import React from 'react'
import { shallow } from 'enzyme'
import { CodingValidation } from '../index'

const props = {
  project: { id: 1, name: 'Project Test', projectJurisdictions: [{ id: 11 }, { id: 10 }, { id: 20, name: 'florida' }] },
  page: 'coding',
  isValidation: false,
  question: { id: 1, text: 'question!' },
  currentIndex: 0,
  questionOrder: [1],
  showNextButton: false,
  isSchemeEmpty: false,
  areJurisdictionsEmpty: false,
  user: { id: 11, role: 'Admin' },
  selectedCategory: null,
  selectedCategoryId: null,
  schemeError: null,
  gettingStartedText: '',
  answerErrorContent: null,
  apiErrorAlert: {
    open: false,
    text: ''
  },
  match: { url: '/project/1/code', params: { id: 1, view: 'code' } },
  history: {
    replace: jest.fn()
  },
  actions: {
    setPage: jest.fn(),
    getOutlineRequest: jest.fn(),
    onCloseScreen: jest.fn(),
    getPrevQuestion: jest.fn(),
    getNextQuestion: jest.fn(),
    onQuestionSelectedInNav: jest.fn(),
    updateUserAnswer: jest.fn(),
    saveUserAnswerRequest: jest.fn(),
    showQuestionLoader: jest.fn(),
    setHeaderText: jest.fn(),
    onChangeComment: jest.fn(),
    onChangePincite: jest.fn(),
    onChangeCategory: jest.fn(),
    onCloseAlert: jest.fn(),
    onClearAnswer: jest.fn(),
    applyAnswerToAll: jest.fn(),
    showPageLoader: jest.fn(),
    toggleAnnotationMode: jest.fn()
  }
}

describe('CodingValidation', () => {
  test('should render Coding component correctly', () => {
    expect(shallow(<CodingValidation {...props} />)).toMatchSnapshot()
  })
  
  describe('setting page name', () => {
    test('should set document title to code if on coding', () => {
      shallow(
        <CodingValidation
          {...props}
          project={{
            name: 'Blep',
            id: 4,
            projectJurisdictions: []
          }}
        />
      )
      expect(document.title).toEqual('PHLIP - Blep - Code')
    })
    
    test('should set document title to validate if on validation', () => {
      shallow(
        <CodingValidation
          {...props}
          isValidation
          project={{
            name: 'Blep',
            id: 4,
            projectJurisdictions: []
          }}
        />
      )
      expect(document.title).toEqual('PHLIP - Blep - Validate')
    })
  })
  
  describe('unmounting', () => {
    test('should clear the info when leaving the page', () => {
      const spy = jest.spyOn(props.actions, 'onCloseScreen')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.unmount()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('getting outline', () => {
    test('should get outline', () => {
      const spy = jest.spyOn(props.actions, 'getOutlineRequest')
      shallow(<CodingValidation {...props} />)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('setting jurisdiction', () => {
    test('should set it to empty if there are no project jurisdictions', () => {
      const wrapper = shallow(
        <CodingValidation
          {...props}
          project={{
            id: 4,
            name: 'blep',
            projectJurisdictions: []
          }}
        />
      )
      expect(wrapper.state().jurisdiction).toEqual({ id: null })
    })
    
    test('should use route param if one is present', () => {
      const wrapper = shallow(<CodingValidation {...props} match={{ params: { jid: 20 } }} />)
      expect(wrapper.state().jurisdiction).toEqual({ id: 20, name: 'florida' })
    })
    
    test('should use first jurisdiction if no route param is present', () => {
      const wrapper = shallow(<CodingValidation {...props} />)
      expect(wrapper.state().jurisdiction).toEqual({ id: 11 })
    })
  })
  
  describe('changing routes', () => {
    test('should change routes if component updated and has a new question', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.setProps({ question: { id: 32 } })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/11/32' })
      spy.mockReset()
    })
    
    test('should change routes if component is updated and has a new jurisdiction', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.setState({ jurisdiction: { id: 20 } })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/20/1' })
      spy.mockReset()
    })
    
    test('should change routes after load and scheme isn\'t empty', () => {
      const spy = jest.spyOn(props.history, 'replace')
      const wrapper = shallow(<CodingValidation {...props} getRequestInProgress />)
      wrapper.setProps({ getRequestInProgress: false })
      expect(spy).toHaveBeenCalledWith({ pathname: '/project/1/code/11/1' })
      spy.mockReset()
    })
    
    test('should not change the route if scheme or jurisdictions are empty', () => {
      const spy = jest.spyOn(props.history, 'replace')
      shallow(<CodingValidation {...props} isSchemeEmpty areJurisdictionsEmpty />)
      expect(spy).not.toHaveBeenCalled()
    })
  })
  
  describe('changing questions', () => {
    test('should open an alert if the user tries to change questions while current answer is saving', () => {
      const wrapper = shallow(<CodingValidation {...props} unsavedChanges />)
      wrapper.instance().getQuestion('next', 0)
      expect(wrapper.state().stillSavingAlertOpen).toEqual(true)
    })
    
    test('should handle if the user selects a question in the navigator', () => {
      const spy = jest.spyOn(props.actions, 'onQuestionSelectedInNav')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.instance().getQuestion('nav', { id: 4, text: 'floop' })
      expect(spy).toHaveBeenCalledWith({ id: 4, text: 'floop' }, { id: 4, text: 'floop' }, 1, 11)
    })
    
    test('should handle if the user selects the next question', () => {
      const spy = jest.spyOn(props.actions, 'getNextQuestion')
      const wrapper = shallow(<CodingValidation {...props} questionOrder={[1, 3]} />)
      wrapper.instance().getQuestion('next', 1)
      expect(spy).toHaveBeenCalledWith(3, 1, 1, 11)
    })
    
    test('should handle if the user selects the previous question', () => {
      const spy = jest.spyOn(props.actions, 'getPrevQuestion')
      const wrapper = shallow(<CodingValidation {...props} questionOrder={[1, 3]} currentIndex={1} />)
      wrapper.instance().getQuestion('prev', 0)
      expect(spy).toHaveBeenCalledWith(1, 0, 1, 11)
    })
  })
  
  describe('on answering the question when it\'s not a text field', () => {
    const saveSpy = jest.spyOn(props.actions, 'saveUserAnswerRequest')
    const updateSpy = jest.spyOn(props.actions, 'updateUserAnswer')
    const setSpy = jest.spyOn(props.actions, 'setHeaderText')
    const wrapper = shallow(<CodingValidation {...props} />)
    wrapper.find('Connect(QuestionCard)').simulate('change', 12, 23)
    
    test('should update the answer', () => {
      expect(updateSpy).toHaveBeenCalledWith(1, 11, 1, 12, 23)
    })
    
    test('should save the answer', () => {
      expect(saveSpy).toHaveBeenCalledWith(1, 11, 1, null)
    })
    
    test('should set header text to Saving...', () => {
      expect(setSpy).toHaveBeenCalledWith('Saving...')
    })
  })
  
  describe('when changing a text field part of the answer', () => {
    const wrapper = shallow(<CodingValidation {...props} />)
    
    test('should handle if the user changes the text answer field', () => {
      const spy = jest.spyOn(props.actions, 'updateUserAnswer')
      wrapper.find('Connect(QuestionCard)').simulate('changeTextAnswer', 'textAnswer', 22, 'new text answer')
      expect(spy).toHaveBeenCalledWith(1, 11, 1, 22, 'new text answer')
    })
    
    test('should update the pincite if the user changes the pincite', () => {
      const spy = jest.spyOn(props.actions, 'onChangePincite')
      wrapper.find('Connect(QuestionCard)').simulate('changeTextAnswer', 'pincite', 22, 'pincite here')
      expect(spy).toHaveBeenCalledWith(1, 11, 1, 22, 'pincite here')
    })
    
    test('should update the comment if the user changes the comment', () => {
      const spy = jest.spyOn(props.actions, 'onChangeComment')
      wrapper.find('Connect(QuestionCard)').simulate('changeTextAnswer', 'comment', null, 'comment here')
      expect(spy).toHaveBeenCalledWith(1, 11, 1, 'comment here')
    })
    
    test('should save the new answer', () => {
      const spy = jest.spyOn(props.actions, 'saveUserAnswerRequest')
      wrapper.find('Connect(QuestionCard)').simulate('changeTextAnswer', 'textAnswer', 22, 'new text answer')
      expect(spy).toHaveBeenCalledWith(1, 11, 1, null)
    })
  
    test('should set header text to Saving...', () => {
      const spy = jest.spyOn(props.actions, 'setHeaderText')
      wrapper.find('Connect(QuestionCard)').simulate('changeTextAnswer', 'textAnswer', 22, 'new text answer')
      expect(spy).toHaveBeenCalledWith('Saving...')
    })
  })
  
  xdescribe('answer error api alert', () => {
    test('should close the alert', () => {
    
    })
  })
  
  describe('changing categories', () => {
    test('should move to the new category', () => {
      const spy = jest.spyOn(props.actions, 'onChangeCategory')
      const wrapper = shallow(<CodingValidation {...props} />)
      wrapper.find('Connect(QuestionCard)').simulate('changeCategory', null, 3)
      expect(spy).toHaveBeenCalledWith(3)
    })
  })
})
