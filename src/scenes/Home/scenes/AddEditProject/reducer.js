import { types } from './actions'

export const INITIAL_STATE = {
  formError: null,
  goBack: false,
  submitting: false,
  userSuggestions: [],
  userSearchValue: '',
  togglingLock: false,
  project: {
    users: []
  }
}

/**
 * Reducer for the AddEditProject scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{formError: null, goBack: boolean}}
 */
const addEditProjectReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INIT_PROJECT:
      const creatorIndex = action.project.projectUsers.findIndex(user => user.userId === action.project.createdById)
      const users = action.project.projectUsers.slice()
      users.splice(creatorIndex, 1)
      const updated = [...users, action.project.projectUsers[creatorIndex]]
      
      return {
        ...state,
        project: {
          ...action.project,
          users: updated
        },
        userSearchValue: '',
        userSuggestions: []
      }
  
    case types.ADD_PROJECT_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    case types.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: true,
        goBack: false
      }
    
    case types.DELETE_PROJECT_SUCCESS:
    case types.UPDATE_PROJECT_SUCCESS:
    case types.ADD_PROJECT_SUCCESS:
      return {
        ...state,
        formError: null,
        goBack: true,
        submitting: false
      }
  
    case types.ADD_PROJECT_FAIL:
    case types.UPDATE_PROJECT_FAIL:
    case types.DELETE_PROJECT_FAIL:
      return {
        ...state,
        formError: action.payload,
        goBack: false,
        submitting: false
      }
    
    case types.LOCK_PROJECT_REQUEST:
    case types.UNLOCK_PROJECT_REQUEST:
      return {
        ...state,
        togglingLock: true
      }
  
    case types.LOCK_PROJECT_SUCCESS:
    case types.UNLOCK_PROJECT_SUCCESS:
      return {
        ...state,
        togglingLock: false,
        formError: null,
        project: {
          ...state.project,
          status: action.status
        },
        goBack: false
      }
    
    case types.LOCK_PROJECT_FAIL:
    case types.UNLOCK_PROJECT_FAIL:
      return {
        ...state,
        togglingLock: false,
        formError: action.payload,
        goBack: false
      }
    
    case types.ON_USER_SUGGESTION_SELECTED:
      return {
        ...state,
        project: {
          ...state.project,
          users: [
            { ...action.user, userId: action.user.id },
            ...state.project.users
          ]
        },
        userSearchValue: ''
      }
    
    case types.REMOVE_USER_FROM_LIST:
      const updatedUsers = state.project.users.slice()
      updatedUsers.splice(action.index, 1)
      
      return {
        ...state,
        project: {
          ...state.project,
          users: updatedUsers
        }
      }
    
    case types.UPDATE_USER_SUGGESTION_VALUE:
      return {
        ...state,
        userSearchValue: action.suggestionValue
      }
    
    case types.SET_USER_SUGGESTIONS:
      return {
        ...state,
        userSuggestions: action.payload.filter(
          user => state.project.users.findIndex(pUser => pUser.userId === user.id) === -1
        )
      }
    
    case types.ON_CLEAR_USER_SUGGESTIONS:
      return {
        ...state,
        userSuggestions: []
      }
    
    case types.RESET_FORM_ERROR:
      return {
        ...state,
        formError: null
      }
    
    default:
      return state
  }
}

export default addEditProjectReducer
