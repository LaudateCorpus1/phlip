import React from 'react'
import { shallow } from 'enzyme'
import { Autocomplete } from '../index'

const props = {
  suggestions: [],
  classes: {},
  InputProps: {},
  inputProps: {
    value: '',
    onChange: jest.fn()
  },
  handleGetSuggestions: jest.fn(),
  handleClearSuggestions: jest.fn(),
  handleSuggestionSelected: jest.fn(),
  renderSuggestion: jest.fn(),
  getSuggestionValue: jest.fn(),
  showSearchIcon: false,
  theme: {},
  suggestionType: '',
  isSearching: false
}

describe('Autocomplete', () => {
  test('should render correctly', () => {
    expect(shallow(<Autocomplete {...props} />)).toMatchSnapshot()
  })
})
