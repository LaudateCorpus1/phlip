import React from 'react'
import { shallow } from 'enzyme'
import { AppHeader } from '../index'

const props = {
  user: { firstName: 'test', lastName: 'user' },
  tabs: [
    {
      label: 'Project List',
      active: true,
      location: '/home',
      icon: 'dvr'
    },
    {
      label: 'Document Management',
      active: false,
      location: '/docs',
      icon: 'description'
    }
  ],
  onLogoutUser: jest.fn(),
  onDownloadPdf: jest.fn(),
  onToggleMenu: jest.fn(),
  onOpenAdminPage: jest.fn(),
  onTabChange: jest.fn(),
  open: false
}

describe('AppHeader', () => {
  test('it should render correctly', () => {
    expect(shallow(<AppHeader {...props} />)).toMatchSnapshot()
  })

  test('it should call onToggleMenu', () => {

  })
})