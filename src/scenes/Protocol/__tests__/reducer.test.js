import { types } from '../actions'
import reducer, { INITIAL_STATE } from '../reducer'

const initial = {
  content: '',
  getProtocolError: null,
  submitting: false,
  alertError: '',
  lockInfo: {},
  lockedAlert: null,
  lockedByCurrentUser: false
}

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('Protocol reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('UPDATE_PROTOCOL', () => {
    test('should set protocol content', () => {
      const current = getState()
      const state = reducer(current, { type: types.UPDATE_PROTOCOL, content: 'updated protocol content' })
      expect(state.content).toEqual('updated protocol content')
    })
    
    test('should set submitting status to false', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.UPDATE_PROTOCOL, payload: '' })
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('GET_PROTOCOL_SUCCESS', () => {
    describe('locked by current user', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: true,
          error: { lockInfo: '' }
        }
      })
      
      test('should set that is it locked by the current user', () => {
        expect(state.lockedByCurrentUser).toEqual(true)
      })
      
      test('should set lock info', () => {
        expect(state.lockInfo).toEqual({ userId: 5 })
      })
      
      test('should not show the locked alert', () => {
        expect(state.lockedAlert).toEqual(null)
      })
    })
    
    describe('locked by different user', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: false,
          error: { lockInfo: '' }
        }
      })
  
      test('should set that it is not locked by the current user', () => {
        expect(state.lockedByCurrentUser).toEqual(false)
      })
  
      test('should set lock info', () => {
        expect(state.lockInfo).toEqual({ userId: 5 })
      })
  
      test('should show the locked alert', () => {
        expect(state.lockedAlert).toEqual(true)
      })
    })
    
    describe('no lock on protocol', () => {
      test('should not show the lock alert', () => {
        const current = getState()
        const state = reducer(current, {
          type: types.GET_PROTOCOL_SUCCESS,
          payload: {
            protocol: 'this is the protocol content.',
            lockInfo: {},
            lockedByCurrentUser: false,
            error: { lockInfo: '' }
          }
        })
        
        expect(state.lockedAlert).toEqual(null)
      })
    })
    
    test('should set protocol content', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: true,
          error: {}
        }
      })
      expect(state.content).toEqual('this is the protocol content.')
    })
    
    test('should set that there was no error', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: true,
          error: {}
        }
      })
      expect(state.getProtocolError).toEqual(null)
    })
    
    test('should set if there was an error retrieving lock info', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: false,
          error: { lockInfo: 'failed' }
        }
      })
      
      expect(state.alertError).toEqual('failed')
    })
  })
  
  describe('GET_PROTOCOL_FAIL', () => {
    test('should set the fail error', () => {
      const current = getState()
      const state = reducer(current, { type: types.GET_PROTOCOL_FAIL })
      expect(state.getProtocolError).toEqual(true)
    })
  })
  
  describe('RESET_ALERT_ERROR', () => {
    test('should reset the alert', () => {
      const current = getState({ alertError: 'alert!' })
      const state = reducer(current, { type: types.RESET_ALERT_ERROR })
      expect(state.alertError).toEqual('')
    })
  })
  
  describe('SAVE_PROTOCOL_FAIL', () => {
    test('should set alert error from logic payload', () => {
      const current = getState()
      const state = reducer(current, { type: types.SAVE_PROTOCOL_FAIL, payload: 'Failed to save protocol.' })
      expect(state.alertError).toEqual('Failed to save protocol.')
    })
    
    test('should set submitting status to false', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.SAVE_PROTOCOL_FAIL, payload: '' })
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('UNLOCK_PROTOCOL_FAIL', () => {
    test('should set alert error from logic payload', () => {
      const current = getState()
      const state = reducer(current, { type: types.UNLOCK_PROTOCOL_FAIL, payload: 'Failed to save protocol.' })
      expect(state.alertError).toEqual('Failed to save protocol.')
    })
  
    test('should set submitting status to false', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.UNLOCK_PROTOCOL_FAIL, payload: '' })
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('LOCK_PROTOCOL_FAIL', () => {
    test('should set alert error from logic payload', () => {
      const current = getState()
      const state = reducer(current, { type: types.LOCK_PROTOCOL_FAIL, payload: 'Failed to save protocol.' })
      expect(state.alertError).toEqual('Failed to save protocol.')
    })
  
    test('should set submitting status to false', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.LOCK_PROTOCOL_FAIL, payload: '' })
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('RESET_LOCK_ALERT_PROTOCOL', () => {
    test('should reset the alert about locks', () => {
      const current = getState({ lockedAlert: true })
      const state = reducer(current, { type: types.RESET_LOCK_ALERT_PROTOCOL })
      expect(state.lockedAlert).toEqual(null)
    })
  })
  
  describe('SAVE_PROTOCOL_REQUEST', () => {
    test('should set submitting status to true', () => {
      const current = getState()
      const state = reducer(current, { type: types.SAVE_PROTOCOL_REQUEST, payload: '' })
      expect(state.submitting).toEqual(true)
    })
  })
  
  describe('SAVE_PROTOCOL_SUCCESS', () => {
    test('should set that there was no error', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.SAVE_PROTOCOL_SUCCESS, payload: '' })
      expect(state.alertError).toEqual('')
    })
    
    test('should set submitting status to false', () => {
      const current = getState({ submitting: true })
      const state = reducer(current, { type: types.SAVE_PROTOCOL_SUCCESS, payload: '' })
      expect(state.submitting).toEqual(false)
    })
  })
  
  describe('LOCK_PROTOCOL_SUCCESS', () => {
    describe('locked by current user', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.LOCK_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: true,
          error: { lockInfo: '' }
        }
      })
    
      test('should set that is it locked by the current user', () => {
        expect(state.lockedByCurrentUser).toEqual(true)
      })
    
      test('should set lock info', () => {
        expect(state.lockInfo).toEqual({ userId: 5 })
      })
    
      test('should not show the locked alert', () => {
        expect(state.lockedAlert).toEqual(null)
      })
    })
  
    describe('if already locked by different user', () => {
      const current = getState()
      const state = reducer(current, {
        type: types.LOCK_PROTOCOL_SUCCESS,
        payload: {
          protocol: 'this is the protocol content.',
          lockInfo: { userId: 5 },
          lockedByCurrentUser: false,
          error: { lockInfo: '' }
        }
      })
    
      test('should set that it is not locked by the current user', () => {
        expect(state.lockedByCurrentUser).toEqual(false)
      })
    
      test('should set lock info', () => {
        expect(state.lockInfo).toEqual({ userId: 5 })
      })
    
      test('should show the locked alert', () => {
        expect(state.lockedAlert).toEqual(true)
      })
    })
  })
  
  describe('UNLOCK_PROTCOL_SUCCESS', () => {
    test('should clear lock information', () => {
      const current = getState({ lockedByCurrentUser: true, lockInfo: { userId: 1 } })
      const state = reducer(current, { type: types.UNLOCK_PROTOCOL_SUCCESS })
      expect(state.lockedByCurrentUser).toEqual(false)
      expect(state.lockInfo).toEqual({})
    })
  })
  
  describe('CLEAR_STATE', () => {
    test('should return the initial state', () => {
      const current = getState({ submitting: true, content: 'blep' })
      const state = reducer(current, { type: types.CLEAR_STATE })
      expect(state).toEqual(INITIAL_STATE)
    })
  })
})
