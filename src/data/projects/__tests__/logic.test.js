import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, {
  docApiInstance,
  projectApiInstance
} from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'
import { projects } from 'utils/testData/projectsHome'

describe('Data - Projects logic', () => {
  let apiMock
  
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)
  
  beforeEach(() => {
    apiMock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (projects = {}, jurisdictions = {}, other) => {
    return createMockStore({
      initialState: {
        data: {
          projects: {
            byId: {},
            ...projects
          },
          jurisdictions: {
            byId: {},
            ...jurisdictions
          },
          user: {
            currentUser: { id: 4, firstName: 'Test', lastName: 'User' }
          }
        }
      },
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }
  
  describe('GET_PROJECT_REQUEST', () => {
    test('should call api to get project and dispatch GET_PROJECT_SUCCESS when successful', done => {
      apiMock.onGet('/projects/1').reply(200, { id: 1, name: 'project 1' })
      const store = setupStore()
      store.dispatch({ type: types.GET_PROJECT_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_PROJECT_SUCCESS)
        expect(store.actions[1].payload).toEqual({ id: 1, name: 'project 1' })
        done()
      })
    })
  
    test('should call api to get project and dispatch GET_PROJECT_FAIL on failure', done => {
      apiMock.onGet('/projects/1').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.GET_PROJECT_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_PROJECT_FAIL)
        done()
      })
    })
  })
  
  describe('UPDATE_EDITED_FIELDS', () => {
    test('should set user to be currentuser.firstname currentuser.lastname', done => {
      const store = setupStore()
      store.dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[0].user).toEqual('Test User')
        done()
      })
    })
  })
  
  describe('SET_PROJECTS', () => {
    test('should add each jurisdiction from the project only if it doesn\'t exist', done => {
      const store = setupStore({ byId: projects })
      store.dispatch({ type: types.SET_PROJECTS })
      store.whenComplete(() => {
        expect(store.actions.length).toEqual(4)
        done()
      })
    })
  })
})
