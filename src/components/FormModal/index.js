import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import Form from 'components/Form'

/**
 * Display a modal with a redux-form enabled form inside of it
 */
export const FormModal = props => {
  const {
    handleSubmit, form, onClose, open, width, height,
    children, asyncValidate, asyncBlurFields,
    initialValues, validate, maxWidth, style, formStyle
  } = props

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} PaperProps={{ style }}>
      <Form
        ariaLabelledBy="modal-title"
        onSubmit={handleSubmit}
        form={form}
        asyncValidate={asyncValidate}
        asyncBlurFields={asyncBlurFields}
        validate={validate}
        initialValues={initialValues}
        style={{ width, height, ...formStyle }}>
        {children}
      </Form>
    </Dialog>
  )
}

FormModal.propTypes = {
  /**
   * Function to call when the user submits the form
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * Form name
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
   * Width of the form. Will be used in determining the size of the modal
   */
  width: PropTypes.string,
  /**
   * Height of the form. Will be used in determining the size of the modal
   */
  height: PropTypes.string,
  /**
   * Contents of the form
   */
  children: PropTypes.any,
  /**
   * Function to call asynchronously validate the form (used by redux-form)
   */
  asyncValidate: PropTypes.any,
  /**
   * Fields to handle asynchrounously on blur (used by redux-form)
   */
  asyncBlurFields: PropTypes.arrayOf(PropTypes.string),
  /**
   * Initial form values (used by redux-form)
   */
  initialValues: PropTypes.object,
  /**
   * Function to call to validate form (used by redux-form)
   */
  validate: PropTypes.func,
  /**
   * Maximum width of modal
   */
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', false]),
  /*
   * Style to apply to container
   */
  style: PropTypes.object,
  /*
   * Styles to apply to form element
   */
  formStyle: PropTypes.object
}

FormModal.defaultProps = {
  open: true
}

export default FormModal
