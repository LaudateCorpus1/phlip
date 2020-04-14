import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Basic radio button form group
 */
export const RadioGroup = ({ choices, selected, onChange, error, required, helperText, label, classes }) => {
  return (
    <FormControl component="fieldset" required={required} error={error}>
      <InputLabel shrink={true} required={required} style={{ position: 'relative' }}>{label}</InputLabel>
      <FormGroup>
        {choices.map(choice => (
          <div key={choice.type} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              onChange={onChange(choice.type)}
              checked={selected === choice.type}
              control={<Radio classes={{ checked: classes.checked }} />}
              label={choice.text}
              disabled={choice.disabled}
            />
          </div>
        ))}
        <FormHelperText>{error && helperText}</FormHelperText>
      </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
  /**
   * Array of choices to render as radio button inputs
   */
  choices: PropTypes.array,
  /**
   * Type of the currently selected radio button
   */
  selected: PropTypes.any,
  /**
   * Function to call when a radio button is selected
   */
  onChange: PropTypes.func,
  /**
   * Whether or not there's a form error (renders helpText and labels are made red)
   */
  error: PropTypes.bool,
  /**
   * Whether or not input is required
   */
  required: PropTypes.bool,
  /**
   * Helper text to display if there's an error
   */
  helperText: PropTypes.string,
  /**
   * Label for the form group
   */
  label: PropTypes.string,
  /**
   * Style classes from @material-ui/core
   */
  classes: PropTypes.object
}

export default withStyles(styles)(RadioGroup)