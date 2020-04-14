import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router-dom'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import JurisdictionList from './components/JurisdictionList'
import actions from './actions'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import {
  FlexGrid, ApiErrorView, ApiErrorAlert, PageLoader, Alert, Button, withProjectLocked
} from 'components'
import theme from 'services/theme'

/**
 * Main / entry component for all things jurisdiction. It is a modal that shows a list of all jurisdictions for the
 * project of which this was invoked. This component is mounted when the user clicks the 'Edit' under the
 * 'Jurisdictions' table header on the project list page.
 */
export class AddEditJurisdictions extends Component {
  static propTypes = {
    /**
     * Project for which this component was rendered
     */
    project: PropTypes.object,
    /**
     * Jurisdictions visible on the screen (changes when the user uses the search bar)
     */
    visibleJurisdictions: PropTypes.array,
    /**
     * Search value, if any, in the search bar text field
     */
    searchValue: PropTypes.string,
    /**
     * react-router history object
     */
    history: PropTypes.object,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * Whether or not to show the spinning loader when loading the list of jurisdictions
     */
    showJurisdictionLoader: PropTypes.bool,
    /**
     * Whether or not the app is in the process of loading the jurisdictions list
     */
    isLoadingJurisdictions: PropTypes.bool,
    /**
     * Error content that happened when trying to delete a jurisdiction
     */
    deleteError: PropTypes.string,
    /**
     * Whether or not there's currently an error that needs to be shown
     */
    error: PropTypes.bool,
    /**
     * Content of error that needs to be shown
     */
    errorContent: PropTypes.string,
    /**
     * If the project is locked (finalized)
     */
    projectLocked: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  state = {
    confirmDeleteAlertOpen: false,
    jurisdictionToDelete: {},
    deleteErrorAlertOpen: false
  }
  
  componentDidMount() {
    this.props.actions.getProjectJurisdictions(this.props.project.id)
    this.showJurisdictionLoader()
    document.title = `PHLIP - Project ${this.props.project.name} - Jurisdictions`
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.deleteError !== null && prevProps.deleteError === null) {
      this.setState({
        deleteErrorAlertOpen: true
      })
    }
  }
  
  componentWillUnmount() {
    this.props.actions.clearJurisdictions()
    document.title = `PHLIP - Project ${this.props.project.name}`
    this.props.history.push('/home')
  }
  
  /**
   * Closes main modal, and pushes '/home' onto browser history
   * @public
   */
  onCloseModal = () => {
    this.props.history.push('/home')
  }
  
  /**
   * Sets a timeout and if the app is still loading the jurisdictions after 1 second, then it dispatches a redux action
   * to show the loading spinner
   * @public
   */
  showJurisdictionLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingJurisdictions) {
        this.props.actions.showJurisdictionLoader()
      }
    }, 1000)
  }
  
  /**
   * Opens an alert to ask the user to confirm deleting a jurisdiction
   *
   * @public
   * @param {String} id
   * @param {String} name
   */
  confirmDelete = (id, name) => {
    this.setState({
      confirmDeleteAlertOpen: true,
      jurisdictionToDelete: {
        id,
        name
      }
    })
  }
  
  /**
   * User confirms delete, dispatches a redux action to delete the jurisdiction, closes the alert modal
   * @public
   */
  continueDelete = () => {
    this.props.actions.deleteJurisdictionRequest(this.state.jurisdictionToDelete.id, this.props.project.id)
    this.cancelDelete()
  }
  
  /**
   * User cancels delete, closes the alert modal
   * @public
   */
  cancelDelete = () => {
    this.setState({
      confirmDeleteAlertOpen: false,
      jurisdictionToDelete: {}
    })
  }
  
  /**
   * Closes the error alert shown when an error occurs during delete, dispatches an action to clear error content
   * @public
   */
  dismissDeleteErrorAlert = () => {
    this.setState({
      deleteErrorAlertOpen: false
    })
    
    this.props.actions.dismissDeleteErrorAlert()
  }
  
  /**
   * Gets the button to show in the modal header
   * @public
   */
  getButton = () => {
    return (<>
      <div style={{ marginRight: 10 }}>
        <Button
          component={Link}
          to={{
            pathname: `/project/${this.props.project.id}/jurisdictions/add`,
            state: {
              preset: true,
              modal: true
            }
          }}
          value="Load Preset"
          color="accent"
          aria-label="Load preset"
        />
      </div>
      <div>
        <Button
          component={Link}
          to={{
            pathname: `/project/${this.props.project.id}/jurisdictions/add`,
            state: {
              preset: false,
              modal: true
            }
          }}
          value="Add Jurisdiction"
          color="accent"
          aria-label="Add jurisdictions to project"
        />
      </div>
    </>)
  }
  
  render() {
    const alertActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.continueDelete
      }
    ]
    
    const {
      project, error, searchValue, actions, deleteError, errorContent, showJurisdictionLoader, visibleJurisdictions,
      projectLocked
    } = this.props
    
    const { confirmDeleteAlertOpen, jurisdictionToDelete, deleteErrorAlertOpen } = this.state
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="md" hideOverflow>
        <ModalTitle
          title={<Typography variant="title">
            <span style={{ paddingRight: 10 }}>Jurisdictions</span>
            <span style={{ color: theme.palette.secondary.main }}>{project.name}</span>
          </Typography>}
          buttons={(error === true || projectLocked)
            ? []
            : this.getButton()}
          search
          SearchBarProps={{
            searchValue,
            handleSearchValueChange: event => actions.updateSearchValue(event.target.value),
            placeholder: 'Search',
            style: { paddingRight: 10 }
          }}
        />
        <Divider />
        <ModalContent
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Alert actions={alertActions} onCloseAlert={this.cancelDelete} title="Warning" open={confirmDeleteAlertOpen}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              Are you sure you want to delete {jurisdictionToDelete.name}? All coded and validated questions related to
              this jurisdiction will be deleted.
            </Typography>
          </Alert>
          <ApiErrorAlert
            open={deleteErrorAlertOpen}
            content={deleteError}
            onCloseAlert={this.dismissDeleteErrorAlert}
          />
          <FlexGrid container flex style={{ marginTop: 20 }}>
            <FlexGrid container flex style={{ overflowX: 'auto' }}>
              {error === true
                ? <ApiErrorView error={errorContent} />
                : showJurisdictionLoader
                  ? <PageLoader />
                  : <JurisdictionList
                    project={project}
                    jurisdictions={visibleJurisdictions}
                    projectId={project.id}
                    onDelete={this.confirmDelete}
                    disableAll={projectLocked}
                  />}
            </FlexGrid>
          </FlexGrid>
        </ModalContent>
        <ModalActions
          actions={[
            {
              value: 'Close',
              onClick: this.onCloseModal,
              type: 'button',
              otherProps: { 'aria-label': 'Close modal' }
            }
          ]}
        />
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  project: state.data.projects.byId[ownProps.match.params.id],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || [],
  error: state.scenes.home.addEditJurisdictions.error || false,
  errorContent: state.scenes.home.addEditJurisdictions.errorContent || '',
  isLoadingJurisdictions: state.scenes.home.addEditJurisdictions.isLoadingJurisdictions || false,
  showJurisdictionLoader: state.scenes.home.addEditJurisdictions.showJurisdictionLoader || false,
  deleteError: state.scenes.home.addEditJurisdictions.deleteError || null
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withProjectLocked(AddEditJurisdictions)))
