import { types } from '../actions'
import reducer, { INITIAL_STATE } from '../reducer'

describe('Home scene - AddEditJurisdictions reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  test('should handle GET_PROJECTS_JURISDICTIONS_SUCCESS', () => {
    expect(reducer(INITIAL_STATE, {
      type: types.GET_PROJECT_JURISDICTIONS_SUCCESS,
      payload: [{ id: 1, name: 'Jurisdiction 1' }, { id: 2, name: 'Jurisdiction 2' }]
    })).toEqual({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Jurisdiction 1' },
          2: { id: 2, name: 'Jurisdiction 2' }
        },
        allIds: [1, 2]
      },
      visibleJurisdictions: [1, 2],
      error: false,
      errorContent: '',
      formError: null,
      goBack: false
    })
  })
  
  test('should handle UPDATE_PROJECT_JURISDICTION_SUCCESS', () => {
    expect(reducer({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Jurisdiction 1' }
        },
        allIds: [1]
      }
    }, { type: types.UPDATE_PROJECT_JURISDICTION_SUCCESS, payload: { id: 1, name: 'Jurisdiction Name Updated' } }))
      .toEqual({
        ...INITIAL_STATE,
        jurisdictions: {
          byId: {
            1: { id: 1, name: 'Jurisdiction Name Updated' }
          },
          allIds: [1]
        },
        formError: null,
        goBack: true
      })
  })
  
  test('should handle ADD_PROJECT_JURISDICTION_SUCCESS', () => {
    expect(reducer({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Jurisdiction 1' }
        },
        allIds: [1]
      },
      visibleJurisdictions: [1]
    }, { type: types.ADD_PROJECT_JURISDICTION_SUCCESS, payload: { id: 2, name: 'Jurisdiction 2' } })).toEqual({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Jurisdiction 1' },
          2: { id: 2, name: 'Jurisdiction 2' }
        },
        allIds: [2, 1]
      },
      goBack: true,
      visibleJurisdictions: [2, 1]
    })
  })
  
  test('should handle UPDATE_JURISDICTION_SEARCH_VALUE', () => {
    expect(reducer({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Ohio', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) },
          2: { id: 2, name: 'Oregon', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) },
          3: { id: 3, name: 'Atlanta', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) }
        },
        allIds: [1, 2, 3]
      },
      visibleJurisdictions: [1, 2, 3]
    }, { type: types.UPDATE_JURISDICTION_SEARCH_VALUE, searchValue: 'O' })).toEqual({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Ohio', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) },
          2: { id: 2, name: 'Oregon', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) },
          3: { id: 3, name: 'Atlanta', startDate: new Date(2017, 1, 20), endDate: new Date(2018, 1, 20) }
        },
        allIds: [1, 2, 3]
      },
      searchValue: 'O',
      visibleJurisdictions: [1, 2]
    })
  })
  
  test('should handle UPDATE_SUGGESTION_VALUE', () => {
    expect(reducer({
      ...INITIAL_STATE,
      suggestionValue: ''
    }, { type: types.UPDATE_SUGGESTION_VALUE, suggestionValue: 'O' })).toEqual({
      ...INITIAL_STATE,
      suggestionValue: 'O',
      form: {
        values: {
          name: 'O'
        }
      }
    })
  })
  
  test('should handle SET_JURISDICTION_SUGGESTIONS', () => {
    expect(reducer({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Ohio' },
          2: { id: 2, name: 'Oregon' },
          3: { id: 3, name: 'Atlanta' },
          4: { id: 4, name: 'Boston' }
        },
        allIds: [1, 2, 3, 4]
      },
      suggestions: []
    }, {
      type: types.SET_JURISDICTION_SUGGESTIONS,
      payload: [
        { id: 4, name: 'Boston' }, { id: 5, name: 'New York' }, { id: 6, name: 'Oklahoma' },
        { id: 2, name: 'Oregon' }
      ]
    })).toEqual({
      ...INITIAL_STATE,
      jurisdictions: {
        byId: {
          1: { id: 1, name: 'Ohio' },
          2: { id: 2, name: 'Oregon' },
          3: { id: 3, name: 'Atlanta' },
          4: { id: 4, name: 'Boston' }
        },
        allIds: [1, 2, 3, 4]
      },
      searching: false,
      suggestions: [
        { id: 4, name: 'Boston' }, { id: 5, name: 'New York' }, { id: 6, name: 'Oklahoma' }, { id: 2, name: 'Oregon' }
      ]
    })
  })
  
  test('should handle ON_CLEAR_SUGGESTIONS', () => {
    expect(reducer({
      ...INITIAL_STATE,
      suggestions: [{ id: 5, name: 'New York' }, { id: 6, name: 'Oklahoma' }]
    }, { type: types.ON_CLEAR_SUGGESTIONS })).toEqual({
      ...INITIAL_STATE,
      suggestions: []
    })
  })
  
  test('should handle ON_JURISDICTION_SELECTED', () => {
    expect(reducer({
      ...INITIAL_STATE,
      suggestionValue: '',
      jurisdiction: {}
    }, { type: types.ON_JURISDICTION_SELECTED, jurisdiction: { name: 'Atlanta', id: 1 } })).toEqual({
      ...INITIAL_STATE,
      suggestionValue: 'Atlanta',
      jurisdiction: { name: 'Atlanta', id: 1 },
      searching: false,
      form: {
        values: {
          name: 'Atlanta'
        }
      }
    })
  })
  
  test('should handle CLEAR_JURISDICTIONS', () => {
    expect(reducer({
      ...INITIAL_STATE,
      suggestions: [{ id: 5, name: 'New York' }, { id: 6, name: 'Oklahoma' }],
      jurisdiction: { id: 1, name: 'Atlanta' },
      suggestionValue: 'Atlanta'
    }, { type: types.CLEAR_JURISDICTIONS })).toEqual({
      ...INITIAL_STATE,
      suggestions: [],
      jurisdiction: {},
      suggestionValue: ''
    })
  })
  
  test('should handle SEARCH_JURISDICTION_LIST', () => {
    expect(reducer(INITIAL_STATE, { type: types.SEARCH_JURISDICTION_LIST }))
      .toEqual({ ...INITIAL_STATE, searching: true })
  })
  
  test('should handle GET_PROJECT_JURISDICTIONS_REQUEST', () => {
    expect(reducer(INITIAL_STATE, { type: types.GET_PROJECT_JURISDICTIONS_REQUEST }))
      .toEqual({ ...INITIAL_STATE, isLoadingJurisdictions: true })
  })
  
  test('should handle UPDATE_PROJECT_JURISDICTION_REQUEST', () => {
    expect(reducer(INITIAL_STATE, { type: types.UPDATE_PROJECT_JURISDICTION_REQUEST })).toEqual(INITIAL_STATE)
  })
  
  test('should handle ADD_PROJECT_JURISDICTION_REQUEST', () => {
    expect(reducer(INITIAL_STATE, { type: types.ADD_PROJECT_JURISDICTION_REQUEST })).toEqual(INITIAL_STATE)
  })
})
