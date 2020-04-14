import React from 'react'
import PropTypes from 'prop-types'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import TextLink from 'components/TextLink'
import Avatar from 'components/Avatar'
import { commonHelpers, normalize } from 'utils'

const UserTableBody = ({ users }) => {
  return (
    users.map(user => {
      const generateKeyAndId = commonHelpers.generateUniqueProps(user.id)
      return (
        <TableRow key={user.id}>
          <TableCell {...generateKeyAndId('avatar')} style={{ width: 1 }}>
            <Avatar
              cardAvatar
              avatar={user.avatar}
              userName={`${user.firstName} ${user.lastName}`}
              initials={normalize.getInitials(user.firstName, user.lastName)}
            />
          </TableCell>
          <TableCell {...generateKeyAndId('name')} header="name" padding="default">
            <span>{user.firstName} {user.lastName}</span>
          </TableCell>
          <TableCell {...generateKeyAndId('email')} header="email" padding="default">{user.email}</TableCell>
          <TableCell {...generateKeyAndId('role')} header="role" padding="default">
            <span style={{ fontStyle: 'italic' }}>{user.role}</span>
          </TableCell>
          <TableCell {...generateKeyAndId('edit')} padding="default" header="edit">
            <TextLink aria-label="Edit user" to={'/admin/edit/user/' + user.id}>Edit</TextLink>
          </TableCell>
        </TableRow>
      )
    })
  )
}

UserTableBody.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default UserTableBody