import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from '../index'

const props = {
  open: true,
  title: 'Test alert title',
  actions: [
    { value: 'Cancel', type: 'button', onClick: () => {} },
    { value: 'Continue', type: 'button', onClick: () => {} }
  ],
  children: <div>I am the alert content.</div>
}

describe('Alert component', () => {
  test('should render correctly', () => {
    expect(shallow(<Alert {...props} />)).toMatchSnapshot()
  })
})