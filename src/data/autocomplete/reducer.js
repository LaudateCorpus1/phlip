import { types } from './actions'

export const INITIAL_STATE = {
  searchValue: '',
  suggestions: [],
  selectedSuggestion: {},
  searching: false
}

export const createAutocompleteReducer = (searchName, suffix = '') => {
  return function (state = INITIAL_STATE, action) {
    switch (action.type) {
      case `${types.UPDATE_SEARCH_VALUE}_${searchName}${suffix}`:
        return {
          ...state,
          searchValue: action.value,
          suggestions: action.value === '' ? [] : state.suggestions,
          selectedSuggestion: action.value === '' ? {} : state.selectedSuggestion
        }
      
      case `${types.SET_SEARCHING_STATUS}_${searchName}${suffix}`:
        return {
          ...state,
          searching: action.status
        }
      
      case `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_${searchName}`:
      case `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_${searchName}`:
        return {
          ...state,
          searching: action.suffix === suffix
            ? !action.index && action.index !== 0
              ? true
              : state.searching
            : state.searching
        }
      
      case `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_${searchName}${suffix}`:
        return {
          ...state,
          suggestions: action.payload,
          searching: false
        }
      
      case `${types.ON_SUGGESTION_SELECTED}_${searchName}${suffix}`:
        return {
          ...state,
          selectedSuggestion: action.suggestion,
          searchValue: action.suggestion.name,
          suggestions: [],
          searching: false
        }
      
      case `${types.CLEAR_SUGGESTIONS}_${searchName}${suffix}`:
        return {
          ...state,
          suggestions: [],
          searching: false
        }
      
      case `${types.CLEAR_ALL}_${searchName}${suffix}`:
      case types.FLUSH_STATE:
        return INITIAL_STATE
      
      default:
        return state
    }
  }
}
