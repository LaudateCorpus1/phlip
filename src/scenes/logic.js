import projectLogic from './Home/logic'
import userLogic from './Admin/logic'
import loginLogic from './Login/logic'
import codingSchemeLogic from './CodingScheme/logic'
import protocolLogic from './Protocol/logic'
import codingValidationLogic from './CodingValidation/logic'
import docManageLogic from './DocumentManagement/logic'
import docViewLogic from './DocumentView/logic'

import { createLogic } from 'redux-logic'
import { types } from './actions'
import { getToken, decodeToken, login, isLoggedIn } from 'services/authToken'

/**
 * Handles sending a request to download the 'User Guide' PDF
 */
export const downloadPdfLogic = createLogic({
  type: types.DOWNLOAD_PDF_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.DOWNLOAD_PDF_SUCCESS,
    failType: types.DOWNLOAD_PDF_FAIL
  },
  async process({ api }) {
    return await api.getHelpPdf({}, { responseType: 'arraybuffer' }, {})
  }
})

/**
 * Sends a request to get a new JWT every 15 minutes so the user isn't logged out if they are still active
 */
export const refreshJwtLogic = createLogic({
  type: types.REFRESH_JWT,
  warnTimeout: 0,
  cancelType: [types.CANCEL_REFRESH_JWT, types.LOGOUT_USER],
  process({ cancelled$, api }) {
    const interval = setInterval(async () => {
      if (isLoggedIn()) {
        const currentToken = getToken()
        const newToken = await api.checkPivUser(
          { email: decodeToken(currentToken).Email },
          {},
          { tokenObj: { token: currentToken } }
        )
        await login(newToken.token.value)
      }
    }, 900000)
    
    cancelled$.subscribe(() => {
      clearInterval(interval)
    })
  }
})

/**
 * Collects all of the logic from scenes into one array
 */
export default [
  refreshJwtLogic,
  downloadPdfLogic,
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  ...codingSchemeLogic,
  ...codingValidationLogic,
  ...protocolLogic,
  ...docManageLogic,
  ...docViewLogic
]
