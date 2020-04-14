import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import theme from 'services/theme'

/**
 * Wrapper around react-router-dom's Link component, all Link props are passed through.
 * Text color is the apps secondary theme color
 */
export const TextLink = ({ children, style, ...otherProps }) => {
  const styles = {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    ...style
  }

  return (
    <Link {...otherProps} style={styles}>{children}</Link>
  )
}

TextLink.propTypes = {
  /**
   * Link contents
   */
  children: PropTypes.any,
  /**
   * Styles
   */
  style: PropTypes.object
}

export default TextLink
