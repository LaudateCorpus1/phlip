import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

/**
 * Simple wrapper for @material-ui/core's TextField component
 */
export const SimpleInput = props => {
  const {
    value, onChange, name, multiline, shrinkLabel, placeholder,
    error, helperText, label, InputProps, ...otherProps
  } = props

  return (
    <TextField
      value={value}
      onChange={onChange}
      multiline={multiline}
      InputLabelProps={{ shrink: shrinkLabel }}
      placeholder={placeholder}
      label={label}
      name={name}
      fullWidth
      helperText={helperText}
      error={error}
      InputProps={InputProps}
      {...otherProps}
    />
  )
}

SimpleInput.propTypes = {
  /**
   * Value of text field
   */
  value: PropTypes.string,
  /**
   * Function to call when text input changes
   */
  onChange: PropTypes.func,
  /**
   * Name of input element
   */
  name: PropTypes.string,
  /**
   * Whether or not to allow multiple lines
   */
  multiline: PropTypes.bool,
  /**
   * Whether or not to shrink the label of the input
   */
  shrinkLabel: PropTypes.bool,
  /**
   * Placeholder text for input
   */
  placeholder: PropTypes.string,
  /**
   * Whether or not there's an error with the form
   */
  error: PropTypes.bool,
  /**
   * Text to display below input
   */
  helperText: PropTypes.string,
  /**
   * Label for input
   */
  label: PropTypes.string,
  /**
   * Props to pass to @material-ui/core Input component
   */
  InputProps: PropTypes.object
}

SimpleInput.defaultProps = {
  multiline: true
}

export default SimpleInput