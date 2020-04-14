import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Jurisdiction Data reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('ADD_JURISDICTION', () => {
    const action = {
      type: types.ADD_JURISDICTION,
      payload: {
        id: 3,
        name: 'ohio'
      }
    }
  
    test('should add the jurisdiction to the full list', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
    
      expect(state.byId.hasOwnProperty(3)).toEqual(true)
      expect(state.byId[3]).toEqual({ id: 3, name: 'ohio' })
    })
  
    test('should add the jurisdiction id to the id list if it is not already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
    
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[1]).toEqual(3)
    })
  
    test('should not add jurisdiction id to list if it is already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [3, 1]
      })
      const state = reducer(currentState, action)
    
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[0]).toEqual(3)
      expect(state.allIds[1]).toEqual(1)
    })
  })
  
  describe('GET_JURISDICTION_SUCCESS', () => {
    const action = {
      type: types.GET_JURISDICTION_SUCCESS,
      payload: {
        id: 3,
        name: 'ohio'
      }
    }
  
    test('should add the jurisdiction to the full list', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
    
      expect(state.byId.hasOwnProperty(3)).toEqual(true)
      expect(state.byId[3]).toEqual({ id: 3, name: 'ohio' })
    })
  
    test('should add the jurisdiction id to the id list if it is not already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
    
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[1]).toEqual(3)
    })
  
    test('should not add jurisdiction id to list if it is already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [3, 1]
      })
      const state = reducer(currentState, action)
    
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[0]).toEqual(3)
      expect(state.allIds[1]).toEqual(1)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('should return initial state', () => {
      const action = {
        type: types.FLUSH_STATE
      }
    
      const currentState = getState({
        byId: { 1: { text: 'blah' } },
        allIds: [1]
      })
    
      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
})
