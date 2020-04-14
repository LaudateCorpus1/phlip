import React from 'react'
import { shallow } from 'enzyme'
import { AddEditQuestion } from '../index'
import { schemeFromApi } from 'utils/testData/scheme'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const props = {
  actions: {
    updateQuestionRequest: jest.fn(),
    addChildQuestionRequest: jest.fn(),
    addQuestionRequest: jest.fn()
  },
  projectId: 2,
  match: {
    url: '/project/2/coding-scheme/add'
  },
  formError: null,
  formActions: {
    reset: jest.fn(),
    initialize: jest.fn(),
    change: jest.fn()
  },
  location: {
    state: {
      canModify: true
    }
  },
  goBack: false,
  history: {
    goBack: jest.fn()
  },
  onSubmitError: jest.fn(),
  form: {},
  lockedByCurrentUser: true
}

const setup = (other = {}) => {
  return shallow(<AddEditQuestion {...props} {...other} />)
}

describe('CodingScheme scene - AddEditQuestion Component', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditQuestion {...props} />)).toMatchSnapshot()
  })
  
  test('should populate the form if the user is editing a question', () => {
    const wrapper = setup({
      match: { url: '/project/2/coding-scheme/edit/3' },
      location: { state: { questionDefined: { ...schemeFromApi[2] } } }
    })
    
    expect(wrapper.instance().questionDefined).toEqual(schemeFromApi[2])
  })
  
  test('should populate the parent if the user is editing a child question', () => {
    const wrapper = setup({
      match: { url: '/project/2/coding-scheme/add' },
      location: { state: { parentDefined: { ...schemeFromApi[2] } } }
    })
    
    expect(wrapper.instance().parentDefined).toEqual(schemeFromApi[2])
  })
  
  test('should not populate the form if it user is adding a regular parent question', () => {
    const wrapper = setup({
      match: { url: '/project/2/coding-scheme/add' },
      location: { state: undefined }
    })
    
    expect(wrapper.instance().parentDefined).toEqual(null)
    expect(wrapper.instance().questionDefined).toEqual(null)
  })
  
  test('should reset document name when component unmounts', () => {
    document.title = 'Project 4 - Coding Scheme'
    const wrapper = setup()
    wrapper.unmount()
    expect(document.title).toEqual('Project 4 - Coding Scheme')
  })
  
  describe('handling submission', () => {
    test('should send a request to update a question if the user is editing a question', () => {
      const spy = jest.spyOn(props.actions, 'updateQuestionRequest')
      const wrapper = setup({
        match: { url: '/project/2/coding-scheme/edit/3' },
        location: { state: { questionDefined: { ...schemeFromApi[2] } } }
      })
      wrapper.find('FormModal').prop('handleSubmit')({ ...schemeFromApi[2] })
      expect(spy).toHaveBeenCalled()
    })
    
    test('should send a request to add a child question if the user is adding a child question', () => {
      const spy = jest.spyOn(props.actions, 'addChildQuestionRequest')
      const wrapper = setup({
        match: { url: '/project/2/coding-scheme/add' },
        location: { state: { parentDefined: { ...schemeFromApi[2] } } }
      })
      wrapper.find('FormModal').prop('handleSubmit')({ ...schemeFromApi[2] })
      expect(spy).toHaveBeenCalled()
    })
    
    test('should send a request to add a regular question if the user is adding a regular question', () => {
      const spy = jest.spyOn(props.actions, 'addQuestionRequest')
      const wrapper = setup({ match: { url: '/project/2/coding-scheme/add' }, location: { state: {} } })
      wrapper.find('FormModal').prop('handleSubmit')({ ...schemeFromApi[2] })
      expect(spy).toHaveBeenCalled()
    })
    
    test('should show an alert if there\'s an error while submitting', () => {
      const spy = jest.spyOn(props, 'onSubmitError')
      const wrapper = setup({ submitting: true })
      wrapper.setProps({ submitting: false, formError: 'failed' })
      expect(spy).toHaveBeenCalledWith('failed')
    })
    
    test('should close the modal if the submission succeeds', () => {
      const spy = jest.spyOn(props.history, 'goBack')
      const wrapper = setup({ submitting: true })
      wrapper.setProps({ submitting: false, goBack: true })
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('canceling the add / edit question form', () => {
    const resetSpy = jest.spyOn(props.formActions, 'reset')
    const goBackSpy = jest.spyOn(props.history, 'goBack')
    const wrapper = setup()
    wrapper.find('WithStyles(ModalActions)').prop('actions')[0].onClick()
    
    test('should clear the form if the user cancels', () => {
      expect(resetSpy).toHaveBeenCalled()
    })
    
    test('should close the modal', () => {
      expect(goBackSpy).toHaveBeenCalled()
    })
  })
  
  describe('changing the question type', () => {
    const defaultForm = {
      values: {
        possibleAnswers: [],
        text: '',
        questionType: 3,
        hint: '',
        includeComment: false
      }
    }
    
    test('should initialize form if the user changes to text field question', () => {
      const spy = jest.spyOn(props.formActions, 'initialize')
      const wrapper = setup({
        match: { url: '/project/2/coding-scheme/add' },
        location: { state: {} },
        form: { ...defaultForm }
      })
      wrapper.find('Field').at(1).simulate('change', {}, 5)
      expect(spy).toHaveBeenCalledWith('questionForm', {
        questionType: questionTypes.TEXT_FIELD,
        includeComment: false,
        isCategoryQuestion: false
      }, true)
    })
    
    test('should initialize form if the user changes to binary question', () => {
      const spy = jest.spyOn(props.formActions, 'initialize')
      const wrapper = setup({
        match: { url: '/project/2/coding-scheme/add' },
        location: { state: {} },
        form: { ...defaultForm }
      })
      wrapper.find('Field').at(1).simulate('change', {}, 1)
      expect(spy).toHaveBeenCalledWith('questionForm', {
        questionType: questionTypes.BINARY,
        possibleAnswers: [{ text: 'Yes' }, { text: 'No' }],
        includeComment: false,
        isCategoryQuestion: false
      }, {
        options: {
          keepDirty: false,
          keepValues: false
        }
      })
    })
    
    test('should initialize form if the user changes to not text or binary question', () => {
      const spy = jest.spyOn(props.formActions, 'initialize')
      const wrapper = setup({
        match: { url: '/project/2/coding-scheme/add' },
        location: { state: {} },
        form: { ...defaultForm }
      })
      wrapper.find('Field').at(1).simulate('change', {}, 3)
      expect(spy).toHaveBeenCalledWith('questionForm', {
        questionType: questionTypes.TEXT_FIELD,
        includeComment: false,
        isCategoryQuestion: false
      }, true)
    })
  })
  
  describe('validating the form', () => {
    const values = {
      possibleAnswers: [{ id: 4, text: 'blah' }, { text: '' }, { text: '' }],
      text: '',
      questionType: 3,
      hint: '',
      includeComment: false
    }
    
    test('should display that question text is required', () => {
      const wrapper = setup()
      const errors = wrapper.instance().validate(values)
      expect(errors.text).toEqual('Required')
    })
    
    test('should display that all empty possible answers are required', () => {
      const wrapper = setup()
      const errors = wrapper.instance().validate(values)
      expect(errors.possibleAnswers).toEqual([
        undefined,
        { text: 'Required' },
        { text: 'Required' }
      ])
    })
    
    test('should return no errors if everything is filled out', () => {
      const wrapper = setup()
      const values = {
        text: 'question text',
        possibleAnswers: [{ text: 'yes' }, { text: 'no' }],
        hint: ''
      }
      const errors = wrapper.instance().validate(values)
      expect(errors).toEqual({})
    })
  })
})
