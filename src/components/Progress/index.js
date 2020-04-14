import React from 'react'
import PropTypes from 'prop-types'

const trackStyles = {
  height: 5,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#B5BCBE',
  minWidth: 30,
  maxWidth: 30
}

/**
 * Small linear progress bar
 */
export const Progress = ({ progress, color, width, containerStyles }) => {
  const barStyles = {
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    width: width ? width : '100%',
    transformOrigin: 'left',
    backgroundColor: color ? color : '#b3e98c'
  }

  return (
    <div style={{ ...trackStyles, ...containerStyles }}>
      <div style={{ ...barStyles, transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}

Progress.propTypes = {
  /**
   * How much of the progress bar to fill (out of 100)
   */
  progress: PropTypes.number,
  /**
   * Color of the completed portion of progress bar
   */
  color: PropTypes.string,
  /**
   * Width of progress bar
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Override the full progress bar style (not the completed portion)
   */
  containerStyles: PropTypes.object
}

export default Progress