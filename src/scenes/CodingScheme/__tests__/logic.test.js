import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import { INITIAL_STATE } from '../reducer'
import createApiHandler, { projectApiInstance } from 'services/api'
import { schemeOutline, schemeTreeFromApi, schemeTree, schemeFromApi } from 'utils/testData/scheme'
import calls from 'services/api/calls'

const history = {}

describe('CodingScheme logic', () => {
  let mock
  const api = createApiHandler({ history }, projectApiInstance, calls)
  const mockReducer = state => state
  
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (other = {}) => {
    return createMockStore({
      initialState: {
        scenes: {
          codingScheme: {
            main: {
              ...INITIAL_STATE,
              questions: schemeTree,
              outline: schemeOutline,
              ...other
            }
          }
        },
        data: {
          user: {
            currentUser: {
              id: 5
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
  
  describe('Getting the coding scheme', () => {
    test('should call the api to get the coding scheme and dispatch GET_SCHEME_SUCCESS when successful', (done) => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'question 1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })
      
      mock.onGet('/locks/scheme/projects/1').reply(200, {})
      
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })
      
      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({
          type: types.GET_SCHEME_SUCCESS,
          payload: {
            scheme: {
              schemeQuestions: [{ id: 1, text: 'question 1' }],
              outline: { 1: { parentId: 0, positionInParent: 0 } }
            },
            lockInfo: {},
            lockedByCurrentUser: false,
            error: {}
          }
        })
        done()
      })
    })
    
    test('should get lock info for the scheme', done => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'question 1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })
      mock.onGet('/locks/scheme/projects/1').reply(200, { userId: 4 })
      
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockInfo).toEqual({ userId: 4 })
        done()
      })
    })
    
    test('should set lock info to empty if there is no lock on the scheme', done => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'question 1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })
      mock.onGet('/locks/scheme/projects/1').reply(200, '')
      
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockInfo).toEqual({})
        done()
      })
    })
    
    test('should set if there was an error getting the lock info for the scheme', done => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'question 1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })
      mock.onGet('/locks/scheme/projects/1').reply(500)
      
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.error.lockInfo).toEqual('We couldn\'t determine if the coding scheme is checked out at this time.')
        done()
      })
    })
    
    test('should set that it is checkout by current user if lock info matches current user info', done => {
      mock.onGet('/projects/1/scheme').reply(200, {
        schemeQuestions: [{ id: 1, text: 'question 1' }],
        outline: { 1: { parentId: 0, positionInParent: 0 } }
      })
      mock.onGet('/locks/scheme/projects/1').reply(200, { userId: 5 })
      
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })
      
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockedByCurrentUser).toEqual(true)
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error getting the scheme', done => {
      mock.onGet('/projects/1/scheme').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 2 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.GET_SCHEME_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t retrieve the coding scheme for this project.')
        done()
      })
    })
  })
  
  describe('Copying the coding scheme', () => {
    test('should get the scheme tree for the selected project', done => {
      const spy = jest.spyOn(api, 'getSchemeTree')
      mock.onGet('/projects/1/scheme/tree').reply(200, [])
      const store = setupStore({ questions: [], outline: {} })
      store.dispatch({ type: types.COPY_CODING_SCHEME_REQUEST, copyProjectId: 1, projectId: 2 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalledWith({}, {}, { projectId: 1 })
        done()
      })
    })
    
    test('should add all children from scheme tree to current scheme', done => {
      mock.onGet('/projects/1/scheme/tree').reply(200, schemeTreeFromApi)
      mock
        .onPost('/projects/2/scheme').replyOnce(200, schemeFromApi[0])
        .onPost('/projects/2/scheme').replyOnce(200, schemeFromApi[1])
        .onPost('/projects/2/scheme').replyOnce(200, schemeFromApi[2])
        .onPost('/projects/2/scheme').replyOnce(200, schemeFromApi[3])
        .onPost('/projects/2/scheme').replyOnce(200, schemeFromApi[4])
      const store = setupStore({ questions: [], outline: {} })
      store.dispatch({ type: types.COPY_CODING_SCHEME_REQUEST, copyProjectId: 1, projectId: 2 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.scheme.outline).toEqual(schemeOutline)
        expect(store.actions[1].payload.scheme.schemeQuestions).toEqual(schemeFromApi)
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error copying the scheme', done => {
      mock.onGet('/projects/1/scheme/tree').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.COPY_CODING_SCHEME_REQUEST, copyProjectId: 1, projectId: 2 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.COPY_CODING_SCHEME_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t copy the coding scheme.')
        done()
      })
    })
  })
  
  describe('Locking the coding scheme', () => {
    test('should lock the scheme and dispatch success if successful', done => {
      const store = setupStore()
      mock.onPost('/locks/scheme/projects/1/users/5').reply(200, { userId: 5 })
      
      store.dispatch({ type: types.LOCK_SCHEME_REQUEST, id: 1, userId: 5 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.LOCK_SCHEME_SUCCESS)
        expect(store.actions[1].payload.lockInfo).toEqual({ userId: 5 })
        done()
      })
    })
    
    test('should set whether the scheme if locked by current user', done => {
      const store = setupStore()
      mock.onPost('/locks/scheme/projects/1/users/5').reply(200, { userId: 5 })
      store.dispatch({ type: types.LOCK_SCHEME_REQUEST, id: 1, userId: 5 })
      store.whenComplete(() => {
        expect(store.actions[1].payload.lockedByCurrentUser).toEqual(true)
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error locking the scheme', done => {
      mock.onPost('/locks/scheme/projects/1/users/1').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.LOCK_SCHEME_REQUEST, userId: 1, id: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.LOCK_SCHEME_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t lock the coding scheme.')
        done()
      })
    })
  })
  
  describe('Unlocking the coding scheme', () => {
    test('should send a request to unlock the protocol for a project id and user id', done => {
      const store = setupStore()
      mock.onDelete('locks/scheme/projects/1/users/1').reply(200, {})
      store.dispatch({ type: types.UNLOCK_SCHEME_REQUEST, id: 1, userId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UNLOCK_SCHEME_SUCCESS)
        done()
      })
    })
    
    test('should use the current logged in user id if none is passed in', done => {
      const spy = jest.spyOn(api, 'unlockCodingScheme')
      const store = setupStore()
      mock.onDelete('locks/scheme/projects/1/users/1').reply(200, {})
      store.dispatch({ type: types.UNLOCK_SCHEME_REQUEST, id: 1 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalledWith({}, {}, { userId: 5, projectId: 1 })
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error unlocking the scheme', done => {
      mock.onDelete('/locks/scheme/projects/1/users/1').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.UNLOCK_SCHEME_REQUEST, userId: 1, id: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UNLOCK_SCHEME_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t unlock the coding scheme.')
        done()
      })
    })
  })
  
  describe('Reordering the coding scheme', () => {
    test('should use current outline and reorder the coding scheme', done => {
      const spy = jest.spyOn(api, 'reorderScheme')
      mock.onPut('/projects/1/scheme').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.REORDER_SCHEME_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalledWith({ outline: schemeOutline, userId: 5 }, {}, { projectId: 1 })
        expect(store.actions[1].type).toEqual(types.REORDER_SCHEME_SUCCESS)
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error reordering the scheme', done => {
      mock.onPut('/projects/1/scheme').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.REORDER_SCHEME_REQUEST, projectId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.REORDER_SCHEME_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t save your edits.')
        done()
      })
    })
  })
  
  describe('Deleting a coding scheme question', () => {
    test('should call the api to delete the question', done => {
      mock.onDelete('/projects/1/scheme/2').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.DELETE_QUESTION_REQUEST, projectId: 1, questionId: 2, path: [1] })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_QUESTION_SUCCESS)
        done()
      })
    })
    
    test('should save the new scheme order after deletion', done => {
      mock.onDelete('/projects/1/scheme/2').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.DELETE_QUESTION_REQUEST, projectId: 1, questionId: 2, path: [1] })
      store.whenComplete(() => {
        expect(store.actions[2].type).toEqual(types.REORDER_SCHEME_REQUEST)
        expect(store.actions[2].projectId).toEqual(1)
        done()
      })
    })
    
    test('should remove the question from the scheme', done => {
      mock.onDelete('/projects/1/scheme/2').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.DELETE_QUESTION_REQUEST, projectId: 1, questionId: 2, path: [1] })
      const updatedQuestions = schemeTree.slice()
      updatedQuestions.splice(1, 1)
      store.whenComplete(() => {
        expect(store.actions[1].payload.updatedQuestions).toEqual(updatedQuestions)
        done()
      })
    })
    
    test('should remove the question from the outline', done => {
      mock.onDelete('/projects/1/scheme/2').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.DELETE_QUESTION_REQUEST, projectId: 1, questionId: 2, path: [1] })
      const { [2]: removed, ...updatedOutline } = schemeOutline
      const outline = {
        ...updatedOutline,
        '3': {
          ...updatedOutline['3'],
          positionInParent: 1
        },
        '5': {
          ...updatedOutline['5'],
          positionInParent: 2
        }
      }
      store.whenComplete(() => {
        expect(store.actions[1].payload.updatedOutline).toEqual(outline)
        done()
      })
    })
    
    test('should show the user an alert error if there\'s an error deleting a question', done => {
      mock.onDelete('/projects/1/scheme/2').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.DELETE_QUESTION_REQUEST, projectId: 1, questionId: 2 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DELETE_QUESTION_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t delete the question.')
        done()
      })
    })
  })
})
