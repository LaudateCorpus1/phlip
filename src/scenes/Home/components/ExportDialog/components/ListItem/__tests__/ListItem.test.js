import React from 'react'
import { shallow } from 'enzyme'
import { ListItem } from '../index'

const props = {
  onExport: jest.fn(),
  inProgress: false,
  disabled: false,
  item: { displayText: 'Test User', userId: 3 },
  showAvatar: true,
  isSubItem: true
}

describe('Home - Export Dialog - List Item', () => {
  test('should render correctly', () => {
    expect(shallow(<ListItem {...props} />)).toMatchSnapshot()
  })
})
