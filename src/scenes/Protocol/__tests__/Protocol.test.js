import React from 'react'
import { shallow } from 'enzyme'
import { Protocol } from '../index'

const props = {
  projectName: 'Test Project',
  projectId: '12345',
  protocolContent: 'this is the text of the protocol',
  getProtocolError: false,
  submitting: false,
  lockedByCurrentUser: false,
  lockInfo: {},
  lockedAlert: null,
  hasLock: false,
  alertError: '',
  currentUser: {
    role: 'Coordinator'
  },
  history: {
    goBack: jest.fn()
  },
  actions: {
    getProtocolRequest: jest.fn(),
    unlockProtocolRequest: jest.fn(),
    resetLockAlert: jest.fn(),
    updateEditedFields: jest.fn(),
    lockProtocolRequest: jest.fn(),
    saveProtocolRequest: jest.fn(),
    updateProtocol: jest.fn(),
    resetAlertError: jest.fn(),
    clearState: jest.fn()
  }
}

describe('Protocol scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Protocol {...props} />)).toMatchSnapshot()
  })
  
  test('should clear state when unmounting', () => {
    const spy = jest.spyOn(props.actions, 'clearState')
    const wrapper = shallow(<Protocol {...props} />)
    wrapper.unmount()
    expect(spy).toHaveBeenCalled()
  })
  
  test('should show a card error if there was an error getting the protocol', () => {
    const wrapper = shallow(<Protocol {...props} getProtocolError />)
    expect(wrapper.find('CardError').length).toEqual(1)
  })
  
  describe('component did update edit mode', () => {
    test('should turn on edit mode if the current user locks the protocol', () => {
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.setProps({ lockedByCurrentUser: true })
      wrapper.update()
      expect(wrapper.state('editMode')).toEqual(true)
    })
    
    test('should turn off edit mode if there was no error submitting', () => {
      const wrapper = shallow(<Protocol {...props} submitting />)
      wrapper.setProps({ submitting: false })
      expect(wrapper.state('editMode')).toEqual(false)
    })
    
    test('should not turn off edit mode if there was an error submitting', () => {
      const wrapper = shallow(<Protocol {...props} submitting />)
      wrapper.setState({ editMode: true })
      wrapper.setProps({ submitting: false, alertError: 'error happened' })
      wrapper.update()
      expect(wrapper.state('editMode')).toEqual(true)
    })
  })
  
  describe('Saving Error', () => {
    test('should show an api error if an error occurred during submitting', () => {
      const wrapper = shallow(<Protocol {...props} alertError="Error happened" />)
      expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
      expect(wrapper.find('ApiErrorAlert').prop('content')).toEqual('Error happened')
    })
    
    test('should close alert when dismiss is clicked', () => {
      const resetSpy = jest.spyOn(props.actions, 'resetAlertError')
      const wrapper = shallow(<Protocol {...props} alertError="Error happened" />)
      wrapper.find('ApiErrorAlert').prop('onCloseAlert')()
      expect(resetSpy).toHaveBeenCalled()
    })
  })
  
  describe('Editing', () => {
    test('should send a request to lock the Protocol when editing is enabled', () => {
      const lockSpy = jest.spyOn(props.actions, 'lockProtocolRequest')
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').onClick()
      expect(lockSpy).toHaveBeenCalled()
    })
    
    test('should show the editor when edit mode is enabled', () => {
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.setState({ editMode: true })
      expect(wrapper.find('Editor').length).toEqual(1)
    })
    
    test('should save protocol when in edit mode and the Save button is clicked', () => {
      const saveSpy = jest.spyOn(props.actions, 'saveProtocolRequest')
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.setState({ editMode: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').onClick()
      expect(saveSpy).toHaveBeenCalled()
    })
    
    test('should send a request to unlock protocol when Save is clicked', () => {
      const saveSpy = jest.spyOn(props.actions, 'unlockProtocolRequest')
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.setState({ editMode: true })
      wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').onClick()
      expect(saveSpy).toHaveBeenCalled()
    })
    
    describe('Protocol Editor', () => {
      test('protocol action button should save "Save"', () => {
        const wrapper = shallow(<Protocol {...props} />)
        wrapper.setState({ editMode: true })
        expect(wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').text).toEqual('Save')
      })
      
      test('aria-label should say Edit Protocol when in edit mode', () => {
        const wrapper = shallow(<Protocol {...props} />)
        wrapper.setState({ editMode: true })
        expect(wrapper.find('withRouter(WithTheme(PageHeader))').prop('otherButton').otherProps['aria-label'])
          .toEqual('Edit protocol')
      })
      
      test('should update protocol when changes are made', () => {
        const updateSpy = jest.spyOn(props.actions, 'updateProtocol')
        const event = {
          target: {
            getContent: jest.fn()
          }
        }
        const wrapper = shallow(<Protocol {...props} />)
        wrapper.setState({ editMode: true })
        wrapper.find('Editor').simulate('change', event)
        expect(updateSpy).toHaveBeenCalled()
      })
    })
  })
  
  describe('Clicking back button', () => {
    test('should show an alert if the user tries to go back if it is locked by them or in edit mode', () => {
      const wrapper = shallow(<Protocol {...props} lockedByCurrentUser />)
      wrapper.instance().onGoBack()
      wrapper.update()
      expect(wrapper.find('Alert').at(0).prop('open')).toEqual(true)
    })
    
    test('should not show an alert if it is not locked by them or in edit mode', () => {
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.instance().onGoBack()
      wrapper.update()
      expect(wrapper.find('Alert').at(0).prop('open')).toEqual(false)
    })
    
    test('should go back in history if it is not locked or in edit mode', () => {
      const goBackSpy = jest.spyOn(props.history, 'goBack')
      const wrapper = shallow(<Protocol {...props} />)
      wrapper.instance().onGoBack()
      expect(goBackSpy).toHaveBeenCalled()
    })
  })
  
  describe('Unsaved changes', () => {
    test('should discard changes when continue is clicked', () => {
      const unlockSpy = jest.spyOn(props.actions, 'unlockProtocolRequest')
      const wrapper = shallow(<Protocol {...props} lockedByCurrentUser />)
      wrapper.instance().onGoBack()
      wrapper.update()
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(unlockSpy).toHaveBeenCalled()
    })
    
    test('should go back in history if continue is clicked', () => {
      const goBackSpy = jest.spyOn(props.history, 'goBack')
      const wrapper = shallow(<Protocol {...props} lockedByCurrentUser />)
      wrapper.instance().onGoBack()
      wrapper.update()
      wrapper.find('Alert').at(0).prop('actions')[0].onClick()
      expect(goBackSpy).toHaveBeenCalled()
    })
    
    test('should close alert when cancel is clicked', () => {
      const wrapper = shallow(<Protocol {...props} lockedByCurrentUser />)
      wrapper.instance().onGoBack()
      wrapper.update()
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      wrapper.update()
      expect(wrapper.find('Alert').at(0).prop('open')).toEqual(false)
    })
  })
  
  describe('Locked alert', () => {
    test('should show an alert if the protocol is currently checked out (locked)', () => {
      const wrapper = shallow(
        <Protocol
          {...props}
          lockInfo={{ userId: 5, firstName: 'Test', lastName: 'User' }}
          lockedAlert
        />
      )
      expect(wrapper.find('Alert').at(1).prop('open')).toEqual(true)
    })
    
    test('should show "unavailable to edit" with only one dismiss action if user is not an admin', () => {
      const wrapper = shallow(
        <Protocol
          {...props}
          lockInfo={{ userId: 5, firstName: 'Test', lastName: 'User' }}
          lockedAlert
        />
      )
      expect(wrapper.find('Alert').at(1).dive().find('WithStyles(ModalActions)').prop('actions')[0].value)
        .toEqual('Dismiss')
    })
    
    test('should dismiss the locked alert if the dismiss button is clicked', () => {
      const closeSpy = jest.spyOn(props.actions, 'resetLockAlert')
      const wrapper = shallow(
        <Protocol
          {...props}
          lockInfo={{ userId: 5, firstName: 'Test', lastName: 'User' }}
          lockedAlert
        />
      )
      
      wrapper.find('Alert').at(1).prop('onCloseAlert')()
      expect(closeSpy).toHaveBeenCalled()
    })
    
    test('should show "unavailable to edit" with the release lock action and cancel if user is an admin', () => {
      const wrapper = shallow(
        <Protocol
          {...props}
          lockInfo={{ userId: 5, firstName: 'Test', lastName: 'User' }}
          lockedAlert
          currentUser={{ id: 4, role: 'Admin' }}
        />
      )
      expect(wrapper.find('Alert').at(1).prop('actions').length).toEqual(1)
      expect(wrapper.find('Alert').at(1).prop('actions')[0].value).toEqual('Unlock')
    })
    
    test('should release the lock on the protocol when the release lock button is clicked', () => {
      const releaseSpy = jest.spyOn(props.actions, 'unlockProtocolRequest')
      const wrapper = shallow(
        <Protocol
          {...props}
          lockInfo={{ userId: 5, firstName: 'Test', lastName: 'User' }}
          lockedAlert
          currentUser={{ id: 4, role: 'Admin' }}
        />
      )
      
      wrapper.find('Alert').at(1).prop('actions')[0].onClick()
      expect(releaseSpy).toHaveBeenCalled()
    })
  })
})
