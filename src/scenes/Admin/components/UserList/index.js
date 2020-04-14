import React from 'react'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import UserTableBody from './components/UserTableBody'
import UserTableHead from './components/UserTableHead'
import { FlexGrid, Table } from 'components'

export const UserList = props => {
  const { users, sortBy, direction, handleRequestSort } = props
  return (
    <FlexGrid container raised flex>
      <FlexGrid container flex style={{ overflow: 'hidden' }}>
        <Table
          style={{
            borderCollapse: 'separate',
            display: 'block',
            tableLayout: 'auto',
            overflow: 'auto'
          }}
          summary="List of users">
          <TableHead style={{ width: '100%' }}>
            <UserTableHead sortBy={sortBy} direction={direction} onRequestSort={handleRequestSort} />
          </TableHead>
          <TableBody>
            <UserTableBody users={users} />
          </TableBody>
        </Table>
      </FlexGrid>
    </FlexGrid>
  )
}

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  sortBy: PropTypes.string,
  direction: PropTypes.oneOf(['asc', 'desc']),
  handleRequestSort: PropTypes.func
}

export default UserList

