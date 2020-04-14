import actions, { types } from '../actions'

describe('Protocol action creators', () => {
  test('should create an action to get protocol', () => {
    const expectedAction = {
      type: types.GET_PROTOCOL_REQUEST,
      projectId: 1
    }

    expect(actions.getProtocolRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to update protocol', () => {
    const expectedAction = {
      type: types.UPDATE_PROTOCOL,
      content: 'updated protocol'
    }

    expect(actions.updateProtocol('updated protocol')).toEqual(expectedAction)
  })

  test('should create an action to save protocol request', () => {
    const expectedAction = {
      type: types.SAVE_PROTOCOL_REQUEST,
      projectId: 1,
      protocol: 'this is the protocol'
    }

    expect(actions.saveProtocolRequest('this is the protocol', 1)).toEqual(expectedAction)
  })

  test('should create an action to clear state', () => {
    const expectedAction = {
      type: types.CLEAR_STATE
    }

    expect(actions.clearState()).toEqual(expectedAction)
  })
})
