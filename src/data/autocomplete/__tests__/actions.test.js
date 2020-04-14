import { types, makeAutocompleteActionCreators } from '../actions'

describe('Autocomplete action creators', () => {
  const searchName = 'PROJECT'
  const actions = makeAutocompleteActionCreators(searchName)

  test('should create an action to search for suggestions', () => {
    const expectedAction = {
      type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_${searchName}`,
      searchString: 'over',
      suffix: '',
      index: 1
    }

    expect(actions.searchForSuggestionsRequest('over', '', 1)).toEqual(expectedAction)
  })

  test('should create an action to handle a suggestion being selected', () => {
    const expectedAction = {
      type: `${types.ON_SUGGESTION_SELECTED}_${searchName}`,
      suggestion: { name: 'project 1' }
    }

    expect(actions.onSuggestionSelected({ name: 'project 1' })).toEqual(expectedAction)
  })

  test('should create an action to update search value', () => {
    const expectedAction = {
      type: `${types.UPDATE_SEARCH_VALUE}_${searchName}`,
      value: 'new search value'
    }

    expect(actions.updateSearchValue('new search value')).toEqual(expectedAction)
  })

  test('should create an action to clear suggestions', () => {
    const expectedAction = {
      type: `${types.CLEAR_SUGGESTIONS}_${searchName}`
    }

    expect(actions.clearSuggestions()).toEqual(expectedAction)
  })

  test('should create an action to clear all state', () => {
    const expectedAction = {
      type: `${types.CLEAR_ALL}_${searchName}`
    }

    expect(actions.clearAll()).toEqual(expectedAction)
  })

  test('should create an action to get the initial project list', () => {
    const expectedAction = {
      type: types.GET_INITIAL_PROJECT_SUGGESTION_REQUEST
    }

    expect(actions.getProjectsByUserRequest()).toEqual(expectedAction)
  })
})
