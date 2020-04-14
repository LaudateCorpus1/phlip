import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import { projects } from 'utils/testData/projectsHome'
import calls from 'services/api/calls'

describe('AddEditJurisdiction logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })

  const setupStore = (state = {}) => {
    return createMockStore({
      initialState: {
        data: {
          user: { currentUser: { id: 5 } },
          projects: { byId: projects },
          jurisdictions: {
            byId: {}
          }
        },
        ...state
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }

  describe('GET_PROJECT_JURISDICTIONS_REQUEST', () => {
    test('should call the get jurisdictions api and return the list of jurisdictions', done => {
      mock.onGet('/projects/1/jurisdictions').reply(200, [
        { id: 1, name: 'Jurisdiction 1', startDate: '1/1/2000', endDate: '1/1/2000' },
        { id: 2, name: 'Jurisdiction 2', startDate: '1/1/2000', endDate: '1/1/2000' }
      ])
    
      const store = setupStore()
    
      store.dispatch({ type: types.GET_PROJECT_JURISDICTIONS_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.GET_PROJECT_JURISDICTIONS_REQUEST, projectId: 1 },
          {
            type: types.GET_PROJECT_JURISDICTIONS_SUCCESS, payload: [
              { id: 1, name: 'Jurisdiction 1', startDate: '1/1/2000', endDate: '1/1/2000' },
              { id: 2, name: 'Jurisdiction 2', startDate: '1/1/2000', endDate: '1/1/2000' }
            ]
          }
        ])
        done()
      })
    })
  })
  
  describe('ADD_PROJECT_JURISDICTION_REQUEST', () => {
    test('should call the add jurisdiction api and return the new jurisdiction', done => {
      const newJurisdiction = {
        id: 1,
        name: 'Jurisdiction 1',
        startDate: '1/3/2017',
        endDate: '1/4/2017'
      }
    
      mock.onPost('/projects/1/jurisdictions').reply(200, newJurisdiction)
    
      const store = setupStore()
    
      store.dispatch({
        type: types.ADD_PROJECT_JURISDICTION_REQUEST,
        jurisdiction: newJurisdiction,
        projectId: 1
      })
    
      store.whenComplete(() => {
        expect(store.actions[0]).toEqual({
          type: types.ADD_PROJECT_JURISDICTION_REQUEST,
          jurisdiction: {
            ...newJurisdiction,
            userId: 5
          },
          projectId: 1
        })
      
        expect(store.actions[1]).toEqual({
          type: types.ADD_PROJECT_JURISDICTION_SUCCESS,
          payload: { ...newJurisdiction }
        })
      
        done()
      })
    })
  })

  describe('UPDATE_PROJECT_JURISDICTION_REQUEST', () => {
    test('should call the update jurisdiction api and return the updated jurisdiction', done => {
      const updatedJurisdiction = {
        id: 1,
        name: 'Jurisdiction 1',
        startDate: '1/3/2017',
        endDate: '1/4/2017'
      }
    
      mock.onPut(`/projects/${1}/jurisdictions/${1}`).reply(200, updatedJurisdiction)
    
      const store = setupStore()
    
      store.dispatch({
        type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
        jurisdiction: updatedJurisdiction,
        projectId: 1,
        projectJurisdictionId: 1
      })
    
      store.whenComplete(() => {
        expect(store.actions[0]).toEqual({
          type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
          jurisdiction: {
            ...updatedJurisdiction,
            userId: 5
          },
          projectId: 1,
          projectJurisdictionId: 1
        })
      
        expect(store.actions[1]).toEqual({
          type: types.UPDATE_PROJECT_JURISDICTION_SUCCESS,
          payload: { ...updatedJurisdiction }
        })
      
        done()
      })
    })
  })

  describe('SEARCH_JURISDICTION_LIST', () => {
    test('should call the search list api and return a list of matching jurisdictions', done => {
      mock.onGet('/jurisdictions', { params: { name: 'Al' } }).reply(200, [
        { id: 1, name: 'Alaska' },
        { id: 2, name: 'Alabama' }
      ])
    
      const store = setupStore()
    
      store.dispatch({ type: types.SEARCH_JURISDICTION_LIST, searchString: 'Al' })
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.SEARCH_JURISDICTION_LIST, searchString: 'Al' },
          { type: types.SET_JURISDICTION_SUGGESTIONS, payload: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }] }
        ])
        done()
      })
    })
  })
})
