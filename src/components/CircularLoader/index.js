import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

/**
 * Spinning loader, based on @material-ui/core's CircularProgress
 */
export const CircularLoader = ({ type, color, thickness, size, style, ...otherProps }) => {
  const loaderStyle = {
    ...style,
    height: size,
    width: size
  }
  
  return (
    <CircularProgress
      type={type}
      color={color}
      thickness={thickness}
      size={size}
      style={loaderStyle}
      {...otherProps}
    />
  )
}

CircularLoader.defaultProps = {
  type: 'indeterminate',
  color: 'primary',
  thickness: 5,
  size: 24,
  style: { height: 24, width: 24 }
}

CircularLoader.propTypes = {
  /**
   * Type of loader: determinate, indeterminate
   */
  type: PropTypes.string,
  /**
   * Color of the spinning loader ring
   */
  color: PropTypes.string,
  /**
   * Thickness of spinner
   */
  thickness: PropTypes.number,
  /**
   * size of the circle
   */
  size: PropTypes.number,
  /**
   * Style for the loader
   */
  style: PropTypes.object
}

export default CircularLoader
