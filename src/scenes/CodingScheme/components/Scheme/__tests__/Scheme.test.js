import React from 'react'
import { shallow } from 'enzyme'
import { Scheme } from '../index'
import { expandedSchemeTree, schemeFromApi, schemeOutline } from 'utils/testData/scheme'

const props = {
  questions: expandedSchemeTree.slice(),
  onQuestionTreeChange: jest.fn(),
  onQuestionNodeMove: jest.fn(),
  outline: { ...schemeOutline },
  flatQuestions: schemeFromApi.slice(),
  onDeleteQuestion: jest.fn(),
  hasLock: true,
  lockedByCurrentUser: true,
  projectId: 4,
  history: {
    push: jest.fn()
  }
}

const setup = (other = {}) => {
  return (shallow(<Scheme {...props} {...other} />))
}

describe('CodingScheme scene -- Scheme component', () => {
  test('should render correctly', () => {
    expect(shallow(<Scheme {...props} />)).toMatchSnapshot()
  })
  
  describe('Tree props', () => {
    test('should allow the user to drag the question if they\'ve locked the coding scheme', () => {
      const wrapper = setup()
      expect(wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrag')).toEqual(true)
    })
    
    test('should pass the ability to delete a question, projectId and whether the user can modify', () => {
      const wrapper = setup()
      const tree = wrapper.find('DragDropContext(ReactSortableTree)').prop('generateNodeProps')()
      expect(tree.projectId).toEqual(4)
      expect(tree.canModify).toEqual(true)
    })
    
    test('should all the user to drop the question if the next parent is not a category question', () => {
      const wrapper = setup()
      const canDrop = wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrop')(
        { node: schemeFromApi[0], nextParent: null, prevParent: null }
      )
      expect(canDrop).toEqual(true)
    })
    
    test(
      'should not allow the user to add questions to a category child question',
      () => {
        const wrapper = setup()
        const canDrop = wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrop')(
          { node: schemeFromApi[0], nextParent: schemeFromApi[3], prevParent: null }
        )
        expect(canDrop).toEqual(false)
      }
    )
    
    test('should allow the user to move category child questions within the category parent', () => {
      const wrapper = setup()
      const canDrop = wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrop')(
        { node: schemeFromApi[3], nextParent: schemeFromApi[2], prevParent: schemeFromApi[2] }
      )
      expect(canDrop).toEqual(true)
    })
    
    test('should not allow the user to move category child question out of the category parent', () => {
      const wrapper = setup()
      const canDrop = wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrop')(
        { node: schemeFromApi[3], nextParent: null, prevParent: schemeFromApi[2] }
      )
      expect(canDrop).toEqual(false)
    })
    
    test('should not allow the user to add children to a category child question', () => {
      const wrapper = setup()
      const canDrop = wrapper.find('DragDropContext(ReactSortableTree)').prop('canDrop')(
        { node: schemeFromApi[0], nextParent: schemeFromApi[2], prevParent: null }
      )
      expect(canDrop).toEqual(false)
    })
  })
  
  describe('opening add edit question form', () => {
    test('should open the edit modal if the user clicks the pencil icon', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = setup()
      wrapper.instance().handleOpenAddEditModal('edit', { id: 22 }, true, [0])
      expect(spy).toHaveBeenCalledWith({
        pathname: '/project/4/coding-scheme/edit/22',
        state: { questionDefined: { id: 22 }, path: [0], canModify: true, modal: true }
      })
      spy.mockReset()
    })
  
    test('should open the add modal if the user clicks the add child question button', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = setup()
      wrapper.instance().handleOpenAddEditModal('add', { id: 22 }, true, [0])
      expect(spy).toHaveBeenCalledWith({
        pathname: '/project/4/coding-scheme/add',
        state: { parentDefined: { id: 22 }, path: [0], canModify: true, modal: true }
      })
      spy.mockReset()
    })
  })
})
