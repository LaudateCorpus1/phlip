import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
  UPDATE_PROJECT_FAIL: 'UPDATE_PROJECT_FAIL',
  ADD_PROJECT_SUCCESS: 'ADD_PROJECT_SUCCESS',
  ADD_PROJECT_REQUEST: 'ADD_PROJECT_REQUEST',
  ADD_PROJECT_FAIL: 'ADD_PROJECT_FAIL',
  DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
  DELETE_PROJECT_REQUEST: 'DELETE_PROJECT_REQUEST',
  DELETE_PROJECT_FAIL: 'DELETE_PROJECT_FAIL',
  SEARCH_USER_LIST: 'SEARCH_USER_LIST',
  UPDATE_USER_SUGGESTION_VALUE: 'UPDATE_USER_SUGGESTION_VALUE',
  ON_CLEAR_USER_SUGGESTIONS: 'ON_CLEAR_USER_SUGGESTIONS',
  ON_USER_SUGGESTION_SELECTED: 'ON_USER_SUGGESTION_SELECTED',
  SET_USER_SUGGESTIONS: 'SET_USER_SUGGESTIONS',
  REMOVE_USER_FROM_LIST: 'REMOVE_USER_FROM_LIST',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  UPDATE_VISIBLE_PROJECTS: 'UPDATE_VISIBLE_PROJECTS',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  RESET_FORM_ERROR: 'RESET_FORM_ERROR',
  UNLOCK_PROJECT_REQUEST: 'UNLOCK_PROJECT_REQUEST',
  UNLOCK_PROJECT_SUCCESS: 'UNLOCK_PROJECT_SUCCESS',
  UNLOCK_PROJECT_FAIL: 'UNLOCK_PROJECT_FAIL',
  LOCK_PROJECT_REQUEST: 'LOCK_PROJECT_REQUEST',
  LOCK_PROJECT_SUCCESS: 'LOCK_PROJECT_SUCCESS',
  LOCK_PROJECT_FAIL: 'LOCK_PROJECT_FAIL',
  INIT_PROJECT: 'INIT_PROJECT'
}

export default {
  addProjectRequest: makeActionCreator(types.ADD_PROJECT_REQUEST, 'project'),
  addProjectSuccess: makeActionCreator(types.ADD_PROJECT_SUCCESS, 'payload'),
  updateProjectRequest: makeActionCreator(types.UPDATE_PROJECT_REQUEST, 'project'),
  updateProjectSuccess: makeActionCreator(types.UPDATE_PROJECT_SUCCESS, 'payload'),
  deleteProjectRequest: makeActionCreator(types.DELETE_PROJECT_REQUEST, 'project'),
  deleteProjectSuccess: makeActionCreator(types.DELETE_PROJECT_SUCCESS, 'payload'),
  resetFormError: makeActionCreator(types.RESET_FORM_ERROR),
  searchUserList: makeActionCreator(types.SEARCH_USER_LIST, 'searchString'),
  onSuggestionValueChanged: makeActionCreator(types.UPDATE_USER_SUGGESTION_VALUE, 'suggestionValue'),
  onClearSuggestions: makeActionCreator(types.ON_CLEAR_USER_SUGGESTIONS),
  onUserSelected: makeActionCreator(types.ON_USER_SUGGESTION_SELECTED, 'user'),
  removeUserFromList: makeActionCreator(types.REMOVE_USER_FROM_LIST, 'index'),
  lockProjectRequest: makeActionCreator(types.LOCK_PROJECT_REQUEST, 'project', 'status'),
  unlockProjectRequest: makeActionCreator(types.UNLOCK_PROJECT_REQUEST, 'project', 'status'),
  initProject: makeActionCreator(types.INIT_PROJECT, 'project')
}
