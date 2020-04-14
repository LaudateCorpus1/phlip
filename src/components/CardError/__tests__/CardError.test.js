import React from 'react'
import { shallow } from 'enzyme'
import { CardError } from '../index'

const props = {
  children: <div>I am a card error.</div>
}

describe('CardError component', () => {
  test('should render correctly', () => {
    expect(shallow(<CardError {...props} />)).toMatchSnapshot()
  })
})