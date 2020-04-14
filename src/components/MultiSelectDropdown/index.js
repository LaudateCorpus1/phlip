import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  disabled: {
    color: 'black'
  },
  disabledIcon: {
    display: 'none'
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 4,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

const MultiSelectDropdown = props => {
  const {
    input, selected, label, id,
    classes, disabled, options, required,
    meta: { touched, error, active, warning }, ...otherProps } = props

  const menuItems = options.map(option => (
    <MenuItem key={option.value} value={option.value}>
      <Checkbox checked={selected.includes(option.value)} />{option.label}
    </MenuItem>
  ))

  return (
    <FormControl style={{ width: '100%' }} error={Boolean(touched && error && !active || warning)}>
      <InputLabel htmlFor={id} shrink={input.value.length > 0} required={required}>{label}</InputLabel>
      <Select
        {...input}
        multiple
        value={input.value || []}
        classes={{ disabled: classes.disabled, icon: disabled ? classes.disabledIcon : classes.icon }}
        disabled={disabled}
        input={<Input id={id} />}
        onBlur={() => input.onBlur()}
        renderValue={selection => selection.join(', ')}
        {...otherProps}>{menuItems}
      </Select>
      {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

MultiSelectDropdown.propTypes = {
  input: PropTypes.object,
  selected: PropTypes.any,
  label: PropTypes.string,
  id: PropTypes.string,
  meta: PropTypes.object,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  options: PropTypes.object,
  required: PropTypes.bool
}

MultiSelectDropdown.defaultProps = {}

export default withStyles(styles)(MultiSelectDropdown)