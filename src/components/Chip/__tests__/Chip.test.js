import React from 'react'
import { shallow } from 'enzyme'
import { Chip } from '../index'

const props = {
  text: 'Chip text',
  isFocused: false,
  isDisabled: false,
  handleClick: () => {},
  handleDelete: () => {},
  className: ''
}

describe('Chip', () => {
  test('should render correctly', () => {
    expect(shallow(<Chip {...props} />)).toMatchSnapshot()
  })
})