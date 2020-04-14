import React from 'react'
import { AddEditUser } from '../index'
import { shallow } from 'enzyme'

const props = {
  users: [],
  avatar: '',
  currentUser: { id: 1, firstName: 'test', lastName: 'user', avatar: '' },
  actions: {
    loadAddEditAvatar: jest.fn(),
    addUserRequest: jest.fn(),
    updateUserRequest: jest.fn(),
    updateCurrentUser: jest.fn(),
    onCloseAddEditUser: jest.fn()
  },
  formActions: {},
  location: {
    pathname: '/admin/new/user'
  },
  match: {
    params: {}
  },
  history: {
    push: jest.fn(),
    goBack: jest.fn()
  },
  onCloseModal: jest.fn(),
  formError: '',
  isDoneSubmitting: false,
  onSubmitError: jest.fn(),
  selectedUser: {}
}

describe('User Management - AddEditUser scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditUser {...props} />)).toMatchSnapshot()
  })
  
  describe('self updating', () => {
    test('should set modal title to "Profile"', () => {
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/user/profile', params: {} }}
          selectedUser={props.currentUser}
        />
      )
      expect(wrapper.find('WithStyles(ModalForm)').prop('title')).toEqual('Profile')
    })
    
    test('should set document title to "PHLIP - User Management - Profile"', () => {
      shallow(
        <AddEditUser
          {...props}
          match={{ url: '/user/profile', params: {} }}
          selectedUser={props.currentUser}
        />
      )
      expect(window.document.title).toEqual('PHLIP - User Management - Profile')
    })
    
    test('should load current avatar', () => {
      const spy = jest.spyOn(props.actions, 'loadAddEditAvatar')
      shallow(
        <AddEditUser
          {...props}
          match={{ url: '/user/profile', params: {} }}
          selectedUser={props.currentUser}
        />
      )
      expect(spy).toHaveBeenCalled()
    })
    
    test('should push /user/profile/avatar when opening avatar form', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/user/profile', params: {} }}
          selectedUser={props.currentUser}
        />
      )
      wrapper.instance().openAvatarForm({})
      expect(spy).toHaveBeenCalledWith({
        pathname: '/user/profile/avatar',
        state: {
          avatar: undefined,
          userId: 1,
          modal: true
        }
      })
    })
  })
  
  describe('adding a user', () => {
    test('should set document title to "PHLIP - User Management - Add User"', () => {
      shallow(<AddEditUser {...props} match={{ url: '/admin/new/user', params: {} }} selectedUser={null} />)
      expect(window.document.title).toEqual('PHLIP - User Management - Add User')
    })
    
    test('should set modal title to "Add New User"', () => {
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/new/user', params: {} }}
          selectedUser={null}
        />
      )
      expect(wrapper.find('WithStyles(ModalForm)').prop('title')).toEqual('Add New User')
    })
  })
  
  describe('updating a user', () => {
    test('should set document title to "PHLIP - User Management - Edit Test User"', () => {
      shallow(
        <AddEditUser
          {...props}
          match={{
            url: '/admin/edit/user/4',
            params: { id: 4 }
          }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      expect(window.document.title).toEqual('PHLIP - User Management - Edit Test User')
    })
    
    test('should set modal title to "Edit User"', () => {
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{
            url: '/admin/edit/user/4',
            params: { id: 4 }
          }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      expect(wrapper.find('WithStyles(ModalForm)').prop('title')).toEqual('Edit User')
    })
  
    test('should load current avatar', () => {
      const spy = jest.spyOn(props.actions, 'loadAddEditAvatar')
      shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      expect(spy).toHaveBeenCalled()
    })
  
    test('should push /admin/edit/user/:id/avatar when opening avatar form', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      wrapper.instance().openAvatarForm({})
      expect(spy).toHaveBeenCalledWith({
        pathname: '/admin/edit/user/4/avatar',
        state: {
          avatar: undefined,
          userId: 4,
          modal: true
        }
      })
    })
  })
  
  describe('leaving form', () => {
    test('should go back in history', () => {
      const spy = jest.spyOn(props.history, 'goBack')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      wrapper.instance().onCancel()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should clear state', () => {
      const spy = jest.spyOn(props.actions, 'onCloseAddEditUser')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
        />
      )
      wrapper.instance().onCancel()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('handling submit', () => {
    test('should call onSubmitError to show an alert if there was an error during submission', () => {
      const spy = jest.spyOn(props, 'onSubmitError')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
          submitting
        />
      )
      wrapper.setProps({
        submitting: false,
        formError: 'something went wrong'
      })
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  
    test('should go back in history if there was not an error during submission', () => {
      const spy = jest.spyOn(props.history, 'goBack')
      const wrapper = shallow(
        <AddEditUser
          {...props}
          match={{ url: '/admin/edit/user/4', params: { id: 4 } }}
          selectedUser={{ id: 4, firstName: 'Test', lastName: 'User' }}
          submitting
        />
      )
      wrapper.setProps({
        submitting: false,
        formError: '',
        goBack: true
      })
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
