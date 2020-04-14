import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import FlexGrid from 'components/FlexGrid'

/* istanbul ignore next */
const styles = theme => ({
  disabled: {
    color: 'black',
    opacity: .5
  },
  disabledLabel: {
    color: 'rgba(0,0,0,.42)'
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

/**
 * Basic dropdown component, can be used with ReduxForm `<Field />` component
 */
export const Dropdown = props => {
  const {
    input, label, id, defaultValue, classes, shrinkLabel, formControlStyle,
    disabled, options, required, displayEmpty, fullWidth, ...otherProps
  } = props
  
  return (
    <FlexGrid
      container
      align={fullWidth ? 'stretch' : 'flex-start'}
      style={{ minWidth: 120, ...formControlStyle }}
      id={`${id}-container`}>
      {label && <InputLabel htmlFor={id} shrink={shrinkLabel} required={required}>{label}</InputLabel>}
      <Select
        input={<Input id={id} />}
        value={input.value ? input.value : defaultValue}
        onChange={event => input.onChange(event.target.value)}
        classes={{
          disabled: classes.disabled,
          icon: disabled ? classes.disabledIcon : classes.icon
        }}
        displayEmpty={displayEmpty}
        disabled={disabled}
        {...otherProps}>
        {options.map((option, index) => (
          <MenuItem key={`menu-item-${index}`} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FlexGrid>
  )
}

Dropdown.propTypes = {
  /**
   * Input object, has property 'value' and 'onChange'
   */
  input: PropTypes.object,
  /**
   * Input label for dropdown
   */
  label: PropTypes.string,
  /**
   * ID of dropdown input
   */
  id: PropTypes.any,
  /**
   * Default value for the dropdown
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Whether or not to shrink the input label
   */
  shrinkLabel: PropTypes.bool,
  /**
   * Whether or not the dropdown input is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  meta: PropTypes.object,
  /**
   * List of options for the dropdown
   */
  options: PropTypes.arrayOf(PropTypes.object),
  /**
   * Is the input dropdown required
   */
  required: PropTypes.bool,
  /**
   * Whether or not to make it full width
   */
  fullWidth: PropTypes.bool
}

Dropdown.defaultProps = {
  shrinkLabel: true,
  required: false,
  options: [],
  meta: { touched: false, error: undefined },
  label: '',
  displayEmpty: false,
  fullWidth: false,
  disabled: false
}

export default withStyles(styles)(Dropdown)
