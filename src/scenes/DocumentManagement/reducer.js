import { combineReducers } from 'redux'
import upload, { INITIAL_STATE as UPLOAD_INITIAL_STATE } from './scenes/Upload/reducer'
import { types as uploadTypes } from './scenes/Upload/actions'
import { types } from './actions'
import { arrayToObject, createArrOfObj, mapArray } from 'utils/normalize'
import { sliceTable, sortListOfObjects } from 'utils/commonHelpers'
import searchReducer, { COMBINED_INITIAL_STATE as SEARCH_INITIAL_STATE } from './components/SearchBox/reducer'

export const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: [],
    matches: [],
    userDocs: []
  },
  rowsPerPage: '10',
  page: 0,
  allSelected: false,
  bulkOperationInProgress: false,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  },
  sortBy: 'uploadedDate',
  sortDirection: 'desc',
  getDocumentsInProgress: false,
  pageError: '',
  count: 0,
  showAll: false
}

/**
 * Handles slicing and sorting an array of objects to be used as the 'visible' objects
 * @param arrToSlice
 * @param page
 * @param rowsPerPage
 * @param sortBy
 * @param sortDirection
 * @returns {Array}
 */
const sortAndSlice = (arrToSlice, page, rowsPerPage, sortBy, sortDirection) => {
  const arr = arrToSlice
  
  if (arr.length === 0) return []
  const sorted = sortListOfObjects(arr, sortBy, sortDirection)
  const ids = sorted.map(m => m._id)
  let rows = parseInt(rowsPerPage)
  if (rowsPerPage === 'All')
    rows = ids.length
  return sliceTable(ids, page, rows)
}

/***
 * Reducers for all things related to the document management list
 */
export const docManagementReducer = (state = INITIAL_STATE, action) => {
  let rows = parseInt(state.rowsPerPage)
  switch (action.type) {
    case types.GET_DOCUMENTS_REQUEST:
      return {
        ...state,
        getDocumentsInProgress: true,
        allSelected: false,
        bulkOperationInProgress: false
      }
    
    case types.GET_DOCUMENTS_SUCCESS:
      let obj = arrayToObject(action.payload.documents, '_id')
      let userDocs = action.payload.documents.filter(
        doc => parseInt(doc.uploadedBy.id) === parseInt(action.payload.userId)
      )
      let userDocObj = arrayToObject(userDocs, '_id')
      const visible = sortAndSlice(
        userDocs,
        0,
        state.rowsPerPage,
        state.sortBy,
        state.sortDirection
      )
      
      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          visible,
          checked: [],
          matches: [],
          userDocs: Object.keys(userDocObj)
        },
        getDocumentsInProgress: false,
        pageError: '',
        page: 0,
        count: userDocs.length,
        showAll: false,
        allSelected: false
      }
    
    case types.GET_DOCUMENTS_FAIL:
      return {
        ...state,
        getDocumentsInProgress: false,
        pageError: 'We couldn\'t retrieve the list of documents.'
      }
    
    case types.ON_TOGGLE_ALL_DOCS:
      return {
        ...state,
        showAll: !state.showAll,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            0,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          ),
          matches: action.isSearch ? mapArray(action.payload, '_id') : state.documents.matches
        },
        count: action.payload.length,
        page: 0
      }
    
    case types.ON_PAGE_CHANGE:
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            action.page,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          )
        },
        page: action.page
      }
    
    case types.ON_ROWS_CHANGE:
      let page = state.page
      if (action.rowsPerPage === 'All') {
        rows = action.payload.length
        page = 0
      } else {
        rows = parseInt(action.rowsPerPage)
      }
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            page,
            rows,
            state.sortBy,
            state.sortDirection
          )
        },
        page,
        rowsPerPage: action.rowsPerPage
      }
    
    case uploadTypes.UPLOAD_ONE_DOC_COMPLETE:
      if (!action.payload.failed) {
        obj = { ...state.documents.byId, [action.payload.doc._id]: action.payload.doc }
        let userDocs = state.documents.userDocs.map(id => ({ _id: id, ...state.documents.byId[id] }))
        let docArr = state.showAll ? Object.values(obj) : [action.payload.doc, ...userDocs]
        
        return {
          ...state,
          documents: {
            ...state.documents,
            byId: obj,
            allIds: Object.keys(obj),
            visible: sortAndSlice(
              docArr,
              state.page,
              state.rowsPerPage,
              state.sortBy,
              state.sortDirection
            ),
            userDocs: [...state.documents.userDocs, action.payload.doc._id]
          },
          count: docArr.length
        }
      } else {
        return state
      }
    
    case types.SEARCH_VALUE_CHANGE:
      const sorted = sortAndSlice(action.payload, 0, state.rowsPerPage, state.sortBy, state.sortDirection)
      
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sorted,
          matches: action.value === '' ? [] : mapArray(action.payload, '_id')
        },
        page: 0,
        count: action.payload.length
      }
    
    case types.BULK_DELETE_REQUEST:
    case types.BULK_UPDATE_REQUEST:
    case types.BULK_REMOVE_PROJECT_REQUEST:
      return {
        ...state,
        bulkOperationInProgress: true
      }
    
    case types.BULK_DELETE_SUCCESS:
    case types.DELETE_DOC_SUCCESS:
      let updatedDocs = { ...state.documents.byId }
      let matches = state.documents.matches.slice()
      userDocs = state.documents.userDocs.slice()
      
      action.payload.docsDeleted.forEach(docId => {
        const { [docId]: removed, ...docs } = updatedDocs
        updatedDocs = docs
        if (userDocs.includes(docId)) {
          userDocs.splice(userDocs.indexOf(docId), 1)
        }
        
        if (matches.length > 0 && matches.includes(docId)) {
          matches.splice(matches.indexOf(docId), 1)
        }
      })
      
      let docArr = state.documents.matches.length > 0
        ? createArrOfObj(updatedDocs, matches)
        : state.showAll
          ? Object.values(updatedDocs)
          : createArrOfObj(updatedDocs, userDocs)
      
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: updatedDocs,
          allIds: Object.keys(updatedDocs),
          visible: sortAndSlice(docArr, state.page, state.rowsPerPage, state.sortBy, state.sortDirection),
          checked: [],
          matches,
          userDocs
        },
        count: docArr.length,
        bulkOperationInProgress: false,
        allSelected: false
      }
    
    case types.BULK_UPDATE_SUCCESS:
      const updatedVisible = action.payload.affectsView
        ? sortAndSlice(action.payload.sortPayload, state.page, state.rowsPerPage, state.sortBy, state.sortDirection)
        : state.documents.visible
      
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: action.payload.updatedById,
          allIds: Object.keys(action.payload.updatedById),
          visible: updatedVisible,
          checked: [],
          matches: action.payload.affectsView
            ? mapArray(action.payload.sortPayload, '_id')
            : state.documents.matches
        },
        count: action.payload.affectsView
          ? action.payload.count
          : state.count,
        bulkOperationInProgress: false,
        apiErrorOpen: false,
        allSelected: false
      }
    
    case types.CLEAN_PROJECT_LIST_FAIL:
    case types.BULK_DELETE_FAIL:
    case types.BULK_UPDATE_FAIL:
      return {
        ...state,
        bulkOperationInProgress: false,
        cleanProjectOperationInProgress: false,
        apiErrorInfo: {
          title: '',
          text: action.payload.error
        },
        apiErrorOpen: true
      }
    
    case types.CLEAN_PROJECT_LIST_REQUEST:
      return {
        ...state,
        cleanProjectOperationInProgress: true,
        apiErrorOpen: false
      }
    
    case types.CLEAN_PROJECT_LIST_SUCCESS:
      obj = action.payload
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj
        },
        cleanProjectOperationInProgress: false,
        apiErrorOpen: false
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
    
    case types.SORT_DOCUMENTS:
      const currentSortField = state.sortBy
      const currentSortDirection = state.sortDirection
      let sortDirection = 'desc'
      if (action.sortDirection === undefined) {
        if (currentSortField !== action.sortBy) {
          sortDirection = 'asc'
        } else {
          sortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc'
        }
      } else {
        sortDirection = action.sortDirection
      }
      
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: sortDirection,
        documents: {
          ...state.documents,
          visible: sortAndSlice(action.payload, state.page, state.rowsPerPage, action.sortBy, sortDirection)
        }
      }
    
    case types.SELECT_ALL_DOCS:
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: state.allSelected ? [] : state.documents.visible
        },
        allSelected: !state.allSelected
      }
    
    case types.SELECT_ONE_DOC:
      let updatedChecked = [...state.documents.checked]
      
      if (state.documents.checked.includes(action.id)) {
        const index = state.documents.checked.indexOf(action.id)
        updatedChecked.splice(index, 1)
      } else {
        updatedChecked = [...updatedChecked, action.id]
      }
      
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: updatedChecked
        }
      }
    
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

const MAIN_COMBINED_STATE = {
  list: INITIAL_STATE
}

const COMBINED_INITIAL_STATE = {
  upload: { list: UPLOAD_INITIAL_STATE },
  main: MAIN_COMBINED_STATE,
  search: SEARCH_INITIAL_STATE
}

const docManage = combineReducers({
  list: docManagementReducer
})

const docManageReducer = (state = COMBINED_INITIAL_STATE, action) => {
  return {
    upload: upload(state.upload, action),
    main: docManage(state.main, action),
    search: searchReducer(state.search, action)
  }
}

export default docManageReducer
