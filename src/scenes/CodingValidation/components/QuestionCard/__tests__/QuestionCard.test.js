import React from 'react'
import { shallow } from 'enzyme'
import { QuestionCard } from '../index'
import * as questionTypes from '../../../constants'

const props = {
  question: { id: 1, answers: [], questionType: questionTypes.BINARY },
  userAnswers: {},
  onChange: jest.fn(),
  onChangeCategory: jest.fn(),
  onChangeTextAnswer: jest.fn(),
  onClearFlag: jest.fn(),
  onClearAnswer: jest.fn(),
  onSaveFlag: jest.fn(),
  onApplyAll: jest.fn(),
  onResetAnswer: jest.fn(),
  handleGetQuestion: jest.fn(),
  isValidation: false,
  user: { id: 5, firstName: 'test', lastName: 'user' },
  categories: undefined,
  selectedCategory: null,
  selectedCategoryId: 0,
  mergedUserQuestions: {},
  disableAll: false,
  userImages: {},
  questionChangeLoader: false,
  isChangingQuestion: false,
  unsavedChanges: false,
  saveFailed: false,
  touched: false,
  header: '',
  enabledAnswerId: '',
  enabledUserId: '',
  annotationModeEnabled: false,
  areDocsEmpty: false,
  actions: {
    toggleAnnotationMode: jest.fn(),
    setAlert: jest.fn(),
    closeAlert: jest.fn(),
    toggleViewAnnotations: jest.fn(),
    setHeaderText: jest.fn(),
    changeTouchedStatus: jest.fn(),
    setResetStatus: jest.fn(),
    toggleOffView: jest.fn()
  },
  alert: {
    open: false,
    title: '',
    text: '',
    data: {},
    type: ''
  }
}

const categoryAlert = {
  text: 'Deselecting a category will remove answers, pincites and annotations associated with this category. Do you want to continue?',
  title: 'Warning',
  type: 'changeAnswer',
  data: { id: 2, value: 3 },
  open: true
}

const changeAnswerAlert = {
  ...categoryAlert,
  text: 'Changing your answer will remove the pincites and annotations associated with this answer. Do you want to continue?'
}

const clearAlert = {
  ...categoryAlert,
  type: 'clearAnswer',
  text: 'Clearing your answer will remove the selected answer choice, pincites and annotations associated with this answer. Do you want to continue?',
  data: {}
}

const applyAll = {
  ...categoryAlert,
  type: 'applyAll',
  text: 'Your answer will apply to ALL categories. Previous answers will be overwritten.',
  data: {}
}

const reset = {
  ...categoryAlert,
  type: 'reset',
  text: 'Any changes you\'ve made, including selected answer, pincites, comments, and annotations, since arriving to this question will be reset.',
  data: {}
}

const clearFlag = {
  ...categoryAlert,
  type: 'clearFlag',
  text: 'Do you want to clear this flag?',
  title: 'Confirm Clear Flag',
  data: { id: 2, type: 1 },
  continueButtonText: 'Clear Flag'
}

describe('QuestionCard component', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionCard {...props} />)).toMatchSnapshot()
  })
  
  describe('toggling annotation mode', () => {
    test(
      'should call actions.toggleAnnotationMode with enabled === true if annotationMode is not currently enabled',
      () => {
        const wrapper = shallow(<QuestionCard {...props} userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }} />)
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().handleToggleAnnotationMode(1)()
        expect(spy).toHaveBeenCalledWith(1, 1, true)
        spy.mockReset()
      }
    )
    
    test(
      'should call actions.toggleAnnotationMode with enabled === false if annotationMode is enabled and enableAnswerId is same as parameter',
      () => {
        const wrapper = shallow(
          <QuestionCard
            {...props}
            annotationModeEnabled
            enabledAnswerId={1}
            userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
          />
        )
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().handleToggleAnnotationMode(1)()
        expect(spy).toHaveBeenCalledWith(1, 1, false)
        spy.mockReset()
      }
    )
    
    test(
      'should call actions.toggleAnnotationMode with enabled === true and new answerId if enabled and enabledAnswerId !== parameter',
      () => {
        const wrapper = shallow(
          <QuestionCard
            {...props}
            annotationModeEnabled
            enabledAnswerId={1}
            userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
          />
        )
        const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
        wrapper.instance().handleToggleAnnotationMode(2)()
        expect(spy).toHaveBeenCalledWith(1, 2, true)
        spy.mockReset()
      }
    )
  })
  
  describe('changing answer', () => {
    test('should call disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().handleChangeAnswer(2)({}, {})
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    describe('unselecting a category choice', () => {
      test('should call props.setAlert with category question information', () => {
        const spy = jest.spyOn(props.actions, 'setAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
        />)
        wrapper.instance().handleChangeAnswer(2)({}, 3)
        expect(spy).toHaveBeenCalledWith(categoryAlert)
      })
      
      test('should show an alert', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual(categoryAlert.text)
        expect(wrapper.find('Alert').at(0).prop('title')).toEqual(categoryAlert.title)
      })
      
      test('should close the alert when \'Cancel\' button in alert is clicked', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        wrapper.find('Alert').at(0).prop('onCloseAlert')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should change answer when \'Continue\' button in alert is clicked', () => {
        const spy = jest.spyOn(props, 'onChange')
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CATEGORY }}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 },
              2: { schemeAnswerId: 2 }
            }
          }}
          alert={categoryAlert}
        />)
        wrapper.find('Alert').at(0).prop('actions')[0].onClick()
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('changing a non-category answer', () => {
      test('should call props.setAlert with changing answer alert information', () => {
        const spy = jest.spyOn(props.actions, 'setAlert')
        const wrapper = shallow(<QuestionCard
          {...props}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 }
            }
          }}
        />)
        wrapper.instance().handleChangeAnswer(2)({}, 3)
        expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
      })
      
      test('should show an alert if the user tries to change a binary answer', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          userAnswers={{
            answers: {
              1: { schemeAnswerId: 1 }
            }
          }}
          alert={changeAnswerAlert}
        />)
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual(changeAnswerAlert.text)
        expect(wrapper.find('Alert').at(0).prop('title')).toEqual(changeAnswerAlert.title)
      })
      
      test(
        'should call props.setAlert with changing answer alert information if the user tries to change a multiple choice answer',
        () => {
          const spy = jest.spyOn(props.actions, 'setAlert')
          const wrapper = shallow(<QuestionCard
            {...props}
            question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
            userAnswers={{
              answers: {
                3: { schemeAnswerId: 3 }
              }
            }}
          />)
          
          wrapper.instance().handleChangeAnswer(2)({}, 3)
          expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
        }
      )
      
      test(
        'should call props.setAlert with changing answer alert information if the user tries to uncheck a selected checkbox answer',
        () => {
          const spy = jest.spyOn(props.actions, 'setAlert')
          const wrapper = shallow(<QuestionCard
            {...props}
            question={{ questionType: questionTypes.CHECKBOXES }}
            userAnswers={{
              answers: {
                1: { schemeAnswerId: 1 },
                2: { schemeAnswerId: 2 }
              }
            }}
          />)
          
          wrapper.instance().handleChangeAnswer(2)({}, 3)
          expect(spy).toHaveBeenCalledWith(changeAnswerAlert)
        }
      )
      
      test('should not show an alert if the user has not answered the question', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.MULTIPLE_CHOICE }}
          userAnswers={{
            answers: {}
          }}
        />)
        
        wrapper.instance().handleChangeAnswer(2)({}, {})
        const alert = wrapper.find('Alert').at(0)
        expect(alert.props().open).toEqual(false)
      })
      
      test('should not show an alert if the user has not chosen the selected checkbox', () => {
        const wrapper = shallow(<QuestionCard
          {...props}
          question={{ questionType: questionTypes.CHECKBOXES }}
          userAnswers={{
            answers: {
              4: { schemeAnswerId: 4 }
            }
          }}
        />)
        
        wrapper.instance().handleChangeAnswer(2)({}, {})
        const alert = wrapper.find('Alert').at(0)
        expect(alert.props().open).toEqual(false)
      })
    })
  })
  
  describe('toggling view annotations', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
        enabledAnswerId={1}
      />)
      wrapper.instance().handleToggleViewAnnotations(2)()
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    test('should call toggleViewAnnotatoins', () => {
      const spy = jest.spyOn(props.actions, 'toggleViewAnnotations')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().handleToggleViewAnnotations(1)()
      expect(spy).toHaveBeenCalledWith(1, 1)
    })
  })
  
  describe('changing categories', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeCategory({}, 2)
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should change categories', () => {
      const spy = jest.spyOn(props, 'onChangeCategory')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
      />)
      wrapper.instance().handleChangeCategory({}, 2)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('clearing answer', () => {
    test('should disable annotation mode if annotation mode is enabled', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          annotationModeEnabled
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().handleClearAnswer()
      expect(spy).toHaveBeenCalledWith(1, 1, false)
      spy.mockReset()
    })
    
    test('should call props.setAlert with clear answer alert information', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().handleClearAnswer()
      expect(spy).toHaveBeenCalledWith(clearAlert)
    })
    
    test('should close the alert when \'Cancel\' button in alert is clicked', () => {
      const spy = jest.spyOn(props.actions, 'closeAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearAlert}
      />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should clear answer when \'Continue\' button in alert is clicked', () => {
      const spy = jest.spyOn(props, 'onClearAnswer')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearAlert}
      />)
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('applying answer to all categories', () => {
    test('should disable annotation mode if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleApplyAll()
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should call props.setAlert with apply all alert information', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      wrapper.instance().handleApplyAll()
      expect(spy).toHaveBeenCalledWith(applyAll)
    })
    
    test('should close the alert when \'Cancel\' button in alert is clicked', () => {
      const spy = jest.spyOn(props.actions, 'closeAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={applyAll}
      />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should apply to all categories when \'Continue\' button in alert is clicked', () => {
      const spy = jest.spyOn(props, 'onApplyAll')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={applyAll}
      />)
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('reseting answer', () => {
    test('should open an alert when the reset button is clicked', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
          canReset
        />
      )
      
      wrapper.find('IconButton').at(0).simulate('click')
      expect(spy).toHaveBeenCalledWith(reset)
    })
    
    test('should disable annotation mode if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleResetAnswer()
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should close the alert when \'Cancel\' button in alert is clicked', () => {
      const spy = jest.spyOn(props.actions, 'closeAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={reset}
      />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should reset answer when \'Continue\' button in alert is clicked', () => {
      const spy = jest.spyOn(props, 'onResetAnswer')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={reset}
      />)
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('clearing a flag', () => {
    test('should open an alert when a flag is requested to be cleared', () => {
      const spy = jest.spyOn(props.actions, 'setAlert')
      const wrapper = shallow(
        <QuestionCard
          {...props}
          enabledAnswerId={1}
          userAnswers={{ answers: { 1: { schemeAnswerId: 1 } } }}
        />
      )
      
      wrapper.find('WithStyles(QuestionContent)').simulate('clearFlag', 2, 1)
      expect(spy).toHaveBeenCalledWith(clearFlag)
    })
    
    test('should disable annotation mode if currently in annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.find('WithStyles(QuestionContent)').simulate('clearFlag', 2, 1)
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should close the alert when \'Cancel\' button in alert is clicked', () => {
      const spy = jest.spyOn(props.actions, 'closeAlert')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearFlag}
      />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should reset answer when \'Continue\' button in alert is clicked', () => {
      const spy = jest.spyOn(props, 'onClearFlag')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 },
            2: { schemeAnswerId: 2 }
          }
        }}
        alert={clearFlag}
      />)
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('changing a text answer', () => {
    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeTextAnswer(1, 'textAnswer')({ target: { value: 'bloop' } })
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should set card header text with Saving', () => {
      const spy = jest.spyOn(props.actions, 'setHeaderText')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeTextAnswer(1, 'textAnswer')({ target: { value: 'bloop' } })
      expect(spy).toHaveBeenCalledWith('Saving...')
      spy.mockReset()
    })
    
    test('should set reset status', () => {
      const spy = jest.spyOn(props.actions, 'setResetStatus')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeTextAnswer(1, 'textAnswer')({ target: { value: 'bloop' } })
      expect(spy).toHaveBeenCalledWith(true)
      spy.mockReset()
    })
    
    test('should actually change the text answer', () => {
      const spy = jest.spyOn(props, 'onChangeTextAnswer')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeTextAnswer(1, 'textAnswer')({ target: { value: 'bloop' } })
      expect(spy).toHaveBeenCalledWith('textAnswer', 1, 'bloop')
      spy.mockReset()
    })
  })
  
  describe('saving a flag', () => {
    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleSaveFlag({ text: 'flag', type: 1 })
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should set card header text with Saving', () => {
      const spy = jest.spyOn(props.actions, 'setHeaderText')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleSaveFlag({ text: 'flag', type: 1 })
      expect(spy).toHaveBeenCalledWith('Saving...')
      spy.mockReset()
    })
    
    test('should set reset status', () => {
      const spy = jest.spyOn(props.actions, 'setResetStatus')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleSaveFlag({ text: 'flag', type: 1 })
      expect(spy).toHaveBeenCalledWith(true)
      spy.mockReset()
    })
    
    test('should add in user info to the flag information and save flag', () => {
      const spy = jest.spyOn(props, 'onSaveFlag')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleSaveFlag({ text: 'flag', type: 1 })
      expect(spy)
        .toHaveBeenCalledWith({ text: 'flag', type: 1, raisedBy: { userId: 5, firstName: 'test', lastName: 'user' } })
      spy.mockReset()
    })
  })
  
  describe('changing questions', () => {
    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeQuestion('next', 1)()
      expect(spy).toHaveBeenCalledWith(1, '', false)
      spy.mockReset()
    })
    
    test('should clear card header text', () => {
      const spy = jest.spyOn(props.actions, 'setHeaderText')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeQuestion('next', 1)()
      expect(spy).toHaveBeenCalledWith('')
      spy.mockReset()
    })
    
    test('should clear reset status', () => {
      const spy = jest.spyOn(props.actions, 'setResetStatus')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeQuestion('next', 1)()
      expect(spy).toHaveBeenCalledWith(false)
      spy.mockReset()
    })
    
    test('should get new question', () => {
      const spy = jest.spyOn(props, 'handleGetQuestion')
      const wrapper = shallow(<QuestionCard
        {...props}
        userAnswers={{
          answers: {
            1: { schemeAnswerId: 1 }
          }
        }}
        annotationModeEnabled
      />)
      wrapper.instance().handleChangeQuestion('next', 1)()
      expect(spy).toHaveBeenCalledWith('next', 1)
      spy.mockReset()
    })
  })
  
  describe('page loading', () => {
    test('should show a loader if the page is loading', () => {
      const wrapper = shallow(<QuestionCard {...props} questionChangeLoader />)
      expect(wrapper.find('PageLoader').length).toEqual(1)
    })
  })
  
  describe('hovering answer', () => {
    const wrapper = shallow(<QuestionCard {...props} />)
    
    test('should clear the hovered answer choice when the user moves the mouse out of an answer', () => {
      wrapper.setState({ hoveredAnswerChoice: 1 })
      wrapper.instance().handleMouseOutAnswerChoice()
      expect(wrapper.state().hoveredAnswerChoice).toEqual(0)
    })
    
    test('should set the hovered answer choice when the user moves their cursor into the answer', () => {
      wrapper.setState({ hoveredAnswerChoice: 0 })
      wrapper.instance().handleMouseInAnswerChoice(4)
      expect(wrapper.state().hoveredAnswerChoice).toEqual(4)
    })
  })
  
  describe('when the current question is a category question', () => {
    const wrapper = shallow(<QuestionCard {...props} categories={[{ id: 4 }]} />)
    
    test('should wrap the question in a tab container', () => {
      expect(wrapper.find('TabContainer').length).toEqual(1)
    })
  })
})
