import actions, { types } from '../actions'

describe('Admin action creators', () => {
  test('should create an action to get users', () => {
    const expectedAction = {
      type: types.GET_USERS_REQUEST
    }
    expect(actions.getUsersRequest()).toEqual(expectedAction)
  })

  test('should create an action to indicate getting users was successful', () => {
    const users = [{ name: 'Test User' }]
    const expectedAction = {
      type: types.GET_USERS_SUCCESS,
      users
    }
    expect(actions.getUserSuccess(users)).toEqual(expectedAction)
  })
})
