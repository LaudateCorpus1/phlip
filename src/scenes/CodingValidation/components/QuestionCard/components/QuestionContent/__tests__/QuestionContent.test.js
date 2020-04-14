import React from 'react'
import { shallow } from 'enzyme'
import { QuestionContent } from '../index'
import * as questionTypes from 'scenes/CodingValidation/constants'

const props = {
  question: {
    hint: null,
    questionType: questionTypes.MULTIPLE_CHOICE,
    possibleAnswers: [{ id: 1 }]
  }
}

describe('QuestionCard - QuestionContent', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionContent {...props} />)).toMatchSnapshot()
  })
})
