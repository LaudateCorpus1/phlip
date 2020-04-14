import React from 'react'
import { shallow } from 'enzyme'
import { JurisdictionForm } from '../index'

const props = {
  form: {
    values: { name: '' }
  },
  formName: 'jurisdictionForm',
  jurisdiction: {},
  jurisdictions: [],
  suggestions: [],
  suggestionValue: '',
  actions: {
    initializeFormValues: () => {}
  },
  location: {
    state: {
      jurisdictionDefined: {
        name: 'Jurisdiction Name'
      }
    }
  },
  project: {
    name: 'test project'
  },
  match: {},
  history: {},
  onCloseModal: () => {}
}

describe('Home scene - AddEditJurisdictions - JurisdictionForm', () => {
  test('should render correctly', () => {
    expect(shallow(<JurisdictionForm {...props} />)).toMatchSnapshot()
  })
})
