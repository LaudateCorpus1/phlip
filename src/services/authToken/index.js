import memoize from 'lodash/memoize'
import jwtDecode from 'jwt-decode'

const TOKEN_KEY = 'phlip_token'
const SAML_KEY = 'saml_token'

const getItem = key => () => window.sessionStorage.getItem(key)
const setItem = key => value => window.sessionStorage.setItem(key, value)
const removeItem = key => () => window.sessionStorage.removeItem(key)

const getAuthToken = getItem(TOKEN_KEY)
const setAuthToken = setItem(TOKEN_KEY)
const removeAuthToken = removeItem(TOKEN_KEY)

const getSamlAuthToken = getItem(SAML_KEY)
const setSamlAuthToken = setItem(SAML_KEY)
const removeSamlAuthToken = removeItem(SAML_KEY)

const memoizedGetAuthToken = memoize(getAuthToken)
const memoizedGetSamlAuthToken = memoize(getSamlAuthToken)

/**
 * Logs in a user by setting the token parameter is session storage
 *
 * @param {String} token
 * @param samlToken
 */
export const login = async (token, samlToken) => {
  return new Promise(resolve => {
    memoizedGetAuthToken.cache.clear()
    setAuthToken(token)
    if (samlToken !== undefined) {
      memoizedGetSamlAuthToken.cache.clear()
      setSamlAuthToken(samlToken)
    }
    resolve()
  })
}

/**
 * Checks to see if a user is logged in, by checking to see if a token exists in session storage
 * @returns {Boolean}
 */
export const isLoggedIn = () => {
  return !!memoizedGetAuthToken(TOKEN_KEY)
}

/**
 * Logs out a user by removing the token from session token
 */
export const logout = () => {
  removeAuthToken()
  removeSamlAuthToken()
  memoizedGetAuthToken.cache.clear()
  memoizedGetSamlAuthToken.cache.clear()
}

/**
 * Gets the token that is in session storage
 * @returns {String}
 */
export const getToken = () => memoizedGetAuthToken(TOKEN_KEY)

/**
 * Gets the saml token that is in session storage
 * @returns {String}
 */
export const getSamlToken = () => memoizedGetSamlAuthToken(SAML_KEY)

/**
 * Decodes the JWT token
 * @param {String} token
 * @returns {Object}
 */
export const decodeToken = token => {
  return jwtDecode(token)
}

/**
 * Checks to see if the token has expired
 * @returns {Boolean}
 */
export const isTokenExpired = () => {
  const token = decodeToken(getToken())
  const current = Date.now() / 1000
  return current > token.exp
}

export default {
  login,
  isLoggedIn,
  decodeToken,
  isTokenExpired,
  getSamlToken,
  getToken,
  logout
}
