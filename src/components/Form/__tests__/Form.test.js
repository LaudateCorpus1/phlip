import React from 'react'
import { shallow } from 'enzyme'
import { Form } from '../index'

const props = {
  handleSubmit: jest.fn(),
  form: {},
  role: 'form',
  ariaLabelledBy: 'test-form',
  style: {}
}

describe('Form', () => {
  test('should render correctly', () => {
    expect(shallow(<Form {...props}>form</Form>)).toMatchSnapshot()
  })
})
