import React from 'react'
import { shallow } from 'enzyme'
import { AuthenticatedRoute } from '../index'

const props = {
  location: {
    pathname: '/home'
  },
  user: {
    role: 'Admin'
  },
  component: <div />
}

describe('AuthenticatedRoute', () => {
  test('should render correctly', () => {
    expect(shallow(<AuthenticatedRoute {...props} />)).toMatchSnapshot()
  })
})
