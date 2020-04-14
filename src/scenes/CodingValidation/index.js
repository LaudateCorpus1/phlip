import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography'
import Header from './components/Header'
import QuestionCard from './components/QuestionCard'
import Navigator from './components/Navigator'
import DocumentList from './components/DocumentList'
import BulkValidate from './components/BulkValidate'
import actions from './actions'
import {
  TextLink, Icon, Button, Alert, ApiErrorView, ApiErrorAlert, PageLoader, FlexGrid, withProjectLocked
} from 'components'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import Resizable from 're-resizable'

/* istanbul ignore next */
const ResizeHandle = () => (
  <Icon style={{ width: 17, minWidth: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    more_vert
  </Icon>
)

/**
 * The base component for the Code or Validate screens
 */
export class CodingValidation extends Component {
  static propTypes = {
    project: PropTypes.object,
    page: PropTypes.string,
    isValidation: PropTypes.bool,
    question: PropTypes.object,
    currentIndex: PropTypes.number,
    questionOrder: PropTypes.array,
    showNextButton: PropTypes.bool,
    isSchemeEmpty: PropTypes.bool,
    areJurisdictionsEmpty: PropTypes.bool,
    user: PropTypes.object,
    selectedCategory: PropTypes.number,
    schemeError: PropTypes.string,
    answerErrorContent: PropTypes.any,
    isLoadingPage: PropTypes.bool,
    pageLoadingMessage: PropTypes.string,
    apiErrorAlert: PropTypes.object,
    showPageLoader: PropTypes.bool,
    actions: PropTypes.object,
    unsavedChanges: PropTypes.bool,
    isChangingQuestion: PropTypes.bool,
    selectedCategoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    history: PropTypes.object,
    objectExists: PropTypes.bool,
    getRequestInProgress: PropTypes.bool,
    match: PropTypes.object,
    validationInProgress: PropTypes.bool,
    /**
     * Text to show if the scheme or jurisdictions are empty
     */
    gettingStartedText: PropTypes.string,
    /**
     * Whether or not the project has been finalized (locked) by an admin or coordinator. Different from being 'checked
     * out'
     */
    projectLocked: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      jurisdiction: props.project.projectJurisdictions.length > 0
        ? props.match.params.jid
          ? props.project.projectJurisdictions.find(j => parseInt(props.match.params.jid) === parseInt(j.id))
          : props.project.projectJurisdictions[0]
        : { id: null },
      changeProps: [],
      changeMethod: null,
      stillSavingAlertOpen: false,
      bulkValidateOpen: false
    }
    
    this.stillSavingActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onContinueStillSavingAlert
      }
    ]
    
    this.saveFailedActions = [
      {
        value: 'Try Again',
        type: 'button',
        onClick: this.onTryAgain
      }
    ]
  }
  
  componentDidMount() {
    const { isValidation, page, actions, project, match } = this.props
    const { jurisdiction } = this.state
    
    let q = null, jur = jurisdiction.id
    
    if (match.params.jid) {
      jur = match.params.jid
      q = match.params.qid
    }
    
    document.title = `PHLIP - ${project.name} - ${isValidation ? 'Validate' : 'Code'} `
    actions.setPage(page)
    actions.getOutlineRequest(project.id, jur, q)
    
    this.onShowPageLoader()
  }
  
  componentDidUpdate(prevProps, prevState) {
    const {
      schemeError, question, gettingStartedText, getRequestInProgress, validationInProgress, apiErrorAlert, actions
    } = this.props
    const { jurisdiction } = this.state
    
    if (!getRequestInProgress && prevProps.getRequestInProgress) {
      if (schemeError === null && gettingStartedText === '') {
        this.changeRoutes()
      }
    }
    
    if (gettingStartedText === '') {
      if (prevProps.question.id !== question.id || prevState.jurisdiction.id !== jurisdiction.id) {
        this.changeRoutes()
      }
    }
    
    if (prevProps.validationInProgress && !validationInProgress) {
      if (!apiErrorAlert.open) {
        actions.updateAnnotations(question.id)
        this.handleCloseBulkValidate()
      }
    }
  }
  
  componentWillUnmount() {
    this.props.actions.onCloseScreen()
  }
  
  /**
   * Handle changing the browser routes for when the user changes questions or jurisdictions
   */
  changeRoutes = () => {
    const { history, question, match } = this.props
    const { jurisdiction } = this.state
    
    history.replace({
      pathname: `/project/${match.params.id}/${match.params.view}/${jurisdiction.id}/${question.id}`
    })
  }
  
  /**
   * Handles getting a question depending on the source of the action
   * @returns {Function}
   */
  getQuestion = (source, itemOrIndex) => {
    const { actions, questionOrder, unsavedChanges, project, question } = this.props
    const { jurisdiction } = this.state
    
    let action = '', qItem = itemOrIndex, changeProps = []
    actions.toggleAnnotationMode(question.id, '', false)
    
    switch (source) {
      case 'nav':
        action = actions.onQuestionSelectedInNav
        changeProps = [itemOrIndex, null]
        break
      case 'prev':
        action = actions.getPrevQuestion
        qItem = questionOrder[itemOrIndex]
        changeProps = [qItem, itemOrIndex]
        break
      case 'next':
        action = actions.getNextQuestion
        qItem = questionOrder[itemOrIndex]
        changeProps = [qItem, itemOrIndex]
        break
    }
    
    if (unsavedChanges) {
      this.onShowStillSavingAlert(itemOrIndex, action, changeProps)
    } else {
      action(qItem, itemOrIndex, project.id, jurisdiction.id)
      this.onShowQuestionLoader()
    }
  }
  
  /**
   * Shows a question loader spinner
   * @public
   */
  onShowQuestionLoader = () => {
    const { isChangingQuestion, actions } = this.props
    
    setTimeout(() => {
      if (isChangingQuestion) {
        actions.showQuestionLoader()
      }
    }, 1000)
  }
  
  /**
   * Handles when the user changes part of their answer that's not a text field
   * @public
   * @param id
   * @param value
   */
  onAnswer = (id, value) => {
    const { actions, question, project } = this.props
    const { jurisdiction } = this.state
    
    actions.updateUserAnswer(project.id, jurisdiction.id, question.id, id, value)
    this.onSaveCodedQuestion()
  }
  
  /**
   * This actually dispatches the redux action that calls the api to save the question data
   * @public
   */
  onSaveCodedQuestion = () => {
    const { project, question, selectedCategoryId, actions } = this.props
    const { jurisdiction } = this.state
    
    actions.saveUserAnswerRequest(project.id, jurisdiction.id, question.id, selectedCategoryId)
    actions.setHeaderText('Saving...')
  }
  
  /**
   * @public
   * @param field
   * @param value
   * @param id
   * @returns {Function}
   */
  onChangeTextAnswer = (field, id, value) => {
    const { actions, project, question } = this.props
    const { jurisdiction } = this.state
    
    switch (field) {
      case 'textAnswer':
        actions.updateUserAnswer(project.id, jurisdiction.id, question.id, id, value)
        break
      case 'comment':
        actions.onChangeComment(project.id, jurisdiction.id, question.id, value)
        break
      case 'pincite':
        actions.onChangePincite(project.id, jurisdiction.id, question.id, id, value)
        break
    }
    
    this.onSaveCodedQuestion()
  }
  
  /**
   * @public
   * @returns {*|{type, args}}
   */
  onCloseSaveFailedAlert = () => this.props.actions.dismissApiAlert('answerErrorContent')
  
  /**
   * @public
   * @param event
   * @param selection
   */
  onChangeCategory = (event, selection) => {
    this.props.actions.onChangeCategory(selection)
  }
  
  /**
   * @public
   */
  onTryAgain = () => {
    this.onSaveCodedQuestion()
    this.onCloseSaveFailedAlert()
  }
  
  /**
   * @public
   * @param question
   * @param method
   * @param changeProps
   */
  onShowStillSavingAlert = (question, method, changeProps) => {
    this.setState({
      stillSavingAlertOpen: true,
      changeProps,
      changeMethod: { type: 0, method: method }
    })
  }
  
  /**
   * @public
   */
  onCancelStillSavingAlert = () => {
    this.setState({
      changeProps: [],
      stillSavingAlertOpen: false,
      changeMethod: {}
    })
  }
  
  /**
   * @public
   */
  onContinueStillSavingAlert = () => {
    const { project, actions } = this.props
    const { changeProps, changeMethod, jurisdiction } = this.state
    
    // question changing
    if (changeMethod.type === 0) {
      changeMethod.method(...changeProps, project.id, jurisdiction.id)
      this.onShowQuestionLoader()
      // jurisdiction changing
    } else if (changeMethod.type === 1) {
      actions.onChangeJurisdiction(changeProps[1], project.projectJurisdictions)
      changeMethod.method(...changeProps)
      this.onShowQuestionLoader()
    } else {
      // clicked the back button
      changeMethod.method()
    }
    
    this.onCancelStillSavingAlert()
  }
  
  /**
   * @public
   */
  onClearAnswer = () => {
    const { project, question, actions } = this.props
    const { jurisdiction } = this.state
    
    actions.onClearAnswer(project.id, jurisdiction.id, question.id)
    this.onSaveCodedQuestion()
  }
  
  /**
   * @public
   */
  onGoBack = () => {
    const { unsavedChanges, history } = this.props
    
    if (unsavedChanges === true) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: { type: 2, method: history.goBack }
      })
    } else {
      history.goBack()
    }
  }
  
  /**
   * @public
   */
  onApplyToAll = () => {
    const { actions, project, question } = this.props
    const { jurisdiction } = this.state
    
    actions.applyAnswerToAll(project.id, jurisdiction.id, question.id)
  }
  
  /**
   * Handles opening the bulk validate modal
   */
  handleOpenBulkValidate = () => {
    this.setState({
      bulkValidateOpen: true
    })
  }
  
  /**
   * Handles closing the bulk validate modal
   */
  handleCloseBulkValidate = () => {
    const { validationInProgress, actions } = this.props
    if (validationInProgress) actions.clearValidationProgress()
    this.setState({ bulkValidateOpen: false })
  }
  
  /**
   * Waits 1 sec, then displays a circular loader if API is still loading
   * @public
   */
  onShowPageLoader = () => {
    const { isLoadingPage, actions } = this.props
    
    setTimeout(() => {
      if (isLoadingPage) {
        actions.showPageLoader()
      }
    }, 1000)
  }
  
  /**
   * Invoked when the user changes jurisdictions by selecting a jurisdiction in the dropdown. If there are unsaved
   * changes, a popup is shown alerting the user so, otherwise calls redux actions to change questions and shows the
   * question loader
   * @public
   * @param event
   */
  onJurisdictionChange = event => {
    const { unsavedChanges, page, actions, project, question } = this.props
    const { jurisdiction } = this.state
    
    actions.toggleAnnotationMode(question.id, '', false)
    
    if (unsavedChanges) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: {
          type: 1,
          method: page === 'coding'
            ? actions.getUserCodedQuestions
            : actions.getUserValidatedQuestionsRequest
        },
        changeProps: [project.id, event.target.value]
      })
    } else {
      const newIndex = project.projectJurisdictions.findIndex(jur => jur.id === event.target.value)
      const newJur = project.projectJurisdictions[newIndex]
      
      if (jurisdiction.id !== newJur.id) {
        this.setState({
          jurisdiction: newJur
        })
        
        if (page === 'coding') {
          actions.getUserCodedQuestions(project.id, event.target.value)
        } else {
          actions.getUserValidatedQuestionsRequest(project.id, event.target.value)
        }
        
        this.onShowQuestionLoader()
        actions.changeTouchedStatus(false)
        actions.setHeaderText('')
        actions.getApprovedDocumentsRequest(project.id, newJur.jurisdictionId, page)
      }
    }
  }
  
  /**
   * The user has clicked 'save' in either of the flag popover forms
   * @public
   * @param flagInfo
   */
  onSaveFlag = flagInfo => {
    const { actions, project, question, selectedCategoryId } = this.props
    const { jurisdiction } = this.state
    
    if (flagInfo.type === 3) {
      actions.onSaveRedFlag(project.id, question.id, flagInfo)
    } else {
      actions.onSaveFlag(project.id, jurisdiction.id, question.id, flagInfo)
      actions.saveUserAnswerRequest(project.id, jurisdiction.id, question.id, selectedCategoryId)
    }
  }
  
  /**
   * Called if the user chooses they are sure they want to clear the flag, calls a redux action creator function
   * depending on flag type. Closes delete flag confirm alert
   * @public
   */
  onClearFlag = (id, type) => {
    const { actions, question, project } = this.props
    const { jurisdiction } = this.state
    
    if (type === 3) {
      actions.clearRedFlag(id, question.id, project.id)
    } else {
      actions.clearFlag(id, project.id, jurisdiction.id, question.id)
    }
  }
  
  /**
   * Resets users answer to initial state when they came to the question
   */
  onResetAnswer = () => {
    const { actions, question, project } = this.props
    const { jurisdiction } = this.state
    
    actions.resetAnswer(project.id, jurisdiction.id, question.id)
    actions.setUnsavedChanges(true)
    this.onSaveCodedQuestion()
  }
  
  /**
   * Handles when the user does a 'bulk' validation
   */
  handleConfirmValidate = (scope, user) => {
    const { actions, project, question } = this.props
    const { jurisdiction } = this.state
    actions.toggleAnnotationMode(question.id, '', false)
    actions.bulkValidationRequest(project.id, jurisdiction.id, question.id, scope, user)
  }
  
  render() {
    const {
      showPageLoader, answerErrorContent, objectExists, actions, page, selectedCategory, questionOrder, isSchemeEmpty,
      schemeError, areJurisdictionsEmpty, gettingStartedText, getRequestInProgress, user, currentIndex, showNextButton,
      question, project, projectLocked, apiErrorAlert, validationInProgress
    } = this.props
    
    const { stillSavingAlertOpen, jurisdiction, bulkValidateOpen } = this.state
    
    const containerStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    }
    
    return (
      <FlexGrid container type="row" flex style={containerStyle}>
        <Alert
          open={stillSavingAlertOpen}
          onCloseAlert={this.onCancelStillSavingAlert}
          title="Still Saving Changes"
          actions={this.stillSavingActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            We haven't finished saving your answer. If you continue, changes might not be saved.
          </Typography>
        </Alert>
        <ApiErrorAlert
          open={answerErrorContent !== null}
          content={answerErrorContent}
          actions={objectExists ? [] : this.saveFailedActions}
          onCloseAlert={this.onCloseSaveFailedAlert}
        />
        <ApiErrorAlert
          open={apiErrorAlert.open}
          content={apiErrorAlert.text}
          onCloseAlert={() => actions.closeApiErrorAlert()}
        />
        {(gettingStartedText === '' && !getRequestInProgress) &&
        <Navigator selectedCategory={selectedCategory} handleQuestionSelected={this.getQuestion} />}
        <FlexGrid container flex style={{ width: '100%', flexWrap: 'nowrap', overflowX: 'hidden', overflowY: 'auto' }}>
          <Header
            project={project}
            onJurisdictionChange={this.onJurisdictionChange}
            pageTitle={capitalizeFirstLetter(page)}
            currentJurisdiction={jurisdiction}
            onGoBack={this.onGoBack}
            isValidation={page === 'validation'}
            onOpenBulkValidate={this.handleOpenBulkValidate}
            showValidate={schemeError === null && !projectLocked}
            empty={jurisdiction.id === null || questionOrder === null || questionOrder.length === 0}
          />
          <FlexGrid container type="row" flex style={{ backgroundColor: '#f5f5f5' }}>
            <FlexGrid container type="row" flex style={{ overflow: 'auto' }}>
              <FlexGrid
                container
                type="row"
                flex
                style={{ padding: '1px 15px 20px 3px', overflow: 'auto', minHeight: 500 }}>
                {schemeError !== null && <ApiErrorView error="We couldn't get the coding scheme for this project." />}
                <BulkValidate
                  open={bulkValidateOpen}
                  onClose={this.handleCloseBulkValidate}
                  users={project.projectUsers}
                  onConfirmValidate={this.handleConfirmValidate}
                  validationInProgress={validationInProgress}
                />
                {getRequestInProgress
                  ? showPageLoader
                    ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
                    : <></>
                  : (isSchemeEmpty || areJurisdictionsEmpty)
                    ? (
                      <FlexGrid container flex align="center" justify="center" padding={30}>
                        <Typography variant="display1" style={{ marginBottom: '20px', textAlign: 'center' }}>
                          {gettingStartedText}
                        </Typography>
                        {!projectLocked &&
                        <FlexGrid container type="row" style={{ width: '100%', justifyContent: 'space-evenly' }}>
                          {(isSchemeEmpty && user.role !== 'Coder') &&
                          <TextLink to={{ pathname: `/project/${project.id}/coding-scheme` }}>
                            <Button value="Create Coding Scheme" color="accent" />
                          </TextLink>}
                          {(areJurisdictionsEmpty && user.role !== 'Coder') &&
                          <TextLink to={{ pathname: `/project/${project.id}/jurisdictions` }}>
                            <Button value="Add Jurisdictions" color="accent" />
                          </TextLink>}
                        </FlexGrid>}
                      </FlexGrid>
                    )
                    : (schemeError === null && (
                      <>
                        <QuestionCard
                          onChange={this.onAnswer}
                          onChangeTextAnswer={this.onChangeTextAnswer}
                          onChangeCategory={this.onChangeCategory}
                          onAnswer={this.onAnswer}
                          onClearAnswer={this.onClearAnswer}
                          onSaveFlag={this.onSaveFlag}
                          onSave={this.onSaveCodedQuestion}
                          onResetAnswer={this.onResetAnswer}
                          onClearFlag={this.onClearFlag}
                          handleGetQuestion={this.getQuestion}
                          onApplyAll={this.onApplyToAll}
                          totalLength={questionOrder.length}
                          showNextButton={showNextButton}
                          currentIndex={currentIndex}
                          disableAll={projectLocked}
                          page={page}
                        />
                        <Resizable
                          style={{ display: 'flex' }}
                          minWidth="10%"
                          enable={{
                            top: false,
                            right: false,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                          }}
                          handleComponent={{ left: ResizeHandle }}
                          handleStyles={{
                            left: {
                              height: 'fit-content',
                              width: 'fit-content',
                              bottom: '51.25%',
                              top: 'unset',
                              left: 0
                            }
                          }}
                          defaultSize={{
                            width: '50%',
                            height: '100%'
                          }}>
                          <FlexGrid style={{ minWidth: 17, maxWidth: 17, width: 17 }} />
                          <DocumentList
                            project={project}
                            jurisdiction={jurisdiction}
                            page={page}
                            questionId={question.id}
                            saveUserAnswer={this.onSaveCodedQuestion}
                          />
                        </Resizable>
                      </>
                    ))
                }
              </FlexGrid>
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const project = state.data.projects.byId[ownProps.match.params.id]
  const page = ownProps.match.url.split('/')[3] === 'code' ? 'coding' : 'validation'
  const pageState = state.scenes.codingValidation.coding
  
  return {
    project,
    page,
    isValidation: page === 'validation',
    question: pageState.scheme === null
      ? {}
      : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
    currentIndex: pageState.currentIndex || 0,
    gettingStartedText: pageState.gettingStartedText,
    questionOrder: pageState.scheme === null ? null : pageState.scheme.order,
    showNextButton: pageState.showNextButton,
    isSchemeEmpty: pageState.isSchemeEmpty,
    areJurisdictionsEmpty: pageState.areJurisdictionsEmpty,
    user: state.data.user.currentUser,
    selectedCategory: pageState.selectedCategory,
    schemeError: pageState.schemeError || null,
    answerErrorContent: pageState.answerErrorContent || null,
    isLoadingPage: pageState.isLoadingPage,
    showPageLoader: pageState.showPageLoader,
    isChangingQuestion: pageState.isChangingQuestion || false,
    selectedCategoryId: pageState.selectedCategoryId || null,
    unsavedChanges: pageState.unsavedChanges || false,
    objectExists: pageState.objectExists || false,
    getRequestInProgress: pageState.getRequestInProgress,
    apiErrorAlert: pageState.apiErrorAlert,
    validationInProgress: pageState.validationInProgress
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps, mapDispatchToProps)(withProjectLocked(CodingValidation))
