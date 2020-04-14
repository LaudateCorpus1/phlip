import React from 'react'
import { shallow } from 'enzyme'
import { DatePicker } from '../index'

const props = {
  value: 1556166912,
  onChange: () => {},
  name: 'date-picker',
  label: 'Date picker',
  disabled: false,
  required: false,
  dateFormat: 'MM/DD/YYYY'
}

describe('DatePicker component', () => {
  test('should render correctly', () => {
    expect(shallow(<DatePicker {...props} />)).toMatchSnapshot()
  })
})
