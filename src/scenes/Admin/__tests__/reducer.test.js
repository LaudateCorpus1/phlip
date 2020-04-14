import { types } from '../actions'
import { adminReducer as reducer, INITIAL_STATE } from '../reducer'

const mockUsers = [
  { id: 1, firstName: 'Michael', lastName: 'Scott' },
  { id: 2, firstName: 'Jim', lastName: 'Halpert' }
]

const initial = INITIAL_STATE

const getState = (other = {}) => {
  return {
    ...initial,
    ...other
  }
}

describe('Admin reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      payload: mockUsers
    }

    const currentState = getState()
    const updatedState = reducer(currentState, action)

    test('should set state.users to action.payload', () => {
      expect(updatedState.users).toEqual(mockUsers)
    })

    test('should set state.visibleUsers to action.payload', () => {
      expect(updatedState.visibleUsers).toEqual(mockUsers)
    })
  })

  describe('ADD_USER_SUCCESS', () => {
    const action = {
      type: types.ADD_USER_SUCCESS,
      payload: { name: 'new user' }
    }

    const currentState = getState({
      users: mockUsers,
      visibleUsers: mockUsers
    })
    const updatedState = reducer(currentState, action)

    test('should add user to state.users list', () => {
      expect(updatedState.users).toEqual([
        { name: 'new user' },
        ...mockUsers
      ])
    })

    test('should add user to state.visibleUsers', () => {
      expect(updatedState.visibleUsers).toEqual([
        { name: 'new user' },
        ...mockUsers
      ])
    })
  })

  describe('UPDATE_USER_SUCCESS', () => {
    const updatedUser = { id: 1, firstName: 'Michael', lastName: 'Scarn' }

    const action = {
      type: types.UPDATE_USER_SUCCESS,
      payload: updatedUser
    }

    const currentState = getState({
      users: mockUsers,
      visibleUsers: mockUsers
    })
    const updatedState = reducer(currentState, action)

    test('should update the user in state.users based on action.payload.id', () => {
      expect(updatedState.users[1]).toEqual(updatedUser)
    })

    test('should update the user in state.visibleUsers based on action.payload.id', () => {
      expect(updatedState.visibleUsers[1]).toEqual(updatedUser)
    })
  })

  describe('SORT_USERS', () => {
    test('should order state.users descending when state.direction === asc and sortBy === lastName', () => {
      const action = {
        type: types.SORT_USERS,
        sortBy: 'lastName'
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers,
        direction: 'asc'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.users).toEqual(mockUsers)
    })

    test('should order state.users ascending when state.direction === desc and sortBy === lastName', () => {
      const action = {
        type: types.SORT_USERS,
        sortBy: 'lastName'
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers,
        direction: 'desc'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.users).toEqual([
        { id: 2, firstName: 'Jim', lastName: 'Halpert' },
        { id: 1, firstName: 'Michael', lastName: 'Scott' }
      ])
    })

    test('should set state.sortBy to action.sortBy', () => {
      const action = {
        type: types.SORT_USERS,
        sortBy: 'role'
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers,
        direction: 'asc',
        sortBy: 'lastName'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.sortBy).toEqual('role')
    })

    test('should set state.direction to asc if current state.direction === desc', () => {
      const action = {
        type: types.SORT_USERS,
        sortBy: 'lastName'
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers,
        direction: 'desc'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.direction).toEqual('asc')
    })

    test('should set state.direction to desc if current state.direction === asc', () => {
      const action = {
        type: types.SORT_USERS,
        sortBy: 'lastName'
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers,
        direction: 'asc'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.direction).toEqual('desc')
    })
  })

  describe('ADD_USER_IMAGE_SUCCESS', () => {
    test('should add action.payload.avatar to user in state.users with id === action.payload.userId', () => {
      const action = {
        type: types.ADD_USER_IMAGE_SUCCESS,
        payload: {
          userId: 2,
          avatar: '123123'
        }
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.users[1].avatar).toEqual('123123')
    })
  })

  describe('GET_USERS_REQUEST', () => {
    test('should return current state', () => {
      const action = {
        type: types.GET_USERS_REQUEST
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(currentState)
    })
  })

  describe('FLUSH_STATE', () => {
    test('should return initial state', () => {
      const action = {
        type: types.FLUSH_STATE
      }

      const currentState = getState({
        users: mockUsers,
        visibleUsers: mockUsers
      })
      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
})