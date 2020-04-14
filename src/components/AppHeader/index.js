import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Logo } from 'components'
import HeaderTabs from './components/HeaderTabs'
import UserHeader from './components/UserHeader'
import theme from 'services/theme'

export const AppHeader = props => {
  const { user, tabs, onLogoutUser, onDownloadPdf, onToggleMenu, onOpenAdminPage, onTabChange, open } = props

  const headerStyle = {
    borderRadius: 0,
    position: 'relative',
    boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
    backgroundColor: theme.palette.primary.main,
    padding: '0 30px 0 0',
    height: 43,
    minHeight: 43
  }

  return (
    <FlexGrid container align="center" justify="space-between" type="row" style={headerStyle}>
      <HeaderTabs tabs={tabs} onTabChange={onTabChange} />
      <FlexGrid>
        <Logo height={30} />
      </FlexGrid>
      <UserHeader
        user={user}
        open={open}
        handleLogoutUser={onLogoutUser}
        handleToggleMenu={onToggleMenu}
        handleOpenAdminPage={onOpenAdminPage}
        handleOpenHelpPdf={onDownloadPdf}
        handleTabChange={onTabChange}
      />
    </FlexGrid>
  )
}

AppHeader.propTypes = {
  /**
   * List of tabs for the global navigation menu
   */
  tabs: PropTypes.array,

  /**
   * Whether or not the avatar menu is open
   */
  open: PropTypes.bool,

  /**
   * User currently logged in
   */
  user: PropTypes.object,

  /**
   * Handles when the user click the help pdf menu item
   */
  onDownloadPdf: PropTypes.func,

  /**
   * Handles when the user clicks the logout menu item
   */
  onLogoutUser: PropTypes.func,

  /**
   * Handles when the user clicks the open admin page icon
   */
  onOpenAdminPage: PropTypes.func,

  /**
   * Toggles whether the menu is open or closed
   */
  onToggleMenu: PropTypes.func,

  /**
   * Handles navigation via the global menu
   */
  onTabChange: PropTypes.func
}

export default AppHeader
