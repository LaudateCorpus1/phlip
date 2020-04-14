import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { AvatarMenu } from '../index'
import { Provider } from 'react-redux'
import { createMockStore } from 'utils/testData/createMockStore'

const avatar = 'data:image/jpeg;base64,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'

const props = {
  role: 'Admin',
  initials: 'TU',
  open: false,
  onLogoutUser: jest.fn(),
  onToggleMenu: jest.fn(),
  onOpenAdminPage: jest.fn(),
  onOpenHelpPdf: jest.fn(),
  avatar: '',
  userName: 'Test User'
}

const store = createMockStore()

const setup = otherProps => {
  return mount(
    <Provider store={store}>
      <MemoryRouter>
        <AvatarMenu {...props} {...otherProps} />
      </MemoryRouter>
    </Provider>
  )
}

describe('Header -- AvatarMenu', () => {
  test('should render correctly', () => {
    expect(shallow(<AvatarMenu {...props} />)).toMatchSnapshot()
  })
  
  test('should call to open menu when Avatar is clicked', () => {
    const wrapper = setup()
    wrapper.find('Avatar').at(0).simulate('click')
    wrapper.update()
    expect(wrapper.find('AvatarMenu').prop('onToggleMenu')).toHaveBeenCalled()
  })
  
  test('should open the menu when open is true', () => {
    const wrapper = setup({ open: true })
    expect(wrapper.find('MenuList').exists()).toBeTruthy()
  })
  
  test('should call logout when the logout menu item is clicked', () => {
    const wrapper = setup({ open: true })
    wrapper.find('MenuList').find('MenuItem').at(1).simulate('click')
    wrapper.update()
    expect(wrapper.find('AvatarMenu').prop('onLogoutUser')).toHaveBeenCalled()
  })
  
  test('should toggle menu if user clicks away when the menu is open', () => {
    const spy = jest.spyOn(props, 'onToggleMenu')
    const wrapper = shallow(<AvatarMenu {...props} open />)
    wrapper.instance().handleClickAway()
    expect(spy).toHaveBeenCalled()
    spy.mockReset()
  })
  
  test('should not toggle menu if user clicks away when the menu is not open', () => {
    const spy = jest.spyOn(props, 'onToggleMenu')
    const wrapper = shallow(<AvatarMenu {...props} />)
    wrapper.instance().handleClickAway()
    expect(spy).not.toHaveBeenCalled()
  })
  
  test('should toggle menu when avatar is focused by pressing enter', () => {
    const spy = jest.spyOn(props, 'onToggleMenu')
    const wrapper = setup({ open: true })
    wrapper.find('Avatar').at(0).simulate('keypress', { key: 'Enter' })
    wrapper.update()
    expect(spy).toHaveBeenCalled()
    spy.mockReset()
  })
  
  test('should toggle menu when avatar is focused by tabbing', () => {
    const spy = jest.spyOn(props, 'onToggleMenu')
    const wrapper = setup({ open: true })
    wrapper.find('Avatar').at(0).simulate('keypress', { key: ' ' })
    wrapper.update()
    expect(spy).toHaveBeenCalled()
    spy.mockReset()
  })
  
  test('should not toggle menu when avatar is focused by keyboard but not by tab or enter', () => {
    const spy = jest.spyOn(props, 'onToggleMenu')
    const wrapper = setup({ open: true })
    wrapper.find('Avatar').at(0).simulate('keypress', { key: 'blerp' })
    wrapper.update()
    expect(spy).not.toHaveBeenCalled()
    spy.mockReset()
  })
  
  test('should pass an empty string as initials to the Avatar if the user doesn\'t have initials', () => {
    const wrapper = setup({ open: true, initials: undefined })
    expect(wrapper.find('Avatar').at(0).prop('initials')).toEqual('')
  })
  
  describe('when logged in user is an admin', () => {
    test('first menu item should say User Management', () => {
      const wrapper = setup({ role: 'Admin', open: true })
      expect(wrapper.find('MenuList').find('MenuItem').length).toEqual(3)
      expect(wrapper.find('MenuList').find('MenuItem').at(0).find('ListItemText').text()).toEqual('User Management')
    })
    
    test('should call onOpenAdminPage when first menu item is clicked', () => {
      const spy = jest.spyOn(props, 'onOpenAdminPage')
      const wrapper = setup({ role: 'Admin', open: true })
      wrapper.find('MenuList').find('MenuItem').at(0).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('when logged in user is a coder', () => {
    test('first menu item should say Profile if logged in user is not an admin', () => {
      const wrapper = setup({ role: 'Coder', open: true })
      expect(wrapper.find('MenuList').find('MenuItem').length).toEqual(3)
      expect(wrapper.find('MenuList').find('MenuItem').at(0).find('ListItemText').text())
        .toEqual('Profile')
    })
    
    test('should call to open profile when first item is clicked', () => {
      const spy = jest.spyOn(props, 'onOpenAdminPage')
      const wrapper = setup({ role: 'Coder', open: true, avatar })
      wrapper.find('MenuList').find('MenuItem').at(0).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('when logged in user is a coordinator', () => {
    test('first menu item should say Profile if logged in user is not an admin', () => {
      const wrapper = setup({ role: 'Coordinator', open: true })
      expect(wrapper.find('MenuList').find('MenuItem').length).toEqual(3)
      expect(wrapper.find('MenuList').find('MenuItem').at(0).find('ListItemText').text())
        .toEqual('Profile')
    })
    
    test('should call to open profile when first item is clicked', () => {
      const spy = jest.spyOn(props, 'onOpenAdminPage')
      const wrapper = setup({ role: 'Coordinator', open: true, avatar })
      wrapper.find('MenuList').find('MenuItem').at(0).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
