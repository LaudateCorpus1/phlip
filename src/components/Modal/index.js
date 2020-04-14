import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import { withStyles } from '@material-ui/core/styles'

const paper = {
  display: 'flex',
  flexDirection: 'column',
  flex: '0 1 auto',
  position: 'relative',
  maxHeight: '90vh',
  overflowY: 'auto', // Fix IE11 issue, to remove at some point.
  '&:focus': {
    outline: 'none'
  }
}

const classes = theme => ({
  paperNormal: {
    ...paper,
    margin: theme.spacing.unit * 4
  },
  hideOverflow: {
    ...paper,
    margin: theme.spacing.unit * 4,
    overflowY: 'hidden',
    width: '100%',
    height: '100%'
  }
})

/**
 * A dialog component wrapper for @material-ui/core's Dialog component
 */
const Modal = ({ open, onClose, children, classes, hideOverflow, ...otherProps }) => (
  <Dialog
    open={open}
    onClose={onClose}
    {...otherProps}
    classes={{ paper: hideOverflow ? classes.hideOverflow : classes.paperNormal }}>
    {children}
  </Dialog>
)

Modal.propTypes = {
  /**
   * Is the modal open
   */
  open: PropTypes.bool,
  /**
   * Function to call when the modal is closed
   */
  onClose: PropTypes.func,
  /**
   * Contents of modal
   */
  children: PropTypes.node,
  /**
   * Classes object supplied by @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * If true, overflowX: is set to 'hidden'
   */
  hideOverflow: PropTypes.bool
}

Modal.defaultProps = {
  open: true,
  hideOverflow: false
}

export default withStyles(classes)(Modal)
export { default as ModalTitle } from './ModalTitle'
export { default as ModalActions } from './ModalActions'
export { default as ModalContent } from './ModalContent'