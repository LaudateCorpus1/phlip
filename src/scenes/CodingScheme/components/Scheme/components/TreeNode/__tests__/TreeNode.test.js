import React from 'react'
import { shallow } from 'enzyme'
import { TreeNode } from '../index'

const props = {
  children: [],
  listIndex: 0,
  swapFrom: null,
  swapLength: null,
  swapDepth: 0,
  scaffoldBlockPxWidth: 100,
  lowerSiblingCounts: [0],
  connectDropTarget: node => node,
  isOver: false,
  draggedNode: null,
  path: [0],
  canDrop: false,
  treeIndex: 0,
  treeId: 'rst__1',
  getPrevRow: jest.fn(),
  rowDirection: 'ltr',
  style: {
    height: 75,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  node: {}
}

const setup = (other = {}) => {
  return shallow(<TreeNode {...props} {...other} />)
}

describe('CodingScheme - Scheme - TreeNode component', () => {
  test('should render correctly', () => {
    expect(setup()).toMatchSnapshot()
  })
  
  describe('setting scaffolding', () => {
    test('should add a scaffolding block for each nested depth', () => {
      const wrapper = setup({ lowerSiblingCounts: [2, 1, 1], treeIndex: 2, listIndex: 2 })
      expect(wrapper.children().length).toEqual(3)
      expect(wrapper.childAt(0).prop('className')).toEqual('lineBlock lineFullVertical')
      expect(wrapper.childAt(1).prop('className')).toEqual('lineBlock lineFullVertical')
      expect(wrapper.childAt(2).prop('className')).toEqual('lineBlock lineHalfHorizontalRight lineFullVertical')
    })
    
    test('should handle if the question is the last question in the scheme but not the only question', () => {
      const wrapper = setup({ lowerSiblingCounts: [0], treeIndex: 2, listIndex: 2 })
      expect(wrapper.childAt(0).prop('className')).toEqual('lineBlock lineHalfVerticalTop lineHalfHorizontalRight')
    })
    
    test('should handle if the question is the first question but not the only question in the scheme', () => {
      const wrapper = setup({ lowerSiblingCounts: [1], treeIndex: 0, listIndex: 0 })
      expect(wrapper.childAt(0).prop('className')).toEqual('lineBlock lineHalfHorizontalRight lineHalfVerticalBottom')
    })
    
    test('should handle if the question is the only question in the scheme', () => {
      const wrapper = setup()
      expect(wrapper.children().length).toEqual(1)
      expect(wrapper.childAt(0).prop('className')).toEqual('lineBlock lineHalfHorizontalRight')
    })
  })
  
  describe('when the user is dragging a question over a node to drop', () => {
    test('should highlight the scaffolding of the dragging node', () => {
      const wrapper = setup({
        lowerSiblingCounts: [1, 1],
        listIndex: 3,
        treeIndex: 6,
        swapFrom: 6,
        swapLength: 2,
        swapDepth: 1
      })
      expect(wrapper.childAt(2).prop('className')).toEqual('absoluteLineBlock highlightTopLeftCorner')
    })
    
    test('should highlight the scaffolding if the node if in between the target and destination', () => {
      const wrapper = setup({
        lowerSiblingCounts: [1, 1],
        listIndex: 5,
        treeIndex: 6,
        swapFrom: 5,
        swapLength: 2,
        swapDepth: 1
      })
      expect(wrapper.childAt(2).prop('className')).toEqual('absoluteLineBlock highlightLineVertical')
    })
    
    test('should higlight the scaffolding of the final destination of the dragged node', () => {
      const wrapper = setup({
        lowerSiblingCounts: [1, 0],
        listIndex: 3,
        treeIndex: 6,
        swapFrom: 2,
        swapLength: 2,
        swapDepth: 1
      })
      expect(wrapper.childAt(2).prop('className')).toEqual('absoluteLineBlock highlightBottomLeftCorner')
    })
  })
})
