import React from 'react'
import { shallow } from 'enzyme'
import { BulkModal } from '../index'

const props = {
  suggestions: [],
  searchValue: '',
  onClearSuggestions: jest.fn(),
  onGetSuggestions: jest.fn(),
  onSearchValueChange: jest.fn(),
  onSuggestionSelected: jest.fn(),
  bulkType: 'approve',
  docCount: 1,
  onCloseModal: jest.fn(),
  open: true,
  buttonInfo: { inProgress: false, diabled: false },
  onConfirmAction: jest.fn(),
  ownerList: ['Tim Nguyen']
}

describe('DocumentManagement - BulkModal', () => {
  test('should render correctly', () => {
    expect(shallow(<BulkModal {...props} />)).toMatchSnapshot()
  })
})
