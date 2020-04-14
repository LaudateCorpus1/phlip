import { types } from './actions'

const INITIAL_STATE = {
  session: !!sessionStorage.phlip_token,
  pivError: null,
  formMessage: null,
  backendInfo: {
    pipelineId: '',
    builtTime: '',
    databaseName: ''
  }
}

/**
 * Main reducer for handling logging in and logging out
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{session: boolean, pivError: null, formMessage: null}}
 */
const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
    case types.CHECK_PIV_USER_SUCCESS:
      return {
        ...state,
        session: !!sessionStorage.phlip_token,
        formMessage: null
      }
    
    case types.LOGIN_USER_FAIL:
    case types.CHECK_PIV_USER_FAIL:
      return {
        ...state,
        formMessage: action.payload
      }
    
    case types.LOGOUT_USER:
      if (action.sessionExpired === true) {
        return {
          ...state,
          session: false,
          formMessage: 'Your session expired. Please login again.'
        }
      } else {
        return {
          ...state,
          session: false
        }
      }
    
    case types.FLUSH_STATE:
      return {
        ...INITIAL_STATE,
        formMessage: state.formMessage,
        session: false
      }
    
    case types.GET_BACKEND_INFO_SUCCESS:
      return {
        ...state,
        backendInfo: action.payload
      }
      
    case types.LOGIN_USER_REQUEST:
    case types.CHECK_PIV_USER_REQUEST:
    case types.GET_BACKEND_INFO_REQUEST:
    default:
      return state
  }
}

export default loginReducer
