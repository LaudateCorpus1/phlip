import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'

/**
 * CSS flexbox Column based on @material-ui/core's Grid component
 */
const Column = ({ flex, displayFlex, children, component, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    display: displayFlex ? 'flex' : 'block',
    flexDirection: 'column',
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

Column.propTypes = {
  /**
   * Whether or not to set flex: 1 for the column
   */
  flex: PropTypes.bool,
  /**
   * Whether or not to set display: flex for the column
   */
  displayFlex: PropTypes.bool,
  /**
   * Contents of the column
   */
  children: PropTypes.any,
  /**
   * Override add additional style
   */
  style: PropTypes.object,
  /**
   * Component to turn into a flex column
   */
  component: PropTypes.element
}

Column.defaultProps = {
  flex: false,
  displayFlex: false,
  component: <Grid item />
}

export default Column