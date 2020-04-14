import React from 'react'
import { shallow } from 'enzyme'
import { TextFieldQuestion } from '../index'

const props = {
  onChange: jest.fn(),
  name: '',
  answerId: 10,
  userImages: {},
  onToggleAnnotationMode: jest.fn(),
  enabledAnswerId: 0,
  annotationModeEnabled: false,
  areDocsEmpty: false,
  mergedUserQuestions: null,
  onToggleViewAnnotations: jest.fn(),
  onMouseInAnswerChoice: jest.fn(),
  onMouseOutAnswerChoice: jest.fn(),
  hoveredAnswerChoice: 1,
  userAnswers: {
    answers: {
      10: {
        annotations: []
      },
      1: {
        annotations: []
      }
    }
  },
  disableAll: false,
  user: { id: 5 }
}

describe('QuestionCard - QuestionContent - TextFieldQuestion', () => {
  test('should render correctly', () => {
    expect(shallow(<TextFieldQuestion {...props} />)).toMatchSnapshot()
  })
  
  test('should call onToggleAnnotationMode when \'Pencil\' button is clicked', () => {
    const spy = jest.spyOn(props, 'onToggleAnnotationMode')
    const wrapper = shallow(<TextFieldQuestion {...props} answerId={1} />)
    
    const button = wrapper.find('AnnotationControls').dive().find('IconButton').at(1)
    button.simulate('click')
    wrapper.update()
    expect(spy).toHaveBeenCalled()
  })
})
