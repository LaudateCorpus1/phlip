import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'

/**
 * CSS Flexbox row wrapper for @material-ui/core's Grid component
 */
export const Row = ({ flex, displayFlex, children, reverse, component, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    display: displayFlex ? 'flex' : 'block',
    flexDirection: reverse ? 'row-reverse' : 'row',
    ...style
  }

  return (
    React.cloneElement(
      component,
      {
        children,
        style: styles,
        ...otherProps
      }
    )
  )
}

Row.propTypes = {
  /**
   * Whether or not to set flex: 1 for the row
   */
  flex: PropTypes.bool,
  /**
   * Whether or not to set display: flex for the row
   */
  displayFlex: PropTypes.bool,
  /**
   * Contents of the row
   */
  children: PropTypes.any,
  /**
   * Override add additional style
   */
  style: PropTypes.object,
  /**
   * Component to turn into a flex row
   */
  component: PropTypes.element,
  /**
   * Whether or not flex-direction should be set to 'row-reverse'
   */
  reverse: PropTypes.bool
}

Row.defaultProps = {
  flex: false,
  displayFlex: false,
  component: <Grid item />,
  reverse: false
}

export default Row