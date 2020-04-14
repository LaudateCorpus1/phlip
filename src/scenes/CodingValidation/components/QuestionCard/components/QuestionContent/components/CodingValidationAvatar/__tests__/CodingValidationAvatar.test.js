import React from 'react'
import { CodingValidationAvatar } from '../index'
import { shallow } from 'enzyme'

describe('CodingValidation - QuestionCard - QuestionContent - CodingValidationAvatar compoent', () => {
  test('should render correctly', () => {
    expect(
      shallow(<CodingValidationAvatar user={{ username: 'Test User', initials: 'TU', avatar: '' }} />)
    ).toMatchSnapshot()
  })
})
