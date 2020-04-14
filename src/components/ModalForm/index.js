import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import Button from 'components/Button'
import Form from 'components/Form'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  actions: {
    margin: '24px'
  }
}

/**
 * Form inside of a modal connected to redux-form, similar to FormModal. Differences are that
 * with this component all content for title, content, etc. are passed as props instead of children
 */
export const ModalForm = props => {
  const {
    handleSubmit, classes, form, onClose, open, actions, title,
    width, height, children, asyncValidate, asyncBlurFields, initialValues, edit
  } = props

  return (
    <Dialog open={open} onClose={onClose}>
      <Form
        onSubmit={handleSubmit}
        form={form}
        asyncValidate={asyncValidate}
        asyncBlurFields={asyncBlurFields}
        initialValues={initialValues}
        style={{ width, height }}>
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>{children}</DialogContent>
        <DialogActions classes={{ root: classes.actions }}>
          {edit && actions.map(action => (
            <Button
              key={action.value}
              raised={false}
              value={action.value}
              type={action.type}
              color="accent"
              disabled={action.disabled || false}
              onClick={action.onClick}
            />
          ))}
        </DialogActions>
      </Form>
    </Dialog>
  )
}

ModalForm.propTypes = {
  /**
   * Function to call when the form is submitted
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * Name of form for redux-form
   */
  form: PropTypes.string.isRequired,
  /**
   * Function to call when the modal is closed
   */
  onClose: PropTypes.func,
  /**
   * Whether or not the modal is open
   */
  open: PropTypes.bool,
  /**
   * Modal actions for the form
   */
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Title of the form
   */
  title: PropTypes.string,
  /**
   * Width of the form / modal
   */
  width: PropTypes.string,
  /**
   * Height of the form / modal
   */
  height: PropTypes.string,
  /**
   * Contents of the form
   */
  children: PropTypes.node,
  /**
   * Function to call to asynchronously validate the form (used by redux-form)
   */
  asyncValidate: PropTypes.any,
  /**
   * Fields to handle asynchrounously on blur (used by redux-form)
   */
  asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
  /**
   * Initial values of form
   */
  initialValues: PropTypes.object,
  /**
   * Is the form in edit mode
   */
  edit: PropTypes.bool,
  /**
   * Style classes object supplied by @material-ui/core
   */
  classes: PropTypes.object
}

ModalForm.defaultProps = {
  edit: true
}

export default withStyles(styles)(ModalForm)