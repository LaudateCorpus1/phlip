import React from 'react'
import { shallow } from 'enzyme'
import { ApiErrorView } from '../index'

const props = { error: 'This is an error.' }

describe('ApiErrorView component', () => {
  test('should render correctly', () => {
    expect(shallow(<ApiErrorView {...props} />)).toMatchSnapshot()
  })
})