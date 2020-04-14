import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import PinciteTextField from '../PinciteTextField'
import { FlexGrid } from 'components'
import * as types from 'scenes/CodingValidation/constants'
import PinciteList from '../PinciteList'
import AnnotationControls from '../AnnotationControls'
import CodingValidationAvatar from '../CodingValidationAvatar'
import { CheckboxBlankOutline, CheckboxMarked, RadioboxBlank, RadioboxMarked } from 'mdi-material-ui'

/* istanbul ignore next */
const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Whether or not choice id is the enabled answer choice
 * @param enabledAnswer
 * @param annotationMode
 * @returns {function(*): boolean}
 */
export const shouldShowAnnotationStyles = (enabledAnswer, annotationMode) => choiceId => {
  return annotationMode ? (enabledAnswer === choiceId) : false
}

/**
 * Checks if there are any annotations for a question
 * @param coderQuestions
 * @param hasAnnotations
 * @returns {*|boolean}
 */
export const checkForAnnotations = (coderQuestions, hasAnnotations) => {
  let total = 0
  coderQuestions.forEach(q => {
    total += q.annotations.length
  })
  
  return hasAnnotations || total > 0
}

/**
 * Checkbox form group for Coding / Validation screens
 */
export const SelectionControlQuestion = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, user, classes, mergedUserQuestions, disableAll, userImages,
    question, enabledAnswerId, onToggleAnnotationMode, annotationModeEnabled, areDocsEmpty, onToggleViewAnnotations,
    onMouseInAnswerChoice, onMouseOutAnswerChoice, hoveredAnswerChoice
  } = props
  
  const showAnnoStyles = shouldShowAnnotationStyles(enabledAnswerId, annotationModeEnabled)
  const isCheckbox = [types.CATEGORY, types.CHECKBOXES].includes(question.questionType)
  const Control = isCheckbox ? Checkbox : Radio
  const isValidation = mergedUserQuestions !== null
  
  return (
    <FormControl component="fieldset" style={{ flex: '1 1 auto' }}>
      <FormLabel component="legend" style={{ display: 'none' }} id="question_text">{question.text}</FormLabel>
      <FormGroup>
        {choices.map(choice => {
          const controlProps = {
            classes: {
              checked: classes.checked
            },
            style: { height: 'unset' },
            inputProps: { id: choice.id, 'aria-describedby': 'question_text' }
          }
          
          const answerList = mergedUserQuestions !== null
            ? mergedUserQuestions.answers.filter(answer => answer.schemeAnswerId === choice.id)
            : []
          
          const isAnswered = userAnswers.answers.hasOwnProperty(choice.id)
          const validatedBy = isValidation ? userAnswers.validatedBy : {}
          const list = isAnswered
            ? [
              ...answerList,
              {
                ...userAnswers.answers[choice.id],
                isValidatorAnswer: isValidation,
                userId: user.id,
                ...validatedBy
              }
            ]
            : answerList
          
          const CheckedIcon = isCheckbox ? CheckboxMarked : RadioboxMarked
          const BlankIcon = isCheckbox ? CheckboxBlankOutline : RadioboxBlank
          const showAnnoMode = showAnnoStyles(choice.id)
          const viewModeEnabled = !annotationModeEnabled && enabledAnswerId === choice.id
          const userHasAnnotations = userAnswers.answers[choice.id]
            ? userAnswers.answers[choice.id].annotations.length > 0
            : false
          
          return (
            <FlexGrid
              container
              type="row"
              key={choice.id}
              padding={isValidation ? '15px 10px 0 5px' : '15px 10px 15px 5px'}
              onMouseEnter={() => onMouseInAnswerChoice(choice.id)}
              onMouseLeave={() => onMouseOutAnswerChoice(choice.id)}
              align="flex-start"
              style={{
                backgroundColor: (showAnnoMode || viewModeEnabled)
                  ? '#e6f8ff'
                  : hoveredAnswerChoice === choice.id
                    ? '#f5f5f5'
                    : 'white'
              }}>
              <FlexGrid container flex>
                <FormControlLabel
                  checked={isAnswered}
                  aria-checked={isAnswered}
                  onChange={onChange(choice.id)}
                  htmlFor={choice.id}
                  control={
                    <Control
                      {...controlProps}
                      icon={<BlankIcon style={{ fontSize: 20 }} />}
                      checkedIcon={<CheckedIcon style={{ fontSize: 20 }} />}
                    />
                  }
                  disabled={disableAll}
                  label={choice.text}
                  aria-label={choice.text}
                  style={{ marginRight: 0 }}
                />
                
                <FlexGrid container padding="0 0 0 32px">
                  {(list.length > 0 && isValidation) &&
                  <FlexGrid container type="row" align="center" padding="5px 10px 5px 0">
                    {list.map((answer, i) => {
                      const user = userImages[answer.userId]
                      return (
                        <div style={{ marginRight: 2 }} key={`user-answer-${answer.schemeAnswerId}-${i}`}>
                          <CodingValidationAvatar
                            user={user}
                            enabled={false}
                            isValidator={answer.isValidatorAnswer}
                            key={`user-${user.id}-${answer.pincite}-${answer.schemeAnswerId}`}
                          />
                        </div>
                      )
                    })}
                  </FlexGrid>}
                  
                  {(list.length > 0 && isValidation) &&
                  <PinciteList
                    answerList={answerList}
                    userImages={userImages}
                    isAnswered={isAnswered}
                    validatorObj={{ ...userAnswers.answers[choice.id], ...validatedBy }}
                    handleChangePincite={onChangePincite}
                  />}
                </FlexGrid>
                
                {(isAnswered && !isValidation) &&
                <PinciteTextField
                  style={{ paddingLeft: 32, paddingBottom: 5, marginTop: 10, width: 'unset', flex: '1 1 0%' }}
                  schemeAnswerId={choice.id}
                  pinciteValue={userAnswers.answers[choice.id].pincite}
                  handleChangePincite={onChangePincite}
                  disabled={disableAll}
                />}
              </FlexGrid>
              <FlexGrid
                container
                padding="0 5px"
                align="center"
                justify="center"
                style={{ minWidth: 40, marginLeft: 10 }}>
                {(!areDocsEmpty && (hoveredAnswerChoice === choice.id || showAnnoMode || viewModeEnabled)) &&
                <AnnotationControls
                  onToggleViewAnnotations={onToggleViewAnnotations}
                  onToggleAnnotationMode={onToggleAnnotationMode}
                  annoModeButtonDisabled={!isAnswered || disableAll}
                  viewButtonDisabled={isValidation
                    ? !checkForAnnotations(answerList, userHasAnnotations)
                    : !userHasAnnotations
                  }
                  answerId={choice.id}
                  viewEnabled={viewModeEnabled}
                  annoModeEnabled={showAnnoMode}
                />}
              </FlexGrid>
            </FlexGrid>
          )
        })}
      </FormGroup>
    </FormControl>
  )
}

SelectionControlQuestion.defaultProps = {
  pincites: true,
  userImages: undefined
}

SelectionControlQuestion.propTypes = {
  /**
   * Array of answer choices to display as checkbox inputs
   */
  choices: PropTypes.array,
  /**
   * The user's answer object for this question
   */
  userAnswers: PropTypes.object,
  /**
   * Function to call when a user clicks a checkbox input
   */
  onChange: PropTypes.func,
  /**
   * Function to call when the user changes the pincite text field
   */
  onChangePincite: PropTypes.func,
  /**
   * Whether or not to show pincite text field
   */
  mergedUserQuestions: PropTypes.object,
  /**
   * Whether or not to disabled all inputs
   */
  disableAll: PropTypes.bool,
  /**
   * User images array for getting the avatars (used in validation)
   */
  userImages: PropTypes.object,
  /**
   * Current question
   */
  question: PropTypes.object,
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * answer choice id that has been selected for annotating
   */
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * handles when a user enables / disables an answer choice for annotating
   */
  onToggleAnnotationMode: PropTypes.func,
  /**
   * Whether or not annotation mode is enabled
   */
  annotationModeEnabled: PropTypes.bool,
  /**
   * Whether or not this project / jurisdiction has documents
   */
  areDocsEmpty: PropTypes.bool,
  /**
   * Current logged in user
   */
  user: PropTypes.object,
  /**
   * Showing annotations
   */
  onToggleViewAnnotations: PropTypes.func,
  /**
   * When the mouse enters the answer choice area
   */
  onMouseInAnswerChoice: PropTypes.func,
  /**
   * When the mouse leaves the answer choice area
   */
  onMouseOutAnswerChoice: PropTypes.func,
  /**
   * Which answer choice is currently being hovered on
   */
  hoveredAnswerChoice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default withStyles(styles)(SelectionControlQuestion)
