import React from 'react'
import { shallow } from 'enzyme'
import { Navigator } from '../index'

const props = {
  handleQuestionSelected: jest.fn(),
  currentQuestion: { id: 2 },
  selectedCategory: 0,
  tree: [
    { id: 1, text: 'question 1', indent: 0, number: '1', parentId: 0, positionInParent: 0 },
    { id: 4, text: 'question 2', indent: 0, number: '2', parentId: 0, positionInParent: 1 },
    {
      id: 2, text: 'question 3', indent: 0, number: '3', parentId: 0, positionInParent: 2,
      expanded: true,
      children: [
        { id: 3, text: 'question 4', indent: 1, number: '3.1', parentId: 2, positionInParent: 0 }
      ]
    }
  ]
}

describe('CodingValidation scene - Navigator', () => {
  test('should render correctly', () => {
    expect(shallow(<Navigator {...props} />)).toMatchSnapshot()
  })
  
  test('should return expanded item count', () => {
    const nav = shallow(<Navigator {...props} />)
    expect(nav.instance().getExpandedItemCount(props.tree[2])).toEqual(2)
  })
  
  test('should return row height depending on children', () => {
    const nav = shallow(<Navigator {...props} />)
    expect(nav.instance().rowHeight(props.tree)({ index: 2 })).toEqual(80)
  })
  
  describe('Resizing the navigator', () => {
    const nav = shallow(<Navigator {...props} />)
    
    test('should update list width during resize events', () => {
      nav.find('Resizable').simulate('resize', null, null, null, { width: 25 })
      expect(nav.state().list.width).toEqual(325)
      nav.setState({
        width: 300
      })
    })
    
    test('should update navigator width when resizing stops', () => {
      nav.find('Resizable').simulate('resizeStop', null, null, null, { width: 25 })
      expect(nav.state().width).toEqual(325)
      nav.setState({
        width: 300
      })
    })
    
    test('should update list width when resizing stops', () => {
      nav.find('Resizable').simulate('resizeStop', null, null, null, { width: 25 })
      expect(nav.state().list.width).toEqual(325)
    })
  })
})
