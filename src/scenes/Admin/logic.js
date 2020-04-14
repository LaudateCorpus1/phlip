import { createLogic } from 'redux-logic'
import { types } from './actions'
import addEditUserLogic from './scenes/AddEditUser/logic'

/**
 * Logic for getting all the users in the system, invoked when the component is mounted
 */
export const getUserLogic = createLogic({
  type: types.GET_USERS_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USERS_SUCCESS,
    failType: types.GET_USERS_FAIL
  },
  async process({ api }) {
    let users = {}
    try {
      users = await api.getUsers()
    } catch (e) {
      throw { error: 'failed to get users' }
    }

    return users
  }
})

export default [
  getUserLogic,
  ...addEditUserLogic
]