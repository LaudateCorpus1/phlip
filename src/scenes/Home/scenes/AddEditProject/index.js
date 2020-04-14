import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import { default as formActions } from 'redux-form/lib/actions'
import { withRouter } from 'react-router'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import {
  FormModal,
  TextInput,
  Dropdown,
  withFormAlert,
  CircularLoader,
  Button,
  Alert,
  FlexGrid,
  Autocomplete,
  IconButton
} from 'components'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import DetailRow from './components/DetailRow'
import { Lock, LockOpen } from 'mdi-material-ui'

/**
 * Main / entry component for all things related to adding and editing a project. This component is a modal and is
 * rendered and mounted when the user clicks the 'Add New Project' button or the name of a project in the Project List
 * scene. The Edit or Add view is determined by the location and location.state props variables. If a project is passed
 * along, then it's edit, otherwise it's Add. This component is wrapped by the withFormAlert, withTracking and
 * react-redux's connect HOCs.
 */
export class AddEditProject extends Component {
  static propTypes = {
    /**
     * redux actions
     */
    actions: PropTypes.object,
    /**
     * redux-form actions
     */
    formActions: PropTypes.object,
    /**
     * Array of all projects, used for making sure project names don't conflict
     */
    projects: PropTypes.arrayOf(PropTypes.object),
    /**
     * redux-form object
     */
    form: PropTypes.object,
    /**
     * Name of form
     */
    formName: PropTypes.string,
    /**
     * react-router location match object
     */
    match: PropTypes.object,
    /**
     * Browser history object
     */
    history: PropTypes.object,
    /**
     * react-router location object
     */
    location: PropTypes.object,
    /**
     * Function passed in from withFormAlert HOC
     */
    onCloseModal: PropTypes.func,
    /**
     * The current user logged in
     */
    currentUser: PropTypes.object,
    /**
     * Form error if any that occurred when manipulating the form
     */
    formError: PropTypes.string,
    /**
     * Whether or not to go back (after successfully saving, it will be true)
     */
    goBack: PropTypes.bool,
    /**
     * onSubmitError
     */
    onSubmitError: PropTypes.func,
    /**
     * Submitting status
     */
    submitting: PropTypes.bool,
    /**
     * User search suggestions
     */
    userSuggestions: PropTypes.array,
    /**
     * User search value
     */
    userSearchValue: PropTypes.string,
    /**
     * New users
     */
    users: PropTypes.array,
    /**
     * Passed in from withFormAlert HOC
     */
    openConfirmAlert: PropTypes.func,
    /**
     * Whether or not a request for toggling lock is in progress
     */
    togglingLock: PropTypes.bool,
    /**
     * Project being edited
     */
    project: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    this.projectDefined = this.props.match.url === '/project/add' ? null : this.props.location.state.projectDefined
    this.state = {
      alertOpen: false,
      alertInfo: {
        title: '',
        text: ''
      },
      addUserEnabled: false,
      hoveredUser: null
    }
  }
  
  componentDidMount() {
    const { actions, currentUser } = this.props
    this.prevTitle = document.title
    
    if (this.projectDefined) {
      document.title = `PHLIP - Project ${this.projectDefined.name} - Edit`
      actions.initProject(this.projectDefined)
    } else {
      document.title = `PHLIP - Add Project`
      actions.initProject({ projectUsers: [currentUser], createdById: currentUser.userId })
    }
  }
  
  componentDidUpdate(prevProps) {
    const { formError, onSubmitError, history, goBack, submitting, togglingLock } = this.props
    
    if ((prevProps.submitting && !submitting) || (prevProps.togglingLock && !togglingLock)) {
      if (formError !== null) {
        onSubmitError(formError)
      } else if (goBack) {
        history.push('/home')
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
  }
  
  /**
   * In edit mode, the user clicks the cancel button. Resets to form values to whatever they were before editing.
   * @public
   */
  onCancel = () => {
    const { formActions, history } = this.props
    formActions.reset('projectForm')
    history.push('/home')
  }
  
  /**
   * Function called when the form is submitted, dispatches a redux action for updating or adding depending on state.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    const { actions } = this.props
    
    this.projectDefined
      ? actions.updateProjectRequest({ ...values, name: this.capitalizeFirstLetter(values.name) })
      : actions.addProjectRequest({ type: 1, ...values, name: this.capitalizeFirstLetter(values.name) })
  }
  
  /**
   * Capitalizes first letter of string
   *
   * @public
   * @param {String} text
   * @returns {String}
   */
  capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)
  
  /**
   * Validates the name of the project in add or edit does not conflict with another project
   *
   * @public
   * @param {Object} values
   */
  validateProjectName = values => {
    const { projects } = this.props
    
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const projectsWoCurrent = this.projectDefined
      ? projects.filter(project => project.id !== this.projectDefined.id)
      : projects
    
    const names = projectsWoCurrent.map(project => project.name.toLowerCase())
    return sleep(1).then(() => {
      if (names.includes(values.name.toLowerCase()) &&
        !(this.projectDefined && this.projectDefined.name === values.name)) {
        throw { name: 'There is already a project with this name.' }
      }
    })
  }
  
  /**
   * Checks to see if a value is defined and if not return 'required' string
   *
   * @public
   * @param {*} value
   * @returns {String}
   */
  required = value => value ? undefined : 'Required'
  
  /**
   * Gets button text adds a spinner if a saving is happening
   * @param text
   * @returns {*}
   */
  getButtonText = text => {
    return (
      <>
        {text}
        {this.props.submitting && <CircularLoader size={15} style={{ marginLeft: 10 }} />}
      </>
    )
  }
  
  /**
   * Shows a modal asking user to confirm deletion of project
   */
  handleShowDeleteConfirm = () => {
    this.setState({
      alertOpen: true,
      alertInfo: {
        title: 'Warning',
        text: `Are you sure you want to delete ${this.projectDefined.name}? The project's coding scheme, protocol, as well as coded and validated questions will be deleted.`
      }
    })
  }
  
  /*
   * Handles when the user confirms deletion of project
   */
  handleDeleteConfirm = () => {
    this.onCancelDelete()
    this.props.actions.deleteProjectRequest(this.projectDefined.id)
  }
  
  /**
   * Handles when the user confirms cancels deletion of project
   */
  onCancelDelete = () => {
    this.setState({
      alertOpen: false,
      alertInfo: {}
    })
  }
  
  /**
   * Closes an alert on the page
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Search user list for adding a user
   * @param value
   */
  onUsersFetchRequest = ({ value }) => {
    this.props.actions.searchUserList(value)
  }
  
  /**
   * When a user was selected
   * @param event
   * @param suggestionValue
   */
  onUserSelected = (event, { suggestionValue }) => {
    this.props.actions.onUserSelected(suggestionValue)
    this.setState({
      addUserEnabled: false
    })
  }
  
  /**
   * User changed their search value
   * @param event
   */
  onUserSuggestionChange = event => {
    this.props.actions.onSuggestionValueChanged(event.target.value)
  }
  
  /**
   * Clears suggestion list
   */
  onClearUserSuggestions = () => {
    this.props.actions.onClearSuggestions()
  }
  
  /**
   * Removes a user from the list
   * @returns {*}
   */
  removeUser = index => () => {
    this.props.actions.removeUserFromList(index)
  }
  
  /**
   * Changes background color when user hovers over a user in the list
   * @param index
   */
  onHoverUser = index => () => {
    const { hoveredUser } = this.state
    const { project } = this.props
    
    if (project.status !== 2) {
      this.setState({
        hoveredUser: hoveredUser === index ? null : index
      })
    }
  }
  
  /**
   * Checks whether there have been updates to the users list; if not delegates it to the form alert
   */
  onCloseModal = () => {
    const { users, onCloseModal, openConfirmAlert } = this.props
    
    if (this.projectDefined) {
      if (users.length !== this.projectDefined.projectUsers.length) {
        openConfirmAlert()
      } else {
        onCloseModal()
      }
    } else if (users.length > 1) {
      openConfirmAlert()
    } else {
      onCloseModal()
    }
  }
  
  /**
   * Stops the form from submitting when hitting 'enter' while in the search field
   * @param event
   */
  onEnterKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
  
  /**
   * Enables the add user field
   * @returns {*}
   */
  onEnabledAddUser = () => {
    this.setState({
      addUserEnabled: true
    })
  }
  
  /**
   * Handles locking / unlocking a project
   */
  handleToggleLock = () => {
    const { actions, project } = this.props
    
    if (project.status === 2) {
      actions.unlockProjectRequest(project, 1)
    } else {
      actions.lockProjectRequest(project, 2)
    }
  }
  
  render() {
    const { alertOpen, alertInfo, hoveredUser, addUserEnabled } = this.state
    const { currentUser, location, submitting, userSuggestions, userSearchValue, users, project } = this.props
    
    const isLocked = project.status === 2
    let actions = [
      {
        value: isLocked ? 'Close' : 'Cancel',
        onClick: this.onCloseModal,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel edit view' }
      }
    ]
    
    actions = isLocked
      ? actions
      : [
        ...actions,
        {
          value: this.projectDefined
            ? this.getButtonText('Save')
            : this.getButtonText('Create'),
          type: 'submit',
          disabled: submitting || isLocked,
          otherProps: { 'aria-label': 'Save form' }
        }
      ]
    
    const options = [
      { value: 1, label: 'Legal Scan' },
      { value: 2, label: 'Policy Surveillance' }
    ]
    
    const alertActions = [
      {
        value: 'Delete',
        type: 'button',
        onClick: this.handleDeleteConfirm
      }
    ]
    
    let modalButtons = undefined
    
    if (this.projectDefined && currentUser.role === 'Admin') {
      modalButtons = (
        <Button
          color={isLocked ? `rgba(0, 0, 0, 0.12)` : 'error'}
          disabled={isLocked}
          onClick={this.handleShowDeleteConfirm}>
          Delete
        </Button>
      )
    }
    
    return (
      <>
        <Alert open={alertOpen} actions={alertActions} onCloseAlert={this.onCancelDelete} title={alertInfo.title}>
          <Typography variant="body1">{alertInfo.text}</Typography>
        </Alert>
        <FormModal
          form="projectForm"
          handleSubmit={this.handleSubmit}
          asyncValidate={this.validateProjectName}
          asyncBlurFields={['name']}
          onClose={this.onCloseModal}
          maxWidth="lg"
          style={{ height: '90%', width: '80%' }}
          formStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          initialValues={location.state.projectDefined || {}}>
          <ModalTitle
            title={this.projectDefined
              ? (
                <FlexGrid container type="row" align="center" flex>
                  <span style={{ paddingRight: 15 }}>{!isLocked ? 'Edit Project' : 'Project Locked'}</span>
                  <IconButton
                    color={isLocked ? 'secondary' : '#757575'}
                    onClick={this.handleToggleLock}
                    tooltipText={isLocked ? 'Unlock Project' : 'Lock Project'}
                    iconSize={24}>
                    {isLocked ? <Lock /> : <LockOpen />}
                  </IconButton>
                </FlexGrid>
              )
              : 'Create New Project'}
            buttons={modalButtons}
          />
          <Divider />
          <ModalContent>
            <FlexGrid container padding="30px 15px 0" style={{ minWidth: 500, minHeight: 230 }}>
              <DetailRow
                name="name"
                component={TextInput}
                label="Project Name"
                validate={this.required}
                placeholder="Enter Project Name"
                disabled={isLocked}
                fullWidth
                required
                onKeyPress={this.onEnterKeyPress}
                shrinkLabel
              />
              <DetailRow
                name="type"
                component={Dropdown}
                label="Type"
                defaultValue={1}
                options={options}
                id="type"
                disabled={isLocked}
                shrinkLabel={false}
                required
                style={{ display: 'flex' }}
              />
              <FlexGrid container padding="0 0 25px">
                <FlexGrid container type="row" align="center">
                  <InputLabel style={{ marginRight: 5, flexShrink: 0 }}>Project Users</InputLabel>
                  {!isLocked &&
                  <Button
                    raised={false}
                    color="accent"
                    variant="text"
                    size="small"
                    style={{ padding: 0, marginRight: 15 }}
                    onClick={this.onEnabledAddUser}>
                    <Typography variant="caption" color="secondary">
                      - Add User
                    </Typography>
                  </Button>}
                  {addUserEnabled && <FlexGrid flex style={{ flexBasis: '50%', flexGrow: 0, marginBottom: 3 }}>
                    <Autocomplete
                      name="name"
                      suggestions={userSuggestions}
                      handleGetSuggestions={this.onUsersFetchRequest}
                      handleClearSuggestions={this.onClearUserSuggestions}
                      InputProps={{
                        placeholder: 'Search for user by name'
                      }}
                      inputProps={{
                        value: userSearchValue,
                        onChange: this.onUserSuggestionChange,
                        onKeyPress: this.onEnterKeyPress,
                        id: 'add-user-name',
                        style: { padding: 2 }
                      }}
                      handleSuggestionSelected={this.onUserSelected}
                    />
                  </FlexGrid>}
                </FlexGrid>
                <FlexGrid container>
                  {users.length > 0 && users.map((user, i) => {
                    const isCreator = this.projectDefined
                      ? user.userId === this.projectDefined.createdById
                      : user.userId === currentUser.userId
                    const userName = `${user.firstName} ${user.lastName}`
                    const hovered = i === hoveredUser
  
                    return (
                      <FlexGrid
                        key={`project-user-${i}`}
                        container
                        type="row"
                        padding="6px 6px 6px 0"
                        align="center"
                        onMouseEnter={this.onHoverUser(i)}
                        onMouseLeave={this.onHoverUser(i)}
                        style={{
                          borderBottom: (users.length > 1 && i !== users.length - 1)
                            ? `1px solid rgba(197, 197, 197, 0.42)`
                            : '',
                          backgroundColor: hovered ? '#f1f1f1' : 'white'
                        }}>
                        <FlexGrid container type="row" align="center" flex>
                          <Typography
                            style={{
                              color: !isLocked
                                ? 'black'
                                : `rgba(0, 0, 0, 0.54)`
                            }}>
                            {userName}
                          </Typography>
                          <Typography variant="caption" style={{ margin: '0 10px' }}>
                            ({isCreator ? 'Creator' : user.role})
                          </Typography>
                        </FlexGrid>
                        {(!isCreator && currentUser.id !== user.userId)
                        && hovered
                        && <IconButton
                          onClick={this.removeUser(i)}
                          color="#757575"
                          iconSize={16}
                          tooltipText={`Remove ${userName}`}>
                          delete
                        </IconButton>}
                      </FlexGrid>
                    )
                  })}
                </FlexGrid>
              </FlexGrid>
            </FlexGrid>
          </ModalContent>
          <ModalActions actions={actions} />
        </FormModal>
      </>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const addEditState = state.scenes.home.addEditProject
  
  return {
    projects: Object.values(state.data.projects.byId) || [],
    project: addEditState.project || {},
    form: state.form.projectForm || {},
    formName: 'projectForm',
    currentUser: { ...state.data.user.currentUser, userId: state.data.user.currentUser.id },
    formError: addEditState.formError,
    goBack: addEditState.goBack,
    submitting: addEditState.submitting,
    userSearchValue: addEditState.userSearchValue,
    userSuggestions: addEditState.userSuggestions,
    users: addEditState.project.users,
    togglingLock: addEditState.togglingLock
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withFormAlert(AddEditProject)
  )
)
