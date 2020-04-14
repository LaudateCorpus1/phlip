import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPDATE_PROTOCOL: 'UPDATE_PROTOCOL',
  SAVE_PROTOCOL_REQUEST: 'SAVE_PROTOCOL_REQUEST',
  SAVE_PROTOCOL_SUCCESS: 'SAVE_PROTOCOL_SUCCESS',
  SAVE_PROTOCOL_FAIL: 'SAVE_PROTOCOL_FAIL',
  GET_PROTOCOL_REQUEST: 'GET_PROTOCOL_REQUEST',
  GET_PROTOCOL_SUCCESS: 'GET_PROTOCOL_SUCCESS',
  GET_PROTOCOL_FAIL: 'GET_PROTOCOL_FAIL',
  LOCK_PROTOCOL_REQUEST: 'LOCK_PROTOCOL_REQUEST',
  LOCK_PROTOCOL_SUCCESS: 'LOCK_PROTOCOL_SUCCESS',
  LOCK_PROTOCOL_FAIL: 'LOCK_PROTOCOL_FAIL',
  UNLOCK_PROTOCOL_REQUEST: 'UNLOCK_PROTOCOL_REQUEST',
  UNLOCK_PROTOCOL_SUCCESS: 'UNLOCK_PROTOCOL_SUCCESS',
  UNLOCK_PROTOCOL_FAIL: 'UNLOCK_PROTOCOL_FAIL',
  UPDATE_EDITED_FIELDS: 'UPDATE_EDITED_FIELDS',
  RESET_LOCK_ALERT_PROTOCOL: 'RESET_LOCK_ALERT_PROTOCOL',
  RESET_ALERT_ERROR: 'RESET_ALERT_ERROR',
  CLEAR_STATE: 'CLEAR_STATE'
}

export default {
  getProtocolRequest: makeActionCreator(types.GET_PROTOCOL_REQUEST, 'projectId'),
  lockProtocolRequest: makeActionCreator(types.LOCK_PROTOCOL_REQUEST, 'projectId'),
  unlockProtocolRequest: makeActionCreator(types.UNLOCK_PROTOCOL_REQUEST, 'projectId', 'userId'),
  updateProtocol: makeActionCreator(types.UPDATE_PROTOCOL, 'content'),
  saveProtocolRequest: makeActionCreator(types.SAVE_PROTOCOL_REQUEST, 'protocol', 'projectId'),
  updateEditedFields: makeActionCreator(types.UPDATE_EDITED_FIELDS, 'projectId'),
  clearState: makeActionCreator(types.CLEAR_STATE),
  resetAlertError: makeActionCreator(types.RESET_ALERT_ERROR),
  resetLockAlert: makeActionCreator(types.RESET_LOCK_ALERT_PROTOCOL)
}
