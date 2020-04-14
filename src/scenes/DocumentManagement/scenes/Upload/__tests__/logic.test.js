import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic, { mergeInfoWithDocs } from '../logic'
import {
  selectedDocs,
  excelInfoFull,
  excelInfoWithMissing,
  fullMerged,
  mergedWithMissing,
  excelWithDup,
  excelWithoutState,
  selectedWithDup,
  files,
  arrOfDocsTransport
} from 'utils/testData/upload'
import { types } from '../actions'
import createApiHandler, {
  docApiInstance,
  projectApiInstance
} from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'
import { INITIAL_STATE as mainListState } from '../../../reducer'
import { INITIAL_STATE } from '../reducer'
import { INITIAL_STATE as AUTO_INITIAL_STATE } from 'data/autocomplete/reducer'

describe('Document Management - Upload logic', () => {
  let mock, apiMock
  
  const mockReducer = state => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)
  
  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (current = {}, projAuto = {}, jurAuto = {}, mainListUpdates = {}) => {
    return createMockStore({
      initialState: {
        data: {
          user: {
            currentUser: {
              firstName: 'Test',
              lastName: 'User',
              id: 43
            }
          }
        },
        scenes: {
          docManage: {
            main: { list: { ...mainListState, ...mainListUpdates } },
            upload: {
              list: { ...INITIAL_STATE, ...current }
            }
          }
        },
        'autocomplete.project.upload': {
          ...AUTO_INITIAL_STATE,
          ...projAuto
        },
        'autocomplete.jurisdiction.upload': {
          ...AUTO_INITIAL_STATE,
          ...jurAuto
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }
  
  describe('Upload Documents', () => {
    test('should reject action with type REJECT_NO_PROJECT_SELECTED when no project is selected', done => {
      const store = setupStore()
      store.dispatch({ type: types.UPLOAD_DOCUMENTS_START, selectedDocs, project: {}, jurisdiction: {} })
      
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.REJECT_NO_PROJECT_SELECTED,
            error: 'You must associate these documents with a project.'
          }
        ])
        done()
      })
    })
    
    test('should reject the action if the user hasn\'t selected a valid project', done => {
      const store = setupStore(
        {
          selectedDocs: [
            { name: 'doc1', jurisdictions: { value: { name: '' } } },
            { name: 'doc2', jurisdictions: { value: { name: '' } } },
            { name: 'doc3', jurisdictions: { value: { name: 'jur1', id: 3 } } }
          ]
        },
        { selectedSuggestion: { name: 'project' } }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs,
        project: { name: 'project' },
        jurisdiction: {}
      })
      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.REJECT_NO_PROJECT_SELECTED,
            error: 'You must select a valid project from the autocomplete list.'
          }
        ])
        done()
      })
    })
    
    test(
      'should reject action with type REJECT_EMPTY_JURISDICTIONS if one or more documents are missing a jurisdiction',
      done => {
        const store = setupStore(
          {
            selectedDocs: [
              { name: 'doc1', jurisdictions: { value: { name: '' } } },
              { name: 'doc2', jurisdictions: { value: { name: '' } } },
              { name: 'doc3', jurisdictions: { value: { name: 'jur1', id: 3 } } }
            ]
          },
          { selectedSuggestion: { name: 'project', id: 4 } }
        )
        
        store.dispatch({
          type: types.UPLOAD_DOCUMENTS_START,
          selectedDocs,
          project: { name: 'project', id: 4 },
          jurisdiction: {}
        })
        store.whenComplete(() => {
          expect(store.actions).toEqual([
            {
              type: types.REJECT_EMPTY_JURISDICTIONS,
              error: 'You must select a jurisdiction from the drop-down list at the top to apply to all files or select a jurisdiction from the drop-down list for each file.',
              invalidDocs: [
                { name: 'doc1', jurisdictions: { value: { name: '' } } },
                { name: 'doc2', jurisdictions: { value: { name: '' } } }
              ]
            }
          ])
          done()
        })
      }
    )
    
    test(
      'should allow the action if each document has their own jurisdiction and no global jurisdiction is selected',
      done => {
        const docsWithFiles = selectedDocs.map(doc => ({ ...doc, file: new Blob() }))
        mock.onPost('/docs/upload').reply(200, { files: [{ content: '', bleh: 'bleh' }] })
        const store = setupStore(
          {
            selectedDocs: [
              { name: 'doc1', jurisdictions: { value: { name: 'jur2', id: 2 } } },
              { name: 'doc2', jurisdictions: { value: { name: 'jur1', id: 3 } } },
              { name: 'doc3', jurisdictions: { value: { name: 'jur1', id: 3 } } }
            ]
          },
          { selectedSuggestion: { name: 'project', id: 4 } }
        )
        
        store.dispatch({
          type: types.UPLOAD_DOCUMENTS_START,
          selectedDocs: docsWithFiles,
          project: { name: 'project', id: 4 },
          jurisdiction: {}
        })
        store.whenComplete(() => {
          expect(store.actions[0].type).toEqual(types.UPLOAD_DOCUMENTS_START)
          done()
        })
      }
    )
    
    test('should dispatch that there are duplicates if duplicates are found', done => {
      const store = setupStore(
        { selectedDocs: fullMerged },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } },
        {
          documents: {
            byId: {
              1: {
                jurisdictions: [4],
                projects: [4],
                name: 'Ohio - combined PDF.pdf'
              }
            }
          }
        }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs: arrOfDocsTransport,
        project: { name: 'project', id: 4 },
        jurisdiction: { name: 'jurisdiction 10', id: 10 }
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.VERIFY_RETURN_DUPLICATE_FILES)
        done()
      })
    })
    
    test('should upload documents one at a time', done => {
      const spy = jest.spyOn(docApi, 'upload')
      mock.onPost('/docs/upload').reply(200, { files: [{ content: '', bleh: 'bleh' }] })
      
      const docsWithFiles = selectedDocs.map(doc => ({ ...doc, file: new Blob() }))
      const store = setupStore(
        { hasVerified: true, selectedDocs: fullMerged },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs: docsWithFiles,
        project: { name: 'project', id: 4 },
        jurisdiction: { name: 'jurisdiction 10', id: 10 }
      })
      
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalledTimes(4)
        done()
      })
    })
    
    test('should dispatch no failures if all uploads succeed', done => {
      mock.onPost('/docs/upload').reply(200, { files: [{ content: '', bleh: 'bleh' }] })
      
      const docsWithFiles = selectedDocs.map(doc => ({ ...doc, file: new Blob() }))
      const store = setupStore(
        { hasVerified: true, selectedDocs: fullMerged },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs: docsWithFiles,
        project: { name: 'project', id: 4 },
        jurisdiction: { name: 'jurisdiction 10', id: 10 }
      })
      
      store.whenComplete(() => {
        const actions = store.actions
        expect(actions[actions.length - 1].type).toEqual(types.UPLOAD_DOCUMENTS_FINISH_SUCCESS)
        done()
      })
    })
    
    test('should send a request to upload docs and handle failed uploads', done => {
      mock
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
        .onPost('/docs/upload').replyOnce(500)
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
      
      const docsWithFiles = selectedDocs.map(doc => ({ ...doc, file: new Blob() }))
      const store = setupStore(
        { hasVerified: true, selectedDocs: fullMerged },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs: docsWithFiles,
        project: { name: 'project', id: 4 },
        jurisdiction: { name: 'jurisdiction 10', id: 10 }
      })
      
      store.whenComplete(() => {
        expect(store.actions[3].payload.failed).toEqual(true)
        expect(store.actions[1].payload.failed).toEqual(false)
        expect(store.actions[2].payload.failed).toEqual(false)
        expect(store.actions[4].payload.failed).toEqual(false)
        done()
      })
    })
    
    test('should inform the user of upload failures', done => {
      mock
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
        .onPost('/docs/upload').replyOnce(500)
        .onPost('/docs/upload').replyOnce(200, { files: [{ content: '', bleh: 'bleh' }] })
      
      const docsWithFiles = selectedDocs.map(doc => ({ ...doc, file: new Blob() }))
      const store = setupStore(
        { hasVerified: true, selectedDocs: fullMerged },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )
      
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_START,
        selectedDocs: docsWithFiles,
        project: { name: 'project', id: 4 },
        jurisdiction: { name: 'jurisdiction 10', id: 10 }
      })
      
      store.whenComplete(() => {
        const actions = store.actions
        expect(actions[actions.length - 1].type).toEqual(types.UPLOAD_DOCUMENTS_FINISH_WITH_FAILS)
        done()
      })
    })
  })
  
  describe('Upload Excel -- merge info', () => {
    describe('merging info function', () => {
      test('should not query the same jurisdiction more than once', async () => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
        
        const spy = jest.spyOn(api, 'searchJurisdictionList')
        await mergeInfoWithDocs(excelWithDup, selectedWithDup, api)
        expect(spy).toHaveBeenCalledTimes(4)
      })
      
      test('should prepopulate jurisdiction value with value from excel is jurisdiction is not a state', async () => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
        
        const { merged: response } = await mergeInfoWithDocs(excelWithoutState, selectedWithDup, api)
        expect(response[response.length - 1].jurisdictions.value.searchValue).toEqual('butler county')
      })
    })
    
    describe('MERGE_INFO', () => {
      test('should create an object of docs to prepare for merging info', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)', id: 1 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)', id: 2 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)', id: 3 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } })
          .reply(200, [{ name: 'Ohio (state)', id: 4 }])
        
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoFull)
        
        const store = setupStore({ extractedInfo: excelInfoFull })
        
        store.dispatch({
          type: types.MERGE_INFO_WITH_DOCS,
          docs: files
        })
        
        store.whenComplete(() => {
          expect(store.actions[0].payload.merged).toEqual(fullMerged)
          done()
        })
      })
    })
    
    describe('EXTRACT_INFO', () => {
      test('should specify that there are no selected docs when dispatching success', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)', id: 1 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)', id: 2 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)', id: 3 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } })
          .reply(200, [{ name: 'Ohio (state)', id: 4 }])
        
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoFull)
        
        const store = setupStore({ selectedDocs: [] })
        
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoFull
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.EXTRACT_INFO_SUCCESS_NO_DOCS)
          done()
        })
      })
      
      test('should merge info with already selected docs for upload', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)', id: 1 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)', id: 2 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)', id: 3 }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } })
          .reply(200, [{ name: 'Ohio (state)', id: 4 }])
        
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoFull)
        
        const store = setupStore({ selectedDocs })
        
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoFull
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].payload.merged).toEqual(fullMerged)
          done()
        })
      })
      
      test('should clear out info when there is already info in state', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
        
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
        
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoWithMissing)
        
        const store = setupStore({ selectedDocs, extractedInfo: excelInfoFull })
        
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoWithMissing
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].payload.merged).toEqual(mergedWithMissing)
          done()
        })
      })
      
      test('should set an error if there is an error extracting info', done => {
        mock.onPost('/docs/upload/extractInfo').reply(500)
        
        const store = setupStore({ selectedDocs, extractedInfo: excelInfoFull })
        
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoWithMissing
        })
        
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.EXTRACT_INFO_FAIL)
          done()
        })
      })
    })
  })
})
