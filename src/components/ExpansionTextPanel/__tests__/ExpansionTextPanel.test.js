import React from 'react'
import { shallow } from 'enzyme'
import { ExpansionTextPanel } from '../index'

const props = {
  text: 'This is the text of the panel',
  textProps: {
    tooltipText: 'tooltip text'
  },
  dropdownIconProps: {}
}

describe('ExpansionTextPanel', () => {
  test('should render correctly', () => {
    expect(shallow(<ExpansionTextPanel {...props} />)).toMatchSnapshot()
  })
})
