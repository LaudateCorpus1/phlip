import actions, { types } from '../actions'

describe('Home scene - AddEditJurisdiction actions creators', () => {
  test('should create an action to add a jurisdiction', () => {
    const expectedAction = {
      type: types.ADD_PROJECT_JURISDICTION_REQUEST,
      projectId: 1,
      jurisdiction: { id: 1, name: 'Atlanta' }
    }

    expect(actions.addJurisdiction({ id: 1, name: 'Atlanta' }, 1)).toEqual(expectedAction)
  })

  test('should create an action to update a jurisdiction', () => {
    const expectedAction = {
      type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
      projectId: 1,
      jurisdiction: { id: 1, name: 'Atlanta' }
    }

    expect(actions.updateJurisdiction({ id: 1, name: 'Atlanta' }, 1)).toEqual(expectedAction)
  })

  test('should create an action to get project jurisdictions', () => {
    const expectedAction = {
      type: types.GET_PROJECT_JURISDICTIONS_REQUEST,
      projectId: 1
    }

    expect(actions.getProjectJurisdictions(1)).toEqual(expectedAction)
  })

  test('should create an action to update search value', () => {
    const expectedAction = {
      type: types.UPDATE_JURISDICTION_SEARCH_VALUE,
      searchValue: 'Atl'
    }

    expect(actions.updateSearchValue('Atl')).toEqual(expectedAction)
  })

  test('should create an action to clear jurisdictions', () => {
    const expectedAction = {
      type: types.CLEAR_JURISDICTIONS
    }

    expect(actions.clearJurisdictions()).toEqual(expectedAction)
  })

  test('should create an action to search jurisdiction list', () => {
    const expectedAction = {
      type: types.SEARCH_JURISDICTION_LIST,
      searchString: 'Oh'
    }

    expect(actions.searchJurisdictionList('Oh')).toEqual(expectedAction)
  })

  test('should create an action to handle suggestion value change', () => {
    const expectedAction = {
      type: types.UPDATE_SUGGESTION_VALUE,
      suggestionValue: 'Oh'
    }

    expect(actions.onSuggestionValueChanged('Oh')).toEqual(expectedAction)
  })

  test('should create an action to clear suggestions', () => {
    const expectedAction = {
      type: types.ON_CLEAR_SUGGESTIONS
    }

    expect(actions.onClearSuggestions()).toEqual(expectedAction)
  })

  test('should create an action to handle selected jurisdiction', () => {
    const expectedAction = {
      type: types.ON_JURISDICTION_SELECTED,
      jurisdiction: 'Atlanta'
    }

    expect(actions.onJurisdictionSelected('Atlanta')).toEqual(expectedAction)
  })
})
