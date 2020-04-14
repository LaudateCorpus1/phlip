import React from 'react'
import { shallow } from 'enzyme'
import { Avatar } from '../index'

const props = {
  big: false,
  avatar: null,
  initials: 'AU',
  style: {},
  theme: { palette: { secondary: { main: '#38a48e' } } },
  cardAvatar: false
}

describe('Avatar component', () => {
  test('should render correctly', () => {
    expect(shallow(<Avatar {...props} />)).toMatchSnapshot()
  })
})