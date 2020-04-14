import React from 'react'
import { shallow } from 'enzyme'
import { Card } from '../index'

const props = { children: <div>I am card children.</div>, style: {} }

describe('Card component', () => {
  test('should render correctly', () => {
    expect(shallow(<Card {...props} />)).toMatchSnapshot()
  })
})