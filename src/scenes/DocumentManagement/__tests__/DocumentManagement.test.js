import React from 'react'
import { shallow } from 'enzyme'
import { DocumentManagement } from '../index'

const props = {
  page: 0,
  rowsPerPage: '10',
  documents: [],
  allSelected: false,
  docCount: 0,
  actions: {
    getDocumentsRequest: jest.fn(),
    handleSelectAll: jest.fn(),
    handleSearchFieldChange: jest.fn(),
    handlePageChange: jest.fn(),
    handleRowsChange: jest.fn(),
    handleSelectOneFile: jest.fn()
  },
  jurisdictionAutocompleteProps: {
    suggestions: [
      { id: 2932 },
      { id: 25332 },
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ],
    selectedSuggestion: {},
    searchValue: ''
  },
  projectAutocompleteProps: {
    suggestions: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }],
    selectedSuggestion: {},
    searchValue: ''
  },
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  }
}

describe('Document Management scene', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentManagement {...props} />)).toMatchSnapshot()
  })
})
