import React from 'react'
import { SelectInput } from '../index'
import { shallow } from 'enzyme'

const props = {
  canModify: true,
  name: 'possibleAnswers',
  label: 'select-label',
  answerType: 3,
  type: 'text',
  input: {},
  classes: {},
  index: 1,
  currentValue: {},
  meta: {
    active: true,
    touched: true,
    error: false,
    warning: false
  },
  handleDelete: jest.fn(),
  handleUp: jest.fn(),
  handleDown: jest.fn(),
  fields: [],
  isEdit: false
}

describe('AddEditQuestion form -- SelectInput', () => {
  test('should render correctly', () => {
    expect(shallow(<SelectInput {...props} />)).toMatchSnapshot()
  })
})
