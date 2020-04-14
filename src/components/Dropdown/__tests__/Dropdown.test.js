import React from 'react'
import { shallow } from 'enzyme'
import { Dropdown } from '../index'

const props = {
  shrinkLabel: true,
  required: false,
  options: [{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }],
  meta: { touched: false, error: undefined },
  label: '',
  displayEmpty: false,
  fullWidth: false,
  input: { value: 1 },
  id: 'test-dropdown',
  classes: {
    disabled: 'class-disabled',
    icon: 'class-icon',
    disabledIcon: 'class-disabled-icon',
    disabledLabel: 'class-disabled-label'
  }
}

describe('Dropdown', () => {
  test('should render correctly', () => {
    expect(shallow(<Dropdown {...props} />)).toMatchSnapshot()
  })
})
