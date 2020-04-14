import React from 'react'
import { shallow } from 'enzyme'
import { ListSection } from '../index'

const props = {
  users: [],
  section: 'numeric',
  expanded: true,
  sectionText: 'Coded Data - Numeric',
  onExport: jest.fn(),
  onExpand: jest.fn(),
  inProgress: {
    type: null,
    user: null
  }
}

describe('Home - Export Dialog - List Section', () => {
  test('should render correctly', () => {
    expect(shallow(<ListSection {...props} />)).toMatchSnapshot()
  })
})
