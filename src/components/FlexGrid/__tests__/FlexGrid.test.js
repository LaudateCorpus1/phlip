import React from 'react'
import { shallow } from 'enzyme'
import { FlexGrid } from '../index'

const props = {
  type: 'column',
  flex: false,
  container: false,
  align: 'stretch',
  justify: 'stretch',
  style: {},
  padding: 0,
  raised: false,
  circular: false
}

describe('FlexGrid', () => {
  test('should render correctly', () => {
    expect(shallow(<FlexGrid {...props}>Test Here</FlexGrid>)).toMatchSnapshot()
  })
})
