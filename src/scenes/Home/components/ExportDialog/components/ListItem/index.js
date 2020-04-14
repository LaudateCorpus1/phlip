import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiListItem } from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { Avatar, CircularLoader, FlexGrid, IconButton } from 'components'

/**
 * Wrapper for the list items in the export dialog / sections
 * @param props
 * @constructor
 */
export const ListItem = props => {
  const { inProgress, disabled, onExport, item, showAvatar, isSubItem } = props
  const listItemStyle = isSubItem
    ? { paddingTop: 8, paddingBottom: 8, fontSize: '.875rem' }
    : { padding: '12px 24px', fontSize: '1rem' }
  
  return (
    <MuiListItem style={listItemStyle}>
      <FlexGrid container type="row" align="center" style={{ width: '100%' }}>
        {showAvatar && <Avatar small userId={item.userId} {...item.avatarInfo} />}
        <Typography style={{ flex: '1 1 auto', fontSize: listItemStyle.fontSize, padding: isSubItem ? '0 16px' : 0 }}>
          {item.displayText}
        </Typography>
        {!inProgress &&
        <IconButton iconStyle={{ color: disabled ? 'unset' : 'black' }} disabled={disabled} onClick={onExport}>
          file_download
        </IconButton>}
        {inProgress && <CircularLoader type="indeterminate" size={17} />}
      </FlexGrid>
    </MuiListItem>
  )
}

ListItem.propTypes = {
  /**
   * Whether or not an export request is in progress for this item
   */
  inProgress: PropTypes.bool,
  /**
   * If item action should be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Function to call when exporting for this item
   */
  onExport: PropTypes.func,
  /**
   * Item information
   */
  item: PropTypes.object,
  /**
   * Whether or not to show an avatar for this item
   */
  showAvatar: PropTypes.bool,
  /**
   * Whether it's a sub item
   */
  isSubItem: PropTypes.bool
}

ListItem.defaultProps = {
  isSubItem: true,
  showAvatar: true
}

export default ListItem
