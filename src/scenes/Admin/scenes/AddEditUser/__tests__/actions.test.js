import actions, { types } from '../actions'

const user = {
  firstName: 'Test',
  lastName: 'User',
  role: 'Admin',
  avatar: '',
  email: 'test@test.test'
}

describe('Admin - AddEditUser action creators', () => {
  test('should create an action to add a user', () => {
    const expected = {
      type: types.ADD_USER_REQUEST,
      user
    }
    
    expect(actions.addUserRequest(user)).toEqual(expected)
  })
  
  test('should create an action to update user', () => {
    const expected = {
      type: types.UPDATE_USER_REQUEST,
      user,
      selfUpdate: false
    }
    
    expect(actions.updateUserRequest(user, false)).toEqual(expected)
  })
  
  test('should create an action to update current user', () => {
    const expected = {
      type: types.UPDATE_CURRENT_USER,
      payload: {
        firstName: 'Tester'
      }
    }
    
    expect(actions.updateCurrentUser({ firstName: 'Tester' })).toEqual(expected)
  })
  
  test('should create an action to add a user picture', () => {
    const expected = {
      type: types.ADD_USER_IMAGE_REQUEST,
      userId: 1,
      patchOperation: [{ op: 'add', path: '/avatar', value: 'lalala' }],
      user,
      selfUpdate: false
    }
    
    expect(actions.addUserPictureRequest(1, [{ op: 'add', path: '/avatar', value: 'lalala' }], user, false))
      .toEqual(expected)
  })
  
  test('should create to delete a user picture', () => {
    const expected = {
      type: types.DELETE_USER_IMAGE_REQUEST,
      userId: 1,
      operation: [{ op: 'add', path: '/avatar', value: 'lalala' }],
      user,
      selfUpdate: false
    }
  
    expect(actions.deleteUserPictureRequest(1, [{ op: 'add', path: '/avatar', value: 'lalala' }], user, false))
      .toEqual(expected)
  })
  
  test('should create an action to handle when the modal closes', () => {
    const expected = {
      type: types.ON_CLOSE_ADD_EDIT_USER
    }
    
    expect(actions.onCloseAddEditUser()).toEqual(expected)
  })
  
  test('should create an action to load avatar when modal opens', () => {
    const expected = {
      type: types.LOAD_ADD_EDIT_AVATAR,
      avatar: 'this is an avatar'
    }
    
    expect(actions.loadAddEditAvatar('this is an avatar')).toEqual(expected)
  })
  
  test('should create an action to reset form error', () => {
    const expected = {
      type: types.RESET_USER_FORM_ERROR
    }
    
    expect(actions.resetFormError()).toEqual(expected)
  })
})
