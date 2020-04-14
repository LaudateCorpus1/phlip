import React from 'react'
import PropTypes from 'prop-types'
import DialogContent from '@material-ui/core/DialogContent'

/**
 * Wrapper for @material-ui/core's DialogContent component
 */
export const ModalContent = ({ children, ...otherProps }) => {
  return (
    <DialogContent {...otherProps}>
      {children}
    </DialogContent>
  )
}

ModalContent.propTypes = {
  /**
   * Content of div
   */
  children: PropTypes.any
}

export default ModalContent