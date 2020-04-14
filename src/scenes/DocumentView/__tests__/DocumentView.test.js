import React from 'react'
import { shallow } from 'enzyme'
import { DocumentView } from '../index'

const props = {
  document: {
    content: {},
    name: 'Test file'
  },
  history: {},
  location: {
    state: {
      document: { _id: 1234 }
    }
  },
  documentRequestInProgress: false,
  actions: {
    getDocumentContentsRequest: jest.fn(),
    initState: jest.fn()
  }
}

describe('DocumentView scene', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentView {...props} />)).toMatchSnapshot()
  })
})
