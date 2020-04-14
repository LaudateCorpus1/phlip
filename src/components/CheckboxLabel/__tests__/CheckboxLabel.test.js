import React from 'react'
import { shallow } from 'enzyme'
import { CheckboxLabel } from '../index'

const props = {
  input: {},
  label: 'Checkbox here',
  onChange: () => {},
  disabled: false,
  classes: {
    checked: {
      color: '#38a48e'
    }
  }
}

describe('CheckboxLabel component', () => {
  test('should render correctly', () => {
    expect(shallow(<CheckboxLabel {...props} />)).toMatchSnapshot()
  })
})