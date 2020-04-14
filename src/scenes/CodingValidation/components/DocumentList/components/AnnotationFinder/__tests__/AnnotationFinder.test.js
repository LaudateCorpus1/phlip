import React from 'react'
import { AnnotationFinder } from '../index'
import { shallow } from 'enzyme'

const users = [
  { enabled: false, userId: 1, isValidator: false },
  { enabled: true, userId: 2, isValidator: false },
  { enabled: false, userId: 3, isValidator: true }
]

const mockClick = jest
  .fn()
  .mockImplementation((id, val) => jest.fn())

const props = {
  count: 4,
  current: 0,
  users,
  onScrollAnnotation: jest.fn(),
  onClickAvatar: mockClick
}

const setup = (other = {}) => {
  return shallow(<AnnotationFinder {...props} {...other} />)
}

describe('PDFViewer - AnnotationFinder', () => {
  test('should render correctly', () => {
    expect(shallow(<AnnotationFinder {...props} />)).toMatchSnapshot()
  })
  
  describe('rendering all of the users', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })
    
    test('should show an avatar for every user and ALL avatar that has annotations', () => {
      const wrapper = setup()
      expect(wrapper.find('CodingValidationAvatar').length).toEqual(4)
    })
    
    test('should not do anything if the user clicks on the user that is already enabled', () => {
      const wrapper = setup()
      expect(wrapper.find('CodingValidationAvatar').at(1).prop('onClickAvatar')).toBeFalsy()
    })
    
    test('should filter for the user annotations that the user clicks on', () => {
      const wrapper = setup()
      const spy = jest.spyOn(props, 'onClickAvatar')
      wrapper.find('CodingValidationAvatar').at(0).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('user should be enabled if it\'s the only user', () => {
      const wrapper = setup({ users: [users[0]] })
      expect(wrapper.find('CodingValidationAvatar').at(0).prop('enabled')).toEqual(true)
    })
    
    test('should not do anything if the user clicks on the only avatar', () => {
      const wrapper = setup({ onClickAvatar: null })
      const spy = jest.spyOn(props, 'onClickAvatar')
      wrapper.find('CodingValidationAvatar').at(0).simulate('click')
      expect(spy).not.toHaveBeenCalled()
    })
  })
  
  describe('the ALL avatar', () => {
    test('should show the ALL avatar if there is more than one user', () => {
      const wrapper = setup()
      const all = wrapper.find('CodingValidationAvatar').filterWhere(node => node.prop('user').initials === 'ALL')
      expect(all.length).toEqual(1)
    })
    
    test('should show all annotations if the user clicks the avatar', () => {
      const spy = jest.spyOn(props, 'onClickAvatar')
      const wrapper = setup({ allEnabled: false })
      const all = wrapper.find('CodingValidationAvatar').filterWhere(node => node.prop('user').initials === 'ALL')
      all.simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should not do anything if ALL is already enabled and the user clicks it', () => {
      const wrapper = setup({ allEnabled: true })
      const all = wrapper.find('CodingValidationAvatar').filterWhere(node => node.prop('user').initials === 'ALL')
      expect(all.prop('onClick')).toBeFalsy()
    })
  })
  
  describe('jumping to annotations', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })
    
    test('should go to the next annotation when the user clicks the down arrow', () => {
      const wrapper = setup()
      wrapper.find('IconButton').at(1).simulate('click')
      const spy = jest.spyOn(props, 'onScrollAnnotation')
      expect(spy).toHaveBeenCalledWith(1)
    })
  
    test('should go to the previous annotation when the user clicks the down arrow', () => {
      const wrapper = setup({ current: 4 })
      wrapper.find('IconButton').at(0).simulate('click')
      const spy = jest.spyOn(props, 'onScrollAnnotation')
      expect(spy).toHaveBeenCalledWith(3)
    })
  
    test('should disable the next arrow if the user is currently on the last annotation', () => {
      const wrapper = setup({ current: 3 })
      expect(wrapper.find('IconButton').at(1).prop('color')).toEqual(`rgba(0, 0, 0, 0.54)`)
    })
  
    test('should disable the previous arrow if the user is currently on the first annotation', () => {
      const wrapper = setup()
      expect(wrapper.find('IconButton').at(0).prop('color')).toEqual(`rgba(0, 0, 0, 0.54)`)
    })
  })
})
