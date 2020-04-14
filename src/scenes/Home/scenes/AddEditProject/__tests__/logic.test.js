import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { projects } from 'utils/testData/projectsHome'
import { types as projectTypes } from 'data/projects/actions'

describe('Home scene - AddEditProject logic', () => {
  let mock
  
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)
  const mockReducer = (state, action) => state
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = initialBookmarks => {
    return createMockStore({
      initialState: {
        data: {
          user: {
            currentUser: {
              id: 5,
              bookmarks: initialBookmarks,
              firstName: 'Test',
              lastName: 'User'
            },
            byId: {
              5: {
                id: 5,
                bookmarks: initialBookmarks,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          },
          projects: {
            byId: projects
          }
        },
        scenes: {
          home: {
            addEditProject: {
              project: {
                users: [{ userId: 4 }, { userId: 1 }]
              }
            }
          }
        }
      },
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api
      }
    })
  }
  
  describe('Adding a project', () => {
    const project = {
      id: 12345,
      name: 'New Project',
      isCompleted: false,
      lastEditedBy: 'Test User',
      projectUsers: [{ userId: 4 }, { userId: 1 }, { userId: 5 }]
    }
    
    let store
    beforeEach(() => {
      mock.onPost('/projects').reply(200, project)
      mock.onGet('/users/4/avatar').reply(200, {})
      mock.onGet('/users/1/avatar').reply(200, {})
      mock.onGet('/users/5/avatar').reply(200, {})
      store = setupStore()
      store.dispatch({ type: types.ADD_PROJECT_REQUEST, project })
    })
    
    test('should post a new project and dispatch ADD_PROJECT_SUCCESS when successful', done => {
      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({ type: types.ADD_PROJECT_SUCCESS })
        done()
      })
    })
    
    test('should add the project to global projects', done => {
      store.whenComplete(() => {
        expect(store.actions[2]).toEqual({
          type: projectTypes.ADD_PROJECT, payload: { ...project, lastUsersCheck: null }
        })
        done()
      })
    })
    
    test('should update visible projects', done => {
      store.whenComplete(() => {
        expect(store.actions[3]).toEqual({
          type: types.UPDATE_VISIBLE_PROJECTS, payload: {}
        })
        done()
      })
    })
    
    test('should dispatch failure when adding a project fails', done => {
      const store = setupStore([])
      
      mock.onPost('/projects').reply(500)
      store.dispatch({
        type: types.ADD_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_PROJECT_FAIL)
        done()
      })
    })
  })
  
  describe('Updating a project', () => {
    const project = {
      id: 1,
      name: 'Updated Project',
      lastEditedBy: 'Test User',
      projectUsers: [{ userId: 4 }, { userId: 1 }, { userId: 5 }]
    }
    
    let store
    beforeEach(() => {
      mock.onPut('/projects/1').reply(200, project)
      mock.onGet('/users/4/avatar').reply(200, {})
      mock.onGet('/users/1/avatar').reply(200, {})
      mock.onGet('/users/5/avatar').reply(200, {})
      store = setupStore()
      store.dispatch({ type: types.UPDATE_PROJECT_REQUEST, project: { ...project, userId: 5 } })
    })
    
    test('should put an updated project and dispatch UPDATE_PROJECT_SUCCESS when successful', done => {
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_PROJECT_SUCCESS)
        done()
      })
    })
    
    test('should update the project at the global level', done => {
      store.whenComplete(() => {
        expect(store.actions[4]).toEqual({ type: projectTypes.UPDATE_PROJECT, payload: project })
        done()
      })
    })
    
    test('should update visible projects', done => {
      store.whenComplete(() => {
        expect(store.actions[5]).toEqual({
          type: types.UPDATE_VISIBLE_PROJECTS, payload: {}
        })
        done()
      })
    })
    
    test('should dispatch failure when updating a project fails', done => {
      const store = setupStore()
      
      mock.onPut('/projects/1').reply(500)
      store.dispatch({
        type: types.UPDATE_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_PROJECT_FAIL)
        done()
      })
    })
  })
  
  describe('Deleting a project', () => {
    test('should delete a project and dispatch DELETE_PROJECT_SUCCESS when successful', done => {
      const project = { id: 1, name: 'Delete Project', lastEditedBy: 'Test User' }
      const store = setupStore([])
      
      mock.onDelete('/projects/1').reply(200, project)
      store.dispatch({
        type: types.DELETE_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_PROJECT_SUCCESS)
        expect(store.actions[1].project).toEqual(1)
        done()
      })
    })
    
    test('should remove the project from global list', done => {
      const project = { id: 1, name: 'Delete Project', lastEditedBy: 'Test User' }
      const store = setupStore([])
      
      mock.onDelete('/projects/1').reply(200, project)
      store.dispatch({
        type: types.DELETE_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[2].type).toEqual(types.REMOVE_PROJECT)
        expect(store.actions[2].projectId).toEqual(1)
        done()
      })
    })
    
    test('should dispatch failure when deleting a project fails', done => {
      const store = setupStore([])
      
      mock.onDelete('/projects/1').reply(500)
      store.dispatch({
        type: types.DELETE_PROJECT_REQUEST,
        project: 1
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_PROJECT_FAIL)
        done()
      })
    })
  })
  
  describe('Searching for users', () => {
    let store, spy
    
    beforeEach(() => {
      store = setupStore([])
      spy = jest.spyOn(api, 'searchUserList')
      
      mock.onGet('/users').reply(
        200,
        [
          { firstName: 'Test', lastName: 'User', id: 11 },
          { firstName: 'Coord', lastName: 'User', id: 10 }
        ]
      )
      
      store.dispatch({
        type: types.SEARCH_USER_LIST,
        searchString: 'user'
      })
    })
    
    test('should search for users', done => {
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should set name as first and last name of response', done => {
      store.whenComplete(() => {
        expect(store.actions[1].payload).toEqual([
          { firstName: 'Test', lastName: 'User', id: 11, name: 'Test User' },
          { firstName: 'Coord', lastName: 'User', id: 10, name: 'Coord User' }
        ])
        done()
      })
    })
    
    test('should set suggestions', done => {
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.SET_USER_SUGGESTIONS)
        done()
      })
    })
  })
})
