import React from 'react'
import { shallow } from 'enzyme'
import { DocumentContents } from '../index'

const props = {
  document: {
    content: {},
    name: 'Test file'
  },
  loading: false
}

describe('DocumentView - DocumentContents', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentContents {...props} />)).toMatchSnapshot()
  })
})