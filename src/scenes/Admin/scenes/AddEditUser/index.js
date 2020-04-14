import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, withRouter } from 'react-router-dom'
import { Field } from 'redux-form'
import { default as formActions } from 'redux-form/lib/actions'
import isEmail from 'sane-email-validation'
import actions from './actions'
import {
  Dropdown,
  ModalForm,
  TextInput,
  Avatar,
  withFormAlert,
  TextLink,
  Tooltip,
  CheckboxLabel,
  CircularLoader,
  IconButton,
  ImageFileReader,
  FlexGrid
} from 'components'
import { trimWhitespace } from 'utils/formHelpers'
import AvatarForm from './components/AvatarForm'

/**
 * Main / entry component for all things related to adding and editing a user. This component is a modal and is
 * rendered and mounted when the user clicks the 'Add New User' button or the 'Edit' link under the 'Edit' table header
 * in the User Management scene. The Edit or Add view is determined by the location and location.state props variables.
 * If a user is passed along, then it's edit, otherwise it's Add. This component is wrapped by the withFormAlert,
 * withTracking and react-redux's connect HOCs.
 */
export class AddEditUser extends Component {
  static propTypes = {
    /**
     * redux-form object
     */
    form: PropTypes.object,
    /**
     * Name of redux-form
     */
    formName: PropTypes.string,
    /**
     * All users in system
     */
    users: PropTypes.array,
    /**
     * Avatar of current user being edited
     */
    avatar: PropTypes.string,
    /**
     * Current user being edited
     */
    currentUser: PropTypes.object,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * redux-form actions
     */
    formActions: PropTypes.object,
    /**
     * react-router location object
     */
    location: PropTypes.object,
    /**
     * react-router match object
     */
    match: PropTypes.object,
    /**
     * browser history object
     */
    history: PropTypes.object,
    /**
     * Function passed in from withFormAlert HOC
     */
    onCloseModal: PropTypes.func,
    /**
     * Any error that occurred during updating or adding a user
     */
    formError: PropTypes.string,
    /**
     * Function passed in from withFormAlert HOC
     */
    onSubmitError: PropTypes.func,
    /**
     * User selected for edit
     */
    selectedUser: PropTypes.object,
    /**
     * submitting status
     */
    submitting: PropTypes.bool,
    /**
     * Whether or not to go back
     */
    goBack: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    this.selfUpdate = props.match.url === '/user/profile'
  }
  
  componentDidMount() {
    const { selectedUser, match, actions } = this.props
    this.previousTitle = document.title
    this.selfUpdate = match.url === '/user/profile'
    
    const baseTitle = `PHLIP - User Management -`
    document.title = selectedUser
      ? this.selfUpdate
        ? `${baseTitle} Profile`
        : `${baseTitle} Edit ${selectedUser.firstName} ${selectedUser.lastName}`
      : `${baseTitle} Add User`
    
    const id = match.params.id
    
    if (this.selfUpdate || id) {
      actions.loadAddEditAvatar(selectedUser.avatar)
    }
  }
  
  componentDidUpdate(prevProps) {
    const { submitting, formError, onSubmitError, history, goBack } = this.props
    
    if (prevProps.submitting && !submitting) {
      if (formError !== '') {
        onSubmitError(formError)
      } else {
        if (goBack) history.goBack()
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.previousTitle
  }
  
  /**
   * Function called when the form is submitted. Dispatches redux actions to update or create a user depending on view.
   * Dispatches another action if the user being edited is the current user logged in.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    this.setState({ submitting: true })
    
    let updatedValues = { ...values }
    for (let field of ['firstName', 'lastName']) {
      updatedValues[field] = trimWhitespace(values[field])
    }
    
    if (this.props.match.params.id || this.selfUpdate) {
      this.props.actions.updateUserRequest({ ...updatedValues, avatar: this.props.avatar }, this.selfUpdate)
      if (this.props.currentUser.id === updatedValues.id) {
        this.props.actions.updateCurrentUser({ ...this.props.currentUser, ...updatedValues, avatar: this.props.avatar })
      }
    } else {
      this.props.actions.addUserRequest({ role: 'Coordinator', ...updatedValues })
    }
  }
  
  /**
   * Validates that an email in the form is not already used in another account. Throws an error if needed which is
   * caught by redux-form
   *
   * @public
   * @param {Object} values
   */
  validateEmail = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const emails = this.props.users.map(user => user.email)
    return sleep(1).then(() => {
      if (emails.includes(values.email) && !this.props.match.params.id) {
        throw { email: 'This email is already associated with a user account.' }
      }
      if (values.email && !isEmail(values.email)) {
        throw { email: 'Invalid email address' }
      }
    })
  }
  
  /**
   * Opens another modal for removing / updating an avatar for the user. Opens the components/AvatarForm
   * component. Takes the first image in the list, compresses it and passes it to the form.
   *
   * @public
   * @param {Array} files
   */
  openAvatarForm = files => {
    this.props.history.push({
      pathname: this.selfUpdate
        ? '/user/profile/avatar'
        : `/admin/edit/user/${this.props.selectedUser.id}/avatar`,
      state: {
        avatar: files.base64,
        userId: this.props.selectedUser.id,
        modal: true
      }
    })
  }
  
  /**
   * Checks to make sure a value is defined, other returns 'Required' for displaying as a form error
   *
   * @public
   * @param value
   * @returns {*}
   */
  required = value => {
    if (!value && !this.props.match.params.id) {
      return 'Required'
    } else {
      return undefined
    }
  }
  
  /**
   * Gets modal submit but text, shows a spinner if submitting
   * @param text
   * @returns {*}
   */
  getButtonText = text => {
    return (
      <>
        {text}
        {this.props.submitting && <CircularLoader size={18} style={{ paddingLeft: 10 }} />}
      </>
    )
  }
  
  /**
   * Cancels any edits and closes this modal
   * @public
   */
  onCancel = () => {
    this.props.actions.onCloseAddEditUser()
    this.props.history.goBack()
  }
  
  render() {
    const actions = [
      {
        value: 'Cancel',
        onClick: this.onCancel,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: this.getButtonText('Save'),
        type: 'submit',
        disabled: this.props.submitting,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    const roles = [
      { value: 'Admin', label: 'Admin' },
      { value: 'Coordinator', label: 'Coordinator' },
      { value: 'Coder', label: 'Coder' }
    ]
    
    const { avatar, selectedUser, onCloseModal, currentUser } = this.props
    
    return (
      <ModalForm
        open
        title={selectedUser
          ? this.selfUpdate
            ? 'Profile'
            : 'Edit User'
          : 'Add New User'}
        actions={actions}
        form="addEditUser"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateEmail}
        initialValues={selectedUser || { isActive: true }}
        asyncBlurFields={['email']}
        onClose={onCloseModal}>
        <FlexGrid container padding="30px 15px 0" style={{ minWidth: 500, minHeight: 275 }}>
          <FlexGrid type="row" container justify="space-between" padding="0 0 30px">
            {selectedUser &&
            <FlexGrid padding="0 30px 0 0">
              {avatar ? (
                <Tooltip text="Edit photo" placement="top" id="edit-picture">
                  <TextLink
                    to={{
                      pathname: this.selfUpdate
                        ? '/user/profile/avatar'
                        : `/admin/edit/user/${selectedUser.id}/avatar`,
                      state: {
                        isEdit: true,
                        userId: selectedUser.id,
                        avatar: selectedUser.avatar,
                        modal: true
                      }
                    }}>
                    <Avatar
                      cardAvatar
                      style={{ width: '65px', height: '65px' }}
                      userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      avatar={avatar}
                    />
                  </TextLink>
                </Tooltip>
              ) : (
                <ImageFileReader handleFiles={this.openAvatarForm}>
                  <IconButton
                    color="#757575"
                    iconSize={50}
                    tooltipText="Add a photo"
                    id="add-user-photo">
                    add_a_photo
                  </IconButton>
                </ImageFileReader>
              )}
            </FlexGrid>}
            <FlexGrid flex padding="0 20px 0 0">
              <Field
                name="firstName"
                component={TextInput}
                label="First Name"
                placeholder="Enter first name"
                validate={this.required}
                required
                smallLabel
                shrinkLabel
                fullWidth
              />
            </FlexGrid>
            <FlexGrid flex>
              <Field
                name="lastName"
                component={TextInput}
                label="Last Name"
                required
                smallLabel
                shrinkLabel
                placeholder="Enter last name"
                validate={this.required}
                fullWidth
              />
            </FlexGrid>
          </FlexGrid>
          <FlexGrid padding="0 0 30px">
            <Field
              name="email"
              component={TextInput}
              label="Email"
              shrinkLabel
              required
              smallLabel
              placeholder="Enter email"
              validate={this.required}
              fullWidth
              disabled={this.selfUpdate}
            />
          </FlexGrid>
          <FlexGrid container type="row" flex>
            <FlexGrid flex>
              <Field
                name="role"
                component={Dropdown}
                label="Role"
                options={roles}
                defaultValue="Coordinator"
                required
                id="role"
                style={{ display: 'flex' }}
                disabled={this.selfUpdate}
              />
            </FlexGrid>
            <FlexGrid flex>
              <Field
                name="isActive"
                disabled={this.selfUpdate}
                component={CheckboxLabel}
                label="Active"
                style={{ display: '10px' }}
              />
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
        {currentUser.role === 'Admin' && <Route path="/admin/edit/user/:id/avatar" component={AvatarForm} />}
        {currentUser.role !== 'Admin' && <Route path="/user/profile/avatar" component={AvatarForm} />}
      </ModalForm>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.data.user.currentUser || {},
    users: state.scenes.admin.main.users || [],
    form: state.form.addEditUser || {},
    avatar: state.scenes.admin.addEditUser.avatar || null,
    formName: 'addEditUser',
    formError: state.scenes.admin.addEditUser.formError || '',
    submitting: state.scenes.admin.addEditUser.submitting,
    goBack: state.scenes.admin.addEditUser.goBack,
    selectedUser: ownProps.match.params.id
      ? state.scenes.admin.main.users.find(user => user.id === parseInt(ownProps.match.params.id))
      : ownProps.match.url === '/user/profile'
        ? state.data.user.currentUser
        : null
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(AddEditUser)))
