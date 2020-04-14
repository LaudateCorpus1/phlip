import React from 'react'
import { shallow } from 'enzyme'
import { ProjectList } from '../index'

const props = {
  projectIds: [
    1, 2
  ],
  projectCount: 2,
  user: {
    id: 2,
    firstName: 'Test',
    lastName: 'User',
    email: 'tester@test.com',
    password: 'test',
    role: 'Coordinator'
  },
  bookmarkList: [1],
  page: 0,
  rowsPerPage: '10',
  count: 2,
  handleToggleBookmark: jest.fn(),
  handleToggleProject: jest.fn(),
  handlePageChange: jest.fn(),
  handleRowsChange: jest.fn(),
  handleExport: jest.fn(),
  allowExpandCollapse: true,
  theme: {
    palette: {}
  },
  history: {
    push: jest.fn(),
    action: 'POP',
    location: {
      pathname: '/home'
    }
  },
  location: {
    pathname: '/home'
  }
}

const validEventCoords = {
  offsetX: 400,
  offsetY: 500,
  target: {
    clientWidth: 1200,
    clientHeight: 1200
  }
}

const parentNode = {
  className: 'valid',
  id: 'valid-id',
  tagName: 'div'
}

const offsetParent = {
  className: 'valid-offset',
  id: 'valid-offset',
  tagName: 'div'
}

const setup = (otherProps = {}) => {
  return shallow(<ProjectList {...props} {...otherProps} />)
}

describe('Home scene - ProjectList component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectList {...props} />)).toMatchSnapshot()
  })
  
  describe('table pagination', () => {
    test('should render the table pagination if there are projects', () => {
      const wrapper = setup()
      expect(wrapper.find('Table').length).toEqual(1)
    })
    
    test('should change pages to select page if the user clicks the page buttons', () => {
      const spy = jest.spyOn(props, 'handlePageChange')
      const wrapper = setup()
      wrapper.find('WithStyles(TablePagination)').simulate('changePage', {}, 2)
      expect(spy).toHaveBeenCalledWith(2)
    })
    
    test('should change the number of projects visible per page if the user changes the number of rows', () => {
      const spy = jest.spyOn(props, 'handleRowsChange')
      const wrapper = setup()
      wrapper.find('WithStyles(TablePagination)').simulate('changeRowsPerPage', { target: { value: 'All' } })
      expect(spy).toHaveBeenCalledWith('All')
    })
  })
  
  describe('toggling projects', () => {
    afterEach(() => {
      jest.resetAllMocks()
    })
    
    test('should track the coordinates when the user clicks on a container', () => {
      const wrapper = setup()
      wrapper.find('FlexGrid').simulate('mouseDown', { clientX: 100, clientY: 100 })
      expect(wrapper.state().mouse.x).toEqual(100)
      expect(wrapper.state().mouse.y).toEqual(100)
    })
    
    describe('expanding projects', () => {
      test('should not do anything if collapsing if disallowed', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const wrapper = setup({ allowExpandCollapse: false })
        wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {})
        expect(spy).not.toHaveBeenCalled()
      })
      
      describe('checking current routes', () => {
        test('should not expand if a modal is open', () => {
          const spy = jest.spyOn(props, 'handleToggleProject')
          const wrapper = setup({
            location: { pathname: '/home' },
            history: {
              action: 'PUSH',
              location: {
                pathname: '/project/10/jurisdictions/add'
              }
            }
          })
          
          wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {})
          expect(spy).not.toHaveBeenCalled()
        })
        
        test('should not expand if the page isn\'t not the home page', () => {
          const spy = jest.spyOn(props, 'handleToggleProject')
          const wrapper = setup({ location: { pathname: '/home/project/add' } })
          wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {})
          expect(spy).not.toHaveBeenCalled()
        })
      })
  
      describe('validating the click target', () => {
        test('should use the offsetParent if it exists', () => {
          const target = {
            ...validEventCoords.target,
            ...offsetParent,
            offsetParent
          }
      
          const wrapper = setup({
            location: { pathname: '/home' },
            history: { action: 'POP' }
          })
      
          wrapper.instance().checkExpand = jest.fn()
          wrapper.update()
          wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {
            ...validEventCoords,
            target
          })
      
          expect(wrapper.instance().checkExpand).toHaveBeenCalledWith(target)
        })
    
        test('should use the parentNode if there is no offsetParent', () => {
          const target = {
            ...validEventCoords.target,
            offsetParent: null,
            parentNode
          }
      
          const wrapper = setup({
            location: { pathname: '/home' },
            history: { action: 'POP' }
          })
      
          wrapper.instance().checkExpand = jest.fn()
          wrapper.update()
          wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {
            ...validEventCoords,
            target
          })
      
          expect(wrapper.instance().checkExpand).toHaveBeenCalledWith(target)
        })
      })
  
      test('should clear mouse coordinates', () => {
        const target = {
          ...validEventCoords.target,
          ...parentNode,
          offsetParent: null,
          parentNode
        }
  
        const wrapper = setup({
          location: { pathname: '/home' },
          history: { action: 'POP' }
        })
  
        wrapper.setState({
          mouse: {
            x: 0,
            y: 100
          }
        })
        wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {
          ...validEventCoords,
          target,
          path: [{ id: 'valid-path' }]
        })
        expect(wrapper.state().mouse.x).toEqual(0)
        expect(wrapper.state().mouse.y).toEqual(0)
      })
  
      test('should expand if all conditions are met', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const target = {
          ...validEventCoords.target,
          ...parentNode,
          offsetParent: null,
          parentNode
        }
        
        const wrapper = setup({
          location: { pathname: '/home' },
          history: { action: 'POP' }
        })
        
        wrapper.find('Connect(ProjectPanel)').at(0).prop('handleExpandProject')(1, {
          ...validEventCoords,
          target,
          path: [{ id: 'valid-path' }]
        })
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('collapsing projects', () => {
      test('should not do anything if collapsing if disallowed', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const wrapper = setup({ allowExpandCollapse: false })
        wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {})
        expect(spy).not.toHaveBeenCalled()
      })
      
      describe('if the user clicks and the drags to another part of the screen', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const wrapper = setup()
        
        test('should not collapse the project', () => {
          wrapper.setState({
            mouse: {
              x: 100,
              y: 100
            }
          })
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
            clientY: 300,
            clientX: 400
          })
          expect(spy).not.toHaveBeenCalled()
        })
        
        test('should clear mouse coordinates', () => {
          wrapper.setState({
            mouse: {
              x: 0,
              y: 100
            }
          })
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
            clientY: 300,
            clientX: 400
          })
          
          expect(wrapper.state().mouse.x).toEqual(0)
          expect(wrapper.state().mouse.y).toEqual(0)
        })
      })
      
      test('should not collapse the project if the user clicks the scroll bar', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const wrapper = setup()
        wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
          offsetX: 400,
          offsetY: 500,
          target: {
            clientWidth: 200,
            clientHeight: 200
          }
        })
        
        expect(spy).not.toHaveBeenCalled()
      })
      
      describe('checking current routes', () => {
        test('should not collapse if a modal is open', () => {
          const spy = jest.spyOn(props, 'handleToggleProject')
          const wrapper = setup({
            location: { pathname: '/home' },
            history: {
              action: 'PUSH',
              location: {
                pathname: '/project/10/jurisdictions/add'
              }
            }
          })
          
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', validEventCoords)
          
          expect(spy).not.toHaveBeenCalled()
        })
        
        test('should not collapse if the page isn\'t not the home page', () => {
          const spy = jest.spyOn(props, 'handleToggleProject')
          const wrapper = setup({ location: { pathname: '/home/project/add' } })
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', validEventCoords)
          
          expect(spy).not.toHaveBeenCalled()
        })
      })
      
      describe('validating the click target', () => {
        test('should use the offsetParent if it exists', () => {
          const target = {
            ...validEventCoords.target,
            ...offsetParent,
            offsetParent
          }
          
          const wrapper = setup({
            location: { pathname: '/home' },
            history: { action: 'POP' }
          })
          
          wrapper.instance().checkExpand = jest.fn()
          wrapper.update()
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
            ...validEventCoords,
            target
          })
          
          expect(wrapper.instance().checkExpand).toHaveBeenCalledWith(target)
        })
        
        test('should use the parentNode if there is no offsetParent', () => {
          const target = {
            ...validEventCoords.target,
            offsetParent: null,
            parentNode
          }
          
          const wrapper = setup({
            location: { pathname: '/home' },
            history: { action: 'POP' }
          })
          
          wrapper.instance().checkExpand = jest.fn()
          wrapper.update()
          wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
            ...validEventCoords,
            target
          })
          
          expect(wrapper.instance().checkExpand).toHaveBeenCalledWith(target)
        })
        
        describe('should not collapse if', () => {
          let spy, wrapper
          beforeEach(() => {
            spy = jest.spyOn(props, 'handleToggleProject')
            wrapper = setup({
              location: { pathname: '/home' },
              history: { action: 'POP' }
            })
          })
          
          afterEach(() => {
            spy.mockReset()
          })
          
          const target = {
            ...validEventCoords.target,
            ...parentNode,
            offsetParent: null,
            parentNode
          }
          
          test('the user clicked the avatar menu', () => {
            wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
              ...validEventCoords,
              target,
              path: [{ id: 'avatar-user-menu' }]
            })
            expect(spy).not.toHaveBeenCalled()
          })
          
          test('the user clicked the sort dropdown', () => {
            wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
              ...validEventCoords,
              target,
              path: [{ id: 'menu-projectSort' }]
            })
            expect(spy).not.toHaveBeenCalled()
          })
          
          test('the user clicked an option the sort menu', () => {
            wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
              ...validEventCoords,
              target,
              path: [{ id: 'projectSort-container' }]
            })
            expect(spy).not.toHaveBeenCalled()
          })
          
          test('the user clicked the document management app header', () => {
            wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
              ...validEventCoords,
              target,
              path: [{ id: 'tab-doc-manage' }]
            })
            expect(spy).not.toHaveBeenCalled()
          })
          
          test('the user clicked the project list app header', () => {
            wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
              ...validEventCoords,
              target,
              path: [{ id: 'tab-project-list' }]
            })
            expect(spy).not.toHaveBeenCalled()
          })
        })
      })
      
      test('should collapse if all conditions are met', () => {
        const spy = jest.spyOn(props, 'handleToggleProject')
        const target = {
          ...validEventCoords.target,
          ...parentNode,
          offsetParent: null,
          parentNode
        }
        
        const wrapper = setup({
          location: { pathname: '/home' },
          history: { action: 'POP' }
        })
        
        wrapper.find('FlexGrid').childAt(0).simulate('clickAway', {
          ...validEventCoords,
          target,
          path: [{ id: 'valid-path' }]
        })
        expect(spy).toHaveBeenCalled()
      })
    })
  })
  
  describe('editing a project', () => {
    test('should open an edit modal and change routes', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = setup()
      wrapper.find('Connect(ProjectPanel)').at(0).prop('handleEditProject')({ id: 1 })()
      expect(spy).toHaveBeenCalledWith({
        pathname: `/project/edit/1`,
        state: { projectDefined: { id: 1 }, modal: true }
      })
    })
  })
})
