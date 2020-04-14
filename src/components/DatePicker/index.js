import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import { ChevronRight, ChevronLeft, Calendar } from 'mdi-material-ui'
import moment from 'moment'

/**
 * GUI DatePicker Input wrapper for @material-ui/core-picker's date picker
 */
export class DatePicker extends PureComponent {
  render() {
    const {
      label, name, error, dateFormat, disabled, required, value, onChange, onInputChange,
      InputAdornmentProps, inputProps, containerProps, ...otherProps
    } = this.props

    const displayValue = moment(value).format('MM/DD/YYYY') === 'Invalid date' ? value : moment(value).format('MM/DD/YYYY')
    const mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

    return (
      <FormControl error={Boolean(error)} disabled={disabled} {...containerProps}>
        <MuiDatePicker
          label={label}
          style={{ marginTop: 16, ...otherProps.style }}
          format={dateFormat}
          name={name}
          keyboardIcon={<Calendar />}
          rightArrowIcon={<ChevronRight />}
          leftArrowIcon={<ChevronLeft />}
          keyboard
          mask={mask}
          onChange={onChange}
          value={value}
          autoOk
          InputLabelProps={{ shrink: true, required, error: Boolean(error) }}
          InputProps={{
            onChange: onInputChange,
            value: displayValue,
            inputProps: { mask, readOnly: false, ...inputProps }
          }}
          InputAdornmentProps={InputAdornmentProps}
          {...otherProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )
  }
}

DatePicker.propTypes = {
  /**
   * Label for date picker input
   */
  label: PropTypes.string,
  /**
   * name attribute for input
   */
  name: PropTypes.string,
  /**
   * Error displayed in helper text
   */
  error: PropTypes.string,
  /**
   * Format the dates should be in
   */
  dateFormat: PropTypes.string,
  /**
   * Whether or not the input is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Whether or not the input is required
   */
  required: PropTypes.bool,
  /**
   * Value of the date picker input. Can be string or date type
   */
  value: PropTypes.any,
  /**
   * Function called when the user changes the input and the new value is valid
   */
  onChange: PropTypes.func,
  /**
   * Function that is called when the value changes, regardless of validity
   */
  onInputChange: PropTypes.func,
  /**
   * Any other props to pass to the input html element
   */
  inputProps: PropTypes.object,
  /**
   * props to be passed to input adornment component
   */
  InputAdornmentProps: PropTypes.object,
  /**
   * Props to be passed to container FormControl component
   */
  containerProps: PropTypes.object
}

export default DatePicker