import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from './actions'
import Typography from '@material-ui/core/Typography'
import { FlexGrid, Icon, Alert, PageHeader, CardError, ApiErrorAlert, withProjectLocked } from 'components'

/* eslint-disable no-unused-vars */
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/paste'
import { Editor } from '@tinymce/tinymce-react'

/**
 * Protocol viewer and editor component. Rendered when the user clicks 'Edit' under the Protocol table header in the
 * project list or one of the Protocol buttons in the page header on various pages.
 */
export class Protocol extends Component {
  static propTypes = {
    /**
     * Name of project for which the protocol was opened
     */
    projectName: PropTypes.string,
    /**
     * ID of project for which the protocol was opened
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Contents to render in the protoocl editor and view
     */
    protocolContent: PropTypes.string,
    /**
     * Whether or not an error occurred while trying to get the protocol
     */
    getProtocolError: PropTypes.bool,
    /**
     * Whether or not an API request is executing for saving the protocol
     */
    submitting: PropTypes.bool,
    /**
     * Whether or not the protocol is checked out by the current user logged in
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * Locked / checked out information for the protocol
     */
    lockInfo: PropTypes.object,
    /**
     * Anything that should be shown inside an alert related to the checking out of the protocol
     */
    lockedAlert: PropTypes.bool,
    /**
     * Whether or not the protocol is currently checked out
     */
    hasLock: PropTypes.bool,
    /**
     * Any error that should be displayed in an alert
     */
    alertError: PropTypes.string,
    /**
     * Any error that should be displayed in an alert
     */
    lockedAlertAction: PropTypes.array,
    /**
     * Redux actions object
     */
    actions: PropTypes.object,
    /**
     * If populated, an error that happened while saving the protocol
     */
    saveError: PropTypes.any,
    /**
     * Browser history
     */
    history: PropTypes.object,
    /**
     * Current user logged in
     */
    currentUser: PropTypes.object,
    /**
     * Whether or not the project has been finalized (locked) by an admin or coordinator. Different from being 'checked
     * out'
     */
    projectLocked: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      editMode: false,
      open: false,
      alertText: '',
      alertTitle: ''
    }
  }
  
  componentDidMount() {
    this.props.actions.getProtocolRequest(this.props.projectId)
    document.title = `PHLIP - ${this.props.projectName} - Protocol`
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.submitting && !this.props.submitting) {
      if (this.props.alertError === '') {
        this.setState({
          editMode: false
        })
      }
    }
    
    if (!prevProps.lockedByCurrentUser && this.props.lockedByCurrentUser) {
      this.setState({
        editMode: true
      })
    }
  }
  
  componentWillUnmount() {
    this.props.actions.clearState()
  }
  
  /**
   * Calls a redux action to request to checkout the protocol. Invoked when the user clicks the 'Edit' button
   * @public
   */
  onEnableEdit = () => {
    this.props.actions.lockProtocolRequest(this.props.projectId)
  }
  
  /**
   * Closes any alert erorr that might be open
   * @public
   */
  onCloseAlert = () => {
    this.props.actions.resetAlertError()
  }
  
  /**
   * Calls redux actions to save and unlock protocol. Invoked when the user clicks the 'Save' button
   * @public
   */
  onSaveProtocol = () => {
    this.props.actions.saveProtocolRequest(this.props.protocolContent, this.props.projectId)
    this.props.actions.unlockProtocolRequest(this.props.projectId)
    this.props.actions.updateEditedFields(this.props.projectId)
  }
  
  /**
   * Closes the alert that shows when the user clicks the 'back' arrow while still in edit mode, and then hit 'Cancel'
   * in the alert
   * @public
   */
  onClose = () => {
    this.setState({
      open: false,
      alertText: ''
    })
  }
  
  /**
   * Closes any alert related to locking / checking out of the protocol
   * @public
   */
  onCloseLockedAlert = () => {
    this.props.actions.resetLockAlert()
  }
  
  /**
   * Invoked when the user hits 'Continue' in the alert that shows when the user clicks the 'back' arrow while still in
   * edit mode. Sends a request to unlock the protocol, and goes back one in browser history.
   * @public
   */
  onContinue = () => {
    this.props.actions.unlockProtocolRequest(this.props.projectId)
    this.props.history.goBack()
  }
  
  /**
   * If in edit mode, opens an alert to let the user know they are still in edit mode. Invoked when the user clicks the
   * 'back' arrow while still in edit mode. If not in edit mode, goes back once in browser history.
   * @public
   */
  onGoBack = () => {
    if (this.props.lockedByCurrentUser || this.state.editMode) {
      this.setState({
        open: true,
        alertText: 'You will lose unsaved changes. Do you want to continue?',
        alertTitle: 'Warning'
      })
    } else {
      this.props.history.goBack()
    }
  }
  
  /**
   * Overrides a currently checked out protocol
   */
  overrideLock = () => {
    this.props.actions.unlockProtocolRequest(this.props.projectId, this.props.lockInfo.userId)
    this.props.actions.updateEditedFields(this.props.projectId)
    this.onCloseLockedAlert()
  }
  
  /**
   * Updates the protocol content
   * @returns {*}
   */
  updateProtocol = e => {
    this.props.actions.updateProtocol(e.target.getContent())
  }
  
  render() {
    const alertActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onContinue
      }
    ]
    
    const {
      currentUser, lockedAlert, lockInfo, projectName, projectId, getProtocolError, alertError, protocolContent,
      projectLocked
    } = this.props
    
    const { open, alertText, alertTitle, editMode } = this.state
    
    let lockedAlertAction = []
    
    if (currentUser.role === 'Admin') {
      lockedAlertAction.push({ value: 'Unlock', type: 'button', onClick: this.overrideLock })
    }
    
    return (
      <FlexGrid flex container padding="12px 20px 20px 20px">
        <Alert open={open} onCloseAlert={this.onClose} actions={alertActions} title={alertTitle}>
          <Typography variant="body1">
            {alertText}
          </Typography>
        </Alert>
        <Alert
          onCloseAlert={this.onCloseLockedAlert}
          actions={lockedAlertAction}
          closeButton={{ value: lockedAlertAction.length === 0 ? 'Dismiss' : 'Cancel' }}
          open={lockedAlert !== null}
          title={
            <>
              <Icon size={30} color="primary" style={{ paddingRight: 10 }}>lock</Icon>
              The Protocol is checked out.
            </>
          }>
          <Typography variant="body1">
            {`${lockInfo.firstName} ${lockInfo.lastName} `} is editing the protocol.
            You are unable to edit until they save their changes.
            {currentUser.role === 'Admin' &&
            ' Select \'Unlock\' to terminate their editing session or try again later.'}
          </Typography>
        </Alert>
        <PageHeader
          projectName={projectName}
          projectId={projectId}
          pageTitle="Protocol"
          protocolButton={false}
          onBackButtonClick={this.onGoBack}
          otherButton={getProtocolError ? {} : {
            isLink: false,
            text: editMode ? 'Save' : 'Edit',
            onClick: editMode ? this.onSaveProtocol : this.onEnableEdit,
            style: { color: 'black', backgroundColor: 'white' },
            otherProps: { 'aria-label': editMode ? 'Edit protocol' : 'Save protocol' },
            show: getProtocolError !== true && !projectLocked
          }}
        />
        <ApiErrorAlert onCloseAlert={this.onCloseAlert} open={alertError !== ''} content={alertError} />
        {editMode
          ? (
            <FlexGrid raised flex id="tiny">
              <Editor
                init={{
                  statusbar: false,
                  plugins: ['paste', 'link', 'image', 'lists', 'advlist', 'table', 'paste'],
                  toolbar: 'undo redo | \
                          styleselect | \
                          bold italic strikethrough underline | \
                          table | \
                          alignleft alignright aligncenter alignjustify | \
                          numlist bullist | \
                          link image',
                  theme: 'modern',
                  skin_url: '/skins/custom',
                  branding: false,
                  resize: false,
                  menubar: false,
                  content_style: '* {font-family: Roboto }',
                  advlist_bullet_styles: 'default,circle,square,disc',
                  link_title: false,
                  target_list: false,
                  link_assume_external_targets: true,
                  default_link_target: '_blank',
                  anchor_bottom: false,
                  anchor_top: false
                }}
                onChange={this.updateProtocol}
                initialValue={protocolContent}
              />
            </FlexGrid>
          ) : (
            getProtocolError === true
              ? (<CardError>
                Uh-oh! Something went wrong. We couldn't retrieve the protocol for this project. Please try again later.
              </CardError>)
              : <FlexGrid
                raised
                padding={25}
                style={{ fontFamily: 'Roboto', overflow: 'auto' }}
                dangerouslySetInnerHTML={{ __html: protocolContent }}
              />
          )
        }
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  projectName: state.data.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  protocolContent: state.scenes.protocol.content || '',
  getProtocolError: state.scenes.protocol.getProtocolError || null,
  submitting: state.scenes.protocol.submitting || false,
  lockedByCurrentUser: state.scenes.protocol.lockedByCurrentUser || false,
  lockInfo: state.scenes.protocol.lockInfo || {},
  lockedAlert: state.scenes.protocol.lockedAlert || null,
  hasLock: Object.keys(state.scenes.protocol.lockInfo).length > 0 || false,
  alertError: state.scenes.protocol.alertError || '',
  currentUser: state.data.user.currentUser
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withProjectLocked(Protocol))
