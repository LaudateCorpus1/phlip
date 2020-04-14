import React from 'react'
import { shallow } from 'enzyme'
import { QuestionNode } from '../index'
import { schemeFromApi, schemeTree } from 'utils/testData/scheme'

const props = {
  listIndex: 0,
  node: {
    text: 'la la la',
    hovering: false,
    id: 22
  },
  lowerSiblingCounts: [0],
  path: [0],
  scaffoldBlockPxWidth: 50,
  treeIndex: 0,
  isDragging: false,
  isOver: false,
  projectId: 4,
  didDrop: false,
  canModify: true,
  canDrag: true,
  onDeleteQuestion: jest.fn(),
  connectDragPreview: preview => preview,
  connectDragSource: handle => handle,
  toggleChildrenVisibility: jest.fn(),
  onOpenAddEditModal: jest.fn()
}

const setup = (other = {}) => {
  return shallow(<QuestionNode {...props} {...other} />)
}

describe('CodingScheme -- Scheme -- QuestionNode', () => {
  test('should render correctly', () => {
    expect(shallow(<QuestionNode {...props} />)).toMatchSnapshot()
  })
  
  describe('Question hovering', () => {
    test('should call setHoveredStatus on mouse enter', () => {
      const wrapper = setup()
      const card = wrapper.find('WithStyles(CardContent)').dive()
      const spy = jest.spyOn(wrapper.instance(), 'setHoveredStatus')
      card.find('CardContent').simulate('mouseenter')
      card.update()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should call turnOffHover on mouse leave', () => {
      const wrapper = setup()
      const card = wrapper.find('WithStyles(CardContent)').dive()
      const spy = jest.spyOn(wrapper.instance(), 'setHoveredStatus')
      card.find('CardContent').simulate('mouseleave')
      card.update()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should display actions if hovering = true and canModify = true', () => {
      const wrapper = setup({ node: { text: 'la la la' } })
      wrapper.setState({ hovered: true })
      const card = wrapper.find('WithStyles(CardContent)').dive()
      expect(card.find('CardContent').find('WithTheme(Button)')).toHaveLength(3)
    })
    
    describe('hovering without edit mode enabled', () => {
      test('should only display one action button', () => {
        const wrapper = setup({ node: { text: 'la la la' }, canModify: false })
        wrapper.setState({ hovered: true })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('CardContent').find('WithTheme(Button)')).toHaveLength(1)
      })
  
      test('should display an eyeball icon in button', () => {
        const wrapper = setup({ node: { text: 'la la la' }, canModify: false })
        wrapper.setState({ hovered: true })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('WithTheme(Button)').prop('value').props.children).toEqual('visibility')
      })
      
      test('should set tooltip text for button icon to be View Question', () => {
        const wrapper = setup({ node: { text: 'la la la' }, canModify: false })
        wrapper.setState({ hovered: true })
        const card = wrapper.find('WithStyles(CardContent)').dive()
        expect(card.find('WithStyles(Tooltip)').prop('text')).toEqual('View Question')
      })
    })
  })
  
  describe('handling children', () => {
    test('should render an expand collapse button if the node has children', () => {
      const wrapper = setup({ node: schemeTree[2] })
      expect(wrapper.find('IconButton').at(0).childAt(0).text()).toEqual('remove_circle')
    })
  
    test('should hide children when the collapse button is clicked and children are expanded', () => {
      const spy = jest.spyOn(props, 'toggleChildrenVisibility')
      const wrapper = setup({ node: schemeTree[2] })
      wrapper.find('IconButton').at(0).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should show children when the expand button is clicked and children are hidden', () => {
      const spy = jest.spyOn(props, 'toggleChildrenVisibility')
      const wrapper = setup({ node: { ...schemeTree[2], expanded: false } })
      wrapper.find('IconButton').at(0).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('node buttons', () => {
    test('should not show the add child question button if the question is a category child', () => {
      const wrapper = setup({ node: schemeFromApi[3], parentNode: schemeFromApi[2] })
      wrapper.setState({ hovered: true })
      expect(wrapper.find('WithStyles(CardContent)').find('WithTheme(Button)').length).toEqual(2)
    })
    
    test('should open the edit modal if the user clicks the pencil icon', () => {
      const spy = jest.spyOn(props, 'onOpenAddEditModal')
      const wrapper = setup()
      wrapper.setState({ hovered: true })
      wrapper.find('WithStyles(CardContent)').find('WithTheme(Button)').at(1).simulate('click')
      expect(spy).toHaveBeenCalled()
      spy.mockReset()
    })
    
    test('should open the add modal if the user clicks the add child question button', () => {
      const spy = jest.spyOn(props, 'onOpenAddEditModal')
      const wrapper = setup()
      wrapper.setState({ hovered: true })
      wrapper.find('WithStyles(CardContent)').find('WithTheme(Button)').at(0).simulate('click')
      expect(spy).toHaveBeenCalled()
      spy.mockReset()
    })
    
    test('should delete question when the user clicks the trash can icon', () => {
      const spy = jest.spyOn(props, 'onDeleteQuestion')
      const wrapper = setup()
      wrapper.setState({ hovered: true })
      wrapper.find('WithStyles(CardContent)').find('WithTheme(Button)').at(2).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
  })
})
