import React from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalContent, ModalActions, ModalTitle } from 'components/Modal'

/**
 * Popup modal alert
 */
export const Alert = props => {
  const { actions, open, title, children, id, onCloseAlert, closeButton, hideClose, ...otherProps } = props
  const closeAction = {
    onClick: onCloseAlert,
    value: 'Cancel',
    type: 'button',
    preferred: actions.findIndex(action => action.preferred) === -1,
    'aria-label': 'Close alert',
    ...closeButton
  }
  
  const allActions = hideClose ? actions : [closeAction, ...actions]
  
  return (
    <Modal open={open} id={id} {...otherProps}>
      {title !== null && <ModalTitle style={{ display: 'flex', alignItems: 'center' }} title={title} />}
      <ModalContent style={{ minWidth: 350 }}>
        {children}
      </ModalContent>
      <ModalActions actions={allActions} />
    </Modal>
  )
}

Alert.propTypes = {
  /**
   * Whether the alert should be open (visible)
   */
  open: PropTypes.bool.isRequired,
  /**
   * Array of objects which are the Alert actions
   */
  actions: PropTypes.array,
  /**
   * Title of the alert
   */
  title: PropTypes.any,
  /**
   * The body of the alert
   */
  children: PropTypes.any,
  /**
   * The id of the alert
   */
  id: PropTypes.string,
  /**
   * function to call when alert is closed
   */
  onCloseAlert: PropTypes.func,
  /**
   * Overrides the dismiss button
   */
  closeButton: PropTypes.object,
  /**
   * Can override hiding the close button
   */
  hideClose: PropTypes.bool
}

Alert.defaultProps = {
  open: false,
  title: null,
  actions: [],
  closeButton: {},
  hideClose: false
}

export default Alert
