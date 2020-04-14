import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'

describe('DocumentView logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
  })

  const setupStore = state => {
    return createMockStore({
      initialState: {
        scenes: {
          docView: {
            meta: {
              ...state
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi
      }
    })
  }

  describe('get document contents logic', () => {
    test('should get document contents and dispatch GET_DOCUMENT_CONTENTS_SUCCESS when successful', (done) => {
      mock.onGet('/docs/1212/contents').reply(200, { content: {} })
      const store = setupStore()
      store.dispatch({ type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' },
          {
            type: types.GET_DOCUMENT_CONTENTS_SUCCESS,
            payload: {}
          }
        ])
        done()
      })
    })

    test('should get document contents and dispatch GET_DOCUMENT_CONTENTS_FAIL on failure', (done) => {
      mock.onGet('/docs/1212/contents').reply(500)

      const store = setupStore()

      store.dispatch({ type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' },
          {
            type: types.GET_DOCUMENT_CONTENTS_FAIL,
            payload: 'We couldn\'t retrieve the contents for this document.'
          }
        ])
        done()
      })
    })
  })

  describe('update document logic', () => {
    test('should send a request to update document and dispatch UPDATE_DOC_SUCCESS on success', done => {
      mock.onPut('/docs/4').reply(200, { _id: 4 })

      const store = setupStore({
        documentForm: {
          name: 'document',
          projects: [1, 2],
          jurisdictions: [3, 4],
          _id: 4,
          effectiveDate: '',
          citation: '',
          status: 'Approved'
        }
      })
      store.dispatch({ type: types.UPDATE_DOC_REQUEST, property: null, value: null })

      store.whenComplete(() => {
        expect(store.actions[0]).toEqual({ type: types.UPDATE_DOC_REQUEST, property: null, value: null })
        expect(store.actions[1]).toEqual({ type: types.UPDATE_DOC_SUCCESS, payload: 4 })
        done()
      })
    })
  })

  describe('delete document logic', () => {
    test('should send a request to delete document and dispatch DELETE_DOCUMENT_SUCCESS on success', done => {
      mock.onDelete('/docs/4').reply(200, { _id: 4 })

      const store = setupStore({
        documentForm: {
          name: 'document',
          projects: [1, 2],
          jurisdictions: [3, 4],
          _id: 4,
          effectiveDate: '',
          citation: '',
          status: 'Approved'
        }
      })
      store.dispatch({ type: types.DELETE_DOCUMENT_REQUEST, id: 4 })

      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({ type: types.DELETE_DOCUMENT_SUCCESS, payload: 4 })
        done()
      })
    })
    
    test('should send a request to delete document and dispatch DELETE_DOCUMENT_FAIL on failed', done => {
      mock.onDelete('/docs/5').reply(500)

      const store = setupStore({
        documentForm: {
          name: 'document',
          projects: [1, 2],
          jurisdictions: [3, 4],
          _id: 4,
          effectiveDate: '',
          citation: '',
          status: 'Approved'
        }
      })
      store.dispatch({ type: types.DELETE_DOCUMENT_REQUEST, id: 5 })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.DELETE_DOCUMENT_REQUEST, id: 5 },
          {
            type: types.DELETE_DOCUMENT_FAIL,
            payload: { error: 'We couldn\'t delete the document.' }
          }
        ])
        done()
      })
    })
  })
})
