import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

const mockReducer = (state, action) => state
const history = {}
const api = createApiHandler({ history }, projectApiInstance, calls)

const setupStore = (state = {}) => {
  return createMockStore({
    initialState: state,
    reducer: mockReducer,
    logic,
    injectedDeps: {
      api
    }
  })
}

describe('Admin - AddEditUser Logic', () => {
  let mock
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  describe('Adding a user', () => {
    test('should call add user api to add a user', done => {
      const spy = jest.spyOn(api, 'addUser')
      mock.onPost('/users').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should dispatch success when adding is successful', done => {
      mock.onPost('/users').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      store.whenComplete(() => {
        expect(store.actions[1])
          .toEqual({ type: types.ADD_USER_SUCCESS, payload: { id: 1, firstName: 'new', lastName: 'user' } })
        done()
      })
    })
    
    test('should dispatch failure when adding fails', done => {
      mock.onPost('/users').reply(500)
      
      const store = setupStore()
      store.dispatch({ type: types.ADD_USER_REQUEST, user: { firstName: 'new', lastName: 'user' } })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_USER_FAIL)
        done()
      })
    })
  })
  
  describe('updating a user', () => {
    test('should call patch operation is the user is updating themselves (action.selfUpdate === true)', done => {
      const spy = jest.spyOn(api, 'updateSelf')
      mock.onPatch('/users/1/selfUpdate').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: true
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should call put is the user is not updating themselves (action.selfUpdate === false)', done => {
      const spy = jest.spyOn(api, 'updateUser')
      mock.onPut('/users/1').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should dispatch success with response from api and action if update is successful', done => {
      mock.onPut('/users/1').reply(200, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_USER_SUCCESS)
        expect(store.actions[1].payload).toEqual({ id: 1, firstName: 'new', lastName: 'user', avatar: '' })
        done()
      })
    })
    
    test('should return success if api response code is 304', done => {
      mock.onPut('/users/1').reply(304, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_USER_SUCCESS)
        expect(store.actions[1].payload).toEqual({ id: 1, firstName: 'new', lastName: 'user', avatar: '' })
        done()
      })
    })
    
    test('should return failure with error if api request fails', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_USER_FAIL)
        done()
      })
    })
  
    test('should return failure with error: "We couldn\'t update this user" if not self update', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
    
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false
      })
    
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t update this user. Please try again later.')
        done()
      })
    })
  
    test('should return failure with error: "We couldn\'t update your profile. Please try again later." if self update', done => {
      mock.onPatch('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
    
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_USER_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: true
      })
    
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t update your profile. Please try again later.')
        done()
      })
    })
  })
  
  describe('add a picture to a user', () => {
    test('should call update user image api if user is admin (action.selfUpdate === false)', done => {
      const spy = jest.spyOn(api, 'updateUserImage')
      mock.onPatch('/users/1').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: '' })
      
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        avatar: 'bloop',
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'bloop' }],
        selfUpdate: false,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should call patch operation is the user is updating themselves (action.selfUpdate === true)', done => {
      const spy = jest.spyOn(api, 'updateSelf')
      mock.onPatch('/users/1/selfUpdate').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: 'blep' })
      
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'bloop' }],
        avatar: 'blep',
        selfUpdate: true,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should dispatch success with user information if api call is successful', done => {
      mock.onPatch('/users/1/selfUpdate').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: 'blep' })
      
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blep' }],
        avatar: 'blep',
        selfUpdate: true,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_USER_IMAGE_SUCCESS)
        expect(store.actions[1].payload)
          .toEqual({ avatar: 'blep', userId: 1, user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 } })
        done()
      })
    })
    
    test('should return failure with error if api request fails', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        avatar: 'blah',
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_USER_IMAGE_FAIL)
        done()
      })
    })
  
    test('should return failure with error: "We couldn\'t add a photo for this user" if not self update', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
    
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        avatar: 'blah',
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false,
        userId: 1
      })
    
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t add a photo for this user. Please try again later.')
        done()
      })
    })
  
    test('should return failure with error: "We couldn\'t add your photo." if self update', done => {
      mock.onPatch('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
    
      const store = setupStore()
      store.dispatch({
        type: types.ADD_USER_IMAGE_REQUEST,
        avatar: 'blah',
        patchOperation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: true,
        userId: 1
      })
    
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t add your photo. Please try again later.')
        done()
      })
    })
  })
  
  describe('removing a picture from a user', () => {
    test('should call delete user image api if user is admin (action.selfUpdate === false)', done => {
      const spy = jest.spyOn(api, 'deleteUserImage')
      mock.onPatch('/users/1').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: '' })
      
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        operation: [{ 'op': 'remove', 'path': '/avatar' }],
        selfUpdate: false,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should call patch operation is the user is remove image from themselves (action.selfUpdate === true)', done => {
      const spy = jest.spyOn(api, 'updateSelf')
      mock.onPatch('/users/1/selfUpdate').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: 'blep' })
      
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        operation: [{ 'op': 'remove', 'path': '/avatar' }],
        selfUpdate: true,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should dispatch success with user information if api call is successful', done => {
      mock.onPatch('/users/1/selfUpdate').reply(200, { id: 1, firstName: 'new', lastName: 'user', avatar: 'blep' })
      
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        operation: [{ 'op': 'remove', 'path': '/avatar' }],
        selfUpdate: true,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_USER_IMAGE_SUCCESS)
        expect(store.actions[1].payload)
          .toEqual({ userId: 1, user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 }, avatar: null })
        done()
      })
    })
    
    test('should return failure with error if api request fails', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
      
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        operation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false,
        userId: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_USER_IMAGE_FAIL)
        done()
      })
    })
    
    test('should return error: "We couldn\'t remove the photo for this user" if not self update', done => {
      mock.onPut('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
  
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        operation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: false,
        userId: 1
      })
  
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t remove the photo for this user. Please try again later.')
        done()
      })
    })
  
    test('should return error: "We couldn\'t remove your photo" if self update', done => {
      mock.onPatch('/users/1').reply(500, { id: 1, firstName: 'new', lastName: 'user' })
    
      const store = setupStore()
      store.dispatch({
        type: types.DELETE_USER_IMAGE_REQUEST,
        operation: [{ 'op': 'replace', 'path': '/avatar', 'value': 'blah' }],
        user: { firstName: 'new', lastName: 'user', avatar: '', id: 1 },
        selfUpdate: true,
        userId: 1
      })
    
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual('We couldn\'t remove your photo. Please try again later.')
        done()
      })
    })
  })
  
})
