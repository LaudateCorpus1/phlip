import actions, { types } from '../actions'

describe('CodingValidation - Question card action creators', () => {
  test('should create an action to set alert', () => {
    const action = { type: types.SET_ALERT, alert: { text: 'alert' } }
    expect(actions.setAlert({ text: 'alert' })).toEqual(action)
  })
  
  test('should create an action to close the alert', () => {
    const action = { type: types.CLOSE_ALERT }
    expect(actions.closeAlert()).toEqual(action)
  })
  
  test('should create an action to set touched status', () => {
    const action = { type: types.CHANGE_TOUCHED_STATUS, touched: false }
    expect(actions.changeTouchedStatus(false)).toEqual(action)
  })
  
  test('should create an action to set header text', () => {
    const action = { type: types.SET_HEADER_TEXT, text: 'header text' }
    expect(actions.setHeaderText('header text')).toEqual(action)
  })
  
  test('should create an action to set reset status', () => {
    const action = { type: types.SET_RESET_STATUS, canReset: false }
    expect(actions.setResetStatus(false)).toEqual(action)
  })
})
