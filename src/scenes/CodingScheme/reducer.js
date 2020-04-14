import { types } from './actions'
import {
  changeNodeAtPath,
  getTreeFromFlatData,
  walk,
  map,
  addNodeUnderParent
} from 'react-sortable-tree'
import { commonHelpers } from 'utils'
import { combineReducers } from 'redux'
import addEditQuestion from './scenes/AddEditQuestion/reducer'

export const INITIAL_STATE = {
  questions: [],
  outline: {},
  flatQuestions: [],
  schemeError: null,
  alertError: '',
  previousQuestions: [],
  previousOutline: {},
  lockedByCurrentUser: false,
  lockInfo: {},
  lockedAlert: null,
  copying: false
}

/**
 * Turns the tree of questions into a flat object outline that is used by the backend.
 * @param {Array} questions
 */
export const questionsToOutline = questions => {
  const outline = {}

  // Get the root questions information
  questions.forEach((parentQuestion, i) => {
    outline[parentQuestion.id] = { parentId: 0, positionInParent: i }
  })

  walk({
    treeData: questions,
    getNodeKey,
    callback: ({ node }) => {
      if (node.children) {
        node.children.forEach((child, i) => {
          outline[child.id] = { parentId: node.id, positionInParent: i }
        })
      }
    },
    ignoreCollapsed: false
  })

  return outline
}

/**
 * Takes an object oultine and turns it into an array of questions
 *
 * @param {Object} outline
 * @param {Array} questions
 * @returns {Array}
 */
const getQuestionsFromOutline = (outline, questions) => {
  return questions.reduce((arr, q) => {
    return [
      ...arr,
      {
        ...q,
        ...outline[q.id],
        expanded: true
      }
    ]
  }, [])
}

/**
 * Sorts the array of questions based on position in parent, sorts the answer choices in each question by 'order'
 * property and sorts the children of each question.
 *
 * @param {Array} questions
 * @returns {Array}
 */
const sortQuestions = questions => {
  const sortedPossibleAnswerQuestion = questions.map(question => {
    return { ...question, possibleAnswers: commonHelpers.sortListOfObjects(question.possibleAnswers, 'order', 'asc') }
  })

  const sortedChildren = map({
    treeData: sortedPossibleAnswerQuestion,
    getNodeKey,
    callback: ({ node }) => {
      if (node.children) {
        node.children = commonHelpers.sortListOfObjects(node.children, 'positionInParent', 'asc')
      }
      return node
    },
    ignoreCollapsed: false
  })
  return commonHelpers.sortListOfObjects(sortedChildren, 'positionInParent', 'asc')
}

/**
 * Used by react-sortable-tree for getting a node in a tree
 *
 * @param {Object} node
 * @param {Number} treeIndex
 * @returns {Number}
 */
export const getNodeKey = ({ treeIndex }) => {
  return treeIndex
}

/**
 * Sorts the possibleAnswers property for all questions in questions parameter
 *
 * @param {Array} questions
 * @returns {Array}
 */
const sortPossibleAnswers = questions => {
  return questions.map((question) => {
    return commonHelpers.sortListOfObjects(question.possibleAnswers, 'order', 'asc')
  })
}

/**
 * Main reducer function for coding scheme scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const codingSchemeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_SCHEME_REQUEST:
      return {
        ...state,
        schemeError: null
      }
      
    case types.GET_SCHEME_SUCCESS:
      sortPossibleAnswers(action.payload.scheme.schemeQuestions)
      return {
        ...state,
        questions: sortQuestions(getTreeFromFlatData({
          flatData: getQuestionsFromOutline(action.payload.scheme.outline, action.payload.scheme.schemeQuestions)
        })),
        flatQuestions: action.payload.scheme.schemeQuestions,
        outline: action.payload.scheme.outline,
        empty: action.payload.scheme.schemeQuestions <= 0,
        alertError: action.payload.error.lockInfo ? action.payload.error.lockInfo : '',
        lockInfo: action.payload.lockInfo,
        lockedByCurrentUser: action.payload.lockedByCurrentUser,
        lockedAlert: Object.keys(action.payload.lockInfo).length > 0
          ? action.payload.lockedByCurrentUser
            ? null
            : true
          : null
      }

    case types.GET_SCHEME_FAIL:
      return {
        ...INITIAL_STATE,
        schemeError: action.payload
      }

    case types.RESET_ALERT_ERROR:
      return {
        ...state,
        alertError: ''
      }

    case types.CLOSE_CODING_SCHEME_LOCK_ALERT:
      return {
        ...state,
        lockedAlert: null
      }
  
    case types.REORDER_SCHEME_SUCCESS:
      return {
        ...state,
        alertError: '',
        previousQuestions: [],
        previousOutline: {}
      }

    case types.REORDER_SCHEME_FAIL:
      return {
        ...state,
        alertError: action.payload,
        questions: state.previousQuestions,
        outline: state.previousOutline,
        previousQuestions: [],
        previousOutline: {}
      }
  
    case types.LOCK_SCHEME_SUCCESS:
      return {
        ...state,
        lockedByCurrentUser: action.payload.lockedByCurrentUser,
        lockInfo: action.payload.lockInfo,
        lockedAlert: Object.keys(action.payload.lockInfo).length > 0
          ? action.payload.lockedByCurrentUser
            ? null
            : true
          : null
      }
  
    case types.UNLOCK_SCHEME_SUCCESS:
      return {
        ...state,
        lockedByCurrentUser: false,
        lockInfo: {}
      }
  
    case types.DELETE_QUESTION_SUCCESS:
      return {
        ...state,
        questions: action.payload.updatedQuestions,
        outline: action.payload.updatedOutline,
        empty: action.payload.updatedQuestions.length === 0
      }

    case types.LOCK_SCHEME_FAIL:
    case types.UNLOCK_SCHEME_FAIL:
    case types.DELETE_QUESTION_FAIL:
      return {
        ...state,
        alertError: action.payload
      }
  
    case types.ADD_QUESTION_SUCCESS:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        outline: questionsToOutline([...state.questions, action.payload]),
        flatQuestions: [...state.flatQuestions, action.payload],
        empty: false
      }
  
    case types.ADD_CHILD_QUESTION_SUCCESS:
      const { outline, ...question } = action.payload
      const newTree = addNodeUnderParent({
        treeData: state.questions,
        parentKey: action.payload.path[action.payload.path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: { ...question }
      })
      
      return {
        ...state,
        questions: newTree.treeData,
        outline: questionsToOutline(newTree.treeData),
        empty: false,
        flatQuestions: [...state.flatQuestions, action.payload]
      }
  
    case types.UPDATE_QUESTION_SUCCESS:
      const updatedTree = changeNodeAtPath({
        treeData: state.questions,
        path: action.payload.path,
        getNodeKey,
        newNode: { ...action.payload }
      })
    
      return {
        ...state,
        questions: updatedTree,
        outline: questionsToOutline(updatedTree),
        empty: false
      }

    case types.SET_EMPTY_STATE:
      return {
        ...state,
        empty: state.questions.length <= 0
      }

    case types.HANDLE_QUESTION_TREE_CHANGE:
      return {
        ...state,
        previousQuestions: state.questions,
        previousOutline: state.outline,
        questions: action.questions,
        outline: questionsToOutline(action.questions)
      }
      
    case types.COPY_CODING_SCHEME_REQUEST:
      return {
        ...state,
        copying: true
      }
      
    case types.COPY_CODING_SCHEME_SUCCESS:
      sortPossibleAnswers(action.payload.scheme.schemeQuestions)
      return {
        ...state,
        questions: sortQuestions(getTreeFromFlatData({
          flatData: getQuestionsFromOutline(action.payload.scheme.outline, action.payload.scheme.schemeQuestions)
        })),
        flatQuestions: action.payload.scheme.schemeQuestions,
        outline: action.payload.scheme.outline,
        copying: false,
        empty: false
      }
      
    case types.COPY_CODING_SCHEME_FAIL:
      return {
        ...state,
        alertError: action.payload,
        copying: false
      }

    case types.CLEAR_STATE:
      return INITIAL_STATE

    case types.DELETE_QUESTION_REQUEST:
    case types.LOCK_SCHEME_REQUEST:
    case types.UNLOCK_SCHEME_REQUEST:
    case types.REORDER_SCHEME_REQUEST:
    default:
      return state
  }
}

/**
 * Combines the reducers from ./scenes/AddEditProject and ./scenes/AddEditJurisdiction
 */
const codingSchemeRootReducer = combineReducers({
  main: codingSchemeReducer,
  addEditQuestion
})

export default codingSchemeRootReducer
