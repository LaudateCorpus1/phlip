import React from 'react'
import { shallow } from 'enzyme'
import { UserHeader } from '../index'

const props = {
  user: { firstName: 'Test', lastName: 'User', role: 'Coordinator' },
  open: false,
  handleLogoutUser: jest.fn(),
  handleToggleMenu: jest.fn(),
  handleCloseMenu: jest.fn(),
  handleOpenHelpPdf: jest.fn(),
  handleOpenAdminPage: jest.fn()
}

describe('UserHeader', () => {
  test('should render correctly', () => {
    expect(shallow(<UserHeader {...props} />)).toMatchSnapshot()
  })
})