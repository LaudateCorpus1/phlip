import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { combineReducers } from 'redux'
import addEditJurisdictions from './scenes/AddEditJurisdictions/reducer'
import addEditProject from './scenes/AddEditProject/reducer'
import { updater } from 'utils'

export const INITIAL_STATE = {
  projects: {
    visible: [],
    matches: []
  },
  bookmarkList: [],
  searchValue: '',
  rowsPerPage: '10',
  page: 0,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false,
  projectCount: 0,
  projectToExport: {
    text: '',
    id: null,
    name: '',
    projectUsers: [],
    exportType: null,
    user: {
      id: null,
      firstName: '',
      lastName: ''
    }
  },
  exporting: false,
  openProject: 0,
  apiErrorAlert: {
    text: '',
    open: false
  }
}

/**
 * This is the main reducer for the Home scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const mainReducer = (state = INITIAL_STATE, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)
  
  switch (action.type) {
    case projectTypes.SET_PROJECTS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'searchValue', 'projectCount']),
        projects: action.payload.projects,
        searchValue: ''
      }
    
    case types.TOGGLE_BOOKMARK_SUCCESS:
      return updateHomeState(['bookmarkList'])
    
    case types.SORT_PROJECTS:
    case types.SORT_BOOKMARKED:
    case types.UPDATE_ROWS:
    case types.UPDATE_PAGE:
    case types.UPDATE_SEARCH_VALUE:
    case types.UPDATE_VISIBLE_PROJECTS:
    case types.REMOVE_PROJECT:
      return {
        ...state,
        ...action.payload
      }
    
    case types.GET_PROJECTS_FAIL:
      return {
        ...state,
        errorContent: 'We couldn\'t retrieve the project list. Please try again later.',
        error: true
      }
    
    case types.SET_PROJECT_TO_EXPORT:
      return {
        ...state,
        projectToExport: {
          ...state.projectToExport,
          id: action.project.id,
          projectUsers: action.project.projectUsers,
          name: action.project.name,
          text: ''
        }
      }
    
    case types.CLEAR_PROJECT_TO_EXPORT:
      return {
        ...state,
        projectToExport: {
          ...INITIAL_STATE.projectToExport
        }
      }
    
    case types.EXPORT_DATA_REQUEST:
      return {
        ...state,
        projectToExport: {
          ...state.projectToExport,
          exportType: action.exportType,
          user: action.user === null
            ? { id: 'val' }
            : {
              id: action.user.userId,
              firstName: action.user.firstName,
              lastName: action.user.lastName
            },
          text: ''
        },
        exporting: true
      }
    
    case types.EXPORT_DATA_SUCCESS:
      return {
        ...state,
        projectToExport: {
          ...state.projectToExport,
          text: action.payload
        },
        exporting: false
      }
    
    case types.TOGGLE_BOOKMARK_FAIL:
    case types.GET_PROJECT_USERS_FAIL:
    case types.EXPORT_DATA_FAIL:
      return {
        ...state,
        apiErrorAlert: {
          text: action.payload,
          open: true
        },
        exporting: false
      }
    
    case types.DISMISS_API_ERROR:
      return {
        ...state,
        apiErrorAlert: {
          ...state.apiErrorAlert,
          open: false
        }
      }
    
    case types.TOGGLE_PROJECT:
      return {
        ...state,
        openProject: action.projectId === state.openProject ? 0 : action.projectId
      }
    
    case types.FLUSH_STATE:
      return {
        ...INITIAL_STATE,
        rowsPerPage: state.rowsPerPage,
        openProject: action.isLogout ? 0 : state.openProject
      }
    
    case types.GET_PROJECTS_SUCCESS:
    case types.GET_PROJECTS_REQUEST:
    default:
      return state
  }
}

/**
 * Combines the reducers from ./scenes/AddEditProject and ./scenes/AddEditJurisdiction
 */
const homeRootReducer = combineReducers({
  main: mainReducer,
  addEditProject,
  addEditJurisdictions
})

export default homeRootReducer
