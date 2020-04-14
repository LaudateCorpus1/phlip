import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import Grid from '@material-ui/core/Grid'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import { Manager, Reference, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Icon, Avatar } from 'components'

export class AvatarMenu extends Component {
  constructor(props, context) {
    super(props, context)
    this.firstMenuItem = null
  }
  
  setFirstMenuItem = element => {
    this.firstMenuItem = findDOMNode(element)
    if (this.props.role === 'Admin' && this.props.open && this.firstMenuItem !== null) {
      this.firstMenuItem.focus()
    }
  }
  
  onKeyPressMenu = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this.props.onToggleMenu()
    }
  }
  
  handleClickAway = () => {
    if (this.props.open) {
      this.props.onToggleMenu()
    }
  }
  
  render() {
    const {
      role, initials, userName, open, onLogoutUser, onOpenAdminPage, onToggleMenu, onOpenHelpPdf, avatar
    } = this.props
    
    const textColor = '#5f6060'
    
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <Grid item style={{ zIndex: 2 }}>
          <Manager>
            <Reference>
              {({ ref }) => {
                return (
                  <div ref={ref}>
                    <Avatar
                      id="avatar-menu-button"
                      onClick={onToggleMenu}
                      onKeyPress={this.onKeyPressMenu}
                      role="button"
                      tabIndex={0}
                      aria-controls="avatar-menu"
                      aria-haspopup={true}
                      aria-owns={open ? 'avatar-user-menu' : null}
                      avatar={avatar}
                      userName={userName}
                      initials={initials || ''}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )
              }}
            </Reference>
            <Popper placement="bottom-end" eventsEnabled={open} style={{ pointerEvents: open ? 'auto' : 'none' }}>
              {({ placement, ref, style }) => {
                return (
                  open &&
                  <div data-placement={placement} style={{ marginTop: 5, ...style }} ref={ref}>
                    <Paper>
                      <MenuList
                        role="menu"
                        aria-expanded={open}
                        id="avatar-user-menu"
                        aria-labelledby="avatar-menu-button">
                        <MenuItem
                          onClick={onOpenAdminPage}
                          key="admin-menu"
                          ref={this.setFirstMenuItem}>
                          <ListItemIcon>
                            <Icon color="accent">person</Icon>
                          </ListItemIcon>
                          <ListItemText
                            style={{ color: textColor }}
                            disableTypography
                            primary={role === 'Admin' ? 'User Management' : 'Profile'}
                          />
                        </MenuItem>
                        <MenuItem
                          onClick={onLogoutUser}
                          key="logout-menu"
                          ref={role === 'Admin' ? null : this.setFirstMenuItem}>
                          <ListItemIcon>
                            <Icon color="accent">exit_to_app</Icon>
                          </ListItemIcon>
                          <ListItemText style={{ color: textColor }} disableTypography primary="Logout" />
                        </MenuItem>
                        <MenuItem onClick={onOpenHelpPdf} key="help-section-pdf">
                          <ListItemIcon>
                            <Icon color="accent">help</Icon>
                          </ListItemIcon>
                          <ListItemText style={{ color: textColor }} disableTypography primary="Help" />
                        </MenuItem>
                      </MenuList>
                    </Paper>
                  </div>
                )
              }}
            </Popper>
          </Manager>
        </Grid>
      </ClickAwayListener>
    )
  }
}

AvatarMenu.propTypes = {
  role: PropTypes.string,
  initials: PropTypes.string,
  open: PropTypes.bool,
  onCloseMenu: PropTypes.func,
  onLogoutUser: PropTypes.func,
  onOpenMenu: PropTypes.func,
  onToggleMenu: PropTypes.func,
  userName: PropTypes.string,
  onOpenAdminPage: PropTypes.func,
  onOpenHelpPdf: PropTypes.func,
  avatar: PropTypes.any
}

AvatarMenu.defaultProps = {
  open: false
}

export default AvatarMenu
