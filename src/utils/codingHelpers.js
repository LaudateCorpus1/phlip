import { normalize, commonHelpers } from 'utils'
import * as questionTypes from 'scenes/CodingValidation/constants'
import { getTreeFromFlatData } from 'react-sortable-tree'
import { getQuestionNumbers, sortQuestions } from 'utils/treeHelpers'

/**
 * @typedef {Object} UserCodedQuestion
 * @type {Object}
 * @property {Array} codedAnswers
 * @property {?Object} flag
 * @property {Number} [id]
 * @property {Number} schemeQuestionId
 * @property {String} comment
 * @property {Number} [categoryId]
 */

/**
 * @typedef {Object} UserAnswerObject
 * @type {Object}
 * @property {String} comment
 * @property {Object} flag
 * @property {String} flag.notes
 * @property {Number} flag.type
 * @property {Object} flag.raisedBy
 * @property {Object} answers
 * @property {Number} answers.schemeAnswerId
 * @property {String} answers.pincite
 * @property {?String} answers.textAnswer
 * @property {Number} schemeQuestionId
 * @property {Boolean} isNewCodedQuestion
 * @property {Boolean} hasMadePost
 */

/**
 * Initializes the UserAnswerObject for each property from UserQuestionObject in the way that is needed by the
 * application. This newly initialized question is what will be in state: `{ userAnswers: { schemeQuestionId:
 * [UserAnswerObject] } }`. The parameter question is what comes back for a codedQuestion in the database. This will
 * convert the codedAnswers array to an object where keys are the schemeAnswerIds in for each codedAnswer.
 *
 * @param {UserCodedQuestion} question
 * @returns {UserAnswerObject}
 */
export const initializeValues = question => {
  const { codedAnswers, ...initializedQuestion } = {
    ...question.id ? { id: question.id } : {},
    ...question,
    comment: question.comment || '',
    flag: question.flag !== null ? question.flag : { notes: '', type: 0, raisedBy: {} },
    answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId'),
    schemeQuestionId: question.schemeQuestionId,
    isNewCodedQuestion: !question.hasOwnProperty('id'),
    hasMadePost: false
  }
  
  return initializedQuestion
}

/**
 * This function takes an array of {@link UserCodedQuestion} and creates an object where each schemeQuestionId is a key
 * in the object. `{ [schemeQuestionId]: [UserAnswerObject] }`
 *
 * It accounts for category question as well. If the question object has a categoryId, then the final answers object,
 * looks like this: `{ [schemeQuestionId]: { [categoryId]: [UserAnswerObject] } }`.
 *
 * @param {UserCodedQuestion[]} userCodedQuestions
 * @param {Array} codingSchemeQuestions
 * @param {(String|Number)} userId
 * @param {Object} initialObj
 * @returns {Object}
 */
export const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions, userId, initialObj = {}) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...codedQuestionObj[question.schemeQuestionId],
          [question.categoryId]: {
            ...initializeValues(
              question,
              codingSchemeQuestions[question.schemeQuestionId],
              userId
            )
          }
        }
        : { ...initializeValues(question, codingSchemeQuestions[question.schemeQuestionId], userId) }
    })
  }, initialObj)
}

/**
 * Finds the next question that is a parent question in case of category questions having not been answered
 * @param {Object} scheme
 * @param {Object} question
 * @param {Number} currentIndex
 * @returns {Number} -- The ID of the question
 */
export const findNextParentSibling = (scheme, question, currentIndex) => {
  const subArr = [...scheme.order].slice(currentIndex + 1)
  return subArr.find(id => scheme.byId[id].parentId !== question.id)
}

/**
 * Handles determining whether or not to show the 'next question' button at the bottom of the screen. If the question is
 * a category question and no categories have been selected, check if there are any remaining questions in the list that
 * aren't a child of the category questions. If there are none, don't show button, if there are do.
 * @param {Object} state -- Redux state
 * @returns {Boolean} -- Whether or not to show button
 */
export const determineShowButton = state => {
  if (state.question.questionType === questionTypes.CATEGORY) {
    if (!checkIfAnswered(state.question, state.userAnswers)) {
      return findNextParentSibling(state.scheme, state.question, state.currentIndex) !== undefined
    } else {
      return state.question.id !== state.scheme.order[state.scheme.order.length - 1]
    }
  } else {
    return state.scheme.order && state.question.id !== state.scheme.order[state.scheme.order.length - 1]
  }
}

/**
 * Retrieves all of the selected categories for that parentQuestion object
 * @param {Object} parentQuestion
 * @param {Object} userAnswers
 * @returns {Array} selected categories
 */
export const getSelectedCategories = (parentQuestion, userAnswers) =>
  parentQuestion.possibleAnswers.filter(category => checkIfExists(category, userAnswers[parentQuestion.id].answers))

/**
 * Initializes an object to be used for creating entry in user answers
 * @param {Object} question
 * @returns {UserCodedQuestion}
 */
export const initializeNextQuestion = question => ({
  comment: '',
  flag: { notes: '', type: 0, raisedBy: {} },
  codedAnswers: [],
  schemeQuestionId: question.id
})

/**
 * Sends back an initialized object for a question in userAnswers
 * @param {Number} id
 * @returns {UserCodedQuestion}
 */
export const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: '',
  flag: { notes: '', type: 0, raisedBy: {} },
  hasMadePost: false,
  isNewCodedQuestion: true
})

/**
 * Handles updating state.userAnswers, state.selectedCategoryId, state.categories, and state.selectedCategory with
 * correct information and structure. Each time a question is navigated to, it goes through this function. If the
 * question already exists in state.userAnswers, that object is used.
 * @param {Object} newQuestion
 * @param {Number} newIndex
 * @param {Object} state
 * @returns {{
 * question: Object,
 * categories: Array,
 * selectedCategory: Number,
 * userAnswers: Object,
 * selectedCategoryId: Number
 * }}
 */
export const handleCheckCategories = (newQuestion, newIndex, state) => {
  const base = {
    question: newQuestion,
    currentIndex: newIndex,
    userAnswers: checkIfExists(newQuestion, state.userAnswers)
      ? { ...state.userAnswers }
      : newQuestion.isCategoryQuestion
        ? { ...state.userAnswers }
        : {
          ...state.userAnswers,
          [newQuestion.id]: initializeRegularQuestion(newQuestion.id)
        }
  }
  
  if (newQuestion.isCategoryQuestion) {
    const parentQuestion = state.scheme.byId[newQuestion.parentId]
    const selectedCategories = commonHelpers.sortListOfObjects(
      getSelectedCategories(parentQuestion, state.userAnswers),
      'order',
      'asc'
    )
    const baseQuestion = base.userAnswers[newQuestion.id]
    
    const answers = selectedCategories.reduce((answerObj, cat) => {
      return {
        ...answerObj,
        [cat.id]: {
          ...initializeRegularQuestion(base.question.id),
          categoryId: cat.id,
          schemeQuestionId: base.question.id
        }
      }
    }, {})
    
    const userAnswers = {
      ...base.userAnswers,
      [newQuestion.id]: { ...answers, ...baseQuestion }
    }
    
    const selectedCatId = selectedCategories[state.selectedCategory].id
    
    return {
      ...base,
      question: { ...base.question },
      categories: [...selectedCategories],
      selectedCategory: state.selectedCategory,
      userAnswers,
      answerSnapshot: { ...userAnswers[newQuestion.id][selectedCatId] },
      selectedCategoryId: selectedCatId
    }
  } else {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0,
      selectedCategoryId: null,
      answerSnapshot: { ...base.userAnswers[newQuestion.id] }
    }
  }
}

/**
 * Determines what the next question will be. Check to make sure newQuestion is correct. If the newQuestion is a
 * category child, but the user hasn't selected any categories, then find the next parent question in the coding
 * scheme.
 * Category children whose parent hasn't been answered are not shown.
 *
 * @param {Object} state - Redux state
 * @param {Object} action - return value from redux action creator
 * @returns {{ index: Number, question: Object, categories: Array, selectedCategoryId: Number, selectedCategory:
 *   Number}}
 */
export const getNextQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex
  let categories = state.categories,
    selectedCategoryId = state.selectedCategoryId,
    selectedCategory = state.selectedCategory
  
  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      const p = findNextParentSibling(state.scheme, state.question, state.currentIndex)
      if (p !== undefined) {
        newQuestion = state.scheme.byId[p]
        newIndex = state.scheme.order.indexOf(p)
        categories = undefined
        selectedCategoryId = null
        selectedCategory = 0
      }
    } else {
      categories = getSelectedCategories(state.scheme.byId[newQuestion.parentId], state.userAnswers)
      selectedCategory = state.selectedCategory
      selectedCategoryId = categories[selectedCategory].id
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

/**
 * Determines what the previous question is. Check to make sure newQuestion is correct. If the newQuestion is a
 * category child, but the user hasn't selected any categories for that question's parent, then find the previous is
 * the category question's parent.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{index: Number, question: Object, categories: Array, selectedCategoryId: Number, selectedCategory: Number}}
 */
export const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex
  let categories = state.categories, selectedCategoryId = state.selectedCategoryId,
    selectedCategory = state.selectedCategory
  
  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
      categories = undefined
      selectedCategoryId = null
      selectedCategory = 0
    } else {
      categories = getSelectedCategories(state.scheme.byId[newQuestion.parentId], state.userAnswers)
      selectedCategory = state.selectedCategory
      selectedCategoryId = categories[selectedCategory].id
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

/**
 * Handles updating state.userAnswers with the user's new answer
 * @param {Object} state
 * @param {Object} action
 * @returns {{ ...state.userAnswers, action.questionId: UserAnswerObject }}
 */
export const handleUpdateUserAnswers = (state, action) => {
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers
  
  let otherAnswerUpdates = { ...state.userAnswers }
  
  switch (state.question.questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      currentUserAnswers = { [action.answerId]: { schemeAnswerId: action.answerId, pincite: '', annotations: [] } }
      break
    
    case questionTypes.TEXT_FIELD:
      if (action.answerValue === '') currentUserAnswers = {}
      else {
        currentUserAnswers = {
          [action.answerId]: {
            ...currentUserAnswers[action.answerId],
            schemeAnswerId: action.answerId,
            textAnswer: action.answerValue,
            pincite: currentUserAnswers[action.answerId] ? currentUserAnswers[action.answerId].pincite || '' : '',
            annotations: currentUserAnswers[action.answerId] ? currentUserAnswers[action.answerId].annotations : []
          }
        }
      }
      break
    
    case questionTypes.CATEGORY:
      // If they uncheck a category, then delete all other answers that have been associated with that category
      if (checkIfExists(action, currentUserAnswers, 'answerId')) {
        Object.values(state.scheme.byId).forEach(question => {
          if (question.parentId === action.questionId) {
            if (otherAnswerUpdates[question.id]) {
              delete otherAnswerUpdates[question.id][action.answerId]
            }
          }
        })
        delete currentUserAnswers[action.answerId]
      } else {
        currentUserAnswers = {
          ...currentUserAnswers,
          [action.answerId]: { schemeAnswerId: action.answerId, pincite: '', annotations: [] }
        }
      }
      break
    
    case questionTypes.CHECKBOXES:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) delete currentUserAnswers[action.answerId]
      else currentUserAnswers = {
        ...currentUserAnswers,
        [action.answerId]: { schemeAnswerId: action.answerId, pincite: '', annotations: [] }
      }
  }
  
  return {
    ...otherAnswerUpdates,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      ...state.question.isCategoryQuestion
        ? {
          [state.selectedCategoryId]: {
            ...state.userAnswers[action.questionId][state.selectedCategoryId],
            answers: { ...currentUserAnswers },
            ...action.otherUpdates
          }
        }
        : { answers: { ...currentUserAnswers }, ...action.otherUpdates }
    }
  }
}

export const handleUpdateAnnotations = (state, action) => {
  const currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers
  
  const parsedAnnotations = currentUserAnswers[action.answerId].annotations
  const updatedAnnotations = [...parsedAnnotations, action.annotation]
  const currentPincite = currentUserAnswers[action.answerId].pincite
  
  return {
    ...currentUserAnswers,
    [action.answerId]: {
      ...currentUserAnswers[action.answerId],
      annotations: updatedAnnotations,
      pincite: action.citation !== ''
        ? `${currentPincite}${currentPincite.length > 0 ? '; ' : ''}${action.citation}`
        : currentPincite
    }
  }
}

/**
 * Removes an annotation from a coded answer
 * @param state
 * @param action
 * @returns {*}
 */
export const handleRemoveAnnotation = (state, action) => {
  const currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers
  
  const annotations = [...currentUserAnswers[action.answerId].annotations]
  annotations.splice(action.index, 1)
  
  return {
    ...currentUserAnswers,
    [action.answerId]: {
      ...currentUserAnswers[action.answerId],
      annotations
    }
  }
}

/**
 * Handles if a user updates the pincite of an answer choice
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} UserAnswerObject for action.questionId
 */
export const handleUserPinciteQuestion = (state, action) => {
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers
  
  switch (state.question.questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
    case questionTypes.TEXT_FIELD:
      return { [action.answerId]: { ...currentUserAnswers[action.answerId], pincite: action.pincite } }
    case questionTypes.CATEGORY:
    case questionTypes.CHECKBOXES:
      return {
        ...currentUserAnswers,
        [action.answerId]: { ...currentUserAnswers[action.answerId], pincite: action.pincite }
      }
  }
}

/**
 * Handles any updates for 'fieldValue' in state.userAnswers that are for regular questions
 * @param {Object} state
 * @param {Object} action
 * @returns {function(fieldValue: String, getFieldValue:*): { userAnswers: {} } } - UserAnswers with updated field
 *   value for state.question.id
 */
export const handleUpdateUserCodedQuestion = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [state.question.id]: {
      ...state.userAnswers[state.question.id],
      [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues,
      ...action.otherUpdates
    }
  }
})

/**
 * Handles when anything in a question in state.userAnswers needs to be updated, not just the answers Object
 *
 * @param {Object} state
 * @param {Number} questionId
 * @param {Object} updatedQuestion
 * @returns Object {{ userAnswers: {} } } The updated userAnswers object with the updated questionId
 */
export const updateCodedQuestion = (state, questionId, updatedQuestion) => ({
  userAnswers: {
    ...state.userAnswers,
    [questionId]: {
      ...state.userAnswers[questionId],
      ...updatedQuestion
    }
  }
})

/**
 * Handles when any property of a category question needs to be updated in state.userAnswers
 * @param {Object} state
 * @param {Object} questionId
 * @param {Object} categoryId
 * @param {Object} updatedQuestion
 * @returns {Object} {{userAnswers: {}}} - Updated userAnswers object with updated category question
 */
export const updateCategoryCodedQuestion = (state, questionId, categoryId, updatedQuestion) => {
  let update = { [categoryId]: { ...updatedQuestion } }
  
  if (state.userAnswers.hasOwnProperty(questionId)) {
    if (state.userAnswers[questionId].hasOwnProperty(categoryId)) {
      update = {
        [categoryId]: {
          ...state.userAnswers[questionId][categoryId],
          ...updatedQuestion
        }
      }
    }
  }
  
  return {
    userAnswers: {
      ...state.userAnswers,
      [questionId]: {
        ...state.userAnswers[questionId],
        ...update
      }
    }
  }
}

/**
 * Handles any updates for 'fieldValue' in state.userAnswers that are for category child questions. If getFieldValues
 * is
 * a function, then it calls the function to get the value to set, otherwise just sets the value to whatever
 * getFieldValues is.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {function(fieldValue: String, getFieldValue:*): {userAnswers: {}}} - UserAnswers with updated field value
 *   for state.question.id
 */
export const handleUpdateUserCategoryChild = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [state.question.id]: {
      ...state.userAnswers[state.question.id],
      [state.selectedCategoryId]: {
        ...state.userAnswers[state.question.id][state.selectedCategoryId],
        [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues,
        ...action.otherUpdates
      }
    }
  }
})

/**
 * Initializes and updates the navigator
 *
 * @param {Array} tree
 * @param {Object} scheme
 * @param {Array} codedQuestions
 * @param {Object} currentQuestion
 * @returns {Array} Navigator tree with nested questions and children
 */
export const initializeNavigator = (tree, scheme, codedQuestions, currentQuestion) => {
  return tree.map(item => {
    if (!item.isCategory) {
      item.text = scheme[item.id].text
      item.hint = scheme[item.id].hint
      item.possibleAnswers = scheme[item.id].possibleAnswers
      item.flags = scheme[item.id].flags
    }
    
    item.isAnswered = item.isCategoryQuestion ? false : checkIfAnswered(item, codedQuestions)
    if (item.children) {
      item.children = item.questionType === questionTypes.CATEGORY
        ? item.isAnswered
          ? initializeNavigator(
            commonHelpers.sortListOfObjects(
              Object.values(scheme).filter(question => question.parentId === item.id),
              'positionInParent',
              'asc'
            ),
            { ...scheme },
            codedQuestions,
            currentQuestion
          ) : []
        : initializeNavigator(item.children, { ...scheme }, codedQuestions, currentQuestion)
    }
    
    if (item.isCategoryQuestion) {
      let countAnswered = 0
      
      /*
       item: category question children
       */
      if (checkIfExists(scheme[item.parentId], codedQuestions)) {
        item.children = Object.values(codedQuestions[item.parentId].answers).map((category, index) => {
          const isAnswered =
            checkIfExists(item, codedQuestions) &&
            checkIfAnswered(category, codedQuestions[item.id], 'schemeAnswerId')
          
          countAnswered = isAnswered ? countAnswered += 1 : countAnswered
          
          const schemeAnswer = scheme[item.parentId].possibleAnswers.find(answer => answer.id ===
            category.schemeAnswerId)
          
          return {
            schemeAnswerId: category.schemeAnswerId,
            text: schemeAnswer.text,
            order: schemeAnswer.order,
            indent: item.indent + 1,
            positionInParent: schemeAnswer.order - 1,
            isAnswered,
            schemeQuestionId: item.id,
            isCategory: true
          }
        })
      } else {
        item.children = []
      }
      
      item.children = commonHelpers.sortListOfObjects([...item.children], 'order', 'asc')
      
      if (item.children.length > 0) {
        item.completedProgress = (countAnswered / item.children.length) * 100
      } else {
        if (checkIfExists(item, 'completedProgress')) delete item.completedProgress
      }
    }
    
    if ((item.id === currentQuestion.id || currentQuestion.parentId === item.id) && item.children) {
      item.expanded = true
    }
    
    return item
  })
}

/**
 * Determines what question was selected in the navigator, and updates the state accordingly, even if the user selects
 * a category. If the user selects a category in the navigator, it finds the actual question that belongs to.
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} {{ question: Object, index: Number, categories: ?Array, selectedCategoryId: Number,
 *   selectedCategory: Number }}
 */
export const getQuestionSelectedInNav = (state, action) => {
  let q = {}, categories = undefined, selectedCategory = 0, selectedCategoryId = null
  
  if (action.question.isCategory || action.question.isCategoryQuestion) {
    q = action.question.isCategory
      ? state.scheme.byId[action.question.schemeQuestionId]
      : state.scheme.byId[action.question.id]
    categories = getSelectedCategories(state.scheme.byId[q.parentId], state.userAnswers)
    selectedCategory = action.question.isCategory ? action.question.treeIndex : 0
    selectedCategoryId = categories[selectedCategory].id
  } else {
    q = state.scheme.byId[action.question.id]
  }
  commonHelpers.sortListOfObjects(q.possibleAnswers, 'order', 'asc')
  return {
    question: q,
    index: state.scheme.order.findIndex(id => q.id === id),
    categories,
    selectedCategoryId,
    selectedCategory
  }
}

/**
 * Delete any 'ids' in answer objects in userAnswers because it fails on the backend with them
 * @param {Object} answer
 * @returns {Object} - Answer object without the property 'id'
 */
const deleteAnswerIds = answer => {
  let ans = { ...answer }
  if (ans.id) delete ans.id
  
  return ans
}

/**
 * Used to create the request body for updating a UserCodedQuestion or UserValidationQuestion.
 *
 * @param {Object} state
 * @param {Object} action
 * @param {Boolean} isValidation
 * @param {Number} selectedCategoryId
 * @returns {UserCodedQuestion}
 */
export const getFinalCodedObject = (state, action, isValidation, selectedCategoryId = state.selectedCategoryId) => {
  let flagObj = null
  const { flag, ...questionObject } = state.scheme.byId[action.questionId].isCategoryQuestion
    ? state.userAnswers[action.questionId][selectedCategoryId]
    : state.userAnswers[action.questionId]
  
  if (flag.type !== 0) {
    flagObj = flag
  }
  
  const { answers, schemeQuestionId, ...answerObject } = {
    ...questionObject,
    codedAnswers: Object.values(questionObject.answers).map(deleteAnswerIds),
    flag: flagObj,
    ...isValidation ? { validatedBy: action.userId } : {}
  }
  
  return answerObject
}

/**
 * Used for bulk validation. Copies a user's coded answer object to be used as the validated
 * object.
 */
export const copyCoderAnswer = (state, action, selectedCategoryId = state.selectedCategoryId) => {
  const isCatQ = state.scheme.byId[action.questionId].isCategoryQuestion
  let coderAnswer = state.mergedUserQuestions[action.questionId]
  const currentValAnswer = isCatQ
    ? state.userAnswers[action.questionId][selectedCategoryId]
    : state.userAnswers[action.questionId]
  
  let hasCoderAnswered = false, hasAnswers = false
  let userAnswer = { codedAnswers: [] }
  
  if (state.mergedUserQuestions.hasOwnProperty(action.questionId)) {
    hasAnswers = true
    if (isCatQ) {
      if (coderAnswer.hasOwnProperty(selectedCategoryId)) {
        // Check if any coder has answered the question and select category Id
        hasAnswers = true
        coderAnswer = coderAnswer[selectedCategoryId]
      } else {
        // No coders have coded the selected category Id
        hasAnswers = false
      }
    }
    
    if (hasAnswers) {
      // check if the coder the validator selected to use for bulk validation has answered
      const answers = coderAnswer.answers.filter(answer => answer.userId === action.user.userId)
      if (answers.length > 0) {
        answers.forEach(answer => {
          const { id, userId, ...answerObj } = answer
          userAnswer.codedAnswers.push(answerObj)
        })
        hasCoderAnswered = true
      }
      
      const commIndex = coderAnswer.flagsComments.findIndex(flagComm => flagComm.raisedBy.userId === action.user.userId)
      
      if (commIndex !== -1) {
        userAnswer.comment = coderAnswer.flagsComments[commIndex].comment || ''
        hasCoderAnswered = true
      }
    }
  }
  
  userAnswer.hasCoderAnswered = hasCoderAnswered
  if (currentValAnswer.hasOwnProperty('id') && currentValAnswer.id) {
    userAnswer.id = currentValAnswer.id
  }
  
  return { ...userAnswer, validatedBy: action.userId, categoryId: selectedCategoryId }
}

/**
 * Gets a specific scheme question, checks if it's answered and initializes it by sending a post if it's not. Sends back
 * the updated user answers object. Called in Validation/logic and Coding/logic
 *
 * @param {Object} state
 * @param {Object} action
 * @param {Object} api
 * @param {Number} userId
 * @param {Object} questionInfo
 * @param {Function} apiGetMethod
 * @param {Object} userImages
 * @returns {Object} {{
 *   question: Object,
 *   currentIndex: Number,
 *   updatedState: ({ scheme: Object, selectedCategory: Number, selectedCategoryId: Number, categories: Array }| {} ),
 *   errors: Object,
 *   newImages: Object
 * }}
 */
export const getSelectedQuestion = async (state, action, api, userId, questionInfo, apiGetMethod, userImages) => {
  let errors = {}, newSchemeQuestion = {},
    combinedQuestion = { ...state.scheme.byId[questionInfo.question.id] },
    updatedScheme = { ...state.scheme }, codedQuestion = {}, updatedState = { ...state }, initialize = true,
    newImages = {}
  
  // Get the scheme question from the db in case it has changed
  try {
    newSchemeQuestion = await api.getSchemeQuestion({}, {}, {
      questionId: questionInfo.question.id,
      projectId: action.projectId
    })
    commonHelpers.sortListOfObjects(newSchemeQuestion.possibleAnswers, 'order', 'asc')
    combinedQuestion = { ...state.scheme.byId[questionInfo.question.id], ...newSchemeQuestion }
    updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [combinedQuestion.id]: { ...state.scheme.byId[combinedQuestion.id], ...combinedQuestion }
      }
    }
    
    if (state.page === 'validation') {
      if (combinedQuestion.flags.length > 0) {
        if (!checkIfExists(newSchemeQuestion.flags[0].raisedBy, userImages, 'userId')) {
          newImages = {
            ...newImages,
            [newSchemeQuestion.flags[0].raisedBy.userId]: { ...newSchemeQuestion.flags[0].raisedBy }
          }
        }
      }
    }
  } catch (error) {
    // Couldn't get the updated scheme question so use the old one
    errors = {
      newSchemeQuestion: 'We couldn\'t retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since you started coding are not available.'
    }
  }
  
  try {
    codedQuestion = await apiGetMethod({}, {}, {
      userId: userId,
      projectId: action.projectId,
      questionId: questionInfo.question.id,
      jurisdictionId: action.jurisdictionId
    })
    
    if (Array.isArray(codedQuestion) && codedQuestion.length > 0) {
      initialize = codedQuestion.length > 0
    } else if (typeof codedQuestion === 'object') {
      initialize = Object.keys(codedQuestion).length > 0
    } else {
      initialize = false
    }
  } catch (error) {
    errors = {
      ...errors,
      updatedCodedQuestion: 'We couldn\'t retrieve your updated answers. You still have access to the previous answers, but any changes that have been made since you started coding are not available.'
    }
    initialize = false
  }
  
  if (initialize) {
    if (combinedQuestion.isCategoryQuestion) {
      for (let question of codedQuestion) {
        if (question.hasOwnProperty('validatedBy')) {
          if (!checkIfExists(question.validatedBy, userImages, 'userId') &&
            !checkIfExists(question.validatedBy, newImages, 'userId')) {
            newImages = { ...newImages, [question.validatedBy.userId]: { ...question.validatedBy } }
          }
        }
        if (combinedQuestion.questionType === questionTypes.TEXT_FIELD && question.codedAnswers.length > 0) {
          question.codedAnswers[0].textAnswer = question.codedAnswers[0].textAnswer === null
            ? ''
            : question.codedAnswers[0].textAnswer
        }
        const updatedAnswers = updateCategoryCodedQuestion(
          updatedState,
          combinedQuestion.id,
          question.categoryId,
          initializeValues(question)
        )
        updatedState = {
          ...updatedState,
          ...updatedAnswers
        }
      }
    } else {
      if (combinedQuestion.questionType === questionTypes.TEXT_FIELD && codedQuestion.codedAnswers.length > 0) {
        codedQuestion.codedAnswers[0].textAnswer = codedQuestion.codedAnswers[0].textAnswer === null
          ? ''
          : codedQuestion.codedAnswers[0].textAnswer
      }
      if (codedQuestion.hasOwnProperty('validatedBy')) {
        if (!checkIfExists(codedQuestion.validatedBy, userImages, 'userId') && !checkIfExists(codedQuestion.validatedBy, newImages, 'userId')) {
          newImages = { ...newImages, [codedQuestion.validatedBy.userId]: { ...codedQuestion.validatedBy } }
        }
      }
      updatedState = {
        ...updatedState,
        ...updateCodedQuestion(updatedState, combinedQuestion.id, initializeValues(codedQuestion))
      }
    }
  }
  
  updatedState = {
    ...updatedState,
    scheme: updatedScheme,
    selectedCategory: questionInfo.selectedCategory,
    selectedCategoryId: questionInfo.selectedCategoryId,
    categories: questionInfo.categories
  }
  
  return {
    question: combinedQuestion,
    currentIndex: questionInfo.index,
    updatedState,
    errors,
    newImages
  }
}

/**
 * Gets the scheme from the API, normalizes it into an object, creates the tree and gets the first question
 *
 * @param {(Number|String)} projectId
 * @param {Object} api
 * @returns {Object} {{
 *   firstQuestion: Object, tree: Array, order: Array, questionsById: Object, outline: Object, isSchemeEmpty: Boolean
 * }}
 */
export const getSchemeAndInitialize = async (projectId, api, questionId = null) => {
  let scheme = {}, payload = { firstQuestion: {}, tree: [], order: [], questionsById: {} }
  try {
    scheme = await api.getScheme({}, {}, { projectId })
    
    if (scheme.schemeQuestions.length === 0) {
      return { isSchemeEmpty: true, ...payload }
    }
    
    // Create one array with the outline information in the question information
    const merge = scheme.schemeQuestions.reduce((arr, q) => {
      return [...arr, { ...q, ...scheme.outline[q.id] }]
    }, [])
    
    // Create a sorted question tree with sorted children with question numbering and order
    const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
    const questionsById = normalize.arrayToObject(questionsWithNumbers)
    const questionIndex = questionId === null
      ? 0
      : questionsWithNumbers.findIndex(question => parseInt(question.id) === parseInt(questionId))
    const firstQuestion = questionsWithNumbers[questionIndex]
    commonHelpers.sortListOfObjects(firstQuestion.possibleAnswers, 'order', 'asc')
    
    return { order, tree, questionsById, firstQuestion, outline: scheme.outline, isSchemeEmpty: false, questionIndex }
    
  } catch (error) {
    throw { error: 'Failed to get coding scheme.' }
  }
}

/**
 * Gets either the Validation question or Coded questions for a project / user depending on the page in which it is
 * called
 * (Coding or Validation)
 *
 * @param {(String|Number)} projectId
 * @param {(String|Number)} jurisdictionId
 * @param {(String|Number)} userId
 * @param {Function} apiMethod
 * @returns {Object} {{ codedValQuestions: Array, codedValError: Object }}
 */
export const getCodedValidatedQuestions = async (projectId, jurisdictionId, userId, apiMethod) => {
  let codedValQuestions = [], codedValErrors = {}
  try {
    codedValQuestions = await apiMethod({}, {}, { userId, projectId, jurisdictionId })
    return { codedValQuestions, codedValErrors }
  } catch (e) {
    return {
      codedValQuestions: [],
      codedValErrors: {
        codedValQuestions: 'We couldn\'t get your answered questions for this project and jurisdiction, so you are not able to answer questions.'
      }
    }
  }
}

/**
 * Gets the schemeQuestion from the API based on the id from question parameter. Updates the state.scheme variable with
 * the new object from the API.
 *
 * @param {(String|Number)} projectId
 * @param {Object} state
 * @param {Object} question
 * @param {Object} api
 * @returns {Object} {{ updatedScheme: { byId: Object, tree: Array, order: Array }, schemeErrors: Object,
 *   updatedSchemeQuestion: Object }}
 */
export const getSchemeQuestionAndUpdate = async (projectId, state, question, api) => {
  let updatedSchemeQuestion = {}, schemeErrors = {}
  
  // Get scheme question in case there are changes
  try {
    updatedSchemeQuestion = await api.getSchemeQuestion({}, {}, { questionId: question.id, projectId })
  } catch (error) {
    updatedSchemeQuestion = { ...question }
    schemeErrors = {
      updatedSchemeQuestion: 'We couldn\'t retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since you started coding are not available.'
    }
  }
  
  commonHelpers.sortListOfObjects(updatedSchemeQuestion.possibleAnswers, 'order', 'asc')
  
  // Update scheme with new scheme question
  const updatedScheme = {
    ...state.scheme,
    byId: {
      ...state.scheme.byId,
      [updatedSchemeQuestion.id]: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion }
    }
  }
  
  return { updatedScheme, schemeErrors, updatedSchemeQuestion }
}

/**
 * Generates a string error from the values in an object
 *
 * @param {Object} errorsObj
 * @returns {String}
 */
export const generateError = errorsObj => {
  return Object.values(errorsObj).join('\n\n')
}

/**
 * Checks the user answers object parameter if it has the value from item[id] as a key. If so, checks to see if it has
 * an answers object that is populates
 *
 * @param {Object} item
 * @param {Object} userAnswers
 * @param {String} id
 * @returns {Boolean}
 */
export const checkIfAnswered = (item, userAnswers, id = 'id') => {
  return userAnswers.hasOwnProperty(item[id]) &&
    Object.keys(userAnswers[item[id]].answers).length > 0
}

/**
 * Checks to see if the obj parameter has the value from item[id] as a property
 *
 * @param {Object} item
 * @param {Object} obj
 * @param {String} id
 * @returns {Boolean}
 */
export const checkIfExists = (item, obj, id = 'id') => {
  return obj.hasOwnProperty(item[id])
}

export default {
  checkIfAnswered,
  checkIfExists,
  generateError,
  getSchemeQuestionAndUpdate,
  getCodedValidatedQuestions,
  getFinalCodedObject,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionNumbers,
  copyCoderAnswer
}
