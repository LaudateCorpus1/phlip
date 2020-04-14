import React from 'react'
import { shallow } from 'enzyme'
import { QuestionRow } from '../index'

const props = {
  item: {
    id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2, ancestorSiblings: [1],
    expanded: true,
    children: [
      { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
    ]
  },
  treeLength: 0,
  onQuestionSelected: () => {}
}

describe('Coding scene - QuestionRow', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionRow {...props} />)).toMatchSnapshot()
  })
})
