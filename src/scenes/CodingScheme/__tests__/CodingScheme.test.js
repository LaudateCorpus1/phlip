import React from 'react'
import { shallow } from 'enzyme'
import { CodingScheme } from '../index'

const props = {
  actions: {
    getSchemeRequest: jest.fn(),
    updateQuestionTree: jest.fn(),
    copyCodingSchemeRequest: jest.fn(),
    deleteQuestionRequest: jest.fn(),
    unlockCodingSchemeRequest: jest.fn(),
    lockCodingSchemeRequest: jest.fn(),
    closeLockedAlert: jest.fn(),
    resetAlertError: jest.fn(),
    clearState: jest.fn()
  },
  project: {
    id: 1,
    name: 'Test Project'
  },
  questions: [],
  lockInfo: { userId: 1 },
  lockedByCurrentUser: false,
  lockedAlert: null,
  hasLock: false,
  currentUser: { role: 'Admin', id: 1 },
  projectLocked: false,
  alertError: '',
  copying: false,
  history: {
    goBack: jest.fn(),
    push: jest.fn()
  },
  projectAutocompleteProps: {
    selectedSuggestion: {},
    suggestions: [],
    inputProps: {
      value: '',
      onChange: jest.fn()
    },
    onSuggestionsFetchRequested: jest.fn(),
    onSuggestionsClearRequested: jest.fn(),
    getSuggestionValue: jest.fn(),
    renderSuggestion: jest.fn()
  },
  projectAutoActions: {
    clearAll: jest.fn()
  },
  schemeError: null
}

const setup = (other = {}) => {
  return shallow(<CodingScheme {...props} {...other} />)
}

describe('CodingScheme scene', () => {
  test('should render correctly', () => {
    expect(shallow(<CodingScheme {...props} />)).toMatchSnapshot()
  })
  
  test('should show an error if there\'s an error while getting the scheme', () => {
    const wrapper = setup({ schemeError: 'Failed to get scheme' })
    expect(wrapper.find('ApiErrorView').length).toEqual(1)
  })
  
  test('should show the add new question button if the scheme is checked out by current user and is not empty', () => {
    const wrapper = setup({ lockedByCurrentUser: true, hasLock: true, questions: [{ text: 'q' }] })
    expect(wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').show).toEqual(true)
  })
  
  test('should show the check in / out button if the scheme is not empty', () => {
    const wrapper = setup({ lockedByCurrentUser: true, hasLock: true, questions: [{ text: 'q' }] })
    expect(wrapper.find('withRouter(WithTheme(PageHeader))').prop('checkoutButton').show).toEqual(true)
  })
  
  test('should check in the scheme if the user clicks the check in button', () => {
    const spy = jest.spyOn(props.actions, 'unlockCodingSchemeRequest')
    const wrapper = setup({ lockedByCurrentUser: true, hasLock: true, questions: [{ text: 'q' }] })
    wrapper.find('withRouter(WithTheme(PageHeader))').prop('checkoutButton').props.onClick()
    expect(spy).toHaveBeenCalled()
  })
  
  describe('if the user clicks the back arrow', () => {
    test('should go back if the scheme is not checked out by current user', () => {
      const spy = jest.spyOn(props.history, 'goBack')
      const wrapper = setup()
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      expect(spy).toHaveBeenCalled()
      spy.mockReset()
    })
    
    test('should clear the coding scheme state', () => {
      const spy = jest.spyOn(props.actions, 'clearState')
      const wrapper = setup()
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should show an alert if the scheme is checked out by current user', () => {
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      expect(wrapper.state('goBackAlertOpen')).toEqual(true)
      expect(wrapper.find('Alert').at(0).prop('open')).toEqual(true)
    })
    
    test('should check in the coding scheme if the user clicks the check in button on the go back alert', () => {
      const spy = jest.spyOn(props.actions, 'unlockCodingSchemeRequest')
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  
    test('should go back if the user clicks the check in button on the go back alert', () => {
      const spy = jest.spyOn(props.history, 'goBack')
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should close the alert if the user clicks the cancel button in the go back alert', () => {
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').simulate('backButtonClick')
      wrapper.find('Alert').at(0).simulate('closeAlert')
      expect(wrapper.state('goBackAlertOpen')).toEqual(false)
    })
  })
  
  describe('when the user first opens this page', () => {
    describe('when the coding scheme is empty and checked out by the current user', () => {
      test('should show the add question and copy coding scheme button', () => {
        const wrapper = setup({ empty: true, lockedByCurrentUser: true })
        const buttons = wrapper
          .find('WithTheme(Button)')
          .filterWhere(node => ['Add New Question', 'Copy Coding Scheme'].includes(node.prop('value')))
        expect(buttons.length).toEqual(2)
      })
      
      test('should display correct text', () => {
        const wrapper = setup({ empty: true, lockedByCurrentUser: true })
        expect(wrapper.find('WithStyles(Typography)').at(3).childAt(0).text()).toEqual(
          'The coding scheme is empty. To get started, add a question or copy the coding scheme from another project.'
        )
      })
    })
    
    describe('when a coordinator has locked a project', () => {
      test('should display correct text is the coding scheme is empty', () => {
        const wrapper = setup({ empty: true, projectLocked: true })
        expect(wrapper.find('WithStyles(Typography)').at(3).childAt(0).text()).toEqual(
          'This project is locked. No changes can be made to the coding scheme.'
        )
      })
      
      test('should not show any getting started buttons if the coding scheme is empty', () => {
        const wrapper = setup({ empty: true, projectLocked: true })
        expect(wrapper.find('FlexGrid').at(2).find('WithTheme(Button)').length).toEqual(0)
      })
      
      test('should not show the add new question button', () => {
        const wrapper = setup()
        expect(wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').show).toEqual(false)
      })
    })
    
    describe('when the coding scheme is empty and no one has checked out the scheme', () => {
      test('should show the check out button if the coding scheme is not locked', () => {
        const wrapper = setup({ empty: true })
        const button = wrapper.find('WithTheme(Button)').filterWhere(node => node.prop('value') === 'Check out')
        expect(button.length).toEqual(1)
      })
      
      test('should checkout the coding scheme if the user clicks the coding scheme button', () => {
        const spy = jest.spyOn(props.actions, 'lockCodingSchemeRequest')
        const wrapper = setup({ empty: true })
        const button = wrapper.find('WithTheme(Button)').filterWhere(node => node.prop('value') === 'Check out')
        button.simulate('click')
        expect(spy).toHaveBeenCalled()
      })
      
      test('should display checkout text', () => {
        const wrapper = setup({ empty: true })
        expect(wrapper.find('WithStyles(Typography)').at(3).childAt(0).text()).toEqual(
          'The coding scheme is empty. To get started, check out the coding scheme for editing.'
        )
      })
    })
  })
  
  describe('locked alert', () => {
    test('should show an alert if the coding scheme is checked out', () => {
      const wrapper = setup({
        currentUser: { userId: 3, role: 'Coordinator' },
        lockedByCurrentUser: false,
        hasLock: true,
        lockedAlert: true
      })
      expect(wrapper.find('Alert').at(2).prop('open')).toEqual(true)
    })
    
    test('should close the locked alert if the user clicks the dismiss button', () => {
      const spy = jest.spyOn(props.actions, 'closeLockedAlert')
      const wrapper = setup({
        currentUser: { userId: 3, role: 'Coordinator' },
        lockedByCurrentUser: false,
        hasLock: true,
        lockedAlert: true
      })
      wrapper.find('Alert').at(2).simulate('closeAlert')
      expect(spy).toHaveBeenCalled()
    })
    
    test(
      'should show an alert with the ability to override lock if the scheme is checked out and the logged in user is an admin',
      () => {
        const wrapper = setup({
          lockedByCurrentUser: false,
          hasLock: true,
          lockedAlert: true
        })
        expect(wrapper.find('Alert').at(2).prop('actions').length).toEqual(1)
      }
    )
    
    test('should send a request to override lock if the user clicks the override lock button', () => {
      const spy = jest.spyOn(props.actions, 'unlockCodingSchemeRequest')
      const wrapper = setup({
        lockedByCurrentUser: false,
        hasLock: true,
        lockedAlert: true
      })
      wrapper.find('Alert').at(2).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('Deleting a question', () => {
    test('should open a confirmation alert when the user clicks the delete icon for a question', () => {
      const wrapper = setup({ lockedByCurrentUser: true, questions: [{ text: 'blah' }] })
      wrapper.find('withRouter(Scheme)').prop('onDeleteQuestion')(1, [1, 2])
      expect(wrapper.find('Alert').at(1).prop('open')).toEqual(true)
    })
    
    test('should delete the question when the user confirms deletion', () => {
      const spy = jest.spyOn(props.actions, 'deleteQuestionRequest')
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.setState({ deleteQuestionAlertOpen: true })
      wrapper.find('Alert').at(1).prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should close the alert when the user cancels deletion', () => {
      const wrapper = setup({ lockedByCurrentUser: true })
      wrapper.setState({ deleteQuestionAlertOpen: true })
      wrapper.find('Alert').at(1).simulate('closeAlert')
      expect(wrapper.state('deleteQuestionAlertOpen')).toEqual(false)
    })
  })
  
  describe('Copying the coding scheme', () => {
    test('should show the project search if the user clicks the Copy Coding Scheme button', () => {
      const wrapper = setup({ lockedByCurrentUser: true, empty: true })
      wrapper.find('WithTheme(Button)').at(1).simulate('click')
      expect(wrapper.find('WithStyles(Modal)').length).toEqual(1)
    })
    
    test('should send a request to copy the coding scheme when the user chooses a project to copy from', () => {
      const spy = jest.spyOn(props.actions, 'copyCodingSchemeRequest')
      const wrapper = setup({
        lockedByCurrentUser: true,
        empty: true,
        projectAutocompleteProps: { ...props.projectAutocompleteProps, selectedSuggestion: { id: 3 } }
      })
      wrapper.setState({ projectSearchOpen: true })
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should close the project search if the user cancels copying', () => {
      const spy = jest.spyOn(props.projectAutoActions, 'clearAll')
      const wrapper = setup({
        lockedByCurrentUser: true,
        empty: true,
        projectAutocompleteProps: { ...props.projectAutocompleteProps, selectedSuggestion: { id: 3 } }
      })
      wrapper.setState({ projectSearchOpen: true })
      wrapper.find('WithStyles(ModalActions)').prop('actions')[0].onClick()
      expect(spy).toHaveBeenCalled()
      expect(wrapper.state('projectSearchOpen')).toEqual(false)
    })
    
    test('should close the project search if the copy completes successfully', () => {
      const wrapper = setup({ lockedByCurrentUser: true, empty: true, copying: true })
      wrapper.setState({ projectSearchOpen: true })
      wrapper.setProps({ copying: false })
      expect(wrapper.state('projectSearchOpen')).toEqual(false)
    })
    
    test('should open an alert if there is an error copying the scheme', () => {
      const wrapper = setup({ lockedByCurrentUser: true, empty: true, copying: true, alertError: 'Failed' })
      wrapper.setState({ projectSearchOpen: true })
      wrapper.setProps({ copying: false })
      expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
    })
    
    test('should close the alert if the user clicks the dismiss button', () => {
      const spy = jest.spyOn(props.actions, 'resetAlertError')
      const wrapper = setup({ alertError: 'Failed' })
      wrapper.find('ApiErrorAlert').simulate('closeAlert')
      expect(spy).toHaveBeenCalled()
    })
  })
})
