import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'

/**
 * CSS Flexbox container wrapper for @material-ui/core's Grid container component, it always has display: true
 */
export const Container = ({ column, flex, spacing, children, style, ...otherProps }) => {
  const styles = {
    flex: flex ? '1' : '0 0 auto',
    ...style
  }

  return (
    <Grid container direction={column ? 'column' : 'row'} spacing={spacing} style={styles} {...otherProps}>
      {children}
    </Grid>
  )
}

Container.propTypes = {
  /**
   * Whether or not to set flex-direction: column for the container
   */
  column: PropTypes.bool,
  /**
   * Whether or not to set flex: 1 to container
   */
  flex: PropTypes.bool,
  /**
   * Spacing in padding (from @material-ui/core Grid component)
   */
  spacing: PropTypes.number,
  /**
   * Contents of container
   */
  children: PropTypes.node,
  /**
   * Override / set style of container
   */
  style: PropTypes.object
}

Container.defaultProps = {
  spacing: 0,
  flex: false,
  column: false
}

export default Container