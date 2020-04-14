import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { INITIAL_STATE as USER_INITIAL_STATE } from 'data/users/reducer'
import { INITIAL_STATE as MAIN_INITIAL_STATE } from 'scenes/CodingScheme/reducer'
import { INITIAL_STATE as ADD_EDIT_INITIAL_STATE } from '../reducer'
import { schemeFromApi, schemeOutline } from 'utils/testData/coding'

let history = {}, mock = {}
const api = createApiHandler({ history }, projectApiInstance, calls)
const setupStore = (otherMainState = {}, otherAddEditState = {}) => {
  return createMockStore({
    initialState: {
      data: {
        user: {
          ...USER_INITIAL_STATE,
          currentUser: { id: 1, firstName: 'Test', lastName: 'User', avatar: '' },
          byId: {
            1: { id: 1 }
          }
        }
      },
      scenes: {
        codingScheme: {
          main: {
            ...MAIN_INITIAL_STATE,
            questions: schemeFromApi,
            outline: schemeOutline,
            ...otherMainState
          },
          addEditQuestion: {
            ...ADD_EDIT_INITIAL_STATE,
            ...otherAddEditState
          }
        }
      }
    },
    reducer: state => state,
    logic,
    injectedDeps: { api }
  })
}

describe('CodingScheme - AddEditQuestion logic', () => {
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  describe('Adding a root question', () => {
    const newQuestion = {
      questionType: 1,
      possibleAnswers: [{ text: 'Yes', order: 1 }, { text: 'No', order: 2 }],
      includeComment: false,
      isCategoryQuestion: false,
      text: 'q'
    }
    
    test('should add the question to the bottom of the scheme', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.ADD_QUESTION_REQUEST, projectId: 14, question: newQuestion, parentId: 0 })
      store.whenComplete(() => {
        expect(store.actions[0].question.positionInParent).toEqual(5)
        done()
      })
    })
    
    test('should transform action and add the user who added the question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({ type: types.ADD_QUESTION_REQUEST, projectId: 14, question: newQuestion })
      store.whenComplete(() => {
        expect(store.actions[0].question.userId).toEqual(1)
        done()
      })
    })
    
    test('should set the possible answers with just one if the question is a text field question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_QUESTION_REQUEST,
        projectId: 14,
        question: { ...newQuestion, questionType: 5 },
        parentId: 0
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.possibleAnswers).toEqual([{ text: '', order: 0 }])
        done()
      })
    })
    
    test('should always set that the question is not a category question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_QUESTION_REQUEST,
        projectId: 14,
        question: { ...newQuestion, questionType: 5 },
        parentId: 0
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.isCategoryQuestion).toEqual(false)
        done()
      })
    })
    
    test('should show an alert to the user if the request fails', done => {
      mock.onPost('/projects/14/scheme').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.ADD_QUESTION_REQUEST, projectId: 14, question: newQuestion })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_QUESTION_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t add the question. Please try again later.')
        done()
      })
    })
  })
  
  describe('Adding a child question', () => {
    const newQuestion = {
      questionType: 1,
      possibleAnswers: [{ text: 'Yes', order: 1 }, { text: 'No', order: 2 }],
      includeComment: false,
      isCategoryQuestion: false,
      text: 'q'
    }
    
    const parentNode = {
      id: 1,
      text: 'fa la la la',
      hint: '',
      questionType: 1,
      parentId: 0,
      positionInParent: 0,
      isCategoryQuestion: false,
      flags: [],
      possibleAnswers: [{ id: 123, text: 'answer 1', order: 1 }, { id: 234, text: 'answer 2', order: 2 }]
    }
    
    test('should add the question to the bottom of the parent\'s children', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: newQuestion,
        parentId: 1,
        parentNode: {
          ...parentNode,
          children: [{ id: 12 }, { id: 3 }]
        }
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.positionInParent).toEqual(2)
        done()
      })
    })
    
    test('should add the question to be the first child if the parent has no children', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: newQuestion,
        parentNode,
        parentId: 1
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.positionInParent).toEqual(0)
        done()
      })
    })
    
    test('should transform action and add the user who added the question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: newQuestion,
        parentNode,
        parentId: 1
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.userId).toEqual(1)
        done()
      })
    })
    
    test('should set the possible answers with just one if the question is a text field question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: { ...newQuestion, questionType: 5 },
        parentNode,
        parentId: 1
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.possibleAnswers).toEqual([{ text: '', order: 0 }])
        done()
      })
    })
    
    test('should always set if the question is a category question', done => {
      mock.onPost('/projects/14/scheme').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: newQuestion,
        parentId: 0,
        parentNode: { ...parentNode, questionType: 2 }
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.isCategoryQuestion).toEqual(true)
        done()
      })
    })
    
    test('should show an alert to the user if the request fails', done => {
      mock.onPost('/projects/14/scheme').reply(500)
      const store = setupStore()
      store.dispatch({
        type: types.ADD_CHILD_QUESTION_REQUEST,
        projectId: 14,
        question: newQuestion,
        parentNode,
        parentId: 1
      })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.ADD_CHILD_QUESTION_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t add this child question. Please try again later.')
        done()
      })
    })
  })
  
  describe('Updating a question', () => {
    const updatedQuestion = {
      questionType: 4,
      possibleAnswers: [
        { text: 'Yes', order: 1 },
        { text: 'Maybe', order: 2 },
        { text: 'No', order: 2 },
        { text: 'I don\'t know', order: 4 }
      ],
      includeComment: false,
      isCategoryQuestion: false,
      text: 'q',
      id: 4
    }
    
    test('should transform action and add the user who updated the question', done => {
      mock.onPut('/projects/14/scheme/4').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_QUESTION_REQUEST,
        projectId: 14,
        question: updatedQuestion,
        parentId: 1,
        questionId: 4
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.userId).toEqual(1)
        done()
      })
    })
    
    test('should relabel the possible answers in case the user added a new one', done => {
      mock.onPut('/projects/14/scheme/4').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_QUESTION_REQUEST,
        projectId: 14,
        question: updatedQuestion,
        parentId: 1,
        questionId: 4
      })
      store.whenComplete(() => {
        expect(store.actions[0].question.possibleAnswers).toEqual([
          { text: 'Yes', order: 1 },
          { text: 'Maybe', order: 2 },
          { text: 'No', order: 3 },
          { text: 'I don\'t know', order: 4 }
        ])
        done()
      })
    })
    
    test('should keep existing children or set to empty after updating', done => {
      mock.onPut('/projects/14/scheme/4').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_QUESTION_REQUEST,
        projectId: 14,
        question: updatedQuestion,
        parentId: 1,
        questionId: 4
      })
      store.whenComplete(() => {
        expect(store.actions[1].payload.children).toEqual([])
        done()
      })
    })
    
    test('should show an alert to the user if the request fails', done => {
      mock.onPut('/projects/14/scheme/4').reply(500)
      const store = setupStore()
      store.dispatch({
        type: types.UPDATE_QUESTION_REQUEST,
        projectId: 14,
        question: updatedQuestion,
        questionId: 4,
        parentId: 0
      })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.UPDATE_QUESTION_FAIL)
        expect(store.actions[1].payload).toEqual('We couldn\'t update the question. Please try again later.')
        done()
      })
    })
  })
})
