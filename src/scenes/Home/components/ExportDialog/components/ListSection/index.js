import React from 'react'
import PropTypes from 'prop-types'
import { Icon, IconButton } from 'components'
import List from '@material-ui/core/List'
import { default as MuiListItem } from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '../ListItem'

/**
 * Renders the expandable part for a export dialog list section
 * @param props
 * @returns {*}
 * @constructor
 */
export const ListSection = props => {
  const { users, section, expanded, sectionText, onExport, onExpand, inProgress } = props
  const validatorUser = {
    avatarInfo: {
      initials: <Icon size={20} color="white" style={{ fontWeight: 800 }}>check</Icon>,
      style: { backgroundColor: '#80d134' },
      avatar: ''
    },
    userId: null,
    firstName: 'Validated',
    lastName: 'Codes'
  }
  const allUsers = [...users, validatorUser]
  
  return (
    <>
      <MuiListItem onClick={onExpand(section)} selected={expanded}>
        <ListItemText primary={sectionText} />
        <IconButton iconStyle={{ color: 'black' }}>
          {expanded ? 'expand_less' : 'expand_more'}
        </IconButton>
      </MuiListItem>
      <Collapse in={expanded}>
        <List component="div" disablePadding>
          {allUsers.map(user => {
            const userInProgress = inProgress.type !== section
              ? false
              : user.userId === null
                ? inProgress.user === 'val'
                : inProgress.user === user.userId
            
            return (
              <ListItem
                key={`${section}-${user.userId}`}
                isUser={user.userId !== null}
                item={{ ...user, displayText: `${user.firstName} ${user.lastName}` }}
                inProgress={userInProgress}
                disabled={inProgress.type !== null && !userInProgress}
                onExport={onExport(section, user.userId === null ? null : user)}
              />
            )
          })}
        </List>
      </Collapse>
    </>
  )
}

ListSection.propTypes = {
  /**
   * Is this section expanded
   */
  expanded: PropTypes.bool,
  /**
   * List of users available for export
   */
  users: PropTypes.array,
  /**
   * String name of section (type of export)
   */
  section: PropTypes.string,
  /**
   * Section list header
   */
  sectionText: PropTypes.string,
  /**
   * User clicked the download button for a user or validator
   */
  onExport: PropTypes.func,
  /**
   * Expand or collapse section
   */
  onExpand: PropTypes.func,
  /**
   * User in progress for export if any
   */
  inProgress: PropTypes.object
}

export default ListSection
