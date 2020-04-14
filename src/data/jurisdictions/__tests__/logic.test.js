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
  
  describe('GET_JURISDICTION_REQUEST', () => {
    test('should call api to get project and dispatch GET_JURISDICTION_SUCCESS when successful', done => {
      apiMock.onGet('/jurisdictions/1').reply(200, { id: 1, name: 'ohio' })
      const store = setupStore()
      store.dispatch({ type: types.GET_JURISDICTION_REQUEST, jurisdictionId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_JURISDICTION_SUCCESS)
        expect(store.actions[1].payload).toEqual({ id: 1, name: 'ohio' })
        done()
      })
    })
    
    test('should call api to get project and dispatch GET_JURISDICTION_FAIL on failure', done => {
      apiMock.onGet('/jurisdictions/1').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.GET_JURISDICTION_REQUEST, jurisdictionId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_JURISDICTION_FAIL)
        done()
      })
    })
  })
})
