import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('Admin - AddEditUser reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  describe('LOAD_ADD_EDIT_AVATAR', () => {
    test('should set state.avatar to action.avatar', () => {
      const action = {
        type: types.LOAD_ADD_EDIT_AVATAR,
        avatar: 'blep'
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.avatar).toEqual('blep')
    })
  })
  
  describe('ADD_USER_FAIL', () => {
    const action = {
      type: types.ADD_USER_FAIL,
      payload: 'failed to add user'
    }
  
    const currentState = getState({
      submitting: true
    })
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set state.formError to action.payload', () => {
      expect(state.formError).toEqual('failed to add user')
    })
  })
  
  describe('UPDATE_USER_FAIL', () => {
    const action = {
      type: types.UPDATE_USER_FAIL,
      payload: 'failed to update user'
    }
  
    const currentState = getState({
      submitting: true
    })
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  
    test('should set state.formError to action.payload', () => {
      expect(state.formError).toEqual('failed to update user')
    })
  })
  
  describe('ADD_USER_IMAGE_FAIL', () => {
    const action = {
      type: types.ADD_USER_IMAGE_FAIL,
      payload: 'failed to photo for user'
    }
  
    const currentState = getState({
      submitting: true
    })
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  
    test('should set state.formError to action.payload', () => {
      expect(state.formError).toEqual('failed to photo for user')
    })
  })
  
  describe('DELETE_USER_IMAGE_FAIL', () => {
    const action = {
      type: types.DELETE_USER_IMAGE_FAIL,
      payload: 'failed to delete user image'
    }
  
    const currentState = getState({
      submitting: true
    })
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
  
    test('should set state.formError to action.payload', () => {
      expect(state.formError).toEqual('failed to delete user image')
    })
  })
  
  describe('RESET_USER_FORM_ERROR', () => {
    test('should set state.formError to an empty string', () => {
      const action = {
        type: types.RESET_USER_FORM_ERROR
      }
  
      const currentState = getState({
        formError: 'failed to delete user image'
      })
      const state = reducer(currentState, action)
      expect(state.formError).toEqual('')
    })
  })
  
  describe('ADD_USER_IMAGE_SUCCESS', () => {
    const action = {
      type: types.ADD_USER_IMAGE_SUCCESS,
      payload: { avatar: 'bloop' }
    }
  
    const currentState = getState({
      submitting: true
    })
    
    const state = reducer(currentState, action)
  
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set state.avatar to an action.payload.avatar', () => {
      expect(state.avatar).toEqual('bloop')
    })
  })
  
  describe('DELETE_USER_IMAGE_SUCCESS', () => {
    const action = {
      type: types.DELETE_USER_IMAGE_SUCCESS,
      payload: { avatar: null }
    }
    
    const currentState = getState({
      submitting: true,
      avatar: 'bloop'
    })
    
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set state.avatar to an action.payload.avatar', () => {
      expect(state.avatar).toEqual(null)
    })
  })
  
  describe('ADD_USER_SUCCESS', () => {
    const action = {
      type: types.ADD_USER_SUCCESS
    }
    
    const currentState = getState({
      submitting: true
    })
    
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set state.goBack to true', () => {
      expect(state.goBack).toEqual(true)
    })
  })
  
  describe('UPDATE_USER_SUCCESS', () => {
    const action = {
      type: types.UPDATE_USER_SUCCESS
    }
    
    const currentState = getState({
      submitting: true
    })
    
    const state = reducer(currentState, action)
    
    test('should set state.submitting to false', () => {
      expect(state.submitting).toEqual(false)
    })
    
    test('should set state.goBack to true', () => {
      expect(state.goBack).toEqual(true)
    })
  })
  
  describe('ADD_USER_REQUEST', () => {
    const action = {
      type: types.ADD_USER_REQUEST
    }
  
    const currentState = getState()
    const state = reducer(currentState, action)
    test('should set state.submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('UPDATE_USER_REQUEST', () => {
    const action = {
      type: types.UPDATE_USER_REQUEST
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    test('should set state.submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('ADD_USER_IMAGE_REQUEST', () => {
    const action = {
      type: types.ADD_USER_IMAGE_REQUEST
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    test('should set state.submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('DELETE_USER_IMAGE_REQUEST', () => {
    const action = {
      type: types.DELETE_USER_IMAGE_REQUEST
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    test('should set state.submitting to true', () => {
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('ON_CLOSE_ADD_EDIT_USER', () => {
    test('should return initial state', () => {
      const action = { type: types.ON_CLOSE_ADD_EDIT_USER }
      const currentState = getState({
        avatar: 'blep',
        formError: 'blep'
      })
      
      const state = reducer(currentState, action)
      expect(state).toEqual(INITIAL_STATE)
    })
  })
})
