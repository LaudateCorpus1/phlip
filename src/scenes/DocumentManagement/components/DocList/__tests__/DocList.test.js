import React from 'react'
import { shallow } from 'enzyme'
import { DocList } from '../index'

const props = {
  documents: [{ name: 'Doc', _id: '1' }],
  docs: [],
  page: 0,
  rowsPerPage: '10',
  onSelectAllFiles: () => {},
  onSelectOneFile: () => {},
  docCount: 1,
  onChangePage: () => {},
  onChangeRows: () => {},
  allSelected: false
}

describe('DocumentManagement - DocList', () => {
  test('should render correctly', () => {
    expect(shallow(<DocList {...props} />)).toMatchSnapshot()
  })
})
