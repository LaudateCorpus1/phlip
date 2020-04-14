import React from 'react'
import PropTypes from 'prop-types'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const columns = [
  { key: 'avatar', label: '', style: { width: '1%' } },
  { key: 'lastName', label: 'Name', hasSort: true },
  { key: 'email', label: 'Email', hasSort: false },
  { key: 'role', label: 'Role', hasSort: true },
  { key: 'edit', label: '', hasSort: false }
]

const UserTableHead = ({ onRequestSort, sortBy, direction }) => {
  return (
    <TableRow key="headers" style={{ width: '100%' }}>
      {columns.map(c => (
        <TableCell key={c.key} id={c.key} style={{ ...c.style }} scope="col" padding="default">
          {c.hasSort ? (
            <TableSortLabel active={sortBy === c.key} style={{ color: 'inherit' }} direction={direction} onClick={onRequestSort(c.key)}>
              {c.label}
            </TableSortLabel>
          ) : c.label}
        </TableCell>
      ))}
    </TableRow>
  )
}

UserTableHead.propTypes = {
  onRequestSort: PropTypes.func,
  sortBy: PropTypes.string,
  direction: PropTypes.string
}

export default UserTableHead