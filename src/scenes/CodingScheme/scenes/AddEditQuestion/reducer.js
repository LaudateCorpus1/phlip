import { types } from './actions'

export const INITIAL_STATE = {
  submitting: false,
  goBack: false,
  formError: false
}

export const addEditQuestionReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.ADD_CHILD_QUESTION_REQUEST:
    case types.ADD_QUESTION_REQUEST:
    case types.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        submitting: true,
        formError: null,
        goBack: false
      }
  
    case types.ADD_CHILD_QUESTION_SUCCESS:
    case types.ADD_QUESTION_SUCCESS:
    case types.UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        submitting: false,
        goBack: true,
        formError: null
      }
  
    case types.ADD_CHILD_QUESTION_FAIL:
    case types.ADD_QUESTION_FAIL:
    case types.UPDATE_QUESTION_FAIL:
      return {
        ...state,
        submitting: false,
        goBack: false,
        formError: action.payload
      }
      
    default:
      return state
  }
}

export default addEditQuestionReducer
