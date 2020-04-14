import React from 'react'
import { default as MuiSnackbar } from '@material-ui/core/Snackbar'
import PropTypes from 'prop-types'

/**
 * Small rectangluar popover with single action button -- wrapper for @material-ui/core's Snackbar component
 */
export const Snackbar = ({ anchorOrigin, open, handleClose, content, ...other }) => {
  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      open={open}
      onClose={handleClose}
      message={content}
      {...other}
    />
  )
}

Snackbar.propTypes = {
  /**
   * Where to display the snackbar
   */
  anchorOrigin: PropTypes.object,
  /**
   * If true, the snackbar is visible
   */
  open: PropTypes.bool,
  /**
   * Function to class when snackbar is closed
   */
  handleClose: PropTypes.func,
  /**
   * Message for popover
   */
  content: PropTypes.any
}

Snackbar.defaultProps = {
  open: false,
  anchorOrigin: { vertical: 'top', horizontal: 'center' }
}

export default Snackbar