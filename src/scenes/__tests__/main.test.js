import React from 'react'
import { Main } from '../main'
import { shallow } from 'enzyme'

const props = {
  history: {
    location: {
      pathname: '/home'
    },
    goBack: jest.fn(),
    push: jest.fn()
  },
  pdfFile: null,
  actions: {
    setPreviousLocation: jest.fn()
  },
  location: { pathname: '/home' },
  isLoggedIn: true,
  isRefreshing: true,
  user: {},
  pdfError: '',
  previousLocation: {}
}

describe('Main scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Main {...props} />)).toMatchSnapshot()
  })
  
  describe('opening profile or user management page', () => {
    test('should push /user/profile onto the history if logged in user is not an admin', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = shallow(<Main {...props} user={{ role: 'Coder', id: 4, avatar: '' }} />)
      wrapper.instance().handleOpenAdminPage()
      expect(spy).toHaveBeenCalledWith({
        pathname: '/user/profile',
        state: {
          isEdit: false,
          avatar: '',
          userId: 4,
          modal: true,
          selfUpdate: true
        }
      })
    })
  })
})
