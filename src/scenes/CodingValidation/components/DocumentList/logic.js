import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Figures out which question to use
 * @param questionId
 * @param state
 * @param isValidation
 * @returns {{coderQuestion, userQuestion}}
 */
const getQuestions = (questionId, state, isValidation) => {
  const codingState = state.scenes.codingValidation.coding
  let coderQuestion = {}, userQuestion = {}
  
  if (codingState.question.isCategoryQuestion) {
    coderQuestion = isValidation
      ? codingState.mergedUserQuestions[questionId].hasOwnProperty(codingState.selectedCategoryId)
        ? codingState.mergedUserQuestions[questionId][codingState.selectedCategoryId]
        : null
      : null
    
    userQuestion = codingState.userAnswers[questionId][codingState.selectedCategoryId]
  } else {
    coderQuestion = isValidation
      ? codingState.mergedUserQuestions.hasOwnProperty(questionId)
        ? codingState.mergedUserQuestions[questionId]
        : null
      : null
    userQuestion = codingState.userAnswers[questionId]
  }
  
  return {
    userQuestion,
    coderQuestion
  }
}

/**
 * Gets all of the annotations for a question
 */
const getAnnotsForQAndDoc = (userAnswersQuestion, docId = null) => {
  let annotations = []
  if (Object.keys(userAnswersQuestion.answers).length > 0) {
    for (let answer of Object.values(userAnswersQuestion.answers)) {
      if (docId) {
        annotations = [...annotations, ...answer.annotations.filter(annot => annot.docId === docId)]
      } else {
        annotations.push(answer.annotations)
      }
    }
  }
  
  return annotations
}

/**
 * Gets annotations for current user or validator
 * @param question
 * @param answerId
 * @param state
 * @param isValidation
 * @param user
 * @returns {{annotations: Array, users: Array}}
 */
const getUserAnnotations = (question, answerId, state, isValidation, user) => {
  let annotations = [], users = []
  
  if (question.answers.hasOwnProperty(answerId)) {
    let userId = isValidation
      ? (question.validatedBy.userId || user.id)
      : user.id
    users.push({
      userId,
      isValidator: isValidation
    })
    annotations = question.answers[answerId].annotations.map((anno, i) => {
      return {
        ...anno,
        userId,
        isValidatorAnswer: isValidation,
        fullListIndex: i
      }
    })
  }
  
  return {
    annotations,
    users
  }
}

/**
 * Gets coder annotations in validation
 * @param question
 * @param answerId
 */
const getCoderAnnotations = (question, answerId) => {
  let annotations = [], users = []
  question.answers.forEach(answer => {
    if (answer.schemeAnswerId === answerId) {
      answer.annotations.forEach(anno => {
        annotations.push({
          ...anno,
          userId: answer.userId,
          isValidatorAnswer: false
        })
        if (users.findIndex(user => user.userId === answer.userId) === -1) {
          users.push({
            userId: answer.userId,
            isValidator: false
          })
        }
      })
    }
  })
  
  return {
    annotations,
    users
  }
}

/*
 * Adds the document citation string to the action
 */
const addCitationLogic = createLogic({
  type: types.ON_SAVE_ANNOTATION,
  transform({ action, getState }, next) {
    const state = getState().scenes.codingValidation.documentList
    const doc = state.documents.byId[action.annotation.docId]
    next({
      ...action,
      citation: doc.citation || ''
    })
  }
})

/**
 * Get a list of documents for this project / jurisdiction
 * @type {Logic<object, undefined, undefined, {action?: *, docApi?: *}, undefined, string[]>}
 */
const getApprovedDocumentsLogic = createLogic({
  type: types.GET_APPROVED_DOCUMENTS_REQUEST,
  async process({ docApi, action }, dispatch, done) {
    try {
      const docs = await docApi.getDocumentsByProjectJurisdiction(
        {},
        {},
        {
          projectId: action.projectId,
          jurisdictionId: action.jurisdictionId
        }
      )
      dispatch({
        type: types.GET_APPROVED_DOCUMENTS_SUCCESS,
        payload: docs
      })
      done()
    } catch (err) {
      dispatch({ type: types.GET_APPROVED_DOCUMENTS_FAIL })
      done()
    }
  }
})

/**
 * User clicked on a pair of glasses
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const toggleViewAnnotations = createLogic({
  type: [types.TOGGLE_VIEW_ANNOTATIONS, types.UPDATE_ANNOTATIONS],
  transform({ getState, action }, next) {
    const codingState = getState().scenes.codingValidation.coding
    const docState = getState().scenes.codingValidation.documentList
    const isValidation = codingState.page === 'validation'
    const user = getState().data.user.currentUser
    let annotations = [], users = [], answerId = action.answerId
    
    if (action.type === types.UPDATE_ANNOTATIONS && docState.enabledAnswerId !== '') {
      answerId = docState.enabledAnswerId
    }
    
    const { userQuestion, coderQuestion } = getQuestions(action.questionId, getState(), isValidation)
    
    const userAnnotations = getUserAnnotations(userQuestion, answerId, getState(), isValidation, user)
    const coderAnnotations = isValidation && coderQuestion !== null
      ? getCoderAnnotations(coderQuestion, answerId)
      : {
        annotations: [],
        users: []
      }
    
    annotations = [...userAnnotations.annotations, ...coderAnnotations.annotations]
    users = [...userAnnotations.users, ...coderAnnotations.users]
    
    next({
      ...action,
      annotations,
      users,
      answerId
    })
  }
})

/**
 * toggling annotation mode
 */
const toggleAnnoModeLogic = createLogic({
  type: types.TOGGLE_ANNOTATION_MODE,
  transform({ getState, action }, next) {
    let annotations = [], users = []
    
    const codingState = getState().scenes.codingValidation.coding
    const isValidation = codingState.page === 'validation'
    const user = getState().data.user.currentUser
    
    if (action.enabled) {
      const { userQuestion } = getQuestions(action.questionId, getState(), isValidation)
      const userAnnotations = getUserAnnotations(userQuestion, action.answerId, getState(), isValidation, user)
      annotations = [...userAnnotations.annotations]
      users = [...userAnnotations.users]
    }
    
    next({
      ...action,
      annotations,
      users
    })
  }
})

/**
 * Handles when a user requests to download documents
 */
const downloadLogic = createLogic({
  type: types.DOWNLOAD_DOCUMENTS_REQUEST,
  async process({ getState, action, docApi }, dispatch, done) {
    const codingState = getState().scenes.codingValidation.coding
    const isValidation = codingState.page === 'validation'
    const { userQuestion } = getQuestions(codingState.question.id, getState(), isValidation)
    
    try {
      let payload = ''
      if (action.docId === 'all') {
        // download a zip file
        const allIds = getState().scenes.codingValidation.documentList.documents.allIds
        let docs = []
        for (const id of allIds) {
          const annotations = getAnnotsForQAndDoc(userQuestion, id)
          docs = [...docs, { _id: id, annotations }]
        }
        
        payload = await docApi.downloadZipWithAnnotations({ docs }, { responseType: 'arraybuffer' }, {})
      } else {
        const annotations = getAnnotsForQAndDoc(userQuestion, action.docId)
        // download just one file
        payload = await docApi.downloadWithAnnotations(
          { annotations },
          { responseType: 'arraybuffer' },
          { docId: action.docId }
        )
      }
      dispatch({
        type: types.DOWNLOAD_DOCUMENTS_SUCCESS,
        payload
      })
    } catch (err) {
      console.log(err)
      dispatch({
        type: types.DOWNLOAD_DOCUMENTS_FAIL,
        payload: 'We couldn\'t download the documents you selected.'
      })
    }
    done()
  }
})

export default [
  toggleViewAnnotations,
  toggleAnnoModeLogic,
  getApprovedDocumentsLogic,
  addCitationLogic,
  downloadLogic
]
