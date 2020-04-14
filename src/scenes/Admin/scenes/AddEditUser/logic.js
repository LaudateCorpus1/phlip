import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Sends a request to add a user
 */
export const addUserLogic = createLogic({
  type: types.ADD_USER_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const user = await api.addUser(action.user, {}, {})
      dispatch({ type: types.ADD_USER_SUCCESS, payload: user })
    } catch (err) {
      dispatch({ type: types.ADD_USER_FAIL, payload: 'We couldn\'t add this user. Please try again later.' })
    }
    done()
  }
})

/**
 * Sends a request to update the user with userId: action.user.id
 */
export const updateUserLogic = createLogic({
  type: types.UPDATE_USER_REQUEST,
  latest: true,
  async process({ action, api }, dispatch, done) {
    let updatedUser = {}
    try {
      if (action.selfUpdate) {
        const patchDocument = [
          { op: 'replace', path: '/firstName', value: action.user.firstName },
          { op: 'replace', path: '/lastName', value: action.user.lastName },
          { op: 'replace', path: '/avatar', value: action.user.avatar }
        ]
        updatedUser = await api.updateSelf(patchDocument, {}, { userId: action.user.id })
      } else {
        updatedUser = await api.updateUser(action.user, {}, { userId: action.user.id })
      }
      dispatch({ type: types.UPDATE_USER_SUCCESS, payload: { ...updatedUser, avatar: action.user.avatar } })
    } catch (e) {
      if (e.response.status === 304) {
        updatedUser = { ...action.user, avatar: action.user.avatar }
        dispatch({ type: types.UPDATE_USER_SUCCESS, payload: { ...updatedUser, avatar: action.user.avatar } })
      } else {
        dispatch({
          type: types.UPDATE_USER_FAIL,
          payload: action.selfUpdate
            ? 'We couldn\'t update your profile. Please try again later.'
            : 'We couldn\'t update this user. Please try again later.'
        })
      }
    }
    done()
  }
})

/**
 * Sends a PATCH request to update the avatar for the user with userId = action.userId
 */
export const patchUserImageLogic = createLogic({
  type: types.ADD_USER_IMAGE_REQUEST,
  latest: true,
  async process({ action, api }, dispatch, done) {
    try {
      action.selfUpdate
        ? await api.updateSelf(action.patchOperation, {}, { userId: action.userId })
        : await api.updateUserImage(action.patchOperation, {}, { userId: action.userId })
      dispatch({
        type: types.ADD_USER_IMAGE_SUCCESS,
        payload: { avatar: action.patchOperation[0].value, userId: action.userId, user: action.user }
      })
    } catch (err) {
      dispatch({
        type: types.ADD_USER_IMAGE_FAIL,
        payload: action.selfUpdate
          ? 'We couldn\'t add your photo. Please try again later.'
          : 'We couldn\'t add a photo for this user. Please try again later.'
      })
    }
    done()
  }
})

/**
 * Sends a request to delete the avatar image for a user with userId = action.userId
 */
export const deleteUserImageLogic = createLogic({
  type: types.DELETE_USER_IMAGE_REQUEST,
  latest: true,
  async process({ action, api }, dispatch, done) {
    try {
      action.selfUpdate
        ? await api.updateSelf(action.operation, {}, { userId: action.userId })
        : await api.deleteUserImage(action.operation, {}, { userId: action.userId })
      
      dispatch({
        type: types.DELETE_USER_IMAGE_SUCCESS,
        payload: { user: action.user, userId: action.userId, avatar: null }
      })
    } catch (err) {
      dispatch({
        type: types.DELETE_USER_IMAGE_FAIL,
        payload: action.selfUpdate
          ? 'We couldn\'t remove your photo. Please try again later.'
          : 'We couldn\'t remove the photo for this user. Please try again later.'
      })
    }
    done()
  }
})

export default [
  deleteUserImageLogic,
  patchUserImageLogic,
  updateUserLogic,
  addUserLogic
]
