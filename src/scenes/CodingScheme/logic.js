import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import { removeNodeAtPath } from 'react-sortable-tree'
import { questionsToOutline, getNodeKey } from 'scenes/CodingScheme/reducer'
import { types } from './actions'

/**
 * Adds a question to the scheme, used by Copying coding scheme
 * @param questions
 * @param question
 * @param parentId
 * @param positionInParent
 * @param api
 * @param userId
 * @param projectId
 * @param outline
 * @returns {Promise<{outline: *, questions: *}>}
 */
const processQuestion = async ({ questions, question, parentId, positionInParent, api, userId, projectId, outline }) => {
  const { id, flags, childQuestions, ...quest } = question
  quest.possibleAnswers = question.possibleAnswers.map(({ id, ...answer }) => answer)
  
  const request = {
    ...quest,
    positionInParent,
    parentId,
    userId,
    outline
  }
  
  const addedQuestion = await api.addQuestion(request, {}, { projectId: projectId })
  questions.push(addedQuestion)
  outline[addedQuestion.id] = {
    parentId,
    positionInParent
  }
  
  if (question.childQuestions) {
    for (let i = 0; i < question.childQuestions.length; i++) {
      const child = question.childQuestions[i]
      await processQuestion({
        questions,
        question: child,
        parentId: addedQuestion.id,
        positionInParent: i,
        api,
        userId,
        projectId,
        outline
      })
    }
  }
  
  return { outline, questions }
}

/**
 * Goes through every question in a copy scheme to be copied over to the current scheme
 * @param allQuestions
 * @param api
 * @param projectId
 * @param userId
 */
const copyQuestions = async ({ allQuestions, api, projectId, userId }) => {
  let outline = {}, questions = []
  for (let i = 0; i < allQuestions.length; i++) {
    const question = allQuestions[i]
    const response = await processQuestion({
      questions,
      question,
      parentId: 0,
      positionInParent: i,
      api,
      userId,
      projectId,
      outline
    })
    questions = response.questions
    outline = { ...outline, ...response.outline }
  }
  
  return { questions, outline }
}

/**
 * Sends a request to the API to get the coding scheme for project ID: action.id. Also gets the lock information if any
 * on the coding scheme.
 */
const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      const scheme = await api.getScheme({}, {}, { projectId: action.id })
      let lockInfo = {}, error = {}
      
      try {
        lockInfo = await api.getCodingSchemeLockInfo({}, {}, { projectId: action.id })
        if (lockInfo === '') {
          lockInfo = {}
        }
      } catch (e) {
        error.lockInfo = 'We couldn\'t determine if the coding scheme is checked out at this time.'
      }
      const currentUserId = getState().data.user.currentUser.id
      dispatch({
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false,
          error
        }
      })
    } catch (error) {
      dispatch({
        type: types.GET_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t retrieve the coding scheme for this project.'
      })
    }
    done()
  }
})

/**
 * Logic for copying coding scheme
 */
const copyCodingSchemeLogic = createLogic({
  type: types.COPY_CODING_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const scheme = await api.getSchemeTree({}, {}, { projectId: action.copyProjectId })
      const { outline, questions } = await copyQuestions({
        allQuestions: scheme,
        api,
        projectId: action.projectId,
        userId
      })
      dispatch({
        type: types.COPY_CODING_SCHEME_SUCCESS,
        payload: {
          scheme: { schemeQuestions: questions, outline }
        }
      })
    } catch (err) {
      dispatch({ type: types.COPY_CODING_SCHEME_FAIL, payload: 'We couldn\'t copy the coding scheme.' })
    }
    done()
  }
})

/**
 * Sends a request to check out / lock the coding scheme for project ID: action.id and userId
 */
const lockSchemeLogic = createLogic({
  type: types.LOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const lockInfo = await api.lockCodingScheme({}, {}, { userId: currentUserId, projectId: action.id })
      dispatch({
        type: types.LOCK_SCHEME_SUCCESS,
        payload: {
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
        }
      })
    } catch (error) {
      dispatch({
        type: types.LOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t lock the coding scheme.'
      })
    }
    done()
  }
})

/**
 * Sends a request to unlock / check in the coding scheme
 */
const unlockSchemeLogic = createLogic({
  type: types.UNLOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = action.userId === undefined ? getState().data.user.currentUser.id : action.userId
    try {
      const unlockInfo = await api.unlockCodingScheme({}, {}, { projectId: action.id, userId })
      dispatch({
        type: types.UNLOCK_SCHEME_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t unlock the coding scheme.'
      })
    }
    done()
  }
})

/**
 * Sends a request to reorder the coding scheme, new order is in state.scenes.codingScheme.outline
 */
const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = {
      userId: getState().data.user.currentUser.id,
      outline: getState().scenes.codingScheme.main.outline
    }
    try {
      await api.reorderScheme(outline, {}, { projectId: action.projectId })
      dispatch({ type: types.REORDER_SCHEME_SUCCESS })
    } catch (error) {
      dispatch({
        type: types.REORDER_SCHEME_FAIL,
        payload: 'We couldn\'t save your edits.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to delete the question with questionId = aciton.questionId
 */
const deleteQuestionLogic = createLogic({
  type: types.DELETE_QUESTION_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      await api.deleteQuestion({}, {}, { projectId: action.projectId, questionId: action.questionId })
      const updatedQuestions = removeNodeAtPath({
        treeData: getState().scenes.codingScheme.main.questions,
        path: action.path,
        getNodeKey
      })
      const updatedOutline = questionsToOutline(updatedQuestions)
      
      dispatch({
        type: types.DELETE_QUESTION_SUCCESS,
        payload: {
          updatedQuestions,
          updatedOutline
        }
      })
      
      dispatch({
        type: types.REORDER_SCHEME_REQUEST,
        projectId: action.projectId
      })
      
    } catch (error) {
      dispatch({
        type: types.DELETE_QUESTION_FAIL,
        error: true,
        payload: 'We couldn\'t delete the question.'
      })
    }
    done()
  }
})

export default [
  getSchemeLogic,
  copyCodingSchemeLogic,
  reorderSchemeLogic,
  lockSchemeLogic,
  unlockSchemeLogic,
  deleteQuestionLogic,
  ...addEditQuestionLogic
]
