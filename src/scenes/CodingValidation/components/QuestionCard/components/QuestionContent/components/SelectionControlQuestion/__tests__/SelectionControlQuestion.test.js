import React from 'react'
import { shallow } from 'enzyme'
import { SelectionControlQuestion } from '../index'

const props = {
  choices: [],
  userAnswers: {
    answers: {
      10: {
        annotations: []
      },
      3: {
        annotations: []
      },
      1: {
        annotations: []
      }
    }
  },
  onChange: jest.fn(),
  onChangePincite: jest.fn(),
  mergedUserQuestions: null,
  disableAll: false,
  userImages: {},
  question: {},
  classes: {},
  enabledAnswerId: 3,
  onToggleAnnotationMode: jest.fn(),
  onToggleViewAnnotations: jest.fn(),
  onMouseInAnswerChoice: jest.fn(),
  onMouseOutAnswerChoice: jest.fn(),
  annotationModeEnabled: false,
  areDocsEmpty: false,
  hoveredAnswerChoice: 1,
  user: { id: 5 }
}

describe('QuestionCard - QuestionContent - SelectionControlQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<SelectionControlQuestion {...props} />)).toMatchSnapshot()
  })

  test('should call onToggleAnnotationMode when \'Pencil\' button is clicked', () => {
    const spy = jest.spyOn(props, 'onToggleAnnotationMode')
    const wrapper = shallow(
      <SelectionControlQuestion
        {...props}
        choices={[{ id: 1, text: 'answer choice 1' }]}
      />
    )
    const button = wrapper.find('AnnotationControls').dive().find('IconButton').at(1)
    button.simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })
})
