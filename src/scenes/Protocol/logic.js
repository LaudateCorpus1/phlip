/**
 * All protocol related logic is defined here
 */
import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Logic for getting the protocol from the API. Also gets the lock information, if any, about the protocol.
 */
const getProtocolLogic = createLogic({
  type: types.GET_PROTOCOL_REQUEST,
  async process({ getState, api, action }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const protocol = await api.getProtocol({}, {}, { projectId: action.projectId })
      let lockInfo = {}, error = {}
      
      try {
        lockInfo = await api.getProtocolLockInfo({}, {}, { projectId: action.projectId })
        if (lockInfo === '') {
          lockInfo = {}
        }
      } catch (e) {
        error.lockInfo = 'We couldn\'t determine if the protocol is checked out at this time.'
      }
      
      dispatch({
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: protocol.text,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false,
          error
        }
      })
    } catch (error) {
      dispatch({
        type: types.GET_PROTOCOL_FAIL
      })
    }
    done()
  }
})

/**
 * Sends a request to the API to save the protocol content and release the lock on the protocol.
 */
const saveProtocolLogic = createLogic({
  type: types.SAVE_PROTOCOL_REQUEST,
  async process({ getState, api, action }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const resp = await api.saveProtocol({ text: action.protocol, userId }, {}, {
        projectId: action.projectId,
        userId
      })
      dispatch({
        type: types.SAVE_PROTOCOL_SUCCESS,
        payload: { ...resp }
      })
    } catch (error) {
      dispatch({
        type: types.SAVE_PROTOCOL_FAIL,
        payload: 'We couldn\'t save the protocol.'
      })
    }
    done()
  }
})

/**
 * Sends a request to the API to lock / check out the protocol for the current user
 */
const lockProtocolLogic = createLogic({
  type: types.LOCK_PROTOCOL_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const lockInfo = await api.lockProtocol({}, {}, { projectId: action.projectId, userId: currentUserId })
      dispatch({
        type: types.LOCK_PROTOCOL_SUCCESS,
        payload: {
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
        }
      })
    } catch (error) {
      dispatch({
        type: types.LOCK_PROTOCOL_FAIL,
        error: true,
        payload: 'We couldn\'t lock the protocol for editing.'
      })
    }
    done()
  }
})

/**
 * Sends a request to unlock / check in the protocol for the current user.
 */
const unlockProtocolLogic = createLogic({
  type: types.UNLOCK_PROTOCOL_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    // if userId is not passed use current user ID from state
    const userId = action.userId === undefined ? getState().data.user.currentUser.id : action.userId
    try {
      const unlockInfo = await api.unlockProtocol({}, {}, { projectId: action.projectId, userId })
      dispatch({
        type: types.UNLOCK_PROTOCOL_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_PROTOCOL_FAIL,
        error: true,
        payload: 'We couldn\'t unlock the protocol.'
      })
    }
    done()
  }
})

export default [
  getProtocolLogic,
  saveProtocolLogic,
  lockProtocolLogic,
  unlockProtocolLogic
]
