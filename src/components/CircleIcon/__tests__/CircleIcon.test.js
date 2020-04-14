import React from 'react'
import { shallow } from 'enzyme'
import { CircleIcon } from '../index'

const props = {
  circleColor: 'error',
  iconColor: '#fff',
  iconSize: 18,
  circleSize: 32,
  children: 'home',
  theme: {
    palette: {
      error: {
        500: '#ff3d70'
      }
    }
  }
}

describe('CircleIcon component', () => {
  test('should render correctly', () => {
    expect(shallow(<CircleIcon {...props} />)).toMatchSnapshot()
  })
})