import React from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import FlexGrid from 'components/FlexGrid'

/**
 * Text field input with form control wrapper, set up for use in redux-form
 */
export const TextInput = props => {
  const {
    label, type, input, disabled, multiline, shrinkLabel, required,
    meta: { active, touched, error, warning }, smallLabel,
    ...custom
  } = props
  
  const hasError = Boolean(touched && error && !active || warning)
  const Container = shrinkLabel ? FlexGrid : FormControl
  const containerProps = shrinkLabel ? { container: true } : { disabled, error: hasError, fullWidth: true }
  
  return (
    <Container {...containerProps}>
      {label && <InputLabel
        {...{
          htmlFor: input.name,
          error: hasError,
          ...(shrinkLabel && { shrink: smallLabel }),
          disabled,
          required
        }}>
        {label}
      </InputLabel>}
      <Input
        {...input}
        {...custom}
        type={type}
        id={input.name}
        disabled={disabled}
        multiline={multiline}
        inputProps={{ 'aria-label': label }}
      />
      {hasError && <FormHelperText error={hasError}>{error}</FormHelperText>}
    </Container>
  )
}

TextInput.propTypes = {
  /**
   * Label for input form element
   */
  label: PropTypes.string,
  /**
   * Type of input
   */
  type: PropTypes.string,
  /**
   * Object provided by redux-form, includes name, value and onChange
   */
  input: PropTypes.any,
  /**
   * Whether or not the input should be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Whether or not the shrink the input label
   */
  shrinkLabel: PropTypes.bool,
  /**
   * Whether or not the input is required
   */
  required: PropTypes.bool,
  /**
   * Meta information like error provided by redux-form
   */
  meta: PropTypes.object,
  /**
   * Whether or not the input should allow multiline
   */
  multiline: PropTypes.bool,
  /**
   * Style classes from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Whether or not to make the text of the input label small
   */
  smallLabel: PropTypes.bool
}

TextInput.defaultProps = {
  meta: {},
  smallLabel: false
}

export default TextInput
