import React from 'react'
import PropTypes from 'prop-types'

/**
 * PHLIP logo component
 */
export const Logo = props => {
  const { height, width } = props
  return (
    <img src="/phlip-logo.png" style={{ height, width }} alt="Public Health Law Information Portal" />
  )
}

Logo.defaultProps = {
  width: 'auto'
}

Logo.propTypes = {
  /**
   * Height of image
   */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Width of image
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default Logo