import React from 'react'
import { shallow } from 'enzyme'
import { ApiErrorAlert } from '../index'

const props = {
  open: true,
  content: <div>This is the error alert content.</div>,
  onCloseAlert: () => {}
}

describe('ApiErrorAlert component', () => {
  test('should render correctly', () => {
    expect(shallow(<ApiErrorAlert {...props} />)).toMatchSnapshot()
  })
})