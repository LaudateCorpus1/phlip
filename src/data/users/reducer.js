import { types } from './actions'
import { getInitials, updateObject } from 'utils/normalize'

const INITIAL_STATE = {
  currentUser: {},
  byId: {}
}

const handleUpdateUser = (user, avatar) => {
  return {
    username: `${user.firstName} ${user.lastName}`,
    initials: getInitials(user.firstName, user.lastName),
    avatar: avatar === null ? '' : avatar
  }
}

/**
 * Reducer for handling user related actions, mostly coming from the actions in the avatar menu
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{currentUser: {}, menuOpen: boolean, pdfError: string, pdfFile: null}}
 */
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CURRENT_USER:
    case types.CHECK_PIV_USER_SUCCESS:
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...action.payload,
          avatar: action.payload.avatar === null ? '' : action.payload.avatar
        },
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            ...action.payload,
            ...handleUpdateUser(action.payload, action.payload.avatar)
          }
        }
      }
    
    case types.ADD_USER_IMAGE_SUCCESS:
    case types.DELETE_USER_IMAGE_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.userId]: {
            ...state.byId[action.payload.userId],
            ...action.payload.user,
            ...handleUpdateUser(action.payload.user, action.payload.avatar)
          }
        }
      }
    
    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }
    
    case types.ADD_USER:
      const user = {
        ...action.payload,
        ...handleUpdateUser(action.payload, action.payload.avatar)
      }
      
      return {
        ...state,
        byId: updateObject(state.byId, { [action.payload.id]: user })
      }
    
    case types.UPDATE_USER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: updateObject(state.byId[action.payload.id], action.payload.avatar)
        }
      }
    
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

export default userReducer
