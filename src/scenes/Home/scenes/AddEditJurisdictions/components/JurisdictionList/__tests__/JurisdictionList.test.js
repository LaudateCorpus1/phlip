import React from 'react'
import { shallow } from 'enzyme'
import { JurisdictionList } from '../index'

const props = {
  jurisdictions: [],
  onOpenForm: () => {},
  project: {}
}

describe('Home scene - AddEditJurisdictions - JurisdictionList', () => {
  test('should render correctly', () => {
    expect(shallow(<JurisdictionList {...props} />)).toMatchSnapshot()
  })
})