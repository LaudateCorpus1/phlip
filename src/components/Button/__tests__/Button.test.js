import React from 'react'
import { shallow } from 'enzyme'
import { Button } from '../index'

const props = {
  value: 'I am a button',
  color: 'primary',
  raised: true,
  onClick: () => {},
  theme: { palette: { primary: { main: '#3d316a' } } },
  listButton: false,
  style: {}
}

describe('Button component', () => {
  test('should render correctly', () => {
    expect(shallow(<Button {...props} />)).toMatchSnapshot()
  })
})