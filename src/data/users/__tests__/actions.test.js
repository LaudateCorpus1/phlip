import actions, { types } from '../actions'

describe('User action creators', () => {
  test('should create an action to logout user', () => {
    const expectedAction = {
      type: types.LOGOUT_USER,
      sessionExpired: false
    }
    expect(actions.logoutUser(false)).toEqual(expectedAction)
  })

  test('should create an action to flush state', () => {
    const expectedAction = {
      type: types.FLUSH_STATE
    }
    expect(actions.flushState()).toEqual(expectedAction)
  })
})
