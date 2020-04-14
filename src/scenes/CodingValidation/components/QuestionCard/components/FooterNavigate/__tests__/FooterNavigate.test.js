import React from 'react'
import { shallow } from 'enzyme'
import { FooterNavigate } from '../index'

const props = {
  currentIndex: 0,
  totalLength: 1,
  getQuestion: jest.fn()
}

describe('CodingValidation -- FooterNavigate component', () => {
  test('should render correctly', () => {
    expect(shallow(<FooterNavigate {...props} />)).toMatchSnapshot()
  })
})
