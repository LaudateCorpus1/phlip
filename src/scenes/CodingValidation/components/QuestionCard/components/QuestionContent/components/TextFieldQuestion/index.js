import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { InputBox, FlexGrid } from 'components'
import { shouldShowAnnotationStyles, checkForAnnotations } from '../SelectionControlQuestion'
import AnnotationControls from '../AnnotationControls'
import PinciteTextField from '../PinciteTextField'
import PinciteList from '../PinciteList'
import CodingValidationAvatar from '../CodingValidationAvatar'

export const TextFieldQuestion = props => {
  const {
    mergedUserQuestions, userAnswers, areDocsEmpty, onChange, answerId, userImages, disableAll,
    onToggleAnnotationMode, enabledAnswerId, annotationModeEnabled, user, onToggleViewAnnotations,
    onMouseInAnswerChoice, onMouseOutAnswerChoice, hoveredAnswerChoice
  } = props
  
  const isValidation = mergedUserQuestions !== null
  const isAnswered = userAnswers.answers.hasOwnProperty(answerId)
  const value = !isAnswered ? '' : userAnswers.answers[answerId].textAnswer
  const showAnnoMode = shouldShowAnnotationStyles(enabledAnswerId, annotationModeEnabled)(answerId)
  const viewModeEnabled = !annotationModeEnabled && enabledAnswerId === answerId
  const userId = isValidation
    ? userAnswers.validatedBy.userId
      ? userAnswers.validatedBy.userId
      : user.id
    : user.id
  
  const userHasAnnotations = !isAnswered ? false : userAnswers.answers[answerId].annotations.length > 0
  
  return (
    <FlexGrid
      container
      flex
      type={isValidation ? 'column' : 'row'}
      style={{ minHeight: 'unset', paddingTop: isValidation ? 15 : 0 }}>
      {isValidation && mergedUserQuestions.answers.map(answer =>
        <FlexGrid container type="row" padding="0 10px 15px 5px" key={answer.id}>
          <FlexGrid container type="row" align="flex-start" padding="0 20px 0 0">
            <CodingValidationAvatar user={userImages[answer.userId]} enabled={false} />
          </FlexGrid>
          <FlexGrid container justify="flex-start">
            <Typography
              style={{ whiteSpace: 'pre-wrap', paddingBottom: 10 }}
              variant="body1">{answer.textAnswer}
            </Typography>
            <FlexGrid container type="row" align="center">
              <PinciteList alwaysShow showAvatar={false} answerList={[answer]} userImages={userImages} />
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>)}
      <FlexGrid
        container
        type="row"
        flex
        align="flex-start"
        padding="15px 10px 15px 5px"
        onMouseEnter={() => onMouseInAnswerChoice(answerId)}
        onMouseLeave={() => onMouseOutAnswerChoice(answerId)}
        style={{
          backgroundColor: (showAnnoMode || viewModeEnabled)
            ? '#e6f8ff'
            : hoveredAnswerChoice === answerId
              ? '#f5f5f5'
              : 'white',
          marginRight: 10
        }}>
        {(isAnswered && isValidation) &&
        <FlexGrid container type="row" align="flex-start" padding="0 20px 0 0">
          <CodingValidationAvatar enabled={false} isValidator user={userImages[userId]} />
        </FlexGrid>}
        <FlexGrid container justify="flex-start" flex>
          <InputBox
            onChange={onChange(answerId, 'textAnswer')}
            value={value}
            rows={7}
            placeholder="Enter answer"
            disabled={disableAll}
            name="text-answer"
          />
          {isAnswered &&
          <PinciteTextField
            schemeAnswerId={answerId}
            pinciteValue={userAnswers.answers[answerId].pincite}
            handleChangePincite={onChange}
            disabled={disableAll}
            style={{ marginTop: 10, paddingBottom: 5 }}
          />}
        </FlexGrid>
        <FlexGrid
          container
          padding="0 5px"
          align="center"
          justify="center"
          style={{ minWidth: 40, marginLeft: 10 }}>
          {(!areDocsEmpty && (hoveredAnswerChoice === answerId || showAnnoMode || viewModeEnabled)) &&
          <AnnotationControls
            onToggleViewAnnotations={onToggleViewAnnotations}
            onToggleAnnotationMode={onToggleAnnotationMode}
            answerId={answerId}
            showAnnoModeButton={isAnswered}
            viewEnabled={viewModeEnabled}
            annoModeEnabled={showAnnoMode}
            annoModeButtonDisabled={!isAnswered || disableAll}
            viewButtonDisabled={isValidation
              ? !checkForAnnotations(mergedUserQuestions.answers, userHasAnnotations)
              : !userHasAnnotations
            }
          />}
        </FlexGrid>
      </FlexGrid>
    </FlexGrid>
  )
}

TextFieldQuestion.propTypes = {
  /**
   * Function to call when the input changes
   */
  onChange: PropTypes.func,
  /**
   * Name of the input
   */
  name: PropTypes.string,
  /**
   * Number of rows the textarea should be
   */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * schemeAnswerId of the Coding / Validation question
   */
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Collection of user images for ValidationAvatar
   */
  userImages: PropTypes.object,
  /**
   * Handles enabling the answer for annotation mode
   */
  onToggleAnnotationMode: PropTypes.func,
  /**
   * ID of the enabled answer choice
   */
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Whether or not annotation mode is enabled
   */
  annotationModeEnabled: PropTypes.bool,
  /**
   * Whether or not there are documents
   */
  areDocsEmpty: PropTypes.bool,
  /**
   * Coded user answers only used for validation
   */
  mergedUserQuestions: PropTypes.object,
  /**
   * Current user answers
   */
  userAnswers: PropTypes.object,
  /**
   * Whether or not to disable the input field
   */
  disableAll: PropTypes.bool,
  /**
   * Current logged in user
   */
  user: PropTypes.object,
  /**
   * Toggle view annotations
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

export default TextFieldQuestion
