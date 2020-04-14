import reducer from '../reducer'
import { types } from '../actions'

const initial = {
  currentUser: {},
  byId: {}
}

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('User reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('LOGIN_USER_SUCCESS', () => {
    const currentState = getState()
    const state = reducer(currentState, {
      type: types.LOGIN_USER_SUCCESS,
      payload: { firstName: 'test', lastName: 'user', id: 1 }
    })
    
    test('should set currentUser to payload object', () => {
      expect(state.currentUser).toEqual({
        firstName: 'test', lastName: 'user', id: 1
      })
    })
    
    test('should add user to state.byId', () => {
      expect(state.byId[1]).toEqual({
        firstName: 'test', lastName: 'user', initials: 'tu', username: 'test user', id: 1
      })
    })
  })
  
  describe('ADD_USER_IMAGE_SUCCESS', () => {
    test('should add user to state.byId', () => {
      const currentState = getState()
      const state = reducer(currentState, {
        type: types.ADD_USER_IMAGE_SUCCESS,
        payload: {
          userId: 3,
          user: { firstName: 'test', lastName: 'user', id: 3 },
          avatar: 'lalala'
        }
      })
      expect(state.byId[3])
        .toEqual({
          firstName: 'test',
          lastName: 'user',
          initials: 'tu',
          username: 'test user',
          id: 3,
          avatar: 'lalala'
        })
    })
    
    test(
      'should keep existing fields that are in state.byId[userId] that aren\'t present in action.payload.user',
      () => {
        const currentState = getState({
          byId: {
            3: {
              rowId: '42',
              lastCheck: 12345
            }
          }
        })
        const state = reducer(currentState, {
          type: types.ADD_USER_IMAGE_SUCCESS,
          payload: {
            userId: 3,
            user: { firstName: 'test', lastName: 'user', id: 3 },
            avatar: 'lalala'
          }
        })
        expect(state.byId[3].hasOwnProperty('rowId')).toEqual(true)
        expect(state.byId[3].rowId).toEqual('42')
        expect(state.byId[3].hasOwnProperty('lastCheck')).toEqual(true)
        expect(state.byId[3].lastCheck).toEqual(12345)
      }
    )
  })
  
  describe('DELETE_USER_IMAGE_SUCCESS', () => {
    test('should add user to state.byId', () => {
      const currentState = getState()
      const state = reducer(currentState, {
        type: types.DELETE_USER_IMAGE_SUCCESS,
        payload: {
          userId: 3,
          user: { firstName: 'test', lastName: 'user', id: 3 },
          avatar: null
        }
      })
      expect(state.byId[3]).toEqual({
        firstName: 'test',
        lastName: 'user',
        initials: 'tu',
        username: 'test user',
        id: 3,
        avatar: ''
      })
    })
    
    test(
      'should keep existing fields that are in state.byId[userId] that aren\'t present in action.payload.user',
      () => {
        const currentState = getState({
          byId: {
            3: {
              rowId: '42',
              lastCheck: 12345,
              avatar: 'lalala'
            }
          }
        })
        const state = reducer(currentState, {
          type: types.DELETE_USER_IMAGE_SUCCESS,
          payload: {
            userId: 3,
            user: { firstName: 'test', lastName: 'user', id: 3 },
            avatar: null
          }
        })
        expect(state.byId[3].hasOwnProperty('rowId')).toEqual(true)
        expect(state.byId[3].rowId).toEqual('42')
        expect(state.byId[3].hasOwnProperty('lastCheck')).toEqual(true)
        expect(state.byId[3].lastCheck).toEqual(12345)
      }
    )
  })
  
  describe('FLUSH_STATE', () => {
    test('should set state back to initial state', () => {
      const currentState = getState({ currentUser: { firstName: 'test' } })
      expect(reducer(
        currentState,
        { type: types.FLUSH_STATE }
      )).toEqual(initial)
    })
  })
  
  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set currentUser to user object in action', () => {
      expect(reducer(
        { ...initial, currentUser: { firstName: 'user', bookmarks: [5, 6] } },
        { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { user: { firstName: 'user', bookmarks: [5, 6, 7] } } }
      )).toEqual({
        ...initial,
        currentUser: { firstName: 'user', bookmarks: [5, 6, 7] }
      })
    })
  })
})
