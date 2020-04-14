import { types } from './actions'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

export const INITIAL_STATE = {
  params: {
    project: {
      name: '',
      id: null
    },
    jurisdiction: {
      name: '',
      id: null
    },
    uploadedDate1: '',
    uploadedDate2: '',
    uploadedBy: '',
    name: ''
  },
  searchValue: ''
}

export const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FORM_VALUE_CHANGE:
      return {
        ...state,
        params: {
          ...state.params,
          [action.property]: action.value
        }
      }

    case types.SEARCH_VALUE_CHANGE:
      return {
        ...state,
        searchValue: action.value
      }

    case types.CLEAR_SEARCH_STRING:
      return {
        ...state,
        searchValue: ''
      }

    case types.CLEAR_FORM:
      return {
        ...state,
        params: INITIAL_STATE.params
      }
  
    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_PROJECT_SEARCH`:
      return {
        ...state,
        params: {
          ...state.params,
          project: {
            ...action.suggestion
          }
        }
      }
  
    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION_SEARCH`:
      return {
        ...state,
        params: {
          ...state.params,
          jurisdiction: {
            ...action.suggestion
          }
        }
      }

    default:
      return state
  }
}

export const COMBINED_INITIAL_STATE = {
  form: INITIAL_STATE
}

const search = (state = COMBINED_INITIAL_STATE, action) => ({
  form: searchReducer(state.form, action)
})

export default search
