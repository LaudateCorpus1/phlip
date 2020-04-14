import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { INITIAL_STATE } from '../reducer'
import { types as projectTypes } from 'data/projects/actions'
import { projects, projectsPayload, sortedByDateAndBookmarked, defaultSorted } from 'utils/testData/projectsHome'

describe('Home logic', () => {
  let mock
  
  const mockReducer = (state, action) => state
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (initialBookmarks = {}, withProjects = true, homeState = {}) => {
    return createMockStore({
      initialState: {
        data: {
          projects: withProjects ? { byId: projects, allIds: defaultSorted } : { byId: {}, allIds: [] },
          user: { currentUser: { id: 5, bookmarks: initialBookmarks } }
        },
        scenes: {
          home: {
            main: {
              projects: { visible: [], matches: [] },
              ...INITIAL_STATE,
              ...homeState
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }
  
  describe('Updating visible projects by sorting, searching, etc.', () => {
    describe('SORT_PROJECTS', () => {
      describe('sort by: name ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true)
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [1,2,3,4,5]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([1, 2, 3, 4, 5])
            done()
          })
        })
        
        test('should set state.sortBy to name', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('name')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: name descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc' })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [5, 4, 3, 2, 1]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 3, 2, 1])
            done()
          })
        })
        
        test('should set state.sortBy to name', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('name')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
      
      describe('sort by: dateLastEdited ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'dateLastEdited' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [1, 3, 2, 4, 5]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([1, 3, 2, 4, 5])
            done()
          })
        })
        
        test('should set state.sortBy to dateLastEdited', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('dateLastEdited')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: dateLastEdited descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'dateLastEdited' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [5, 4, 2, 3, 1]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 2, 3, 1])
            done()
          })
        })
        
        test('should set state.sortBy to dateLastEdited', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('dateLastEdited')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
      
      describe('sort by: lastEditedBy ascending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'lastEditedBy' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [2, 1, 4, 3, 5]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([2, 1, 4, 3, 5])
            done()
          })
        })
        
        test('should set state.sortBy to lastEditedBy', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('lastEditedBy')
            done()
          })
        })
        
        test('should set state.direction to asc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('asc')
            done()
          })
        })
      })
      
      describe('sort by: lastEditedBy descending', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'asc', projects: { visible: [4, 3, 2, 5, 1] } })
          const action = { type: types.SORT_PROJECTS, payload: { sortBy: 'lastEditedBy' } }
          store.dispatch(action)
        })
        
        test('should set visible projects to [5, 3, 4, 1, 2]', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 3, 4, 1, 2])
            done()
          })
        })
        
        test('should set state.sortBy to lastEditedBy', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBy).toEqual('lastEditedBy')
            done()
          })
        })
        
        test('should set state.direction to desc', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.direction).toEqual('desc')
            done()
          })
        })
      })
    })
    
    describe('UPDATE_ROWS', () => {
      describe('numerical rows per page', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc' })
          const action = { type: types.UPDATE_ROWS, payload: { rowsPerPage: 3 } }
          store.dispatch(action)
        })
        
        test('should set update rowsPerPage in state', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.rowsPerPage).toEqual(3)
            done()
          })
        })
        
        test('should update visible projects to only show first page', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 2])
            done()
          })
        })
      })
      
      describe('rows per page === "all"', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { direction: 'desc' })
          const action = { type: types.UPDATE_ROWS, payload: { rowsPerPage: 'All' } }
          store.dispatch(action)
        })
        
        test('should set update page to be 0', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.page).toEqual(0)
            done()
          })
        })
        
        test('should update visible projects to show all projects', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([5, 4, 2, 3, 1])
            done()
          })
        })
      })
    })
    
    describe('UPDATE_PAGE', () => {
      let store
      beforeEach(() => {
        store = setupStore({}, true, { direction: 'desc', rowsPerPage: 2 })
        const action = { type: types.UPDATE_PAGE, payload: { page: 1 } }
        store.dispatch(action)
      })
      
      test('should set update page in state', done => {
        store.whenComplete(() => {
          expect(store.actions[0].payload.page).toEqual(1)
          done()
        })
      })
      
      test('should update visible projects to page requested', done => {
        store.whenComplete(() => {
          expect(store.actions[0].payload.projects.visible).toEqual([2, 3])
          done()
        })
      })
    })
    
    describe('SORT_BOOKMARKED', () => {
      describe('sorting by bookmarks with bookmarked projects', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { bookmarkList: [1, 3, 4] })
          const action = { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } }
          store.dispatch(action)
        })
        
        test('should move bookmarked projects to the top and sort those depending on the sort label selected', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([...sortedByDateAndBookmarked])
            done()
          })
        })
        
        test('should set sortBookmarked to true', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBookmarked).toEqual(true)
            done()
          })
        })
      })
      
      describe('sorting by bookmarks without bookmarked projects', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true, { bookmarkList: [] })
          const action = { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } }
          store.dispatch(action)
        })
        
        test('should not change the order of the projects if no projects are bookmarked', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual(defaultSorted)
            done()
          })
        })
      })
      
      describe('unsorting by bookmarks', () => {
        let store
        beforeEach(() => {
          store = setupStore(
            {},
            true,
            { bookmarkList: [1, 3, 4], sortBookmarked: true, projects: { visible: [...sortedByDateAndBookmarked] } }
          )
          const action = { type: types.UPDATE_PAGE, payload: { sortBookmarked: false } }
          store.dispatch(action)
        })
        
        test(
          'should move bookmarked projects back to their original order by sort label if sorting by bookmarked is disabled',
          done => {
            store.whenComplete(() => {
              expect(store.actions[0].payload.projects.visible).toEqual(defaultSorted)
              done()
            })
          }
        )
        
        test('should set state.sortBookmarked to false', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.sortBookmarked).toEqual(false)
            done()
          })
        })
      })
    })
    
    describe('UPDATE_SEARCH_VALUE', () => {
      describe('found matches', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true)
          const action = { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: '33' } }
          store.dispatch(action)
        })
        
        test('should update visible projects if there are matches for the search value', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([4])
            done()
          })
        })
        
        test('should update matches to an array of matching project ids', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.matches).toEqual([4])
            done()
          })
        })
        
        test('should update projectCount to number of total matches', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projectCount).toEqual(1)
            done()
          })
        })
        
        test('should update searchValue to action.payload.searchValue', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.searchValue).toEqual('33')
            done()
          })
        })
      })
      
      describe('no matches found', () => {
        let store
        beforeEach(() => {
          store = setupStore({}, true)
          const action = { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'cxx' } }
          store.dispatch(action)
        })
        
        test('should update visible projects to be an empty array', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual([])
            done()
          })
        })
        
        test('should update matches to an empty array', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.matches).toEqual([])
            done()
          })
        })
        
        test('should update projectCount to 0', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projectCount).toEqual(0)
            done()
          })
        })
        
        test('should set searchValue to action.payload.searchValue', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.searchValue).toEqual('cxx')
            done()
          })
        })
      })
      
      describe('clearing search field', () => {
        let store
        beforeEach(() => {
          store = setupStore(
            {},
            true,
            { projects: { visible: [4], matches: [4] }, searchValue: '33', projectCount: 1 }
          )
          const action = { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: '' } }
          store.dispatch(action)
        })
        
        test('should set the projects back to previous state', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projects.visible).toEqual(defaultSorted)
            done()
          })
        })
        
        test('should set state.projectCount to total number of projects', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.projectCount).toEqual(5)
            done()
          })
        })
        
        test('should set state.searchValue to an empty string', done => {
          store.whenComplete(() => {
            expect(store.actions[0].payload.searchValue).toEqual('')
            done()
          })
        })
      })
    })
    
    describe('UPDATE_VISIBLE_PROJECTS', () => {
      let store
      beforeEach(() => {
        store = setupStore({}, false)
        const action = { type: types.UPDATE_VISIBLE_PROJECTS, payload: {} }
        store.dispatch(action)
      })
      
      test('should return state if there are no projects', done => {
        store.whenComplete(() => {
          expect(store.actions[0].payload.projects.visible).toEqual([])
          expect(store.actions[0].payload.projects.matches).toEqual([])
          expect(store.actions[0].payload.projectCount).toEqual(0)
          done()
        })
      })
    })
  })
  
  describe('Getting Projects', () => {
    describe('when getting projects is successful', () => {
      let store
      beforeEach(() => {
        mock.onGet('/projects').reply(200, projectsPayload)
        store = setupStore([1], true)
        store.dispatch({ type: types.GET_PROJECTS_REQUEST, payload: {} })
      })
      
      test('should get project list and set bookmarkList and dispatch GET_PROJECTS_SUCCESS when done', done => {
        store.whenComplete(() => {
          expect(store.actions[1]).toEqual({ type: types.GET_PROJECTS_SUCCESS })
          done()
        })
      })
      
      test('should dispatch set projects to set globally and home state', done => {
        store.whenComplete(() => {
          expect(store.actions[2].type).toEqual(projectTypes.SET_PROJECTS)
          expect(store.actions[2].payload.data).toEqual({
            byId: projects,
            allIds: [1, 2, 3, 4, 5]
          })
          done()
        })
      })
      
      test('should sort by dateLastEdited and descending', done => {
        store.whenComplete(() => {
          expect(store.actions[2].type).toEqual(projectTypes.SET_PROJECTS)
          expect(store.actions[2].payload.projects).toEqual({
            visible: defaultSorted,
            matches: []
          })
          done()
        })
      })
    })
    
    describe('when getting projects is not successful', () => {
      let store
      beforeEach(() => {
        mock.onGet('/projects').reply(500)
        store = setupStore([1], true)
        store.dispatch({ type: types.GET_PROJECTS_REQUEST, payload: {} })
      })
      
      test('should dispatch get projects fail', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.GET_PROJECTS_FAIL)
          done()
        })
      })
    })
  })
  
  describe('Toggling Bookmarks', () => {
    test(
      'should add the project id to bookmarkList if the id doesn\'t exist when TOGGLE_BOOKMARK is dispatched',
      done => {
        const project = { id: 1, name: 'Project 1' }
        const store = setupStore([])
        
        mock.onPost('/users/5/bookmarkedprojects/1').reply(200, [
          { projectId: 1, userId: 5 },
          { projectId: 2, userId: 5 }
        ])
        
        store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
        store.whenComplete(() => {
          expect(store.actions[1].payload.bookmarkList).toEqual([1])
          done()
        })
      }
    )
    
    test(
      'should remove the project id from the bookmarkList if the id exists when TOGGLE_BOOKMARK is dispatched',
      done => {
        const project = { id: 2, name: 'Project 2' }
        const store = setupStore([2, 1, 5])
        
        mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [
          { projectId: 1, userId: 5 },
          { projectId: 5, userId: 5 }
        ])
        
        store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
        store.whenComplete(() => {
          expect(store.actions[1].payload.bookmarkList).toEqual([1, 5])
          done()
        })
      }
    )
    
    test('should return bookmarkList as empty if length is 1 and project id is being un-bookmarked', done => {
      const project = { id: 2, name: 'Project 2' }
      mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [])
      const store = setupStore([2])
      
      store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
      store.whenComplete(() => {
        expect(store.actions[1].payload.bookmarkList).toEqual([])
        done()
      })
    })
    
    describe('when there is an error saving the bookmark request', () => {
      test('should inform the user of the error', done => {
        const project = { id: 2, name: 'Project 2' }
        mock.onDelete('/users/5/bookmarkedprojects/2').reply(500)
        const store = setupStore([2])
  
        store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.TOGGLE_BOOKMARK_FAIL)
          expect(store.actions[1].payload).toEqual('We couldn\'t save your bookmark request.')
          done()
        })
      })
    })
  })
  
  describe('Removing a project', () => {
    test('should update action to have update project arrays after removing project', done => {
      const store = setupStore()
      
      store.dispatch({
        type: types.REMOVE_PROJECT,
        payload: {},
        projectId: 4
      })
      
      store.whenComplete(() => {
        expect(store.actions[0].payload.projects.visible).toEqual([5, 2, 3, 1])
        done()
      })
    })
  })
  
  describe('Exporting project data', () => {
    describe('when user is null', () => {
      let store, spy
      beforeEach(() => {
        spy = jest.spyOn(api, 'exportData')
        mock.onGet('/exports/project/4/data').reply(200, 'file text')
        store = setupStore([1], true, {
          projectToExport: {
            id: 4
          }
        })
        store.dispatch({ type: types.EXPORT_DATA_REQUEST, exportType: 'numeric', user: null })
      })
      
      test('should call the export api without user parameter', done => {
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalledWith({}, { params: { type: 'numeric' } }, { projectId: 4 })
          done()
        })
      })
      
      test('should send back file data', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.EXPORT_DATA_SUCCESS)
          expect(store.actions[1].payload).toEqual('file text')
          done()
        })
      })
    })
    
    describe('when user is populated', () => {
      let store, spy
      beforeEach(() => {
        spy = jest.spyOn(api, 'exportData')
        mock.onGet('/exports/project/4/data').reply(200, 'file text')
        store = setupStore([1], true, {
          projectToExport: {
            id: 4
          }
        })
        store.dispatch({ type: types.EXPORT_DATA_REQUEST, exportType: 'numeric', user: { userId: 5 } })
      })
      
      test('should call the export api without user parameter', done => {
        store.whenComplete(() => {
          expect(spy).toHaveBeenCalledWith({}, { params: { type: 'numeric', userId: 5 } }, { projectId: 4 })
          done()
        })
      })
      
      test('should send back file data', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.EXPORT_DATA_SUCCESS)
          expect(store.actions[1].payload).toEqual('file text')
          done()
        })
      })
    })
    
    describe('when there\'s an error', () => {
      let store
      beforeEach(() => {
        mock.onGet('/exports/project/4/data').reply(500)
        store = setupStore([1], true, {
          projectToExport: {
            id: 4
          }
        })
        store.dispatch({ type: types.EXPORT_DATA_REQUEST, exportType: 'numeric', user: null })
      })
      
      test('should dispatch the error to the user', done => {
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.EXPORT_DATA_FAIL)
          expect(store.actions[1].payload).toEqual('We couldn\'t export the project.')
          done()
        })
      })
    })
  })
})
