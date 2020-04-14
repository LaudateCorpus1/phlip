import { types } from './actions'

export const INITIAL_STATE = {
  avatar: null,
  formError: '',
  submitting: false,
  goBack: false
}

/**
 * Reducer for the AddEditUser scene. Accessible at state.scenes.admin.addEditUser
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
const addEditUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_ADD_EDIT_AVATAR:
      return {
        ...state,
        avatar: action.avatar
      }

    case types.ADD_USER_FAIL:
    case types.ADD_USER_IMAGE_FAIL:
    case types.DELETE_USER_IMAGE_FAIL:
    case types.UPDATE_USER_FAIL:
      return {
        ...state,
        formError: action.payload,
        submitting: false
      }

    case types.RESET_USER_FORM_ERROR:
      return {
        ...state,
        formError: ''
      }
  
    case types.ADD_USER_IMAGE_SUCCESS:
    case types.DELETE_USER_IMAGE_SUCCESS:
      return {
        ...state,
        submitting: false,
        avatar: action.payload.avatar
      }

    case types.UPDATE_USER_SUCCESS:
    case types.ADD_USER_SUCCESS:
      return {
        ...INITIAL_STATE,
        submitting: false,
        goBack: true
      }
      
    case types.ADD_USER_REQUEST:
    case types.UPDATE_USER_REQUEST:
    case types.ADD_USER_IMAGE_REQUEST:
    case types.DELETE_USER_IMAGE_REQUEST:
      return {
        ...state,
        submitting: true,
        goBack: false
      }
      
    case types.ON_CLOSE_ADD_EDIT_USER:
      return INITIAL_STATE

    default:
      return state
  }
}

export default addEditUserReducer
