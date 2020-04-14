import axios from 'axios'
import { isLoggedIn, getToken, logout } from 'services/authToken'
import util from 'util'

/* global APP_IS_SAML_ENABLED, APP_API_URL, APP_IS_PRODUCTION */

/**
 * AxiosInstance with baseURL /api
 * @type {AxiosInstance}
 */
export const projectApiInstance = axios.create({
  baseURL: '/api'
})

export const docApiInstance = axios.create({
  baseURL: '/docsApi'
})

/**
 * This function checks to make sure any error from the API isn't a 401. If it returns a 401 it will push '/login' onto
 * the browser history and logout the user
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.history
 * @param {Object} call
 * @returns {function(error : Object)}
 */
export const redirectIfTokenExpired = ({ history }, call) => error => {
  if (error.response.status === 401) {
    if (call.name === 'login' || call.name === 'checkPivUser') {
      history.push({ pathname: '/login' })
    } else {
      logout()
      history.push({ pathname: '/login', state: { sessionExpired: true } })
    }
  }
  throw error
}

/**
 * Prepares an API axios instance for the 'call' parameter
 *
 * @param {Object} dependencies
 * @param {Object} dependencies.history
 * @returns {function(call : Object): function(data: Object, options: Object, urlParams: Object): Promise}
 * @param instance
 */
const prepare = ({ history }, instance) => call => (data, options, urlParams = {}) => {
  const baseHeaders = isLoggedIn() ? { Authorization: `Bearer ${getToken()}` } : {}
  const callHeaders = call.hasOwnProperty('headers') ? { ...call.headers(urlParams) } : {}
  const headers = { ...baseHeaders, ...callHeaders }

  if (APP_LOG_REQUESTS && APP_LOG_REQUESTS === '1') {
    console.log(`Sending ${call.method.toUpperCase()} request: ${call.path(urlParams)} at ${new Date().toLocaleString()}`)
    console.log(`Data in ${call.method.toUpperCase()} request: ${util.inspect(data)}`)
  }

  return instance({
    ...options,
    data,
    method: call.method,
    url: call.path(urlParams),
    headers
  }).then(res => {
    if (APP_LOG_REQUESTS && APP_LOG_REQUESTS === '1') {
      console.log(`Received response from: ${call.path(urlParams)} at ${new Date().toLocaleString()}`)
    }
    return call.hasOwnProperty('returnObj') ? call.returnObj({ ...urlParams }, res) : res.data
  }).catch(redirectIfTokenExpired({ history }, call))
}

/**
 * Prepares a total API object to be passed to redux-logic
 *
 * @param {Object} dependencies
 * @param {Function} instance
 * @param {Array} calls
 * @returns {Object} - API object with an axios instance for each call from ./call.js
 */
const createApiHandler = (dependencies, instance, calls) => {
  const preparedApi = prepare(dependencies, instance)

  const api = calls.reduce((apiObj, call) => ({
    ...apiObj,
    [call.name]: preparedApi(call)
  }), {})

  return api
}

export default createApiHandler
