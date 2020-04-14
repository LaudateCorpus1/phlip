import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Simple checkbox input type and label
 */
export const RadioButtonLabel = props => {
  const { onChange, checked, label, classes, disabled, style, labelStyle } = props
  
  return (
    <FormControlLabel
      style={labelStyle}
      control={
        <Radio
          checked={checked}
          classes={{ checked: classes.checked }}
          disabled={disabled}
          onChange={onChange}
          style={style}
        />
      }
      label={label}
    />
  )
}

RadioButtonLabel.propTypes = {
  /**
   * Function to handle if input changes
   */
  onChange: PropTypes.func,
  /**
   * Whether this radio button is selected
   */
  checked: PropTypes.bool,
  /**
   * Input label for checkbox
   */
  label: PropTypes.any,
  /**
   * Style classes (comes from @material-ui/core)
   */
  classes: PropTypes.object,
  /**
   * Whether or not the checkbox should be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Style to apply to checkbox, if any
   */
  style: PropTypes.object,
  /**
   * Style to apply to the label container component
   */
  labelStyle: PropTypes.object
}

export default withStyles(styles)(RadioButtonLabel)
