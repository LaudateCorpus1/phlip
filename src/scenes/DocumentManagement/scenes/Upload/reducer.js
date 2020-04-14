import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'
import { combineReducers } from 'redux'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

export const INITIAL_STATE = {
  uploadProgress: {
    index: 0,
    total: 0,
    failures: 0,
    percentage: 0
  },
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  infoSheet: {},
  infoRequestInProgress: false,
  infoSheetSelected: false,
  extractedInfo: {},
  projectSuggestions: [],
  jurisdictionSuggestions: [],
  projectSearchValue: '',
  jurisdictionSearchValue: '',
  selectedProject: {},
  selectedJurisdiction: {},
  showJurSearch: true,
  noProjectError: false,
  hasVerified: false,
  invalidFiles: [],
  alert: {
    open: false,
    text: '',
    title: '',
    type: 'basic'
  }
}

export const uploadReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPLOAD_DOCUMENTS_START:
      return {
        ...state,
        uploading: true,
        goBack: false,
        uploadProgress: {
          index: 0,
          total: action.selectedDocs.length,
          percentage: 0,
          failures: 0
        }
      }
    
    case types.UPLOAD_ONE_DOC_COMPLETE:
      const newIndex = state.uploadProgress.index + 1
      
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          index: newIndex,
          percentage: (newIndex / state.uploadProgress.total) * 100,
          failures: action.payload.failed ? state.uploadProgress.failures + 1 : state.uploadProgress.failures
        }
      }
    
    case types.UPLOAD_DOCUMENTS_FINISH_SUCCESS:
      return {
        ...state,
        selectedDocs: [],
        uploadProgress: {
          ...state.uploadProgress,
          percentage: 100
        }
      }
    
    case types.UPLOAD_DOCUMENTS_FINISH_WITH_FAILS:
      docs = [...state.selectedDocs]
      const d = docs.filter(doc => action.payload.failed.includes(doc.name.value))
      
      return {
        ...state,
        selectedDocs: [...d].map(doc => ({ ...doc, hasError: true })),
        requestError: action.payload.error,
        uploadProgress: {
          ...state.uploadProgress,
          percentage: 100
        }
      }
    
    case types.ACKNOWLEDGE_UPLOAD_FAILURES:
      return {
        ...state,
        requestError: null,
        uploading: false,
        uploadProgress: {
          index: 0,
          failures: 0,
          percentage: 0,
          total: 0
        }
      }
    
    case types.VERIFY_RETURN_DUPLICATE_FILES:
      docs = [...state.selectedDocs]
      docs = docs.map(doc => {
        const isDup = action.payload.findIndex(dup => dup.name === doc.name.value)
        return {
          ...doc,
          isDuplicate: isDup !== -1
        }
      })
      
      return {
        ...state,
        uploading: false,
        selectedDocs: docs,
        alert: {
          open: true,
          text: `The file name, project and jurisdiction properties for one or more of the documents selected for
        upload match a pre-existing document in the system. These documents have been indicated in the file list. You
        can choose to remove the files or click the 'Upload' button again to proceed with saving them.`,
          title: 'Duplicates Found',
          type: 'basic'
        },
        hasVerified: true
      }
    
    case types.EXTRACT_INFO_REQUEST:
      return {
        ...state,
        infoSheet: action.infoSheet,
        infoRequestInProgress: true,
        infoSheetSelected: true
      }
    
    case types.EXTRACT_INFO_SUCCESS:
      return {
        ...state,
        infoRequestInProgress: false,
        extractedInfo: action.payload.info,
        selectedDocs: action.payload.merged,
        showJurSearch: action.payload.missingJurisdiction
      }
    
    case types.SET_INFO_REQUEST_IN_PROGRESS:
      return {
        ...state,
        infoRequestInProgress: true
      }
    
    case types.EXTRACT_INFO_FAIL:
      return {
        ...state,
        requestError: 'We couldn\'t extract the metadata from Excel sheet. Please try again later.',
        infoRequestInProgress: false
      }
    
    case types.MERGE_INFO_WITH_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.payload.merged
        ],
        hasVerified: false,
        infoRequestInProgress: false,
        showJurSearch: action.payload.missingJurisdiction
      }
    
    // If the user has selected an excel file but has not selected documents to upload
    case types.EXTRACT_INFO_SUCCESS_NO_DOCS:
      return {
        ...state,
        infoRequestInProgress: false,
        extractedInfo: action.payload
      }
    
    case types.UPDATE_DOC_PROPERTY:
      let selectedDoc = { ...state.selectedDocs[action.index] }
      let value = action.value
      selectedDoc[action.property] = {
        ...selectedDoc[action.property],
        value,
        error: '',
        fromMetaFile: false
      }
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case types.ADD_SELECTED_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.selectedDocs.map(doc => {
            let d = {}
            Object.keys(doc).forEach(prop => {
              d[prop] = {
                editable: true,
                value: doc[prop],
                error: '',
                inEditMode: false,
                fromMetaFile: false
              }
            })
            return d
          })
        ],
        hasVerified: false
      }
    
    case types.REMOVE_DOC:
      let docs = [...state.selectedDocs]
      docs.splice(action.index, 1)
      
      return {
        ...state,
        selectedDocs: docs,
        hasVerified: state.hasVerified ? docs.length !== 0 : false
      }
    
    case types.TOGGLE_ROW_EDIT_MODE:
      selectedDoc = { ...state.selectedDocs[action.index] }
      selectedDoc[action.property].inEditMode = true
      selectedDoc[action.property].error = ''
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case types.CLOSE_ALERT:
      let invalidFiles = [...state.invalidFiles]
      const cleanedDocs = [...state.selectedDocs].filter(
        doc => !invalidFiles.find(badDoc => badDoc.name === doc.name.value)
      )
      
      return {
        ...state,
        selectedDocs: cleanedDocs,
        invalidFiles: [],
        alert: {
          open: false,
          text: '',
          title: '',
          type: 'basic'
        }
      }
    
    case types.OPEN_ALERT:
      return {
        ...state,
        alert: {
          open: true,
          text: action.text,
          title: action.title || '',
          type: action.alertType
        }
      }
    
    case types.REJECT_NO_PROJECT_SELECTED:
      return {
        ...state,
        noProjectError: true,
        alert: {
          open: true,
          text: action.error,
          title: 'Invalid Project',
          type: 'basic'
        }
      }
    
    case types.RESET_FAILED_UPLOAD_VALIDATION:
      return {
        ...state,
        noProjectError: false
      }
    
    case types.REJECT_EMPTY_JURISDICTIONS:
      return {
        ...state,
        selectedDocs: [...state.selectedDocs].map(doc => {
          if (doc.jurisdictions.value.name.length === 0 || !doc.jurisdictions.value.hasOwnProperty('id')) {
            return {
              ...doc,
              jurisdictions: {
                ...doc.jurisdictions,
                error: true,
                inEditMode: true
              }
            }
          } else {
            return doc
          }
        }),
        alert: {
          open: true,
          text: action.error,
          title: 'Invalid Jurisdictions',
          type: 'basic'
        }
      }
    
    case types.INVALID_FILES_FOUND:
      return {
        ...state,
        uploading: false,
        invalidFiles: action.invalidFiles,
        alert: {
          open: true,
          text: action.text,
          title: action.title,
          type: 'files'
        },
        hasVerified: false
      }
    
    case `${autocompleteTypes.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`:
      const selected = { ...state.selectedDocs[action.index] }
      const updated = { ...selected, jurisdictions: { ...selected.jurisdictions, searching: true } }
      return (action.index !== undefined && action.index !== null)
        ? {
          ...state,
          selectedDocs: updateItemAtIndex(
            [...state.selectedDocs],
            action.index,
            updated
          )
        }
        : { ...state }
  
    case `${types.SEARCH_ROW_SUGGESTIONS_SUCCESS_JURISDICTION}_UPLOAD`:
      selectedDoc = { ...state.selectedDocs[action.payload.index] }
      selectedDoc.jurisdictions.value.suggestions = action.payload.suggestions
      selectedDoc.jurisdictions.searching = false
    
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.payload.index,
          selectedDoc
        )
      }
  
    case types.CLEAR_ROW_JURISDICTION_SUGGESTIONS:
      selectedDoc = { ...state.selectedDocs[action.index] }
      selectedDoc.jurisdictions.value.suggestions = []
      selectedDoc.jurisdictions.searching = false
    
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION_UPLOAD`:
      return {
        ...state,
        selectedDocs: state.selectedDocs.map(doc => {
          const set = doc.jurisdictions.value.hasOwnProperty('id') && doc.jurisdictions.fromMetaFile
          
          return {
            ...doc,
            jurisdictions: {
              ...doc.jurisdictions,
              editable: false,
              inEditMode: false,
              value: set ? doc.jurisdictions.value : action.suggestion,
              fromMetaFile: set,
              searching: false
            }
          }
        })
      }
  
    case `${autocompleteTypes.UPDATE_SEARCH_VALUE}_PROJECT_UPLOAD`:
      return {
        ...state,
        noProjectError: false
      }
    
    case `${autocompleteTypes.UPDATE_SEARCH_VALUE}_JURISDICTION_UPLOAD`:
      if (action.value !== '') {
        return state
      } else {
        return {
          ...state,
          selectedDocs: state.selectedDocs.map(doc => {
            const set = doc.jurisdictions.value.hasOwnProperty('id') && doc.jurisdictions.fromMetaFile
            return {
              ...doc,
              jurisdictions: {
                ...doc.jurisdictions,
                editable: !set,
                value: set ? doc.jurisdictions.value : { suggestions: [], searchValue: '', name: '' },
                searching: false
              }
            }
          })
        }
      }
    
    case types.CLEAR_SELECTED_FILES:
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

export default combineReducers({
  list: uploadReducer
})
