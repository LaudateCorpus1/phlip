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
import { INITIAL_STATE } from '../reducer'

describe('Autocomplete logic', () => {
  let apiMock
  
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)
  
  beforeEach(() => {
    apiMock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (type, suffix, state = {}) => {
    return createMockStore({
      initialState: {
        [`autocomplete.${type}.${suffix}`]: {
          ...INITIAL_STATE,
          ...state
        }
      },
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }
  
  describe('Search Project List Logic', () => {
    test('should send a request to get projects and only return projects matching action.searchString', done => {
      apiMock
        .onGet('/projects/search')
        .reply(200, [
          { name: 'project 1' },
          { name: 'test project' },
          { name: 'testing project' }
        ])
      
      const store = setupStore('project', 'bulk')
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
        searchString: 'project',
        suffix: '_BULK'
      })
      
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
            searchString: 'project',
            suffix: '_BULK'
          },
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT_BULK`,
            payload: [{ name: 'project 1' }, { name: 'test project' }, { name: 'testing project' }]
          }
        ])
        done()
      })
    })
    
    test('should allow the search if there is no project selected', done => {
      const store = setupStore('project', 'upload')
      
      store.dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`, suffix: '_UPLOAD' })
      store.whenComplete(() => {
        expect(store.actions[0].type).toEqual(`${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`)
        done()
      })
    })
    
    test('should allow the action if the selected project\'s name is different than new search', done => {
      const store = setupStore('project', 'upload', { selectedSuggestion: { name: 'Overwatch' } })
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
        searchString: 'Zero Dawn',
        suffix: '_UPLOAD'
      })
      
      store.whenComplete(() => {
        expect(store.actions[0].type).toEqual(`${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`)
        done()
      })
    })
    
    test('should not allow the action if the selected project\'s name is the same as the new search', done => {
      const store = setupStore('project', 'upload', { selectedSuggestion: { name: 'Overwatch' } })
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
        searchString: 'Overwatch',
        suffix: '_UPLOAD'
      })
      
      store.whenComplete(() => {
        expect(store.actions).toEqual([])
        done()
      })
    })
  })
  
  describe('get initial Project List Logic', () => {
    test('should send a request to get list of projects sorted by createdby id', done => {
      apiMock
        .onGet('/projects/searchRecent')
        .reply(200, [
          { name: 'project 1' },
          { name: 'test project' },
          { name: 'testing project' }
        ])
      
      const store = setupStore('project', 'upload', {})
      
      store.dispatch({
        type: `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_PROJECT`,
        userId: 1,
        count: 30,
        suffix: '_UPLOAD'
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(`${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT_UPLOAD`)
        done()
      })
    })
  })
  
  describe('Search Jurisdiction List Logic', () => {
    test(
      'should send a request to search jurisdictions and dispatch SEARCH_JURISDICTION_LIST_SUCCESS when successful',
      done => {
        apiMock
          .onGet('/jurisdictions', { params: { name: 'Al' } })
          .reply(200, [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }])
        
        const store = setupStore('jurisdiction', 'upload')
        store.dispatch({
          type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
          searchString: 'Al',
          suffix: '_UPLOAD'
        })
        
        store.whenComplete(() => {
          expect(store.actions[1]).toEqual({
            type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_JURISDICTION_UPLOAD`,
            payload: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }]
          })
          done()
        })
      }
    )
    
    test('should allow the search if there is no jurisdiction selected', done => {
      const store = setupStore('jurisdiction', 'upload', { selectedSuggestion: {} })
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
        searchString: 'test',
        suffix: '_UPLOAD'
      })
      store.whenComplete(() => {
        expect(store.actions[0].type).toEqual(`${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`)
        done()
      })
    })
    
    test('should allow the action if the selected jurisdictions\'s name is different than new search', done => {
      const store = setupStore('jurisdiction', 'upload', { selectedSuggestion: { name: 'Ohio' } })
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
        searchString: 'Florida',
        suffix: '_UPLOAD'
      })
      
      store.whenComplete(() => {
        expect(store.actions[0].type).toEqual(`${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`)
        done()
      })
    })
    
    test('should not allow the action if the selected jurisdictions\'s name is the same as the new search', done => {
      const store = setupStore('jurisdiction', 'upload', { selectedSuggestion: { name: 'Ohio' } })
      
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
        searchString: 'Ohio',
        suffix: '_UPLOAD'
      })
      
      store.whenComplete(() => {
        expect(store.actions).toEqual([])
        done()
      })
    })
  })
})
