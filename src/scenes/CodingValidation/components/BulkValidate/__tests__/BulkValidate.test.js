import React from 'react'
import { shallow } from 'enzyme'
import { BulkValidate } from '../index'

const props = {
  open: true,
  onConfirmValidate: jest.fn(),
  onClose: jest.fn(),
  users: [],
  validationInProgress: false
}

const setup = (otherProps = {}) => {
  return shallow(<BulkValidate {...props} {...otherProps} />)
}

describe('CodingValidation -- Bulk Validate modal', () => {
  test('should render correctly', () => {
    expect(setup()).toMatchSnapshot()
  })
  
  test('should clear all selections if the user closes the modal without validating', () => {
    const wrapper = setup()
    wrapper.setState({
      activeStep: 1,
      selections: {
        scope: 'jurisdictions',
        user: {
          userId: 1,
          firstName: 'Test',
          lastName: 'User',
          username: 'Test User'
        }
      }
    })
    wrapper.setProps({ open: false })
    expect(wrapper.state().selections).toEqual({
      confirm: false,
      user: null,
      scope: null
    })
    expect(wrapper.state().activeStep).toEqual(0)
  })
  
  test('should clear all selections if the user clicks the close button', () => {
    const wrapper = setup()
    wrapper.setState({
      activeStep: 1,
      selections: {
        scope: 'jurisdictions',
        user: {
          userId: 1,
          firstName: 'Test',
          lastName: 'User',
          username: 'Test User'
        }
      }
    })
    wrapper.find('WithStyles(Modal)').simulate('close')
    expect(wrapper.state().selections).toEqual({
      confirm: false,
      user: null,
      scope: null
    })
    expect(wrapper.state().activeStep).toEqual(0)
  })
  
  describe('scope step', () => {
    test('should show the scope page when the user is on the first step', () => {
      const wrapper = setup()
      expect(wrapper.findWhere(node => node.prop('id') === 'scope-step').length).toEqual(1)
    })
    
    test('should select a scope when the user clicks the select button', () => {
      const wrapper = setup()
      wrapper.find('WithTheme(Button)').at(1).simulate('click')
      expect(wrapper.state().selections.scope).toEqual('jurisdiction')
    })
    
    test('should not changes steps if the user comes back and selects a different scope', () => {
      const wrapper = setup()
      wrapper.setState({
        activeStep: 0,
        selections: {
          scope: 'question',
          user: null,
          confirm: false
        }
      })
      
      wrapper.find('WithTheme(Button)').at(0).simulate('click')
      expect(wrapper.state().activeStep).toEqual(0)
    })
    
    test('should indicate if a scope is selected', () => {
      const wrapper = setup()
      wrapper.setState({
        selections: {
          scope: 'jurisdiction',
          user: {}
        }
      })
      expect(wrapper.find('#scope-step').childAt(1).prop('style').border).toEqual('2px solid #048484')
      expect(wrapper.find('#scope-step').childAt(1).find('WithStyles(Typography)').at(2).childAt(0).text())
        .toEqual('Selected!')
    })
    
    test('should only show the next button if a scope is selected', () => {
      const wrapper = setup()
      wrapper.setState({
        selections: {
          scope: 'jurisdiction',
          user: {}
        }
      })
      
      expect(wrapper.find('WithTheme(Button)').someWhere(n => n.childAt(0).text() === 'Next')).toEqual(true)
    })
  })
  
  describe('user step', () => {
    const users = [
      {
        userId: 1,
        firstName: 'Test',
        lastName: 'User',
        username: 'Test User'
      },
      {
        userId: 2,
        firstName: 'Coder',
        lastName: 'User',
        username: 'Coder User'
      },
      {
        userId: 3,
        firstName: 'Coord',
        lastName: 'User',
        username: 'Coord User'
      }
    ]
    
    test('should show the user page if the user navigates to step 2', () => {
      const wrapper = setup()
      wrapper.setState({ activeStep: 1 })
      expect(wrapper.findWhere(node => node.prop('id') === 'user-step').length).toEqual(1)
    })
    
    test('should select a user if the user clicks on a user in the list', () => {
      const wrapper = setup({ users })
      wrapper.setState({
        activeStep: 1,
        selections: {
          scope: 'question',
          user: null,
          confirm: false
        }
      })
      
      wrapper.find('WithStyles(ListItem)').at(1).simulate('click')
      expect(wrapper.state().selections.user).toEqual({
        userId: 2,
        firstName: 'Coder',
        lastName: 'User',
        username: 'Coder User'
      })
    })
    
    test('should not changes steps if the user comes back and selects a different user', () => {
      const wrapper = setup({ users })
      wrapper.setState({
        activeStep: 1,
        selections: {
          scope: 'question',
          user: {
            userId: 2,
            firstName: 'Coder',
            lastName: 'User',
            username: 'Coder User'
          },
          confirm: false
        }
      })
      
      wrapper.find('WithStyles(ListItem)').at(1).simulate('click')
      expect(wrapper.state().activeStep).toEqual(1)
    })
    
    test('should indicate if a user is selected', () => {
      const wrapper = setup({ users })
      wrapper.setState({
        selections: {
          scope: 'jurisdiction',
          user: {
            userId: 2,
            firstName: 'Coder',
            lastName: 'User',
            username: 'Coder User'
          }
        },
        activeStep: 1
      })
      expect(wrapper.find('WithStyles(ListItem)').at(1).prop('style').backgroundColor)
        .toEqual('rgba(233, 233, 233, 0.68)')
    })
  })
  
  describe('confirm step', () => {
    test('should show the confirm page if the user navigates to the last step', () => {
      const wrapper = setup()
      wrapper.setState({
        activeStep: 2,
        selections: {
          scope: 'jurisdiction',
          user: {
            userId: 1,
            username: 'Test User',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      })
      expect(wrapper.findWhere(node => node.prop('id') === 'confirm-step').length).toEqual(1)
    })
    
    test(
      'should send a validation request if the user clicks the validate button and there\'s not already a request in progress',
      () => {
        const spy = jest.spyOn(props, 'onConfirmValidate')
        const wrapper = setup()
        wrapper.setState({
          activeStep: 2,
          selections: {
            scope: 'jurisdiction',
            user: {
              userId: 1,
              username: 'Test User',
              firstName: 'Test',
              lastName: 'User'
            }
          }
        })
        const validate = wrapper.find('WithTheme(Button)').filterWhere(n => n.childAt(0).text() === 'Validate')
        validate.simulate('click')
        expect(spy).toHaveBeenCalled()
      }
    )
    
    test('should show a spinner when a request is in progress', () => {
      const wrapper = setup({ validationInProgress: true })
      wrapper.setState({
        activeStep: 2,
        selections: {
          scope: 'jurisdiction',
          user: {
            userId: 1,
            username: 'Test User',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      })
      expect(wrapper.find('CircularLoader').length).toEqual(1)
    })
  })
  
  describe('navigating steps', () => {
    test('should go forward a step if the user clicks the next button and is not on the last step', () => {
      const wrapper = setup()
      wrapper.setState({
        activeStep: 1,
        selections: {
          scope: 'jurisdictions',
          user: {
            userId: 1,
            firstName: 'Test',
            lastName: 'User',
            username: 'Test User'
          }
        }
      })
      const nextButton = wrapper.find('WithTheme(Button)').filterWhere(n => n.childAt(0).text() === 'Next')
      nextButton.simulate('click')
      expect(wrapper.state().activeStep).toEqual(2)
    })
    
    test('should go back a step if the user clicks the back button and is not on the first step', () => {
      const wrapper = setup()
      wrapper.setState({
        activeStep: 1,
        selections: {
          scope: 'jurisdictions',
          user: {
            userId: 1,
            firstName: 'Test',
            lastName: 'User',
            username: 'Test User'
          }
        }
      })
      const backButton = wrapper.find('WithTheme(Button)').filterWhere(n => n.childAt(0).text() === 'Back')
      backButton.simulate('click')
      expect(wrapper.state().activeStep).toEqual(0)
    })
  })
})
