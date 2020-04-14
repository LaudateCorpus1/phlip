import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  LOGIN_USER_REQUEST: 'LOGIN_USER_REQUEST',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  LOGIN_USER_FAIL: 'LOGIN_USER_FAIL',
  CHECK_PIV_USER_REQUEST: 'CHECK_PIV_USER_REQUEST',
  CHECK_PIV_USER_SUCCESS: 'CHECK_PIV_USER_SUCCESS',
  CHECK_PIV_USER_FAIL: 'CHECK_PIV_USER_FAIL',
  LOGOUT_USER: 'LOGOUT_USER',
  FLUSH_STATE: 'FLUSH_STATE',
  REFRESH_JWT: 'REFRESH_JWT',
  GET_BACKEND_INFO_REQUEST: 'GET_BACKEND_INFO_REQUEST',
  GET_BACKEND_INFO_FAIL: 'GET_BACKEND_INFO_FAIL',
  GET_BACKEND_INFO_SUCCESS: 'GET_BACKEND_INFO_SUCCESS'
}

export default {
  loginUserRequest: makeActionCreator(types.LOGIN_USER_REQUEST, 'credentials'),
  loginUserSuccess: makeActionCreator(types.LOGIN_USER_SUCCESS, 'payload'),
  checkPivUserRequest: makeActionCreator(types.CHECK_PIV_USER_REQUEST, 'tokenObj'),
  getBackendInfoRequest: makeActionCreator(types.GET_BACKEND_INFO_REQUEST),
  getBackendInfoSuccess: makeActionCreator(types.GET_BACKEND_INFO_SUCCESS)
}
