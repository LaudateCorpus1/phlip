import React from 'react'
import { shallow } from 'enzyme'
import { Home } from '../index'

const props = {
  actions: {
    getProjectsRequest: jest.fn(),
    sortProjects: jest.fn(),
    updatePage: jest.fn(),
    updateRows: jest.fn(),
    toggleBookmark: jest.fn(),
    sortBookmarked: jest.fn(),
    updateSearchValue: jest.fn(),
    setProjectToExport: jest.fn(),
    clearProjectToExport: jest.fn(),
    exportDataRequest: jest.fn(),
    dismissApiError: jest.fn()
  },
  user: {
    id: 2,
    firstName: 'Test',
    lastName: 'User',
    email: 'tester@test.com',
    password: 'test',
    role: 'Coordinator'
  },
  error: false,
  errorContent: '',
  projects: [],
  visibleProjects: [],
  bookmarkList: [],
  sortBookmarked: false,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  page: 0,
  rowsPerPage: '10',
  searchValue: '',
  projectToExport: { text: '' },
  apiErrorAlert: {
    text: '',
    open: false
  }
}

const setup = (otherProps = {}) => {
  return shallow(<Home {...props} {...otherProps} />)
}

describe('Home scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Home {...props} />)).toMatchSnapshot()
  })
  
  test('should render ProjectList and PageHeader components', () => {
    const wrapper = setup()
    expect(wrapper.find('withRouter(ProjectList)')).toHaveLength(1)
  })
  
  describe('Error handling', () => {
    test('should display an error message if prop: error is true', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError')).toHaveLength(1)
      expect(wrapper.find('withRouter(ProjectList)')).toHaveLength(0)
    })
    
    test('should display the content of errorContent prop in error message', () => {
      const wrapper = setup({ error: true, errorContent: 'We could not get projects.' })
      expect(wrapper.find('CardError').childAt(0).text())
        .toEqual('Uh-oh! Something went wrong. We could not get projects.')
    })
    
    describe('Api Errors', () => {
      test('should show an alert if there\'s an api error that happened', () => {
        const wrapper = setup({ apiErrorAlert: { open: true, text: 'Something went wrong.' } })
        expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
      })
      
      test('should close the alert when the user clicks the close button', () => {
        const spy = jest.spyOn(props.actions, 'dismissApiError')
        const wrapper = setup({ apiErrorAlert: { open: true, text: 'Something went wrong.' } })
        wrapper.find('ApiErrorAlert').simulate('closeAlert')
        expect(spy).toHaveBeenCalled()
      })
    })
  })
  
  describe('searching projects', () => {
    test('should update the visible projects when the user types in the search field', () => {
      const spy = jest.spyOn(props.actions, 'updateSearchValue')
      const wrapper = setup()
      const event = {
        target: {
          value: 'project 1'
        }
      }
      wrapper.find('WithTheme(SearchBar)').prop('handleSearchValueChange')(event)
      expect(spy).toHaveBeenCalledWith('project 1')
    })
  })
  
  describe('sorting', () => {
    test('should render the correctly selected sort label', () => {
      const wrapper = setup()
      const dropdown = wrapper.find('WithStyles(Dropdown)').renderProp('renderValue')('dateLastEdited')
      expect(dropdown.contains(<span style={{ paddingRight: 5 }}>Date Last Edited</span>)).toEqual(true)
    })
    
    test('should render an upward arrow if the list is sorted descending', () => {
      const wrapper = setup()
      const dropdown = wrapper.find('WithStyles(Dropdown)').renderProp('renderValue')('dateLastEdited')
      expect(dropdown.find('WithTheme(Icon)').childAt(0).text()).toEqual('arrow_downward')
    })
    
    test('should render a downward arrow if the list is sorted ascending', () => {
      const wrapper = setup({ direction: 'asc' })
      const dropdown = wrapper.find('WithStyles(Dropdown)').renderProp('renderValue')('dateLastEdited')
      expect(dropdown.find('WithTheme(Icon)').childAt(0).text()).toEqual('arrow_upward')
    })
    
    test('should set the dropdown value as bookmarked if the user is sorting by bookmarked', () => {
      const wrapper = setup({ sortBookmarked: true })
      expect(wrapper.find('WithStyles(Dropdown)').prop('input').value).toEqual('sortBookmarked')
    })
    
    test('should sort by bookmarked if the user chooses the bookmarked sort option', () => {
      const spy = jest.spyOn(props.actions, 'sortBookmarked')
      const wrapper = setup()
      wrapper.find('WithStyles(Dropdown)').prop('input').onChange('sortBookmarked')
      expect(spy).toHaveBeenCalledWith(true)
    })
    
    test('should sort by other sort if the user choose another option', () => {
      const spy = jest.spyOn(props.actions, 'sortProjects')
      const wrapper = setup()
      wrapper.find('WithStyles(Dropdown)').prop('input').onChange('name')
      expect(spy).toHaveBeenCalledWith('name')
    })
  })
  
  describe('Handling Exporting', () => {
    test('should open the exporting dialog if the user clicks the export button', () => {
      const spy = jest.spyOn(props.actions, 'setProjectToExport')
      const wrapper = setup()
      wrapper.find('withRouter(ProjectList)').prop('handleExport')({ id: 4, name: 'Project' })
      expect(spy).toHaveBeenCalled()
    })
    
    describe('choosing an export', () => {
      test('should clear out any old URLs if they exist', () => {
        window.URL.revokeObjectURL = jest.fn()
        const spy = jest.spyOn(window.URL, 'revokeObjectURL')
        const wrapper = setup()
        wrapper.instance().url = 'blob://jeosrjosejrrtnrtsr'
        wrapper.find('ExportDialog').simulate('chooseExport', 'numeric', { id: 4 })
        expect(spy).toHaveBeenCalled()
      })
      
      test('should send a request to get export data when the user chooses an export', () => {
        const spy = jest.spyOn(props.actions, 'exportDataRequest')
        const wrapper = setup()
        wrapper.find('ExportDialog').simulate('chooseExport', 'numeric', { id: 4 })
        expect(spy).toHaveBeenCalledWith('numeric', { id: 4 })
      })
      
      describe('preparing the file download', () => {
        describe('when the export request was successful', () => {
          const projectToExport = {
            text: 'this is file text',
            name: 'TestProject',
            exportType: 'numeric',
            user: {
              id: null
            }
          }
          
          test('should prepare the file when the request returns successfully', () => {
            window.URL.createObjectURL = jest.fn()
            const spy = jest.spyOn(window.URL, 'createObjectURL')
            const wrapper = setup({ exporting: true })
            const exportRef = {
              current: {
                click: jest.fn(),
                download: '',
                href: ''
              }
            }
            wrapper.instance().exportRef = exportRef
            wrapper.setProps({
              exporting: false,
              apiErrorAlert: { open: false },
              projectToExport
            })
            expect(spy).toHaveBeenCalled()
          })
          
          test('should include the users name in the file name if it\'s for a user', () => {
            const wrapper = setup({ exporting: true })
            const exportRef = {
              current: {
                click: jest.fn(),
                download: '',
                href: ''
              }
            }
            wrapper.instance().exportRef = exportRef
            wrapper.setProps({
              exporting: false,
              apiErrorAlert: { open: false },
              projectToExport: {
                ...projectToExport,
                user: {
                  id: 4,
                  firstName: 'Test',
                  lastName: 'User'
                }
              }
            })
            expect(wrapper.instance().exportRef.current.download).toEqual('TestProject-Test-User-numeric-export.csv')
          })
          
          test('should only include export type and project name if the user is exporting validated coding', () => {
            const wrapper = setup({ exporting: true })
            const exportRef = {
              current: {
                click: jest.fn(),
                download: '',
                href: ''
              }
            }
            wrapper.instance().exportRef = exportRef
            wrapper.setProps({
              exporting: false,
              apiErrorAlert: { open: false },
              projectToExport
            })
            expect(wrapper.instance().exportRef.current.download).toEqual('TestProject-numeric-export.csv')
          })
          
          test('should download the file', () => {
            const wrapper = setup({ exporting: true })
            const exportRef = {
              current: {
                click: jest.fn(),
                download: '',
                href: ''
              }
            }
            const spy = jest.spyOn(exportRef.current, 'click')
            wrapper.instance().exportRef = exportRef
            wrapper.setProps({
              exporting: false,
              apiErrorAlert: { open: false },
              projectToExport
            })
            expect(spy).toHaveBeenCalled()
          })
        })
        
        describe('when the export request failed', () => {
          test('should show an error alert', () => {
            const wrapper = setup({ exporting: true })
            wrapper.setProps({ exporting: false, apiErrorAlert: { open: true, text: 'there was an error' } })
            expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
            expect(wrapper.instance().url).toEqual(null)
          })
        })
      })
    })
    
    describe('closing the export dialog', () => {
      test('should close the exporting dialog if the user clicks the close button', () => {
        const spy = jest.spyOn(props.actions, 'clearProjectToExport')
        const wrapper = setup()
        wrapper.find('ExportDialog').simulate('close')
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear any object urls if there are any', () => {
        window.URL.revokeObjectURL = jest.fn()
        const spy = jest.spyOn(window.URL, 'revokeObjectURL')
        const wrapper = setup()
        wrapper.instance().url = 'blob://jeosrjosejrrtnrtsr'
        wrapper.find('ExportDialog').simulate('close')
        expect(spy).toHaveBeenCalled()
      })
    })
  })
})
