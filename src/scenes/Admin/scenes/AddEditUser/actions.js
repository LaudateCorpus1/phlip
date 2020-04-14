import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  ADD_USER_REQUEST: 'ADD_USER_REQUEST',
  ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
  ADD_USER_FAIL: 'ADD_USER_FAIL',
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAIL: 'UPDATE_USER_FAIL',
  UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
  ADD_USER_IMAGE_REQUEST: 'ADD_USER_IMAGE_REQUEST',
  ADD_USER_IMAGE_SUCCESS: 'ADD_USER_IMAGE_SUCCESS',
  ADD_USER_IMAGE_FAIL: 'ADD_USER_IMAGE_FAIL',
  DELETE_USER_IMAGE_REQUEST: 'DELETE_USER_IMAGE_REQUEST',
  DELETE_USER_IMAGE_SUCCESS: 'DELETE_USER_IMAGE_SUCCESS',
  DELETE_USER_IMAGE_FAIL: 'DELETE_USER_IMAGE_FAIL',
  ON_CLOSE_ADD_EDIT_USER: 'ON_CLOSE_ADD_EDIT_USER',
  LOAD_ADD_EDIT_AVATAR: 'LOAD_ADD_EDIT_AVATAR',
  RESET_USER_FORM_ERROR: 'RESET_USER_FORM_ERROR'
}

export default {
  addUserRequest: makeActionCreator(types.ADD_USER_REQUEST, 'user'),
  updateUserRequest: makeActionCreator(types.UPDATE_USER_REQUEST, 'user', 'selfUpdate'),
  updateCurrentUser: makeActionCreator(types.UPDATE_CURRENT_USER, 'payload'),
  addUserPictureRequest: makeActionCreator(types.ADD_USER_IMAGE_REQUEST, 'userId', 'patchOperation', 'user', 'selfUpdate'),
  deleteUserPictureRequest: makeActionCreator(types.DELETE_USER_IMAGE_REQUEST, 'userId', 'operation', 'user', 'selfUpdate'),
  onCloseAddEditUser: makeActionCreator(types.ON_CLOSE_ADD_EDIT_USER),
  loadAddEditAvatar: makeActionCreator(types.LOAD_ADD_EDIT_AVATAR, 'avatar'),
  resetFormError: makeActionCreator(types.RESET_USER_FORM_ERROR)
}
