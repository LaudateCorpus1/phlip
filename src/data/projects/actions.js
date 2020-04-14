import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_PROJECT_REQUEST: 'GET_PROJECT_REQUEST',
  GET_PROJECT_SUCCESS: 'GET_PROJECT_SUCCESS',
  GET_PROJECT_FAIL: 'GET_PROJECT_FAIL',
  ADD_PROJECT: 'ADD_PROJECT',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  FLUSH_STATE: 'FLUSH_STATE',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  UPDATE_EDITED_FIELDS: 'UPDATE_EDITED_FIELDS',
  SET_PROJECTS: 'SET_PROJECTS'
}

export default {
  getProjectRequest: makeActionCreator(types.GET_PROJECT_REQUEST, 'projectId'),
  addProject: makeActionCreator(types.ADD_PROJECT, 'payload')
}
