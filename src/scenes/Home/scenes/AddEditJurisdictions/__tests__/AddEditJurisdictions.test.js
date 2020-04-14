import React from 'react'
import { shallow } from 'enzyme'
import { AddEditJurisdictions } from '../index'
import theme from 'services/theme'

const props = {
  actions: {
    getProjectJurisdictions: jest.fn()
  },
  project: {},
  theme
}

describe('Home scene - AddEditJurisdictions scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditJurisdictions {...props} />)).toMatchSnapshot()
  })
})