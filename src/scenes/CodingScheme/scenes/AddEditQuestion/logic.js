import { createLogic } from 'redux-logic'
import { types } from './actions'
import * as questionTypes from './constants'

/**
 * Adds a userID to every action so as to not repeat the code in every logic block
 */
const updateUserIdLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        userId: getState().data.user.currentUser.id,
        possibleAnswers: action.question.possibleAnswers.map((answer, index) => ({ ...answer, order: index + 1 }))
      }
    })
  }
})

/**
 * Updates the question object in the action creators with outline information and possibleAnswers
 */
const updateOutlineLogic = createLogic({
  type: [types.ADD_QUESTION_REQUEST, types.ADD_CHILD_QUESTION_REQUEST],
  transform({ getState, action }, next) {
    let possibleAnswers
    if (action.question.questionType === questionTypes.TEXT_FIELD) {
      possibleAnswers = [{ text: '', order: 0 }]
    } else {
      possibleAnswers = action.question.possibleAnswers.map((answer, index) => ({ ...answer, order: index + 1 }))
    }
    
    next({
      ...action,
      question: {
        ...action.question,
        userId: getState().data.user.currentUser.id,
        outline: getState().scenes.codingScheme.main.outline,
        parentId: action.parentId,
        possibleAnswers,
        isCategoryQuestion: action.type === types.ADD_QUESTION_REQUEST
          ? false
          : action.parentNode.questionType === questionTypes.CATEGORY,
        positionInParent: action.type === types.ADD_QUESTION_REQUEST
          ? getState().scenes.codingScheme.main.questions.length
          : action.parentNode.children
            ? action.parentNode.children.length
            : 0
      }
    })
  }
})

/**
 * Sends a request to update the question in the coding scheme whose questionId = action.question.id
 */
const updateQuestionLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    try {
      const updatedQuestion = await api.updateQuestion(
        action.question,
        {},
        { projectId: action.projectId, questionId: action.questionId }
      )
      
      dispatch({
        type: types.UPDATE_QUESTION_SUCCESS,
        payload: {
          ...updatedQuestion,
          possibleAnswers: action.question.possibleAnswers,
          children: action.question.children || [],
          expanded: true,
          path: action.path
        }
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_QUESTION_FAIL,
        payload: 'We couldn\'t update the question. Please try again later.'
      })
    }
    done()
  }
})

/**
 * Sends a request to add a child question to the coding scheme
 */
const addChildQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    try {
      const question = await api.addQuestion(action.question, {}, { projectId: action.projectId })
      dispatch({
        type: types.ADD_CHILD_QUESTION_SUCCESS,
        payload: {
          ...action.question,
          path: action.path,
          id: question.id
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_CHILD_QUESTION_FAIL,
        payload: 'We couldn\'t add this child question. Please try again later.'
      })
    }
    done()
  }
})

/**
 * Sends a request to add a parent question to the coding scheme
 */
const addQuestionLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    try {
      const question = await api.addQuestion(action.question, {}, { projectId: action.projectId })
      dispatch({
        type: types.ADD_QUESTION_SUCCESS,
        payload: {
          ...question,
          possibleAnswers: action.question.possibleAnswers,
          parentId: action.question.parentId,
          positionInParent: action.question.positionInParent
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_QUESTION_FAIL,
        payload: 'We couldn\'t add the question. Please try again later.'
      })
    }
    done()
  }
})

export default [
  updateUserIdLogic,
  updateOutlineLogic,
  updateQuestionLogic,
  addQuestionLogic,
  addChildQuestionLogic
]
