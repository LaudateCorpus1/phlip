import { types } from './actions'

export const INITIAL_STATE = {
  alert: {
    open: false,
    title: '',
    text: '',
    type: '',
    data: {}
  },
  touched: false,
  header: '',
  canReset: false
}

export const cardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          continueButtonText: '',
          ...action.alert
        }
      }
    
    case types.CLOSE_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          open: false
        }
      }
      
    case types.CHANGE_TOUCHED_STATUS:
      return {
        ...state,
        touched: action.touched
      }
      
    case types.SET_HEADER_TEXT:
      return {
        ...state,
        header: action.text
      }
      
    case types.SET_RESET_STATUS:
      return {
        ...state,
        canReset: action.canReset
      }
      
    case types.ON_CLOSE_SCREEN:
      return INITIAL_STATE
      
    default:
      return state
  }
}

export default cardReducer
