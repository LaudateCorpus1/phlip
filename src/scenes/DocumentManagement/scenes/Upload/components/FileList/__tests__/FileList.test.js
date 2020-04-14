import React from 'react'
import { shallow } from 'enzyme'
import { FileList } from '../index'

const props = {
  selectedDocs: [],
  handleRemoveDoc: jest.fn(),
  toggleRowEditMode: jest.fn(),
  onGetSuggestions: jest.fn(),
  onClearSuggestions: jest.fn(),
  handleDocPropertyChange: jest.fn(),
  invalidFiles: []
}

describe('Upload -- FileList', () => {
  test('should render correctly', () => {
    expect(shallow(<FileList {...props} />)).toMatchSnapshot()
  })
})
