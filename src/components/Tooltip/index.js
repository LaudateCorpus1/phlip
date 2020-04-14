import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTooltip } from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => {
  return {
    tooltipPlacementLeft: {
      transformOrigin: 'right center',
      margin: `0 ${theme.spacing.unit * 3}px`,
      [theme.breakpoints.up('sm')]: {
        margin: '0 7px'
      }
    },
    tooltipPlacementRight: {
      transformOrigin: 'left center',
      margin: `0 ${theme.spacing.unit * 3}px`,
      [theme.breakpoints.up('sm')]: {
        margin: '0 7px'
      }
    },
    tooltipPlacementTop: {
      transformOrigin: 'center bottom',
      margin: `${theme.spacing.unit * 3}px 0`,
      [theme.breakpoints.up('sm')]: {
        margin: '7px 0'
      }
    },
    tooltipPlacementBottom: {
      transformOrigin: 'center top',
      margin: `${theme.spacing.unit * 3}px 0`,
      [theme.breakpoints.up('sm')]: {
        margin: '7px 0'
      }
    },
    popper: {
      margin: -5
    }
  }
}

/**
 * Wrapper for @material-ui/core's Tooltip component, displays a small popover with text on hover
 */
export const Tooltip = ({ text, placement, children, classes, overrideClasses, ...otherProps }) => {
  return (
    <MuiTooltip
      placement={placement}
      title={text}
      enterDelay={350}
      classes={{ ...classes, ...overrideClasses }}
      disableTouchListener
      {...otherProps}
      PopperProps={{
        modifiers: {
          preventOverflow: { enabled: false },
          hide: { enabled: false }
        }
      }}>
      {children}
    </MuiTooltip>
  )
}

Tooltip.defaultProps = {
  placement: 'top',
  text: ''
}

Tooltip.propTypes = {
  /**
   * Tooltip text
   */
  text: PropTypes.string,
  /**
   * Where to place the tooltip, relative to the components children
   */
  placement: PropTypes.string,
  /**
   * Tooltip will show on hover of the children
   */
  children: PropTypes.any,
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Object to override classes
   */
  overrideClasses: PropTypes.object
}

export default withStyles(styles)(Tooltip)
