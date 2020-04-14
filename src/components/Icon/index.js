import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIcon } from '@material-ui/core/Icon'
import { withTheme } from '@material-ui/core/styles'

/**
 * Basic @material-ui/core icon component
 */
const Icon = ({ color, size, style, children, theme, ...otherProps }) => {
  const styles = {
    fontSize: size,
    color: theme.palette[color] ? theme.palette[color][500] : color,
    ...style
  }

  return (
    <MuiIcon style={styles} {...otherProps}>
      {children}
    </MuiIcon>
  )
}

Icon.propTypes = {
  /**
   * Color of the icon, can be a color defined in @material-ui/core theme or css accepted color
   */
  color: PropTypes.string,
  /**
   * Size of the icon
   */
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Override any of the default style of the icon
   */
  style: PropTypes.object,
  /**
   * Can be string or icon component (like from mdi-material-ui package)
   */
  children: PropTypes.any,
  /**
   * Theme supplied from @material-ui/core
   */
  theme: PropTypes.object
}

Icon.defaultProps = {
  size: '24px',
  color: 'primary'
}

export default withTheme()(Icon)