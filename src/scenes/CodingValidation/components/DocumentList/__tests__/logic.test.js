import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import { docListPayload } from 'utils/testData/coding'
import { mockDocuments } from 'utils/testData/documents'
import { userAnswersCoded, userAnswersValidation, schemeById, mergedUserQuestions } from 'utils/testData/coding'

const userAnswers = {
  ...userAnswersCoded,
  1: {
    ...userAnswersCoded[1],
    answers: {
      ...userAnswersCoded[1].answers,
      123: {
        ...userAnswersCoded[1][123],
        annotations: [{ id: 1 }, { id: 2 }, { id: 3 }]
      }
    }
  }
}

const validationUserAnswers = {
  ...userAnswersValidation,
  1: {
    ...userAnswersValidation[1],
    answers: {
      ...userAnswersValidation[1].answers,
      123: {
        ...userAnswersValidation[1][123],
        annotations: [{ id: 1 }, { id: 2 }, { id: 3 }]
      }
    }
  }
}

describe('CodingValidation - DocumentList logic', () => {
  let mock
  
  const mockReducer = state => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  
  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
  })
  
  const setupStore = (otherDoc = {}, otherCoding = {}) => {
    return createMockStore({
      initialState: {
        scenes: {
          codingValidation: {
            documentList: {
              documents: {
                byId: mockDocuments.byId,
                allIds: Object.keys(mockDocuments.byId)
              },
              ...otherDoc
            },
            coding: {
              question: schemeById[1],
              page: 'coding',
              userAnswers,
              selectedCategoryId: 10,
              mergedUserQuestions,
              ...otherCoding
            }
          }
        },
        data: {
          user: {
            currentUser: {
              id: 1,
              firstName: 'Test',
              lastName: 'User'
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
  
  test('should get approved documents and dispatch GET_APPROVED_DOCUMENTS_SUCCESS when successful', done => {
    mock.onGet('/docs/projects/1/jurisdictions/32').reply(200, docListPayload)
    
    const store = setupStore()
    store.dispatch({ type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' })
    
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' },
        {
          type: types.GET_APPROVED_DOCUMENTS_SUCCESS,
          payload: docListPayload
        }
      ])
      done()
    })
  })
  
  test('should get approved documents and dispatch GET_APPROVED_DOCUMENTS_FAIL on failure', done => {
    mock.onGet('/docs/projects/1/jurisdictions/32').reply(500)
    
    const store = setupStore()
    store.dispatch({ type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' })
    
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' },
        { type: types.GET_APPROVED_DOCUMENTS_FAIL }
      ])
      done()
    })
  })
  
  describe('Saving annotation', () => {
    test('should add the document citation if it exists to the action', done => {
      const store = setupStore()
      store.dispatch({ type: types.ON_SAVE_ANNOTATION, annotation: { docId: 1 } })
      
      store.whenComplete(() => {
        expect(store.actions[0].citation).toEqual('123-123')
        done()
      })
    })
    
    test('should set the citation as an empty string if it does not exists', done => {
      const store = setupStore()
      store.dispatch({ type: types.ON_SAVE_ANNOTATION, annotation: { docId: 2 } })
      
      store.whenComplete(() => {
        expect(store.actions[0].citation).toEqual('')
        done()
      })
    })
  })
  
  describe('Toggling annotation mode', () => {
    test('should clear annotations and user\'s if toggling off annotation mode', done => {
      const store = setupStore()
      store.dispatch({ type: types.TOGGLE_ANNOTATION_MODE, enabled: false })
      store.whenComplete(() => {
        expect(store.actions[0].annotations).toEqual([])
        expect(store.actions[0].users).toEqual([])
        done()
      })
    })
    
    describe('toggling on annotation mode', () => {
      test('should return the annotations for the current question and selected answer', done => {
        const store = setupStore()
        store.dispatch({ type: types.TOGGLE_ANNOTATION_MODE, enabled: true, questionId: 1, answerId: 123 })
        store.whenComplete(() => {
          expect(store.actions[0].annotations)
            .toEqual([
              { id: 1, fullListIndex: 0, isValidatorAnswer: false, userId: 1 },
              { id: 2, fullListIndex: 1, isValidatorAnswer: false, userId: 1 },
              { id: 3, fullListIndex: 2, isValidatorAnswer: false, userId: 1 }
            ])
          expect(store.actions[0].users).toEqual([{ userId: 1, isValidator: false }])
          done()
        })
      })
      
      test('should return the annotations with the validated by user if the user is on the validation page', done => {
        const store = setupStore({}, { page: 'validation', userAnswers: validationUserAnswers })
        store.dispatch({ type: types.TOGGLE_ANNOTATION_MODE, enabled: true, questionId: 1, answerId: 123 })
        store.whenComplete(() => {
          expect(store.actions[0].annotations)
            .toEqual([
              { id: 1, fullListIndex: 0, isValidatorAnswer: true, userId: 2 },
              { id: 2, fullListIndex: 1, isValidatorAnswer: true, userId: 2 },
              { id: 3, fullListIndex: 2, isValidatorAnswer: true, userId: 2 }
            ])
          expect(store.actions[0].users).toEqual([{ userId: 2, isValidator: true }])
          done()
        })
      })
    })
  })
  
  describe('Downloading documents', () => {
    test('should download a zip file if the user clicked the download all button', done => {
      mock.onPost('/docs/download').reply(200)
      const store = setupStore()
      const spy = jest.spyOn(docApi, 'downloadZipWithAnnotations')
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 'all' })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should download one file if the user clicked to download only one', done => {
      mock.onGet('/docs/1/download').reply(200)
      const store = setupStore()
      const spy = jest.spyOn(docApi, 'downloadWithAnnotations')
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 1 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should show the user the error if the request fails', done => {
      mock.onGet('/docs/1/download').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DOWNLOAD_DOCUMENTS_FAIL)
        done()
      })
    })
  })
})
