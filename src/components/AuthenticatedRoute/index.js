import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { isLoggedIn } from 'services/authToken'
import { connect } from 'react-redux'
import { UnauthPage, PageNotFound } from 'components/RoutePages'

/**
 * These are all of the routes that exist in the application, split up by who is allowed to view them
 */
const coderPaths = [
  '/home',
  '/project/:id/protocol',
  '/project/:id/code',
  '/docs',
  '/docs/:id/view',
  '/user/profile',
  '/user/profile/avatar'
]

const coordinatorPaths = [
  ...coderPaths,
  '/project/add',
  '/project/:id/jurisdictions',
  '/project/:id/coding-scheme',
  '/project/:id/validate',
  '/project/edit/:id'
]

const adminPaths = [...coderPaths, ...coordinatorPaths, '/admin']

const paths = {
  Coder: coderPaths,
  Coordinator: coordinatorPaths,
  Admin: adminPaths
}

/**
 * Checks whether or not the user is allowed to access the route, based on their role
 * @param user
 * @param path
 * @returns {boolean}
 */
const isAllowed = (user, path) => {
  if (path === '/') return true
  const allowedPaths = [...paths[user.role], ...user.role !== 'Admin' ? ['/user/profile', '/user/profile/avatar'] : []]
  let allowed = true
  if (allowedPaths.length > 0) {
    allowed = false
    allowedPaths.forEach(pathname => {
      const match = matchPath(path, { path: pathname })
      if (match !== null) allowed = true
    })
    return allowed
  }
  return allowed
}

/**
 * Checks whether the given path exists in the application
 * @param path
 * @returns {boolean}
 */
const isPath = path => {
  if (path === '/') return true
  let isPath = false
  adminPaths.forEach(pathname => {
    const match = matchPath(path, { path: pathname })
    if (match !== null) isPath = true
  })
  return isPath
}

/**
 * @component
 * A wrapper around all other routes that handles whether or not the user can view the page. If they are allowed then
 * it renders the component, if not, then renders UnauthPage. If page isn't found, it renders PageNotFound. If the user
 * isn't logged in, renders the Login page.
 */
export const AuthenticatedRoute = ({ component: Component, user, location, ...rest }) => {
  const loggedIn = isLoggedIn()
  return (
    isPath(location.pathname)
      ? loggedIn
        ? isAllowed(user, location.pathname)
          ? <Route {...rest} render={props => <Component {...props} isLoggedIn={loggedIn} />} />
          : <UnauthPage />
        : <Redirect
          {...rest}
          to={{
            pathname: '/login',
            state: { from: location.pathname === '/' ? '/home' : location }
          }}
        />
      : <PageNotFound />
  )
}

AuthenticatedRoute.propTypes = {
  /**
   * The component to route to and render if the user is allowed
   */
  component: PropTypes.any.isRequired,
  /**
   * User currently logged
   */
  user: PropTypes.object,
  /**
   * Location object from React-Router
   */
  location: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.data.user.currentUser
})

export default withRouter(connect(mapStateToProps)(AuthenticatedRoute))
