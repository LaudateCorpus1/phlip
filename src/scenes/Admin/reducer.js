import { types } from './actions'
import { combineReducers } from 'redux'
import addEditUserReducer from './scenes/AddEditUser/reducer'
import { commonHelpers, updater } from 'utils'

export const INITIAL_STATE = {
  users: [],
  rowsPerPage: 10,
  page: 0,
  sortBy: 'lastName',
  direction: 'asc',
  visibleUsers: [],
  error: false,
  errorContent: ''
}

/**
 * Determines the list of user that are visible based on sort by and direction
 *
 * @param {Array} users
 * @param {String} sortBy
 * @param {String} direction
 * @returns {{users: Array, visibleUsers: Array}}
 */
const getAvailableUsers = (users, sortBy, direction) => {
  const sortedUsers = commonHelpers.sortListOfObjects(users, sortBy, direction)
  return { users: sortedUsers, visibleUsers: sortedUsers }
}

/**
 * Main reducer for User Management ('Admin') scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{users: Array, rowsPerPage: number, page: number, sortBy: string, direction: string, visibleUsers: Array}}
 */
export const adminReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_USERS_SUCCESS:
      return {
        ...state,
        error: false,
        errorContent: '',
        ...getAvailableUsers(action.payload, state.sortBy, state.direction, state.page, state.rowsPerPage)
      }

    case types.ADD_USER_SUCCESS:
      const updated = getAvailableUsers(state.users, 'lastName', 'asc', 0, state.rowsPerPage)
      if ((updated.visibleUsers.length + 1) > state.rowsPerPage) {
        updated.visibleUsers.pop()
      }
      return {
        ...state,
        users: [action.payload, ...updated.users],
        sortBy: 'lastName',
        direction: 'desc',
        page: 0,
        visibleUsers: [action.payload, ...updated.visibleUsers]
      }

    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: updater.updateByProperty(action.payload, [...state.users], 'id'),
        visibleUsers: updater.updateByProperty(action.payload, [...state.visibleUsers], 'id')
      }

    case types.SORT_USERS:
      const direction = state.direction === 'asc' ? 'desc' : 'asc'
      return {
        ...state,
        sortBy: action.sortBy,
        direction: direction,
        ...getAvailableUsers(state.users, action.sortBy, direction, state.page, state.rowsPerPage)
      }

    case types.ADD_USER_IMAGE_SUCCESS:
      const user = state.users.find(user => user.id === action.payload.userId)
      return {
        ...state,
        users: updater.updateByProperty({ ...user, avatar: action.payload.avatar }, [...state.users], 'id'),
        visibleUsers: updater.updateByProperty({ ...user, avatar: action.payload.avatar }, [...state.visibleUsers], 'id')
      }
      
    case types.GET_USERS_FAIL:
      return {
        ...state,
        errorContent: 'We couldn\'t retrieve the list of users. Please try again later.',
        error: true
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    case types.GET_USERS_REQUEST:
    default:
      return state
  }
}

/**
 * Combining this reducer and reducer for AddEditUser component in ./scenes/AddEditUser/reducer.js
 */
const adminRootReducer = combineReducers({
  main: adminReducer,
  addEditUser: addEditUserReducer
})

export default adminRootReducer
