import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiMenu } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

/**
 * Displays a menu of menuitems as a popover - wrapper for @material-ui/core's Menu component
 */
export const Menu = ({ open, anchorEl, id, onClose, items, ...otherProps }) => {
  return (
    <MuiMenu
      open={open}
      anchorEl={anchorEl}
      id={id}
      onClose={onClose}
      {...otherProps}>
      {items.map(item => (
        <MenuItem onClick={item.onClick} key={item.key}>
          {item.label}
        </MenuItem>
      ))}
    </MuiMenu>
  )
}

Menu.propTypes = {
  /**
   * Is the menu open
   */
  open: PropTypes.bool,
  /**
   * Anchor element for the menu popover
   */
  anchorEl: PropTypes.any,
  /**
   * ID of the menu list
   */
  id: PropTypes.string,
  /**
   * Function to call when the menu is closed
   */
  onClose: PropTypes.func,
  /**
   * The items to display in the menu
   */
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
    key: PropTypes.any
  }))
}

Menu.defaultProps = {
  open: false
}

export default Menu
