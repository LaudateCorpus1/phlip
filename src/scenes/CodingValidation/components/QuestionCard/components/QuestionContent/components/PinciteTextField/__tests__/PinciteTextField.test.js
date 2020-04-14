import React from 'react'
import { shallow } from 'enzyme'
import { PinciteTextField } from '../index'

const props = {
  schemeAnswerId: 10,
  pinciteValue: 'this is my pincite',
  handleChangePincite: jest.fn(),
  style: {},
  disabled: false
}

describe('QuestionCard - QuestionContent - PinciteTextField', () => {
  test('should render correctly', () => {
    expect(shallow(<PinciteTextField {...props} />)).toMatchSnapshot()
  })
})
