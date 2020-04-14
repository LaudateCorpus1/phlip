import React from 'react'
import { shallow } from 'enzyme'
import { ValidationTable } from '../index'

const props = {
  questionFlags: [{ raisedBy: { userId: 1 } }],
  userImages: {
    1: { avatar: 1, userId: 1, firstName: 'test', lastName: 'user', initials: 'TU', username: 'test user' }
  },
  mergedUserQuestions: {}
}

describe('QuestionCard - ValidationTable', () => {
  test('should render correctly', () => {
    expect(shallow(<ValidationTable {...props} />)).toMatchSnapshot()
  })
})
