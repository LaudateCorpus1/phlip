import actions, { types } from '../actions'

describe('Document management - Search Box - actions creators', () => {
  test('should create an action to update search field', () => {
    const expectedAction = {
      type: types.SEARCH_VALUE_CHANGE,
      value: 'hi',
      form: {}
    }
    expect(actions.updateSearchValue('hi', {})).toEqual(expectedAction)
  })

  test('should create an action to update form value', () => {
    const expectedAction = {
      type: types.FORM_VALUE_CHANGE,
      property: 'name',
      value: 'new search value'
    }

    expect(actions.updateFormValue('name', 'new search value')).toEqual(expectedAction)
  })

  test('should create an action to clear the search string', () => {
    const expectedAction = {
      type: types.CLEAR_SEARCH_STRING
    }

    expect(actions.clearSearchString()).toEqual(expectedAction)
  })

  test('should create an action to clear form', () => {
    const expectedAction = {
      type: types.CLEAR_FORM
    }

    expect(actions.clearForm()).toEqual(expectedAction)
  })
})