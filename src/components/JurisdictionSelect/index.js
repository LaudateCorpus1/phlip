import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  icon: {
    position: 'absolute',
    right: 0,
    top: 4,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

/**
 * Select input used in Coding / Validation for selecting current jurisdiction
 */
export class JurisdictionSelect extends Component {
  constructor(props, context) {
    super(props, context)
    this.jurisdictionRef = undefined
  }

  componentDidMount() {
    this.jurisdictionRef.focus()
  }

  /**
   * This sets the ref for the selectable div. It is used to automatically set the focus to the input.
   * @public
   * @param node
   */
  setJurisdictionRef = node => {
    if (node) {
      this.jurisdictionRef = findDOMNode(node).childNodes[0].childNodes[0]
    }
  }

  render() {
    const { value, onChange, options, theme, ...otherProps } = this.props

    const menuItems = options.map(option => {
      return (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
          <Typography variant="caption" style={{ paddingLeft: 10, color: theme.palette.greyText }}>
            ({new Date(option.startDate).toLocaleDateString()} - {new Date(option.endDate).toLocaleDateString()})
          </Typography>
        </MenuItem>
      )
    })

    const MenuProps = {
      PaperProps: {
        style: {
          zIndex: 10000,
          transform: 'translate3d(0, 0, 0)'
        }
      }
    }

    return (
      <Select
        input={<Input id="jurisdiction-select-list" name="jurisdiction" autoFocus />}
        value={value}
        autoFocus={true}
        onChange={onChange}
        MenuProps={MenuProps}
        ref={this.setJurisdictionRef}
        renderValue={value => {
          const option = options.find(option => option.id === value)
          return option.name
        }}
        {...otherProps}>
        {menuItems}
      </Select>
    )
  }
}

JurisdictionSelect.propTypes = {
  /**
   * ID of the input
   */
  id: PropTypes.any,
  /**
   * Function to change when the selection changes
   */
  onChange: PropTypes.func,
  /**
   * Value selected
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Array of options to populate the list
   */
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    startDate: PropTypes.any,
    endDate: PropTypes.any,
    id: PropTypes.any
  })).isRequired,
  /**
   * Theme object supplied by @material-ui/core
   */
  theme: PropTypes.object
}

export default withStyles(styles, { withTheme: true })(JurisdictionSelect)