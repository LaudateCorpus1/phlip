import { types } from './actions'
import { combineReducers } from 'redux'

export const INITIAL_STATE = {
  document: {
    content: {},
    projects: [],
    jurisdictions: []
  },
  documentForm: {},
  documentRequestInProgress: false,
  documentUpdateInProgress: false,
  documentUpdateError: null,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  },
  inEditMode: false,
  documentDeleteInProgress: false,
  documentDeleteError: false,
  error: ''
}

export const docViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INIT_STATE_WITH_DOC:
      return {
        ...state,
        document: {
          ...action.doc,
          content: {}
        }
      }
    
    case types.GET_DOCUMENT_CONTENTS_REQUEST:
      return {
        ...state,
        documentRequestInProgress: true
      }
    
    case types.GET_DOCUMENT_CONTENTS_FAIL:
      return {
        ...state,
        error: action.payload
      }
    
    case types.EDIT_DOCUMENT:
      return {
        ...state,
        documentForm: {
          ...state.document
        },
        inEditMode: true
      }
    
    case types.CLOSE_EDIT:
      return {
        ...state,
        documentForm: {},
        inEditMode: false
      }
    
    case types.GET_DOCUMENT_CONTENTS_SUCCESS:
      return {
        ...state,
        document: {
          ...state.document,
          content: action.payload
        },
        documentRequestInProgress: false
      }
    
    case types.ADD_PRO_JUR:
      let selectedDoc = { ...state.document }
      const foundIdx = selectedDoc[action.property].findIndex(el => el === action.value.id)
      if (foundIdx === -1) {
        selectedDoc[action.property] = [
          ...selectedDoc[action.property], action.value.id
        ]
      }
      
      return {
        ...state,
        documentForm: selectedDoc
      }
    
    case types.DELETE_PRO_JUR:
      let doc = { ...state.document }
      const index = doc[action.property].findIndex(el => el === action.value.id)
      const arr = doc[action.property]
      doc[action.property] = [...arr.slice(0, index), ...arr.slice(index + 1)]
      
      return {
        ...state,
        documentForm: doc
      }
    
    case types.UPDATE_DOC_PROPERTY:
      selectedDoc = { ...state.documentForm }
      selectedDoc[action.property] = action.value
      return {
        ...state,
        documentForm: { ...selectedDoc }
      }
    
    case types.UPDATE_DOC_REQUEST:
      return {
        ...state,
        documentUpdateInProgress: true
      }
    
    case types.UPDATE_DOC_SUCCESS:
      return {
        ...state,
        documentUpdateInProgress: false,
        document: state.documentForm,
        documentForm: {},
        inEditMode: false
      }
    
    case types.CLEAR_DOCUMENT:
      return {
        ...state,
        document: {
          content: {},
          projects: [],
          jurisdictions: []
        },
        documentForm: {},
        inEditMode: false
      }
    
    case types.UPDATE_DOC_FAIL:
      return {
        ...state,
        apiErrorInfo: {
          title: 'Update error',
          text: action.error
        },
        apiErrorOpen: true,
        documentUpdateInProgress: false,
        document: state.document
      }
    
    case types.CLOSE_ALERT:
      return {
        ...state,
        apiErrorInfo: {
          title: '',
          text: ''
        },
        apiErrorOpen: false
      }
    
    case types.DELETE_DOCUMENT_REQUEST:
      return {
        ...state,
        documentDeleteInProgress: true
      }
    
    case types.DELETE_DOCUMENT_SUCCESS:
      return {
        ...state,
        documentDeleteInProgress: false,
        documentDeleteError: false
      }
    
    case types.DELETE_DOCUMENT_FAIL:
      return {
        ...state,
        apiErrorInfo: {
          title: 'Document Delete Error',
          text: 'Failed to delete the document.'
        },
        apiErrorOpen: true,
        documentDeleteInProgress: false,
        documentDeleteError: true
      }
    
    default:
      return state
  }
}

export default combineReducers({
  meta: docViewReducer
})
