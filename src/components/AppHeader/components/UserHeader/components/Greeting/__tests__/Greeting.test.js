import React from 'react'
import { shallow } from 'enzyme'
import { Greeting } from '../index'

const props = {
  firstName: 'Test',
  lastName: 'User',
  role: 'Admin'
}

describe('App Header - User Header - Greeting', () => {
  test('should render correctly', () => {
    expect(shallow(<Greeting {...props} />)).toMatchSnapshot()
  })
})