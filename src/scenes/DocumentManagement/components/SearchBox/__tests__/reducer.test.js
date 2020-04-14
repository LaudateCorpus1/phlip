import { searchReducer as reducer, INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('DocumentManagement - SearchBox reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  describe('FORM_VALUE_CHANGE', () => {
    test('should test state.params[action.property] to action.value', () => {
      const action = {
        type: types.FORM_VALUE_CHANGE,
        property: 'uploadedBy',
        value: 'test user'
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.params.uploadedBy).toEqual('test user')
    })
  })

  describe('SEARCH_VALUE_CHANGE', () => {
    test('should set state.searchValue to action.value', () => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'new search'
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.searchValue).toEqual('new search')
    })
  })

  describe('CLEAR_SEARCH_STRING', () => {
    test('should set state.searchValue to an empty string', () => {
      const action = {
        type: types.CLEAR_SEARCH_STRING
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.searchValue).toEqual('')
    })
  })

  describe('CLEAR_FORM', () => {
    test('should set state.params to INITIAL_STATE.params', () => {
      const action = {
        type: types.CLEAR_FORM
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.params).toEqual(INITIAL_STATE.params)
    })
  })
})
