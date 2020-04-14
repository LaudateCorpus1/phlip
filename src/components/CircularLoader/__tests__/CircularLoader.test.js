import React from 'react'
import { shallow } from 'enzyme'
import { CircularLoader } from '../index'

const props = {
  type: 'indeterminate',
  color: 'primary'
}

describe('CircularLoader component', () => {
  test('should render correctly', () => {
    expect(shallow(<CircularLoader {...props} />)).toMatchSnapshot()
  })
})