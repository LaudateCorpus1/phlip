import React from 'react'
import { shallow } from 'enzyme'
import { DetailRow } from '../index'
import TextInput from 'components/TextInput'

const props = {
  name: 'type',
  type: 'text',
  label: 'Type',
  component: TextInput,
  disabled: false
}

describe('AddEditProject -- DetailRow component', () => {
  test('should render correctly', () => {
    expect(shallow(<DetailRow {...props} />)).toMatchSnapshot()
  })
})