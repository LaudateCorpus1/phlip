import actions, { types } from '../actions'

describe('Base scene action creators', () => {
  test('should create an action to toggle menu', () => {
    const expectedAction = {
      type: types.TOGGLE_MENU
    }
    expect(actions.toggleMenu()).toEqual(expectedAction)
  })

  test('should create an action to close menu', () => {
    const expectedAction = {
      type: types.CLOSE_MENU
    }
    expect(actions.closeMenu()).toEqual(expectedAction)
  })

  test('should create an action to flush state', () => {
    const expectedAction = {
      type: types.FLUSH_STATE
    }
    expect(actions.flushState()).toEqual(expectedAction)
  })
})
