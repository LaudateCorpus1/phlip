import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Alert from 'components/Alert'
import Typography from '@material-ui/core/Typography'
import Icon from 'components/Icon'

/**
 * HOC for forms to handle checking if there are unsaved changes
 * @param WrappedComponent
 * @returns {FormAlert}
 */
export const withFormAlert = (WrappedComponent) => {
  class FormAlert extends Component {
    constructor(props, context) {
      super(props, context)
      
      this.state = {
        open: false,
        text: '',
        actions: [],
        title: null,
        isReduxForm: this.props.isReduxForm !== false,
        closeButton: {}
      }
    }
  
    /**
     * Closes 'Unsaved Changes' alert
     */
    onClose = () => {
      this.setState({
        open: false,
        text: '',
        actions: [],
        title: null,
        isReduxForm: this.props.isReduxForm !== false,
        closeButton: {}
      })
    }
  
    /**
     * Closes API error alert
     */
    onDismissFormError = () => {
      this.onClose()
      this.props.actions.resetFormError()
    }
  
    /**
     * User continues with exiting even though there are unsaved changes. Closes alert and resets form
     */
    onContinue = () => {
      if (this.state.isReduxForm) {
        this.props.formActions.reset(this.props.formName)
      } else {
        this.props.actions.resetToInitial()
      }
      this.setState({ open: false, text: '', actions: [], title: null })
      this.props.history.goBack()
    }
    
    /**
     * Opens the 'Unsaved changes' alert
     */
    onOpenConfirmAlert = () => {
      this.setState({
        open: true,
        text: 'You will lose unsaved changes. Do you want to continue?',
        onCloseAlert: this.onClose,
        actions: [
          {
            value: 'Continue',
            type: 'button',
            onClick: this.onContinue
          }
        ],
        title: 'Warning',
        closeButton: { value: 'Cancel' }
      })
    }
    
    /**
     * Checks for differences between initial and current values of form to determine if 'Unsaved changes' alert
     * should show
     * @param otherValues
     */
    onCloseModal = (otherValues = {}) => {
      const fields = [...Object.keys(this.props.form.registeredFields), ...Object.keys(otherValues)]
      let shouldOpenAlert = false
      fields.forEach(field => {
        if (this.props.form.initial[field] !== this.props.form.values[field]) {
          shouldOpenAlert = true
        } else if (otherValues.hasOwnProperty(field)) {
          if (otherValues[field] !== this.props.form.initial[field]) {
            shouldOpenAlert = true
          }
        }
      })
      
      if (shouldOpenAlert) {
        this.onOpenConfirmAlert()
      } else {
        this.props.history.goBack()
      }
    }
    
    /**
     * Opens an API error alert
     * @param error
     */
    onSubmitError = error => {
      if (this.state.isReduxForm) {
        this.props.formActions.setSubmitFailed(this.props.formName)
      }
      
      this.setState({
        open: true,
        text: error,
        onCloseAlert: this.onDismissFormError,
        title: (
          <>
            <Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
            Uh-oh! Something went wrong.
          </>
        ),
        closeButton: { value: 'Dismiss' }
      })
    }
    
    render() {
      const { open, title, actions, text, onCloseAlert, closeButton } = this.state
      
      return (
        <>
          <WrappedComponent
            onCloseModal={this.onCloseModal}
            onSubmitError={this.onSubmitError}
            openConfirmAlert={this.onOpenConfirmAlert}
            {...this.props}
          />
          <Alert open={open} title={title} onCloseAlert={onCloseAlert} actions={actions} closeButton={closeButton}>
            <Typography variant="body1">
              {text}
            </Typography>
          </Alert>
        </>
      )
    }
  }
  
  hoistNonReactStatic(FormAlert, WrappedComponent)
  return FormAlert
}

export default withFormAlert
