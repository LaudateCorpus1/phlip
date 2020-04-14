import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

describe('Protocol logic', () => {
  let mock
  
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)
  
  const mockReducer = (state, action) => state
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = () => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 5 } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }
  
  const setupStoreLocked = () => {
    return createMockStore({
      initialState: {
        data: { user: { currentUser: { id: 5 } } },
        scenes: {
          protocol: {
            lockedByCurrentUser: false,
            lockInfo: { userId: 1, firstName: 'Tim', lastName: 'nguyen' }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }
  
  describe('Getting the protocol', () => {
    test('should get the protocol for the project id in the action and dispatch GET_PROTOCOL_SUCCESS when done', done => {
      mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
      mock.onGet('/locks/protocol/projects/1').reply(200, {})
    
      const store = setupStore()
    
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
    
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_PROTOCOL_SUCCESS)
        expect(store.actions[1].payload.protocol).toEqual('protocol text!')
        done()
      })
    })
    
    test('should get lock info for the protocol', done => {
      mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
      mock.onGet('/locks/protocol/projects/1').reply(200, { userId: 4 })
  
      const store = setupStore()
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockInfo).toEqual({ userId: 4 })
        done()
      })
    })
    
    test('should set lock info to empty if there is no lock on the protocol', done => {
      mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
      mock.onGet('/locks/protocol/projects/1').reply(200, '')
  
      const store = setupStore()
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockInfo).toEqual({})
        done()
      })
    })
    
    test('should set if there was an error getting the lock info for the protocol', done => {
      mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
      mock.onGet('/locks/protocol/projects/1').reply(500)
  
      const store = setupStore()
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.error.lockInfo).toEqual('We couldn\'t determine if the protocol is checked out at this time.')
        done()
      })
    })
    
    test('should set that it is checkout by current user if lock info matches current user info', done => {
      mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
      mock.onGet('/locks/protocol/projects/1').reply(200, { userId: 5 })
  
      const store = setupStore()
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
  
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockedByCurrentUser).toEqual(true)
        done()
      })
    })
    
    test('should dispatch a failure error if getting the protocol fails', done => {
      mock.onGet('/projects/1/protocol').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1 })
  
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_PROTOCOL_FAIL)
        done()
      })
    })
  })
  
  describe('Saving the protocol', () => {
    test('should send a request to update the protocol for a project id and set user id to current user', done => {
      const store = setupStore()
      mock.onPut('/projects/1/protocol').reply(200, {})
    
      store.dispatch({ type: types.SAVE_PROTOCOL_REQUEST, projectId: 1, protocol: 'this is new protocol content' })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.SAVE_PROTOCOL_SUCCESS)
        done()
      })
    })
    
    test('should dispatch failure error if saving the protocol fails', done => {
      const store = setupStore()
      mock.onPut('/projects/1/protocol').reply(500)
  
      store.dispatch({ type: types.SAVE_PROTOCOL_REQUEST, projectId: 1, protocol: 'this is new protocol content' })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.SAVE_PROTOCOL_FAIL)
        done()
      })
    })
  })
  
  describe('Locking the protocol', () => {
    test('should lock the protocol and dispatch success if successful', done => {
      const store = setupStore()
      mock.onPost('/locks/protocol/projects/1/users/5').reply(200, { userId: 5 })
  
      store.dispatch({ type: types.LOCK_PROTOCOL_REQUEST, projectId: 1, userId: 5 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.LOCK_PROTOCOL_SUCCESS)
        expect(store.actions[1].payload.lockInfo).toEqual({ userId: 5 })
        done()
      })
    })
    
    test('should set whether the protocol if locked by current user', done => {
      const store = setupStore()
      mock.onPost('/locks/protocol/projects/1/users/5').reply(200, { userId: 5 })
  
      store.dispatch({ type: types.LOCK_PROTOCOL_REQUEST, projectId: 1, userId: 5 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockedByCurrentUser).toEqual(true)
        done()
      })
    })
    
    test('should dispatch failure error if locking the protocol fails', done => {
      const store = setupStore()
      mock.onPost('/locks/protocol/projects/1/users/5').reply(500)
  
      store.dispatch({ type: types.LOCK_PROTOCOL_REQUEST, projectId: 1, userId: 5 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.LOCK_PROTOCOL_FAIL)
        done()
      })
    })
  })
  
  describe('Unlocking the protocol', () => {
    test('should send a request to unlock the protocol for a project id and user id', done => {
      const store = setupStoreLocked()
    
      mock.onDelete('locks/protocol/projects/1/users/1').reply(200, {})
    
      store.dispatch({ type: types.UNLOCK_PROTOCOL_REQUEST, projectId: 1, userId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UNLOCK_PROTOCOL_SUCCESS)
        done()
      })
    })
    
    test('should use the current logged in user id if none is passed in', done => {
      const spy = jest.spyOn(api, 'unlockProtocol')
      const store = setupStoreLocked()
      mock.onDelete('locks/protocol/projects/1/users/1').reply(200, {})
  
      store.dispatch({ type: types.UNLOCK_PROTOCOL_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalledWith({}, {}, { userId: 5, projectId: 1 })
        done()
      })
    })
    
    test('should dispatch a failure error if unlocking the protocol fails', done => {
      const store = setupStoreLocked()
      mock.onDelete('locks/protocol/projects/1/users/1').reply(500)
  
      store.dispatch({ type: types.UNLOCK_PROTOCOL_REQUEST, projectId: 1, userId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UNLOCK_PROTOCOL_FAIL)
        done()
      })
    })
  })
})
