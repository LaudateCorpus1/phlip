import React from 'react'
import { shallow } from 'enzyme'
import { HeaderTabs } from '../index'

const props = {
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
  onTabChange: () => {}
}

describe('HeaderTabs', () => {
  test('should render correctly', () => {
    expect(shallow(<HeaderTabs {...props} />)).toMatchSnapshot()
  })
})