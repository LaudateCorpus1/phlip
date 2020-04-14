import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as documentTypes } from 'scenes/DocumentManagement/actions'
import { types as projectTypes } from 'data/projects/actions'
import { handleUserImages } from 'utils/commonHelpers'

/**
 * Sends a request to add a project
 */
export const addProjectLogic = createLogic({
  type: types.ADD_PROJECT_REQUEST,
  async process({ getState, action, api }, dispatch, done) {
    try {
      const project = await api.addProject(action.project, {}, {})
      dispatch({ type: types.ADD_PROJECT_SUCCESS })
      dispatch({ type: projectTypes.ADD_PROJECT, payload: { ...project, lastUsersCheck: null } })
      dispatch({ type: types.UPDATE_VISIBLE_PROJECTS, payload: {} })
      await handleUserImages(project.projectUsers, getState().data.user.byId, dispatch, api)
    } catch (error) {
      dispatch({
        type: types.ADD_PROJECT_FAIL,
        payload: 'We couldn\'t add the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to update a project
 */
export const updateProjectLogic = createLogic({
  type: types.UPDATE_PROJECT_REQUEST,
  async process({ getState, action, api }, dispatch, done) {
    try {
      const updatedProject = await api.updateProject(action.project, {}, { projectId: action.project.id })
      dispatch({ type: types.UPDATE_PROJECT_SUCCESS })
      await handleUserImages(updatedProject.projectUsers, getState().data.user.byId, dispatch, api)
      dispatch({ type: projectTypes.UPDATE_PROJECT, payload: updatedProject })
      dispatch({ type: types.UPDATE_VISIBLE_PROJECTS, payload: {} })
    } catch (error) {
      dispatch({
        type: types.UPDATE_PROJECT_FAIL,
        payload: 'We couldn\'t update the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 *
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *}, undefined, string>}
 */
export const toggleLockProjectLogic = createLogic({
  type: [types.LOCK_PROJECT_REQUEST, types.UNLOCK_PROJECT_REQUEST],
  async process({ action, api }, dispatch, done) {
    try {
      const updatedProject = await api.updateProject(
        { ...action.project, status: action.status },
        {},
        { projectId: action.project.id }
      )
      
      dispatch({
        type: action.status === 1 ? types.UNLOCK_PROJECT_SUCCESS : types.LOCK_PROJECT_SUCCESS,
        status: action.status
      })
      dispatch({ type: projectTypes.UPDATE_PROJECT, payload: updatedProject })
      dispatch({ type: types.UPDATE_VISIBLE_PROJECTS, payload: {} })
    } catch (error) {
      dispatch({
        type: action.status === 1 ? types.UNLOCK_PROJECT_FAIL : types.LOCK_PROJECT_FAIL,
        payload: `We couldn\'t ${action.status === 1 ? 'unlock' : 'lock'} the project. Please try again later.`,
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to delete a project
 */
export const deleteProjectLogic = createLogic({
  type: types.DELETE_PROJECT_REQUEST,
  async process({ getState, action, api }, dispatch, done) {
    const projectMeta = getState().data.projects.byId[action.project]
    try {
      await api.deleteProject({}, {}, { projectId: action.project })
      dispatch({
        type: types.DELETE_PROJECT_SUCCESS,
        project: action.project
      })
      
      dispatch({ type: projectTypes.REMOVE_PROJECT, projectId: action.project, payload: {} })
      
      // remove project id from all documents' project list and also clean up redux store when completed
      dispatch({
        type: documentTypes.CLEAN_PROJECT_LIST_REQUEST,
        projectMeta: projectMeta
      })
    } catch (error) {
      dispatch({
        type: types.DELETE_PROJECT_FAIL,
        payload: 'We couldn\'t delete the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Transforms the actions for creating and updating to include the userId of the user currently logged in so the code
 * doesn't have to be repeated in both logic.
 */
export const updateUserId = createLogic({
  type: [
    types.ADD_PROJECT_REQUEST,
    types.UPDATE_PROJECT_REQUEST,
    types.LOCK_PROJECT_REQUEST,
    types.UNLOCK_PROJECT_REQUEST
  ],
  transform({ getState, action }, next) {
    const users = getState().scenes.home.addEditProject.project.users.map(user => user.userId)
    next({
      ...action,
      project: {
        ...action.project,
        userId: getState().data.user.currentUser.id,
        users,
        status: getState().scenes.home.addEditProject.project.status
      }
    })
  }
})

/**
 * Handles searching the user list for adding useres
 */
export const searchUserList = createLogic({
  type: types.SEARCH_USER_LIST,
  latest: true,
  async process({ action, api }, dispatch, done) {
    const response = await api.searchUserList({}, {
      params: {
        name: action.searchString
      }
    }, {})
    const users = response.map(user => ({
      ...user,
      name: `${user.firstName} ${user.lastName}`
    }))
    dispatch({ type: types.SET_USER_SUGGESTIONS, payload: users })
    done()
  }
})

export default [
  updateUserId,
  addProjectLogic,
  updateProjectLogic,
  deleteProjectLogic,
  searchUserList,
  toggleLockProjectLogic
]
