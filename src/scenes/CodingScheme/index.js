import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import actions from './actions'
import Scheme from './components/Scheme'
import Autosuggest from 'react-autosuggest'
import {
  ApiErrorAlert,
  ApiErrorView,
  FlexGrid,
  Icon,
  Alert,
  PageHeader,
  Button,
  withProjectLocked,
  withAutocompleteMethods,
  CircularLoader
} from 'components'
import Modal, { ModalActions, ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'

/**
 * Coding Scheme screen main component, rendered when the user clicks 'Edit' under the Coding Scheme table header. This
 * is the parent component for all coding scheme related actions -- adding a question, deleting, reordering, etc. This
 * component has one scene: AddEditQuestion at ./scenes/AddEditQuestion.
 * @component
 */
export class CodingScheme extends Component {
  static propTypes = {
    /**
     * Project for which the coding scheme is open
     */
    project: PropTypes.object,
    /**
     * Array of question tree to render as the coding scheme
     */
    questions: PropTypes.array,
    /**
     * Whether or not the coding scheme is empty
     */
    empty: PropTypes.bool,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Outline of the coding scheme
     */
    outline: PropTypes.object,
    /**
     * Flat list of questions (not a tree)
     */
    flatQuestions: PropTypes.array,
    /**
     * Any scheme error to render, will be rendered as a part of the page, not alert
     */
    schemeError: PropTypes.string,
    /**
     * Error that occured while trying to save reorder, displayed as an alert
     */
    reorderError: PropTypes.string,
    /**
     * Whether or not the coding scheme is currently locked by the user
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * Information on lock of coding scheme, if any
     */
    lockInfo: PropTypes.object,
    /**
     * Any error to display as an alert
     */
    alertError: PropTypes.string,
    /**
     * Displays an alert notifying the user the coding scheme is currently locked
     */
    lockedAlert: PropTypes.bool,
    /**
     * Whether or not the coding scheme is currently locked
     */
    hasLock: PropTypes.bool,
    /**
     * Routing history
     */
    history: PropTypes.object,
    /**
     *  current logged in user
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
      goBackAlertOpen: false,
      deleteQuestionAlertOpen: false,
      questionIdToDelete: null,
      path: null,
      projectSearchOpen: false
    }
    
    this.deleteAlertActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.handleDeleteQuestion
      }
    ]
  }
  
  componentDidMount() {
    const { project, actions } = this.props
    
    document.title = `PHLIP - ${project.name} - Coding Scheme`
    actions.getSchemeRequest(project.id)
    setTimeout(() => {
      actions.setEmptyState()
    }, 1000)
  }
  
  componentDidUpdate(prevProps) {
    const { copying, alertError } = this.props
    
    if (prevProps.copying && !copying) {
      if (!alertError) {
        this.closeProjectSearch()
      }
    }
  }
  
  /**
   * Calls a redux action to close any ApiErrorAlert that is open
   * @public
   */
  onCloseAlert = () => {
    const { actions } = this.props
    actions.resetAlertError()
  }
  
  /**
   * Calls a redux action to close any alert that is associated to the locking on the coding scheme
   * @public
   */
  onCloseLockedAlert = () => {
    const { actions } = this.props
    actions.closeLockedAlert()
  }
  
  /**
   * Invoked when the user reorders the coding scheme or makes any edits to the scheme. Calls a redux action to update
   * the question tree with the questions parameter
   * @param questions
   */
  handleQuestionTreeChange = questions => {
    const { actions } = this.props
    actions.updateQuestionTree(questions)
  }
  
  /**
   * Invoked after a question is move, calls a redux action to send API request
   * @public
   */
  handleQuestionNodeMove = () => {
    const { actions, project } = this.props
    actions.reorderSchemeRequest(project.id)
  }
  
  /**
   * Invoked when the user clicks 'Checkout' button, calls a redux action to send API request to checkout scheme
   * @public
   */
  handleLockCodingScheme = () => {
    const { actions, project } = this.props
    actions.lockCodingSchemeRequest(project.id)
  }
  
  /**
   * Invoked when the user clicks 'Check In' button, calls a redux action to send API request to check in the scheme
   * @public
   */
  handleUnlockCodingScheme = () => {
    const { actions, project } = this.props
    actions.unlockCodingSchemeRequest(project.id)
  }
  
  /**
   * Invoked when the user confirms delete of coding scheme question, closes confirm delete alert
   * @public
   */
  handleDeleteQuestion = () => {
    const { actions, project } = this.props
    const { questionIdToDelete, path } = this.state
    
    actions.deleteQuestionRequest(project.id, questionIdToDelete, path)
    this.onCloseDeleteQuestionAlert()
  }
  
  /**
   * Opens an alert to ask the user to confirm deleting a coding scheme question
   * @public
   * @param questionId
   * @param path
   */
  onOpenDeleteQuestionAlert = (questionId, path) => {
    this.setState({
      deleteQuestionAlertOpen: true,
      questionIdToDelete: questionId,
      path
    })
  }
  
  /**
   * Closes the confirm delete alert
   * @public
   */
  onCloseDeleteQuestionAlert = () => {
    this.setState({
      deleteQuestionAlertOpen: false,
      questionIdToDelete: null,
      path: null
    })
  }
  
  /**
   * Invoked when the user clicks 'cancel' in the alert displayed when they hit the go back arrow. Closes alert
   * @public
   */
  onCloseGoBackAlert = () => {
    this.setState({ goBackAlertOpen: false })
  }
  
  /**
   * Invoked when the user clicks 'check in' on the alert displayed when they hit go back. Calls redux action to call
   * API to check in coding scheme, clears the redux state and goes back one in browser history
   * @public
   */
  onContinueGoBack = () => {
    const { actions, history } = this.props
    
    this.handleUnlockCodingScheme()
    actions.clearState()
    history.goBack()
  }
  
  /**
   * Invoked when the user clicks the 'back arrow' button in the page header. If the coding scheme is checked out by the
   * current user, it opens an alert to tell the user to check in the scheme. Otherwise, it clears redux state and goes
   * back one in the browser history
   * @public
   */
  onGoBack = () => {
    const { actions, history, lockedByCurrentUser } = this.props
    
    if (lockedByCurrentUser) {
      this.setState({ goBackAlertOpen: true })
    } else {
      actions.clearState()
      history.goBack()
    }
  }
  
  /**
   *  release the lock when user click on release lock button
   */
  overrideLock = () => {
    const { actions, project, lockInfo } = this.props
  
    actions.unlockCodingSchemeRequest(project.id, lockInfo.userId)
    this.onCloseLockedAlert()
  }
  
  /**
   * Opens the project search modal for copying the coding scheme
   */
  openProjectSearch = () => {
    this.setState({ projectSearchOpen: true })
  }
  
  /**
   * Closes project search
   */
  closeProjectSearch = () => {
    const { projectAutoActions } = this.props
    
    this.setState({ projectSearchOpen: false })
    projectAutoActions.clearAll()
  }
  
  /**
   * Handles sending a request to copy coding scheme
   */
  onCopyCodingScheme = () => {
    const { projectAutocompleteProps, actions, project } = this.props
    actions.copyCodingSchemeRequest(projectAutocompleteProps.selectedSuggestion.id, project.id)
  }
  
  /**
   * Renders a 'Get started' view. Only called when the coding scheme is empty
   * @public
   * @returns {*}
   */
  renderGetStarted = () => {
    const { lockedByCurrentUser, project, projectLocked } = this.props
    
    return (
      <FlexGrid container flex align="center" justify="center">
        <Typography variant="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
          {projectLocked && 'This project is locked. No changes can be made to the coding scheme.'}
          {!projectLocked && lockedByCurrentUser &&
          'The coding scheme is empty. To get started, add a question or copy the coding scheme from another project.'}
          {!projectLocked && !lockedByCurrentUser &&
          'The coding scheme is empty. To get started, check out the coding scheme for editing.'}
        </Typography>
        {(!projectLocked && lockedByCurrentUser) &&
        <FlexGrid container type="row" align="center" justify="center">
          <Button
            component={Link}
            to={{
              pathname: `/project/${project.id}/coding-scheme/add`,
              state: { questionDefined: null, canModify: true, modal: true }
            }}
            value="Add New Question"
            color="accent"
            aria-label="Add new question to coding scheme"
          />
          <span style={{ width: 20 }} />
          <Button
            onClick={this.openProjectSearch}
            value="Copy Coding Scheme"
            color="accent"
            aria-label="Copy coding scheme from another project"
          />
        </FlexGrid>}
        {(!projectLocked && !lockedByCurrentUser) &&
        <Button
          value="Check out"
          color="accent"
          aria-label="check out coding scheme"
          onClick={this.handleLockCodingScheme}
        />}
      </FlexGrid>
    )
  }
  
  /*
   * gets button modal text
   */
  getButtonText = (text, inProgress) => {
    return (
      <>
        {text}
        {inProgress && <CircularLoader thickness={5} size={15} style={{ marginRight: 5 }} />}
      </>
    )
  }
  
  render() {
    const {
      projectLocked, currentUser, alertError, lockedAlert, lockInfo, project, lockedByCurrentUser,
      questions, hasLock, schemeError, empty, outline, flatQuestions, projectAutocompleteProps, copying
    } = this.props
    
    const { goBackAlertOpen, deleteQuestionAlertOpen, projectSearchOpen } = this.state
    
    // Actions for the 'Go Back' alert modal
    const alertActions = [
      {
        value: 'Check in',
        type: 'button',
        onClick: this.onContinueGoBack,
        preferred: true
      }
    ]
    
    // add a release lock if the user is an admin
    let lockedAlertAction = []
    if (currentUser.role === 'Admin') {
      lockedAlertAction.push({ value: 'Unlock', type: 'button', onClick: this.overrideLock })
    }
    
    const cancelButton = {
      value: 'Cancel',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      preferred: true,
      onClick: this.closeProjectSearch
    }
    
    const modalActions = [
      cancelButton,
      {
        value: this.getButtonText('Confirm', copying),
        type: 'button',
        otherProps: { 'aria-label': 'Confirm', 'id': 'copyCodingSchemeModalBtn' },
        onClick: this.onCopyCodingScheme,
        disabled: copying || !projectAutocompleteProps.selectedSuggestion.id
      }
    ]
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <Alert
          open={goBackAlertOpen}
          onCloseAlert={this.onCloseGoBackAlert}
          title="You have checked out the coding scheme."
          actions={alertActions}>
          <Typography variant="body1">
            No one else can make edits until you check it in.
          </Typography>
        </Alert>
        <Alert
          open={deleteQuestionAlertOpen}
          title="Warning"
          onCloseAlert={this.onCloseDeleteQuestionAlert}
          actions={this.deleteAlertActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            You will permanently delete this question, and all related questions and coded answers from the coding scheme. Do you want to continue?
          </Typography>
        </Alert>
        <ApiErrorAlert content={alertError} open={alertError !== ''} onCloseAlert={this.onCloseAlert} />
        <Alert
          onCloseAlert={this.onCloseLockedAlert}
          actions={lockedAlertAction}
          closeButton={{ value: lockedAlertAction.length === 0 ? 'Dismiss' : 'Cancel' }}
          open={lockedAlert !== null}
          title={
            <>
              <Icon size={30} color="primary" style={{ paddingRight: 10 }}>lock</Icon>
              The Coding Scheme is checked out.
            </>
          }>
          <Typography variant="body1">
            {`${lockInfo.firstName} ${lockInfo.lastName} `} is editing the coding scheme. You are unable to edit until they save their changes.
            {currentUser.role === 'Admin' && ' Select \'Unlock\' to terminate their editing session.'}
          </Typography>
        </Alert>
        {projectSearchOpen &&
        <Modal
          onClose={this.closeProjectSearch}
          open={projectSearchOpen}
          maxWidth="md"
          hideOverflow={false}
          id="copySchemeSearchBox">
          <ModalTitle title="Copy Coding Scheme" />
          <Divider />
          <ModalContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 24,
              width: 500,
              height: 275
            }}>
            <FlexGrid container type="row">
              <Icon style={{ paddingRight: 8, marginTop: 5 }}>dvr</Icon>
              <Autosuggest {...projectAutocompleteProps} />
            </FlexGrid>
          </ModalContent>
          <ModalActions actions={modalActions} />
        </Modal>}
        <PageHeader
          projectName={project.name}
          projectId={project.id}
          pageTitle="Coding Scheme"
          protocolButton
          onBackButtonClick={this.onGoBack}
          checkoutButton={{
            isLink: false,
            text: lockedByCurrentUser ? 'Check in' : 'Check out',
            props: {
              onClick: lockedByCurrentUser
                ? this.handleUnlockCodingScheme
                : this.handleLockCodingScheme
            },
            show: (questions.length > 0 || (questions.length === 0 && lockedByCurrentUser)) && !projectLocked
          }}
          otherButton={{
            isLink: true,
            text: 'Add New Question',
            path: `/project/${project.id}/coding-scheme/add`,
            state: { questionDefined: null, canModify: true, modal: true },
            props: {
              'aria-label': 'Add new question to coding scheme'
            },
            show: questions.length > 0 && (hasLock && lockedByCurrentUser) && !projectLocked
          }}
        />
        <FlexGrid
          container
          type="row"
          flex
          style={{
            backgroundColor: '#f5f5f5',
            paddingTop: 25,
            marginLeft: (schemeError || empty) ? 0 : -30
          }}>
          {schemeError !== null
            ? <ApiErrorView error={schemeError} />
            : empty
              ? this.renderGetStarted()
              : <Scheme
                questions={questions}
                onQuestionTreeChange={this.handleQuestionTreeChange}
                onQuestionNodeMove={this.handleQuestionNodeMove}
                onDeleteQuestion={this.onOpenDeleteQuestionAlert}
                projectId={project.id}
                outline={outline}
                flatQuestions={flatQuestions}
                lockedByCurrentUser={lockedByCurrentUser}
                hasLock={hasLock}
                projectLocked={projectLocked}
              />}
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const schemeState = state.scenes.codingScheme.main
  
  return {
    project: state.data.projects.byId[ownProps.match.params.id],
    questions: schemeState.questions || [],
    empty: schemeState.empty || false,
    outline: schemeState.outline || {},
    flatQuestions: schemeState.flatQuestions || [],
    schemeError: schemeState.schemeError || null,
    reorderError: schemeState.reorderError || null,
    lockedByCurrentUser: schemeState.lockedByCurrentUser || false,
    lockInfo: schemeState.lockInfo || {},
    alertError: schemeState.alertError || '',
    lockedAlert: schemeState.lockedAlert || null,
    hasLock: Object.keys(schemeState.lockInfo).length > 0 || false,
    copying: schemeState.copying,
    currentUser: state.data.user.currentUser,
    user: state.data.user.currentUser
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(
  withAutocompleteMethods('project', 'scheme')(
    withProjectLocked(CodingScheme)
  )
)
