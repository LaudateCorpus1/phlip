import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const getState = (other = {}) => {
  return {
    ...INITIAL_STATE,
    ...other
  }
}

describe('CodingScheme - AddEditQuestion reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  describe('ADD_QUESTION_REQUEST', () => {
    const action = { type: types.ADD_QUESTION_REQUEST }
    const currentState = getState({ formError: 'lala', goBack: true, submitting: false })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  
    test('should set that a request is in progress', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('ADD_CHILD_QUESTION_REQUEST', () => {
    const action = { type: types.ADD_CHILD_QUESTION_REQUEST }
    const currentState = getState({ formError: 'lala', goBack: true, submitting: false })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  
    test('should set that a request is in progress', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('UPDATE_QUESTION_REQUEST', () => {
    const action = { type: types.UPDATE_QUESTION_REQUEST }
    const currentState = getState({ formError: 'lala', goBack: true, submitting: false })
    const state = reducer(currentState, action)
    
    test('should reset any form errors', () => {
      expect(state.formError).toEqual(null)
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set that a request is in progress', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('ADD_QUESTION_SUCCESS', () => {
    const action = { type: types.ADD_QUESTION_SUCCESS }
    const currentState = getState({ submitting: true })
    const state = reducer(currentState, action)
    
    test('should close the modal', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('ADD_CHILD_QUESTION_SUCCESS', () => {
    const action = { type: types.ADD_CHILD_QUESTION_SUCCESS }
    const currentState = getState({ submitting: true })
    const state = reducer(currentState, action)
  
    test('should close the modal', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('UPDATE_QUESTION_SUCCESS', () => {
    const action = { type: types.UPDATE_QUESTION_SUCCESS }
    const currentState = getState({ submitting: true })
    const state = reducer(currentState, action)
  
    test('should close the modal', () => {
      expect(state.goBack).toEqual(true)
    })
    
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('ADD_QUESTION_FAIL', () => {
    const action = { type: types.ADD_QUESTION_FAIL, payload: 'failed to add question' }
    const currentState = getState({ goBack: true, submitting: false })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to add question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
    
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('UPDATE_QUESTION_FAIL', () => {
    const action = { type: types.UPDATE_QUESTION_FAIL, payload: 'failed to update question' }
    const currentState = getState({ goBack: true, submitting: true })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to update question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('ADD_CHILD_QUESTION_FAIL', () => {
    const action = { type: types.ADD_CHILD_QUESTION_FAIL, payload: 'failed to add question' }
    const currentState = getState({ goBack: true, submitting: true })
    const state = reducer(currentState, action)
    
    test('should set the api error', () => {
      expect(state.formError).toEqual('failed to add question')
    })
    
    test('should set to not go back', () => {
      expect(state.goBack).toEqual(false)
    })
  
    test('should set that a request is no longer in process', () => {
      expect(state.submitting).toEqual(false)
    })
  })
})
