import { createLogic } from 'redux-logic'
import { types } from 'data/users/actions'
import scenesLogic from 'scenes/logic'
import dataLogic from 'data/logic'
import { logout, getSamlToken } from 'services/authToken'
import { persistor } from 'services/store'
import axios from 'axios'

/**
 * Logic for when the user logs out. Flushes the state calls logout from authToken service
 */
const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  async process({ action, api }, dispatch, done) {
    // if saml enabled, do saml logout first
    if (APP_IS_SAML_ENABLED === '1') {
      samsLogout()
    }
    logout()
    dispatch({ type: types.FLUSH_STATE, isLogout: true })
    await persistor.flush()
    await persistor.purge()
    done()
  }
})

/**
 * Handles logging the user out of SAMS
 */
const samsLogout = async () => {
  const user = getSamlToken()
  let parsedUser = JSON.parse(user.substring(1, user.length - 1))
  try {
    axios.get('/logout', {
      params: {
        nameID: parsedUser.nameID,
        nameIDFormat: parsedUser.nameIDFormat,
        sessionIndex: parsedUser.sessionIndex
      }
    }).then(res => {
      //logout()
      const logoutURL = res.data
      location.href = logoutURL
    })
  } catch (err) {
    /*istanbul ignore next */
    return err
  }
}

export default [
  ...dataLogic,
  ...scenesLogic,
  logoutLogic
]
