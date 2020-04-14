import React from 'react'
import { FlagPopover } from '../index'
import { shallow } from 'enzyme'

const props = {
  userFlag: { notes: '', type: 0 },
  questionFlags: [],
  onSaveFlag: jest.fn(),
  user: {},
  disableAll: false
}

const redFlag = {
  id: 1,
  type: 3,
  notes: 'stop coding this questione ewqeqw erewrewrwweweeerewr ',
  raisedBy: {
    userId: 5,
    firstName: 'Test',
    lastName: 'User'
  },
  raisedAt: '2019-04-25T16:57:44.6752779'
}

describe('CodingValidation -- FlagPopover component', () => {
  test('should render correctly', () => {
    expect(shallow(<FlagPopover {...props} />)).toMatchSnapshot()
  })
  
  describe('if there is a red flag on this question', () => {
    test('should disable regular flag form', () => {
      const wrapper = shallow(<FlagPopover {...props} questionFlags={[redFlag]} />)
      expect(wrapper.find('form').find('SimpleInput').props().disabled).toEqual(true)
      expect(wrapper.find('form').find('FlexGrid').at(0).childAt(0).props().choices[0].disabled).toEqual(true)
      expect(wrapper.find('form').find('FlexGrid').at(0).childAt(0).props().choices[1].disabled).toEqual(true)
    })
    
    test('should disable the "save" button in the regular flag form', () => {
      const wrapper = shallow(<FlagPopover {...props} questionFlags={[redFlag]} />)
      expect(wrapper.find('form').find('WithTheme(Button)').at(1).props().disabled).toEqual(true)
    })
    
    test('should disable the edit button if the current user is the user who made the red flag', () => {
      const wrapper = shallow(<FlagPopover {...props} questionFlags={[redFlag]} user={{ id: 5 }} />)
      const tHeader = wrapper.find('Table').childAt(0).find('TableCell').at(2).childAt(0)
      expect(tHeader.text()).toEqual('Edit')
      const tBody = wrapper.find('Table').childAt(1).find('TableCell').at(2).find('IconButton')
      expect(tBody.length).toEqual(1)
    })
    
    test('should not show the edit button and table column if the red flag was not created by current user', () => {
      const wrapper = shallow(<FlagPopover {...props} questionFlags={[redFlag]} user={{ id: 4 }} />)
      const tHeader = wrapper.find('Table').childAt(0).find('TableCell').at(2)
      expect(tHeader.length).toEqual(0)
      const tBody = wrapper.find('Table').childAt(1).find('TableCell').at(2).find('IconButton')
      expect(tBody.length).toEqual(0)
    })
  })
  
  describe('if there is no red flag, but there is a user regular flag', () => {
    test('the regular form should not be disabled', () => {
      const wrapper = shallow(<FlagPopover {...props} userFlag={{ type: 1, notes: 'these are notes.' }} />)
      expect(wrapper.find('form').at(1).find('SimpleInput').props().disabled).toEqual(false)
      expect(wrapper.find('form').at(1).find('FlexGrid').at(0).childAt(0).props().choices[0].disabled).toEqual(false)
      expect(wrapper.find('form').at(1).find('FlexGrid').at(0).childAt(0).props().choices[1].disabled).toEqual(false)
    })
    
    test('should populate the form with the user flag from props', () => {
      const wrapper = shallow(<FlagPopover {...props} userFlag={{ type: 1, notes: 'these are notes.' }} />)
      expect(wrapper.find('form').at(1).find('SimpleInput').props().value).toEqual('these are notes.')
      expect(wrapper.find('form').at(1).find('FlexGrid').at(0).childAt(0).props().selected).toEqual(1)
    })
    
    test('the red flag form should not be disabled', () => {
      const wrapper = shallow(<FlagPopover {...props} userFlag={{ type: 1, notes: 'these are notes.' }} />)
      expect(wrapper.find('form').at(0).find('SimpleInput').length).toEqual(1)
    })
    
    test('should automatically be in edit mode for red flag form', () => {
      const wrapper = shallow(<FlagPopover {...props} userFlag={{ type: 1, notes: 'these are notes.' }} />)
      expect(wrapper.state().inEditMode).toEqual(true)
    })
  })
})
