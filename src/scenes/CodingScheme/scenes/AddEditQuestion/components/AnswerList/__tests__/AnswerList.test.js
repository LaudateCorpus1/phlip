import React from 'react'
import { AnswerList } from '../index'
import { shallow } from 'enzyme'

const answers = [
  { text: 'Yes' },
  { text: 'No' }
]

const props = {
  fields: {
    map: cb => answers.map((answer, index) => cb(answers, index, props.fields)),
    swap: jest.fn(),
    push: jest.fn(),
    remove: jest.fn(),
    get: index => answers[index]
  },
  answerType: 3,
  isEdit: false,
  canModify: true,
  name: 'possibleAnswers'
}

const setup = (other = {}) => {
  return shallow(<AnswerList {...props} {...other} />)
}

describe('AddEditQuestion form -- AnswerList', () => {
  test('should render correctly', () => {
    expect(shallow(<AnswerList {...props} />)).toMatchSnapshot()
  })
  
  test('should remove answer choice if the user clicks the trash can icon', () => {
    const spy = jest.spyOn(props.fields, 'remove')
    const wrapper = setup()
    wrapper.find('Field').at(0).prop('handleDelete')()
    expect(spy).toHaveBeenCalledWith(0)
  })
  
  test('should move answer up if the user clicks the up arrow', () => {
    const spy = jest.spyOn(props.fields, 'swap')
    const wrapper = setup()
    wrapper.find('Field').at(1).prop('handleUp')()
    expect(spy).toHaveBeenCalledWith(1, 0)
  })
  
  test('should move answer down if the user clicks the down arrow', () => {
    const spy = jest.spyOn(props.fields, 'swap')
    const wrapper = setup()
    wrapper.find('Field').at(0).prop('handleDown')()
    expect(spy).toHaveBeenCalledWith(0, 1)
  })
  
  test('should change the name of the list of answers if it\'s a category question', () => {
    const wrapper = setup({ answerType: 2 })
    expect(wrapper.find('Field').at(0).prop('label')).toEqual('Category/Tabs')
  })
  
  test('should change the placeholder text if it\'s a category question', () => {
    const wrapper = setup({ answerType: 2 })
    expect(wrapper.find('Field').at(0).prop('placeholder')).toEqual('Add tab')
  })
  
  test('should not show the add more button if the question is a binary question', () => {
    const wrapper = setup({ answerType: 1 })
    expect(wrapper.find('WithTheme(Button)').length).toEqual(0)
  })
  
  test('should show the add more button if the question is not a binary question', () => {
    const wrapper = setup({ answerType: 2 })
    expect(wrapper.find('WithTheme(Button)').length).toEqual(1)
  })
  
  test('should add new field if the user clicks the add more button', () => {
    const spy = jest.spyOn(props.fields, 'push')
    const wrapper = setup({ answerType: 2 })
    wrapper.find('WithTheme(Button)').simulate('click')
    expect(spy).toHaveBeenCalled()
  })
})
