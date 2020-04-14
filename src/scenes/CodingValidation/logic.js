/**
 * Handles all of the common / reusable logic for the coding and validation scenes
 */
import { createLogic } from 'redux-logic'
import { types } from './actions'
import {
  checkIfExists,
  getCodedValidatedQuestions,
  getFinalCodedObject,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionSelectedInNav,
  getSchemeAndInitialize,
  getSchemeQuestionAndUpdate,
  getSelectedQuestion,
  initializeNextQuestion,
  initializeUserAnswers,
  initializeValues,
  copyCoderAnswer
} from 'utils/codingHelpers'
import { handleUserImages } from 'utils/commonHelpers'
import documentListLogic from './components/DocumentList/logic'

/**
 * Updates the existing question object that is present in mergedUserQuestions. Adds answer objects and flagsComments
 * objects
 *
 * @param {Object} existingQuestion
 * @param {Object} question
 * @param {Object} coder
 * @returns {{answers: *[], flagsComments: *[]}}
 */
const addCoderToAnswers = (existingQuestion, question, coder) => {
  let flagComment = {}
  if (question.flag !== null) {
    flagComment = { ...question.flag, raisedBy: { ...coder } }
  }
  if (question.comment !== '') {
    flagComment = { ...flagComment, comment: question.comment, raisedBy: { ...coder } }
  }
  
  return {
    ...existingQuestion,
    answers: [
      ...existingQuestion.answers, ...question.codedAnswers.map(answer => ({ ...answer, userId: coder.userId }))
    ],
    flagsComments: Object.keys(flagComment).length > 0
      ? [...existingQuestion.flagsComments, flagComment]
      : [...existingQuestion.flagsComments]
  }
}

/**
 * Updates the codedQuestions object with any answers, flags, comments for each question in the codedQuestionsPerUser
 *
 * @param {Object} codedQuestions
 * @param {Array} codeQuestionsPerUser
 * @param {Object} coder
 * @returns {Object}
 */
const mergeInUserCodedQuestions = (codedQuestions, codeQuestionsPerUser, coder) => {
  const baseQuestion = { flagsComments: [], answers: [] }
  return codeQuestionsPerUser.reduce((allCodedQuestions, question) => {
    const doesExist = checkIfExists(question, allCodedQuestions, 'schemeQuestionId')
    return {
      ...allCodedQuestions,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...allCodedQuestions[question.schemeQuestionId],
          [question.categoryId]: {
            ...addCoderToAnswers(doesExist
              ? checkIfExists(question, allCodedQuestions[question.schemeQuestionId], 'categoryId')
                ? allCodedQuestions[question.schemeQuestionId][question.categoryId]
                : baseQuestion
              : baseQuestion, question, coder)
          }
        }
        : {
          ...addCoderToAnswers(doesExist
            ? allCodedQuestions[question.schemeQuestionId]
            : baseQuestion, question, coder)
        }
    }
  }, codedQuestions)
}

/**
 * Gets all of the coded questions for the schemeQuestionId (questionId) parameter. This is every user
 * that has answered or flagged or commneted on the question. It creates a coders object with coder information
 * that will be used to retrieve avatars. The coder is only added in if it doesn't already exist so as to not retrieve
 * the avatar multiple times.
 *
 * @param {Object} api
 * @param {Object} action
 * @param {Number} questionId
 * @param {Object} userImages
 * @returns {{ codedQuestionObj: Object, coders: Object, coderError: Object }}
 */
const getCoderInformation = async ({ api, action, questionId, userImages }) => {
  let codedQuestionObj = {}, allCodedQuestions = [], coderErrors = {}, coders = {}
  
  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion({}, {}, {
      projectId: action.projectId,
      jurisdictionId: action.jurisdictionId,
      questionId
    })
  } catch (e) {
    coderErrors = { allCodedQuestions: 'We couldn\'t retrieve all the coded answers for this question.' }
  }
  
  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }
  
  for (let coderUser of allCodedQuestions) {
    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }
    
    // Add all unique coders (later to be used for avatars)
    if (!checkIfExists(coderUser.coder, coders, 'userId') && !checkIfExists(coderUser.coder, userImages, 'userId')) {
      coders = { ...coders, [coderUser.coder.userId]: { ...coderUser.coder } }
    }
  }
  
  return { codedQuestionObj, coderErrors, coders }
}

/**
 * Logic for getting scheme and outline
 */
export const getOutline = createLogic({
  type: types.GET_OUTLINE_REQUEST,
  transform({ getState, action, api }, next) {
    const user = getState().data.user.currentUser
    const state = getState().scenes.codingValidation.coding
    const apiMethod = state.page === 'validation' ? api.getValidatedQuestions : api.getUserCodedQuestions
    
    next({
      ...action,
      payload: {
        scheme: { order: [], byId: {}, tree: [] },
        outline: {},
        question: {},
        userAnswers: {},
        mergedUserQuestions: {},
        categories: undefined,
        areJurisdictionsEmpty: !action.jurisdictionId,
        isSchemeEmpty: false,
        schemeError: null,
        isLoadingPage: false,
        showPageLoader: false,
        errors: {}
      },
      isValidation: state.page === 'validation',
      api: apiMethod,
      user
    })
  },
  async process({ action, getState, api }, dispatch, done) {
    let payload = action.payload, mergedUserQuestions = null, errors = {}, coders = {}, userImages = {}
    const allUserObjs = getState().data.user.byId
    
    // Try to get the project coding scheme
    try {
      const {
        firstQuestion,
        tree,
        order,
        outline,
        questionsById,
        isSchemeEmpty,
        questionIndex
      } = await getSchemeAndInitialize(action.projectId, api, action.questionId)
      
      if (action.payload.areJurisdictionsEmpty || isSchemeEmpty) {
        payload = { ...payload, isSchemeEmpty, user: action.user }
      } else {
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
          action.projectId,
          action.jurisdictionId,
          action.user.id,
          action.api
        )
        
        errors = { ...errors, ...codedValErrors }
        
        // Initialize the user answers object
        const userAnswers = initializeUserAnswers(
          [initializeNextQuestion(firstQuestion), ...codedValQuestions],
          questionsById,
          action.user.id
        )
        
        if (action.isValidation) {
          // If there are flags for this question, then we need to add the flag raiser to our coders object
          if (firstQuestion.flags.length > 0) {
            coders = {
              ...coders,
              [firstQuestion.flags[0].raisedBy.userId]: { ...firstQuestion.flags[0].raisedBy }
            }
          }
          
          // Get all the coded questions for this question
          const coderInfo = await getCoderInformation({
            api,
            action,
            questionId: firstQuestion.id,
            userImages
          })
          
          mergedUserQuestions = coderInfo.codedQuestionObj
          
          // Update coders from the getCoderInformation method
          coders = { ...coders, ...coderInfo.coders }
          
          // Get all the user information for validated questions
          for (let valQuestion of codedValQuestions) {
            if (!checkIfExists(valQuestion.validatedBy, coders, 'userId')) {
              coders = { ...coders, [valQuestion.validatedBy.userId]: { ...valQuestion.validatedBy } }
            }
          }
          
          const imagesResult = await handleUserImages(Object.values(coders), allUserObjs, dispatch, api)
          errors = { ...errors, ...coderInfo.coderErrors, ...imagesResult.error }
        }
        
        payload = {
          ...payload,
          outline,
          userAnswers,
          errors,
          mergedUserQuestions,
          scheme: { byId: questionsById, tree, order },
          question: firstQuestion,
          currentIndex: questionIndex,
          user: action.user
        }
      }
      
      dispatch({ type: types.GET_OUTLINE_SUCCESS, payload })
    } catch (e) {
      dispatch({
        type: types.GET_OUTLINE_FAIL,
        payload: 'Failed to get outline.',
        error: true
      })
    }
    done()
  }
})

/**
 * Updates the action for save / bulk validation
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *, getState?: *}, undefined, string[]>}
 */
const validateSaveAndBulkRequest = createLogic({
  type: [types.SAVE_USER_ANSWER_REQUEST, types.BULK_VALIDATION_REQUEST],
  /**
   * It updates the action creator values and validates
   * that the action should follow through and be sent to the reducers. It updates the action creator values with the
   * final object that should be sent in the request body, the api methods to use, state and userId.
   *
   * It validates that the action should be sent to the reducers to send a request to the API to save the users answer.
   * It will reject the action for a couple different reasons: if there are not unsaved changes, then no need to allow
   * the action. It will also reject if a POST request has already been sent but has not returned a response yet. This
   * is to prevent duplication of codedQuestions and duplicate POST requests being sent. If the app is still waiting on
   * a response then this will reject and dispatch ADD_REQUESTS_TO_QUEUE action to add all of the requests to a queue
   * that will be sent when the app gets a response.
   */
  validate({ getState, action, api }, allow, reject) {
    const state = getState().scenes.codingValidation.coding
    const user = getState().data.user.currentUser
    const isValidation = state.page === 'validation'
    
    // Get the question answer object to be sent to the API
    const questionObj = action.type === types.SAVE_USER_ANSWER_REQUEST
      ? getFinalCodedObject(
        state,
        { ...action, userId: user.id },
        isValidation,
        action.selectedCategoryId
      ) : copyCoderAnswer(
        state,
        { ...action, userId: user.id },
        action.selectedCategoryId
      )
    
    const apiMethods = {
      create: isValidation ? api.answerValidatedQuestion : api.answerCodedQuestion,
      update: isValidation ? api.updateValidatedQuestion : api.updateCodedQuestion
    }
    
    const payloadObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId,
      userId: user.id,
      user,
      questionObj,
      queueId: `${action.questionId}-${action.jurisdictionId}-${action.projectId}-${action.selectedCategoryId}`,
      timeQueued: Date.now()
    }
    
    // Check if there's already a POST request in progress for this question.
    if (questionObj.isNewCodedQuestion && questionObj.hasMadePost && !questionObj.hasOwnProperty('id')) {
      // The question hasn't been answered at all before, but a request has been made. Move request to queue to
      // wait for a response.
      reject({ type: types.ADD_REQUEST_TO_QUEUE, payload: { ...payloadObject, inQueue: true } })
    } else {
      // Allows the request to go through without putting it in the queue
      allow({
        ...action,
        payload: {
          ...payloadObject,
          selectedCategoryId: action.selectedCategoryId,
          api: apiMethods,
          create: !questionObj.hasOwnProperty('id'),
          inQueue: false
        }
      })
    }
  }
})

/**
 * The logic is invoked when the user has made changes to a question.
 */
const answerQuestionLogic = createLogic({
  type: types.SAVE_USER_ANSWER_REQUEST,
  debounce: 350,
  /**
   * Handles actually sending the requests to the API. If the final questionObj (that was created in the validate
   * function above) has an ID a PUT request is sent, otherwise a POST request is sent. This will also send or clear
   * out any messages hanging in the queue for the questionId. If there's an error with the request and the error code
   * is OBJECT_EXISTS, then a message error action is dispatched.
   */
  async process({ getState, action, api }, dispatch, done) {
    let respCodedQuestion = {}
    const apiMethod = action.payload.create ? action.payload.api.create : action.payload.api.update
    
    try {
      respCodedQuestion = await apiMethod(
        action.payload.questionObj,
        {},
        {
          questionId: action.payload.questionId,
          categoryId: action.payload.selectedCategoryId,
          jurisdictionId: action.payload.jurisdictionId,
          userId: action.payload.userId,
          projectId: action.payload.projectId
        }
      )
      
      dispatch({
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          ...respCodedQuestion,
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId
        }
      })
      
      dispatch({ type: types.UPDATE_ANNOTATIONS, questionId: action.payload.questionId })
      dispatch({
        type: types.SEND_QUEUE_REQUESTS,
        payload: {
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId,
          id: respCodedQuestion.id,
          queueId: action.payload.queueId,
          timeQueued: action.payload.timeQueued
        },
        api: action.payload.api
      })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.payload.projectId })
      
    } catch (error) {
      if (error.response && error.response.status === 303) {
        dispatch({
          type: types.OBJECT_EXISTS,
          payload: {
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId,
            object: initializeValues(error.response.data)
          }
        })
      } else {
        dispatch({
          type: types.SAVE_USER_ANSWER_FAIL,
          payload: {
            error: 'Could not update answer',
            isApplyAll: false,
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId
          }
        })
        
        dispatch({ type: types.SET_HEADER_TEXT, text: 'Save failed!' })
      }
    }
    done()
  }
})

/**
 * Logic for when the user clicks 'Apply to all tabs'
 */
const applyAnswerToAllLogic = createLogic({
  type: types.ON_APPLY_ANSWER_TO_ALL,
  /**
   * Transforms the action creator values with the API methods for create and update for coding or validation. Also sets
   * the answer object for the request
   */
  transform({ getState, action, api }, next) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.codingValidation.coding
    const apiMethods = state.page === 'validation'
      ? { create: api.answerValidatedQuestion, update: api.updateValidatedQuestion }
      : { create: api.answerCodedQuestion, update: api.updateCodedQuestion }
    
    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId
    }
    
    next({
      ...action,
      answerObject,
      apiMethods,
      userId
    })
  },
  /**
   * Actually calls the API to send a request to save the answer to all categories.
   */
  async process({ getState, action }, dispatch, done) {
    const userId = action.userId
    const state = getState().scenes.codingValidation.coding
    const allCategoryObjects = Object.values(state.userAnswers[action.questionId])
    
    try {
      for (let category of allCategoryObjects) {
        let respCodedQuestion = {}
        const question = getFinalCodedObject(state, action, state.page === 'validation', category.categoryId)
        
        if (category.id !== undefined) {
          respCodedQuestion = await action.apiMethods.update(question, {}, { ...action.answerObject, userId })
        } else {
          const { id, ...questionObj } = question
          respCodedQuestion = await action.apiMethods.create(questionObj, {}, { ...action.answerObject, userId })
        }
        
        dispatch({
          type: types.SAVE_USER_ANSWER_SUCCESS,
          payload: { ...respCodedQuestion, questionId: action.questionId, selectedCategoryId: category.categoryId }
        })
      }
      
      dispatch({ type: types.SET_HEADER_TEXT, text: 'All changes saved' })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
    } catch (error) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: {
          error: 'Could not update answer',
          isApplyAll: true,
          questionId: action.questionId,
          selectedCategoryId: allCategoryObjects
        }
      })
      
      dispatch({ type: types.SET_HEADER_TEXT, text: 'Save failed!' })
    }
    done()
  }
})

/**
 * Logic for sending / handling requests hanging in the queue
 */
const sendMessageLogic = createLogic({
  type: types.SEND_QUEUE_REQUESTS,
  /**
   * Finds all of the messages to send for the question in the action.payload object. Validates that there are actual
   * messages that need to be sent, otherwise rejects the action.
   */
  validate({ getState, action }, allow, reject) {
    const messageQueue = [...getState().scenes.codingValidation.coding.messageQueue]
    messageQueue.reverse()
    if (messageQueue.length === 0) {
      reject({ type: types.SET_HEADER_TEXT, text: 'All changes saved' })
    } else {
      const index = messageQueue.findIndex(message => {
        return (message.queueId === action.payload.queueId) && (message.timeQueued >= action.payload.timeQueued)
      })
      allow({ ...action, messageToSend: messageQueue[index] })
    }
  },
  /**
   * Actually sends the requests in the queue and then removest the request from the queue.
   */
  async process({ getState, action, api }, dispatch, done) {
    try {
      const respCodedQuestion = await action.api.update({
        ...action.messageToSend.questionObj,
        id: action.payload.id
      }, {}, { ...action.messageToSend })
      
      dispatch({
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          ...respCodedQuestion,
          questionId: action.payload.questionId,
          selectedCategoryId: action.payload.selectedCategoryId
        }
      })
      
      dispatch({ type: types.SET_HEADER_TEXT, text: 'All changes saved' })
      
      dispatch({
        type: types.REMOVE_REQUEST_FROM_QUEUE,
        payload: {
          questionId: action.payload.questionId,
          categoryId: action.payload.selectedCategoryId,
          queueId: action.payload.queueId,
          timeQueue: action.payload.timeQueued
        }
      })
    } catch (e) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: {
          error: 'Could not update answer',
          isApplyAll: false,
          questionId: action.payload.questionId,
          selectedCategoryId: action.payload.selectedCategoryId
        }
      })
      
      dispatch({ type: types.SET_HEADER_TEXT, text: 'Save failed!' })
    }
    done()
  }
})

/**
 * Logic for getting coded / validated questions, transforms the action creator values with the correct question
 * information
 */
const getCodedValQuestionsLogic = createLogic({
  type: [types.GET_USER_CODED_QUESTIONS_REQUEST, types.GET_USER_VALIDATED_QUESTIONS_REQUEST],
  transform({ getState, action }, next) {
    const state = getState().scenes.codingValidation.coding
    let question = { ...state.question }, otherUpdates = {}
    
    // If the current question is a category question, then change the current question to parent
    if (state.question.isCategoryQuestion) {
      question = state.scheme.byId[question.parentId]
      otherUpdates = {
        currentIndex: state.scheme.order.findIndex(id => id === question.id),
        categories: undefined,
        selectedCategory: 0,
        selectedCategoryId: null
      }
    }
    
    next({
      ...action,
      question,
      otherUpdates
    })
  }
})

/**
 * Sends requests for: getting updated scheme question information, getting the coded question for current user.
 * Initializes the userAnswers object that will be in the redux state with the codedQuestions information.
 */
export const getUserCodedQuestionsLogic = createLogic({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.codingValidation.coding
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}
    
    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
      action.projectId,
      action.jurisdictionId,
      userId,
      api.getUserCodedQuestions
    )
    
    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(
      action.projectId,
      state,
      question,
      api
    )
    
    // Update the user answers object
    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions],
      updatedScheme.byId,
      userId
    )
    
    payload = {
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      userAnswers,
      scheme: updatedScheme,
      mergedUserQuestions: null,
      otherUpdates,
      errors: { ...errors, ...codedValErrors, ...schemeErrors }
    }
    
    dispatch({ type: types.GET_USER_CODED_QUESTIONS_SUCCESS, payload })
    dispatch({ type: types.SET_RESET_STATUS, canReset: false })
    done()
  }
})

/**
 * Sends a request to save a red flag for a question
 */
const saveRedFlagLogic = createLogic({
  type: types.ON_SAVE_RED_FLAG_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const flag = { ...action.flagInfo, raisedBy: action.flagInfo.raisedBy.userId }
      const resp = await api.saveRedFlag(flag, {}, { questionId: action.questionId })
      
      dispatch({ type: types.ON_SAVE_RED_FLAG_SUCCESS, payload: { ...resp } })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
      dispatch({ type: types.SET_HEADER_TEXT, text: 'All changes saved' })
    } catch (error) {
      dispatch({ type: types.ON_SAVE_RED_FLAG_FAIL, payload: 'Failed to save red flag.' })
      dispatch({ type: types.SET_HEADER_TEXT, text: 'Save failed!' })
    }
    done()
  }
})

/**
 Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [
    types.UPDATE_USER_ANSWER, types.ON_APPLY_ANSWER_TO_ALL, types.ON_CHANGE_PINCITE, types.ON_SAVE_ANNOTATION,
    types.ON_CHANGE_COMMENT, types.ON_REMOVE_ANNOTATION
  ],
  transform({ action, getState }, next) {
    const state = getState().scenes.codingValidation.coding
    const user = getState().data.user.currentUser
    next({
      ...action,
      otherUpdates: state.page === 'validation'
        ? {
          validatedBy: {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
          }
        } : {},
      isValidation: state.page === 'validation'
    })
  }
})

/**
 * Transforms the action creator values with the current userId and information about the new question to show. It
 * determines the question to show based on the way the user navigated to it.
 *
 * Logic for when the user navigates to a question. It gets the updated scheme question information as well as the coded
 * and validated questions for the new question. It updates the mergedUserQuestions state property and gets any avatars
 * based on the coded / validation questions that it needs to.
 */
const getQuestionLogic = createLogic({
  type: [types.GET_PREV_QUESTION, types.GET_NEXT_QUESTION, types.ON_QUESTION_SELECTED_IN_NAV],
  transform({ getState, action }, next) {
    const state = getState().scenes.codingValidation.coding
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}
    
    // How did the user navigate to the currently selected question
    switch (action.type) {
      case types.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case types.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case types.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }
    
    next({
      ...action,
      questionInfo,
      userId
    })
  },
  /**
   * Gets the updated scheme question content as well as the updated coded or validated question content. If the user
   * is on the validation page, then it also gets updated coder information.
   */
  async process({ getState, action, api }, dispatch, done) {
    let otherErrors = {}
    const state = getState().scenes.codingValidation.coding
    const allUserObjs = getState().data.user.byId
    
    if (state.page === 'coding') {
      const response = await getSelectedQuestion(
        state,
        action,
        api,
        action.userId,
        action.questionInfo,
        api.getCodedQuestion
      )
      dispatch({ type: types.GET_QUESTION_SUCCESS, payload: response })
    } else {
      const {
        updatedState,
        question,
        currentIndex,
        errors,
        newImages
      } = await getSelectedQuestion(
        state,
        action,
        api,
        action.userId,
        action.questionInfo,
        api.getUserValidatedQuestion,
        {}
      )
      const { codedQuestionObj, coderErrors, coders } = await getCoderInformation({
        api,
        action,
        questionId: question.id,
        userImages: newImages
      })
      
      const newCoderImages = { ...newImages, ...coders }
      const imageResult = await handleUserImages(Object.values(newCoderImages), allUserObjs, dispatch, api)
      
      dispatch({
        type: types.GET_QUESTION_SUCCESS,
        payload: {
          updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
          question,
          currentIndex,
          errors: { ...errors, ...coderErrors, ...otherErrors, ...imageResult.errors }
        }
      })
    }
    
    dispatch({ type: types.SET_RESET_STATUS, canReset: false })
    dispatch({ type: types.SET_HEADER_TEXT, text: '' })
    dispatch({ type: types.CHANGE_TOUCHED_STATUS, touched: false })
    done()
  }
})

/**
 * Logic for when the validator changes jurisdictions on the validation screen. Gets the coded and validation questions
 * for the question current visible as well as the updated scheme question information. It updates the
 * mergedUserQuestions state property like the logic above, with avatar and user information.
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.codingValidation.coding
    const question = action.question, otherUpdates = action.otherUpdates
    const allUserObjs = getState().data.user.byId
    let errors = {}, payload = {}, coders = {}
    
    // Get validated questions for this jurisdiction
    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
      action.projectId,
      action.jurisdictionId,
      userId,
      api.getValidatedQuestions
    )
    
    // Get updated scheme question in case changes have been made
    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(
      action.projectId,
      state,
      question,
      api
    )
    
    // If there are flags for this question, then we need to add the flag raiser to our coders object
    if (updatedSchemeQuestion.flags.length > 0) {
      if (!checkIfExists(updatedSchemeQuestion.flags[0].raisedBy, {}, 'userId')) {
        coders = {
          ...coders,
          [updatedSchemeQuestion.flags[0].raisedBy.userId]: { ...updatedSchemeQuestion.flags[0].raisedBy }
        }
      }
    }
    
    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions],
      updatedScheme.byId,
      userId
    )
    
    const coderInfo = await getCoderInformation({
      api,
      action,
      questionId: updatedSchemeQuestion.id,
      userImages: coders
    })
    
    coders = { ...coders, ...coderInfo.coders }
    const imageResult = await handleUserImages(Object.values(coders), allUserObjs, dispatch, api)
    
    payload = {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: coderInfo.codedQuestionObj,
      errors: {
        ...errors, ...coderInfo.coderErrors, ...schemeErrors, ...codedValErrors, ...imageResult.errors
      }
    }
    
    dispatch({ type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS, payload })
    dispatch({ type: types.SET_RESET_STATUS, canReset: false })
    done()
  }
})

/**
 * Sends a request to the API to clear the flag based on the action.flagId, type 1 === red, type 2 === other. This is
 * only used on the validation screen by coordinators or admins.
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }, dispatch, done) {
    try {
      const out = await api.clearFlag({}, {}, { flagId: action.flagId })
      dispatch({
        type: types.CLEAR_FLAG_SUCCESS,
        payload: {
          ...out, flagId: action.flagId, type: action.type === types.CLEAR_RED_FLAG ? 1 : 2
        }
      })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
      dispatch({ type: types.SET_HEADER_TEXT, text: 'All changes saved' })
    } catch (error) {
      dispatch({
        type: types.CLEAR_FLAG_FAIL,
        payload: 'We couldn\'t clear this flag.'
      })
    }
    done()
  }
})

/**
 * Handles the request to bulk validate. This can be bulk validation by question, jurisdiction or project level. If it's
 * by project or jurisdiction level, there's a separate API call. If it's by question level, then we just use the update
 * validated question API.
 */
export const bulkValidateLogic = createLogic({
  type: types.BULK_VALIDATION_REQUEST,
  async process({ getState, action, api }, dispatch, done) {
    const state = getState().scenes.codingValidation.coding
    const byId = state.scheme.byId
    const userAnswers = state.userAnswers
    
    try {
      let updatedUserAnswers = {}, otherStateUpdates = {}, question = state.scheme.byId[action.payload.questionId]
      // Check the scope of the bulk validation
      if (action.scope === 'question') {
        const { hasCoderAnswered, answers, ...requestObj } = action.payload.questionObj
        
        if (hasCoderAnswered) {
          const responsePayload = await action.payload.api[action.payload.create ? 'create' : 'update'](
            requestObj,
            {},
            {
              questionId: question.id,
              categoryId: action.payload.selectedCategoryId,
              jurisdictionId: action.payload.jurisdictionId,
              userId: action.payload.userId,
              projectId: action.payload.projectId
            }
          )
          
          updatedUserAnswers = initializeUserAnswers([responsePayload], byId, action.payload.userId, userAnswers)
        } else {
          updatedUserAnswers = userAnswers
        }
      } else {
        // bulk validate for project or jurisdiction, if project send -1 for jurisdiction in API
        const newValidatedAnswers = await api.bulkValidate(
          {},
          {},
          {
            projectId: action.payload.projectId,
            jurisdictionId: action.scope === 'jurisdiction' ? action.payload.jurisdictionId : -1,
            userId: action.user.userId
          }
        )
        
        // Check if the selected user actually coded anything -- if new validated answers were made
        if (newValidatedAnswers.length > 0) {
          // Get only the jurisdiction that we're currently on if the did project validation
          const thisJurAnswers = newValidatedAnswers.filter(
            answer => answer.projectJurisdictionId === action.payload.jurisdictionId
          )
  
          // Update the User Answer redux object with the user's new answers
          updatedUserAnswers = initializeUserAnswers(
            action.scope === 'project' ? thisJurAnswers : newValidatedAnswers,
            byId,
            action.payload.userId,
            userAnswers
          )
          
          // If the question is a category question, there are more checks that have to be done
          if (state.question.isCategoryQuestion) {
            // check to see if the user has selected the current category as an valid category
            if (!updatedUserAnswers[state.question.parentId].answers.hasOwnProperty(state.selectedCategoryId)) {
              // user hasn't chosen current category, so we move to the parent question
              question = state.scheme.byId[state.question.parentId]
              otherStateUpdates = {
                ...otherStateUpdates,
                categories: undefined,
                selectedCategory: 0,
                selectedCategoryId: null,
                currentIndex: state.scheme.order.findIndex(id => id === question.id)
              }
            }
          }
        } else {
          updatedUserAnswers = userAnswers
        }
      }
      
      dispatch({
        type: types.BULK_VALIDATION_SUCCESS,
        payload: {
          updatedUserAnswers,
          otherStateUpdates: { ...otherStateUpdates, question }
        }
      })
      dispatch({ type: types.SET_RESET_STATUS, canReset: false })
      done()
    } catch (err) {
      dispatch({ type: types.BULK_VALIDATION_FAIL })
      done()
    }
  }
})

export default [
  getOutline,
  getQuestionLogic,
  validateSaveAndBulkRequest,
  answerQuestionLogic,
  applyAnswerToAllLogic,
  sendMessageLogic,
  getCodedValQuestionsLogic,
  getUserCodedQuestionsLogic,
  saveRedFlagLogic,
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  clearFlagLogic,
  bulkValidateLogic,
  ...documentListLogic
]
