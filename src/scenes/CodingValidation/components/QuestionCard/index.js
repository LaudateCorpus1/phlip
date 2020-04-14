import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Broom, Restore } from 'mdi-material-ui'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { getInitials } from 'utils/normalize'
import { connect } from 'react-redux'
import { IconButton, Tabs, Alert, PageLoader, FlexGrid } from 'components'
import styles from './card-styles.scss'
import * as questionTypes from '../../constants'
import FlagPopover from './components/FlagPopover'
import FooterNavigate from './components/FooterNavigate'
import QuestionContent from './components/QuestionContent'
import { bindActionCreators } from 'redux'
import { default as codingActions } from 'scenes/CodingValidation/actions'
import actions from './actions'

/**
 * Wraps a tab container
 * @param props
 * @returns {*}
 * @constructor
 */
/* istanbul ignore next */
const TabContainer = props => {
  return (
    <Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
      {props.children}
    </Tabs>
  )
}

TabContainer.propTypes = {
  tabs: PropTypes.array,
  selected: PropTypes.number,
  onChangeCategory: PropTypes.func,
  children: PropTypes.any
}

export class QuestionCard extends Component {
  static propTypes = {
    question: PropTypes.object,
    userAnswers: PropTypes.any,
    onChange: PropTypes.func,
    isValidation: PropTypes.bool,
    user: PropTypes.object,
    categories: PropTypes.array,
    selectedCategory: PropTypes.number,
    selectedCategoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    mergedUserQuestions: PropTypes.object,
    disableAll: PropTypes.bool,
    userImages: PropTypes.object,
    questionChangeLoader: PropTypes.bool,
    isChangingQuestion: PropTypes.bool,
    unsavedChanges: PropTypes.bool,
    enabledAnswerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    enabledUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    annotationModeEnabled: PropTypes.bool,
    areDocsEmpty: PropTypes.bool,
    actions: PropTypes.object,
    handleGetQuestion: PropTypes.func
  }
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      hoveredAnswerChoice: 0
    }
    
    this.alertActions = []
  }
  
  componentDidMount() {
    this.changeTouchStatusAndText(false, '')
  }
  
  /**
   * User stops hovering on an answer choice
   */
  handleMouseOutAnswerChoice = () => {
    this.setState({
      hoveredAnswerChoice: 0
    })
  }
  
  /**
   * When the user hovers over an answer choice
   * @param answerId
   */
  handleMouseInAnswerChoice = answerId => {
    this.setState({
      hoveredAnswerChoice: answerId
    })
  }
  
  /**
   * User is changing or updating answer of some sort
   * @param id
   * @returns {Function}
   */
  handleChangeAnswer = id => (event, value) => {
    const { question, userAnswers, actions, onChange } = this.props
    let text = '', open = false
    
    this.disableAnnotationMode()
    
    if (question.questionType === questionTypes.CATEGORY) {
      if (userAnswers.answers.hasOwnProperty(id)) {
        open = true
        text = 'Deselecting a category will remove answers, pincites and annotations associated with this category. Do you want to continue?'
      }
    } else {
      text = 'Changing your answer will remove the pincites and annotations associated with this answer. Do you want to continue?'
      
      if (question.questionType !== questionTypes.TEXT_FIELD) {
        if (Object.keys(userAnswers.answers).length > 0) {
          if (!userAnswers.answers.hasOwnProperty(id) &&
            (question.questionType === questionTypes.MULTIPLE_CHOICE || question.questionType ===
              questionTypes.BINARY)) {
            open = true
          } else if (userAnswers.answers.hasOwnProperty(id) && question.questionType === questionTypes.CHECKBOXES) {
            open = true
          }
        }
      }
    }
    
    if (open) {
      actions.setAlert({
        open: true,
        type: 'changeAnswer',
        title: 'Warning',
        text,
        data: { id, value }
      })
    } else {
      onChange(id, value)
      actions.setResetStatus(true)
      this.changeTouchStatusAndText(true, 'Saving...')
    }
  }
  
  /**
   * Shows an alert to confirm clearing answer
   */
  handleClearAnswer = () => {
    const { actions } = this.props
    
    this.disableAnnotationMode()
    
    actions.setAlert({
      open: true,
      title: 'Warning',
      text: 'Clearing your answer will remove the selected answer choice, pincites and annotations associated with this answer. Do you want to continue?',
      type: 'clearAnswer',
      data: {}
    })
  }
  
  /**
   * Closes the open alert on the page
   */
  handleCloseAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Determines how much margin for the question answer area
   * @returns {number}
   */
  getMargin = () => {
    const { isValidation, question } = this.props
    
    return !isValidation
      ? question.questionType !== questionTypes.CATEGORY
        ? -70
        : -46
      : question.questionType !== questionTypes.CATEGORY
        ? -24
        : 0
  }
  
  /**
   * When the user changes the category
   */
  handleChangeCategory = (event, selection) => {
    const { onChangeCategory, actions } = this.props
    
    this.disableAnnotationMode()
    this.changeTouchStatusAndText(false, '')
    actions.toggleOffView()
    actions.setResetStatus(false)
    onChangeCategory(event, selection)
  }
  
  /**
   * When the user clicks the 'Apply to all categories' button for an answer
   */
  handleApplyAll = () => {
    const { actions } = this.props
    
    this.disableAnnotationMode()
    actions.setAlert({
      open: true,
      title: 'Warning',
      text: 'Your answer will apply to ALL categories. Previous answers will be overwritten.',
      type: 'applyAll',
      data: {}
    })
  }
  
  /**
   * Toggles annotation mode
   * @param id
   * @returns {Function}
   */
  handleToggleAnnotationMode = id => () => {
    const { annotationModeEnabled, enabledAnswerId, question, actions } = this.props
    
    const enabled = annotationModeEnabled
      ? enabledAnswerId !== id
      : true
    
    actions.toggleAnnotationMode(question.id, id, enabled)
  }
  
  /**
   * Toggles showing annotations for an answer choice
   * @param answerId
   */
  handleToggleViewAnnotations = answerId => () => {
    const { question, actions } = this.props
    
    this.disableAnnotationMode()
    actions.toggleViewAnnotations(question.id, answerId)
  }
  
  /**
   * Handles when the user changes a text field
   */
  handleChangeTextAnswer = (id, field) => event => {
    const { onChangeTextAnswer, actions } = this.props
    
    this.disableAnnotationMode()
    this.changeTouchStatusAndText(true, 'Saving...')
    actions.setResetStatus(true)
    onChangeTextAnswer(field, id, event.target.value)
  }
  
  /**
   * Turns of annotation mode
   */
  disableAnnotationMode = () => {
    const { question, actions, enabledAnswerId, annotationModeEnabled } = this.props
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId || '', false)
    }
  }
  
  /**
   * Event handler for saving a flag
   */
  handleSaveFlag = flagInfo => {
    const { user, onSaveFlag, actions } = this.props
    
    const flag = {
      raisedBy: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      ...flagInfo
    }
    
    onSaveFlag(flag)
    actions.setResetStatus(true)
    this.disableAnnotationMode()
    this.changeTouchStatusAndText(true, 'Saving...')
  }
  
  /**
   * Changes touched status and card header text
   * @param status
   * @param text
   */
  changeTouchStatusAndText = (status, text) => {
    const { actions } = this.props
    
    actions.changeTouchedStatus(status)
    actions.setHeaderText(text)
  }
  
  /**
   * Continues with whatever action they were doing. Determines which action to call
   */
  handleContinueAlert = () => {
    const { alert, onClearAnswer, onChange, onApplyAll, onResetAnswer, actions, onClearFlag } = this.props
    
    switch (alert.type) {
      case 'clearAnswer':
        onClearAnswer()
        actions.toggleOffView()
        actions.setResetStatus(true)
        break
      case 'changeAnswer':
        onChange(alert.data.id, alert.data.value)
        actions.toggleOffView()
        actions.setResetStatus(true)
        break
      case 'applyAll':
        onApplyAll()
        actions.setResetStatus(true)
        break
      case 'reset':
        onResetAnswer()
        actions.toggleOffView()
        actions.setResetStatus(false)
        break
      case 'clearFlag':
        onClearFlag(alert.data.id, alert.data.type)
        break
    }
    
    actions.setAlert({ open: false })
    this.changeTouchStatusAndText(true, 'Saving...')
    this.disableAnnotationMode()
  }
  
  /**
   * When the user changes question using the arrow buttons
   * @param dir
   * @param newIndex
   * @returns {Function}
   */
  handleChangeQuestion = (dir, newIndex) => () => {
    const { handleGetQuestion, actions } = this.props
    
    this.disableAnnotationMode()
    this.changeTouchStatusAndText(false, '')
    actions.setResetStatus(false)
    handleGetQuestion(dir, newIndex)
  }
  
  /**
   * Handle reset answer
   * @returns {*}
   */
  handleResetAnswer = () => {
    const { actions } = this.props
    
    this.disableAnnotationMode()
    actions.setAlert({
      open: true,
      title: 'Warning',
      text: 'Any changes you\'ve made, including selected answer, pincites, comments, and annotations, since arriving to this question will be reset.',
      type: 'reset',
      data: {}
    })
  }
  
  /**
   * Shows an alert asking the user to confirm clearing a flag
   * @param id
   * @param type
   */
  handleClearFlag = (id, type) => {
    const { actions } = this.props
    
    this.disableAnnotationMode()
    actions.setAlert({
      open: true,
      title: 'Confirm Clear Flag',
      text: 'Do you want to clear this flag?',
      type: 'clearFlag',
      data: { id, type },
      continueButtonText: 'Clear Flag'
    })
  }
  
  render() {
    const {
      canReset, header, user, question, userAnswers, isValidation, mergedUserQuestions,
      disableAll, userImages, enabledAnswerId, enabledUserId, annotationModeEnabled, areDocsEmpty, questionChangeLoader,
      categories, selectedCategory, currentIndex, totalLength, showNextButton, isUserAnswerSelected, selectedCategoryId,
      alert
    } = this.props
    
    const { hoveredAnswerChoice } = this.state
    
    const questionContentProps = {
      onChange: this.handleChangeAnswer,
      onChangeTextAnswer: this.handleChangeTextAnswer,
      onClearFlag: this.handleClearFlag,
      onApplyAll: this.handleApplyAll,
      onToggleAnnotationMode: this.handleToggleAnnotationMode,
      onToggleViewAnnotations: this.handleToggleViewAnnotations,
      onMouseInAnswerChoice: this.handleMouseInAnswerChoice,
      onMouseOutAnswerChoice: this.handleMouseOutAnswerChoice,
      user,
      currentUserInitials: getInitials(user.firstName, user.lastName),
      question,
      userAnswers: { validatedBy: { ...user }, ...userAnswers },
      comment: userAnswers.comment,
      isValidation,
      mergedUserQuestions,
      disableAll,
      userImages,
      isUserAnswerSelected,
      enabledAnswerId,
      enabledUserId,
      annotationModeEnabled,
      areDocsEmpty,
      hoveredAnswerChoice
    }
    
    this.alertActions = [
      {
        value: alert.continueButtonText !== '' ? alert.continueButtonText : 'Continue',
        type: 'button',
        onClick: this.handleContinueAlert
      }
    ]
    
    return (
      <FlexGrid container type="row" flex style={{ minWidth: '10%', flexBasis: '0%' }}>
        <Alert actions={this.alertActions} title={alert.title} onCloseAlert={this.handleCloseAlert} open={alert.open}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {alert.text}
          </Typography>
        </Alert>
        <FlexGrid container flex raised style={{ width: '100%' }}>
          {questionChangeLoader
            ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
            : <>
              <FlexGrid container type="row" align="center" padding="0 15px 0 0" style={{ height: 55, minHeight: 55 }}>
                <FlexGrid flex style={{ width: '100%' }}>
                  <Typography variant="caption" style={{ paddingLeft: 10, textAlign: 'center', color: '#757575' }}>
                    {header}
                  </Typography>
                </FlexGrid>
                <FlexGrid container type="row" style={{ marginLeft: this.getMargin() }}>
                  {canReset &&
                  <IconButton
                    onClick={this.handleResetAnswer}
                    style={{ height: 24, width: 24 }}
                    tooltipText="Restore to initial">
                    {!disableAll && <Restore className={styles.icon} />}
                  </IconButton>}
                  {question.questionType !== questionTypes.CATEGORY &&
                  <IconButton
                    onClick={this.handleClearAnswer}
                    aria-label="Clear answer"
                    tooltipText="Clear answer"
                    id="clear-answer"
                    disabled={disableAll}
                    style={{ height: 24 }}>
                    {!disableAll && <Broom className={styles.icon} aria-labelledby="Clear answer" />}
                  </IconButton>}
                  {!isValidation &&
                  <FlexGrid onClick={annotationModeEnabled ? this.disableAnnotationMode : null}>
                    <FlagPopover
                      userFlag={userAnswers.flag}
                      questionId={question.id}
                      onSaveFlag={this.handleSaveFlag}
                      questionFlags={question.flags}
                      categoryId={selectedCategoryId}
                      user={user}
                      disableAll={disableAll}
                    />
                  </FlexGrid>}
                </FlexGrid>
              </FlexGrid>
              <Divider />
              {categories !== undefined
                ? (
                  <TabContainer
                    tabs={categories}
                    selected={selectedCategory}
                    onChangeCategory={this.handleChangeCategory}>
                    <QuestionContent {...questionContentProps} />
                  </TabContainer>
                ) : <QuestionContent {...questionContentProps} />}
              <Divider />
              <FooterNavigate
                getQuestion={this.handleChangeQuestion}
                totalLength={totalLength}
                currentIndex={currentIndex}
                showNextButton={showNextButton}
              />
            </>}
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes.codingValidation.coding
  const docState = state.scenes.codingValidation.documentList
  const cardState = pageState.card
  
  return {
    touched: cardState.touched,
    header: cardState.header,
    isValidation: ownProps.page === 'validation',
    user: state.data.user.currentUser || {},
    question: pageState.scheme === null ? {} : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
    categories: pageState.categories || undefined,
    selectedCategory: pageState.selectedCategory || 0,
    userAnswers: pageState.userAnswers
      ? pageState.question.isCategoryQuestion
        ? pageState.userAnswers[pageState.question.id][pageState.selectedCategoryId]
        : pageState.userAnswers[pageState.question.id]
      : {},
    selectedCategoryId: pageState.selectedCategoryId || null,
    mergedUserQuestions: pageState.mergedUserQuestions
      ? pageState.question.isCategoryQuestion
        ? pageState.mergedUserQuestions[pageState.question.id][pageState.selectedCategoryId]
        : pageState.mergedUserQuestions[pageState.question.id]
      : null,
    disableAll: pageState.disableAll || ownProps.disableAll || false,
    questionChangeLoader: pageState.questionChangeLoader || false,
    isChangingQuestion: pageState.isChangingQuestion || false,
    unsavedChanges: pageState.unsavedChanges || false,
    userImages: state.data.user.byId,
    enabledAnswerId: docState.enabledAnswerId,
    enabledUserId: docState.enabledUserId,
    annotationModeEnabled: docState.annotationModeEnabled,
    isUserAnswerSelected: docState.isUserAnswerSelected,
    areDocsEmpty: docState.showEmptyDocs,
    alert: cardState.alert,
    canReset: cardState.canReset
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(codingActions, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard)

