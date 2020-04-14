import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  ADD_QUESTION_SUCCESS: 'ADD_QUESTION_SUCCESS',
  ADD_QUESTION_REQUEST: 'ADD_QUESTION_REQUEST',
  ADD_QUESTION_FAIL: 'ADD_QUESTION_FAIL',
  ADD_CHILD_QUESTION_REQUEST: 'ADD_CHILD_QUESTION_REQUEST',
  ADD_CHILD_QUESTION_SUCCESS: 'ADD_CHILD_QUESTION_SUCCESS',
  ADD_CHILD_QUESTION_FAIL: 'ADD_CHILD_QUESTION_FAIL',
  UPDATE_QUESTION_SUCCESS: 'UPDATE_QUESTION_SUCCESS',
  UPDATE_QUESTION_REQUEST: 'UPDATE_QUESTION_REQUEST',
  UPDATE_QUESTION_FAIL: 'UPDATE_QUESTION_FAIL',
  UPDATE_TYPE: 'UPDATE_TYPE',
  RESET_ALERT_ERROR: 'RESET_ALERT_ERROR'
}

export default {
  addQuestionRequest: makeActionCreator(types.ADD_QUESTION_REQUEST, 'question', 'projectId', 'parentId'),
  addChildQuestionRequest: makeActionCreator(
    types.ADD_CHILD_QUESTION_REQUEST,
    'question',
    'projectId',
    'parentId',
    'parentNode',
    'path'
  ),
  updateQuestionRequest: makeActionCreator(types.UPDATE_QUESTION_REQUEST, 'question', 'projectId', 'questionId', 'path'),
  resetFormError: makeActionCreator(types.RESET_ALERT_ERROR),
  updateType: makeActionCreator(types.UPDATE_TYPE)
}
