import React from 'react'
import { shallow } from 'enzyme'
import { PinciteList } from '../index'

const props = {
  avatarSize: 'small',
  alwaysShow: false,
  answerList: [],
  userImages: {},
  isAnswered: false,
  textFieldProps: {},
  validatorStyles: {}
}

describe('QuestionCard - QuestionContent - PinciteList', () => {
  test('should render correctly', () => {
    expect(shallow(<PinciteList {...props} />)).toMatchSnapshot()
  })
})
