import { INITIAL_STATE, createAutocompleteReducer } from '../reducer'
import { types } from '../actions'

const initial = INITIAL_STATE
const reducer = createAutocompleteReducer('PROJECT')

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Autocomplete reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('SET_SEARCHING_STATUS', () => {
    test('should indicate that searching is happening', () => {
      const action = { type: `${types.SET_SEARCHING_STATUS}_PROJECT`, status: true }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.searching).toEqual(true)
    })
  })
  
  describe('SEARCH_FOR_SUGGESTIONS_SUCCESS', () => {
    test('should set suggestions to action.payload', () => {
      const action = {
        type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT`,
        payload: [{ name: 'proj1' }, { name: 'project1' }]
      }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      expect(updatedState.suggestions).toEqual([
        { name: 'proj1' },
        { name: 'project1' }
      ])
    })
  })
  
  describe('ON_SUGGESTION_SELECTED', () => {
    const action = {
      type: `${types.ON_SUGGESTION_SELECTED}_PROJECT`,
      suggestion: { name: 'project overwatch' }
    }
    
    const currentState = getState()
    const updatedState = reducer(currentState, action)
    
    test('should set state.selectedSuggestion to action.suggestion', () => {
      expect(updatedState.selectedSuggestion).toEqual({
        name: 'project overwatch'
      })
    })
    
    test('should set state.searchValue to action.suggestion.name', () => {
      expect(updatedState.searchValue).toEqual('project overwatch')
    })
    
    test('should clear state.suggestions', () => {
      expect(updatedState.suggestions).toEqual([])
    })
  })
  
  describe('UPDATE_VALUE_CHANGE', () => {
    test('should set searchValue and suggestions', () => {
      const action = {
        type: `${types.UPDATE_SEARCH_VALUE}_PROJECT`,
        value: 'new project search value'
      }
      
      const currentState = getState({
        suggestions: [{ name: 'project' }, { name: 'project test' }]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.searchValue).toEqual('new project search value')
    })
    
    test('should set empty suggestions if the search value is empty', () => {
      const action = {
        type: `${types.UPDATE_SEARCH_VALUE}_PROJECT`,
        value: ''
      }
  
      const currentState = getState({
        suggestions: []
      })
  
      const updatedState = reducer(currentState, action)
      expect(updatedState.suggestions).toEqual([])
    })
    
    test('should clear selected suggestion if user clears search value', () => {
      const action = {
        type: `${types.UPDATE_SEARCH_VALUE}_PROJECT`,
        value: ''
      }
  
      const currentState = getState({
        suggestions: [{ name: 'project' }, { name: 'project test' }],
        selectedSuggestion: { name: 'blep' }
      })
  
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedSuggestion).toEqual({})
    })
  })
  
  describe('CLEAR_SUGGESTIONS', () => {
    test('should clear suggestions', () => {
      const action = {
        type: `${types.CLEAR_SUGGESTIONS}_PROJECT`
      }
      
      const currentState = getState({
        suggestions: [{ name: 'project' }, { name: 'project test' }]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.suggestions).toEqual([])
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('should return initial state', () => {
      const action = {
        type: types.FLUSH_STATE
      }
      
      const currentState = getState({
        suggestions: [{ name: 'project' }, { name: 'project test' }]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
  
  describe('CLEAR_ALL', () => {
    test('should return initial state', () => {
      const action = {
        type: `${types.CLEAR_ALL}_PROJECT`
      }
    
      const currentState = getState({
        suggestions: [{ name: 'project' }, { name: 'project test' }]
      })
    
      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
})
