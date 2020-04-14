import React from 'react'
import { shallow } from 'enzyme'
import { SearchBox } from '../index'

const props = {
  form: {
    uploadedBy: 'test',
    uploadedDate: '10/10/2010',
    name: 'document'
  },
  searchValue: ''
}

describe('DocumentManagement - SearchBox', () => {
  test('should render correctly', () => {
    expect(shallow(<SearchBox {...props} />)).toMatchSnapshot()
  })
})