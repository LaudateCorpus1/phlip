import makeActionCreator from 'utils/makeActionCreator'
import {
  default as searchActions,
  types as searchTypes
} from './components/SearchBox/actions'
import { types as uploadTypes } from './scenes/Upload/actions'

export const types = {
  GET_DOCUMENTS_REQUEST: 'GET_DOCUMENTS_REQUEST',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL',
  SELECT_ALL_DOCS: 'SELECT_ALL_DOCS',
  SELECT_ONE_DOC: 'SELECT_ONE_DOC',
  ON_PAGE_CHANGE: 'ON_PAGE_CHANGE',
  ON_ROWS_CHANGE: 'ON_ROWS_CHANGE',
  FLUSH_STATE: 'FLUSH_STATE',
  BULK_UPDATE_REQUEST: 'BULK_UPDATE_REQUEST',
  BULK_UPDATE_SUCCESS: 'BULK_UPDATE_SUCCESS',
  BULK_UPDATE_FAIL: 'BULK_UPDATE_FAIL',
  BULK_DELETE_REQUEST: 'BULK_DELETE_REQUEST',
  BULK_DELETE_SUCCESS: 'BULK_DELETE_SUCCESS',
  BULK_DELETE_FAIL: 'BULK_DELETE_FAIL',
  CLOSE_ALERT: 'CLOSE_ALERT',
  SORT_DOCUMENTS: 'SORT_DOCUMENTS',
  FORM_VALUE_CHANGE: searchTypes.FORM_VALUE_CHANGE,
  SEARCH_VALUE_CHANGE: searchTypes.SEARCH_VALUE_CHANGE,
  CLEAN_PROJECT_LIST_REQUEST: 'CLEAN_PROJECT_LIST_REQUEST',
  CLEAN_PROJECT_LIST_SUCCESS: 'CLEAN_PROJECT_LIST_SUCCESS',
  CLEAN_PROJECT_LIST_FAIL: 'CLEAN_PROJECT_LIST_FAIL',
  BULK_REMOVE_PROJECT_REQUEST: 'BULK_REMOVE_PROJECT_REQUEST',
  ON_TOGGLE_ALL_DOCS: 'ON_TOGGLE_ALL_DOCS',
  DELETE_DOC_SUCCESS: 'DELETE_DOC_SUCCESS',
  ...searchTypes,
  ...uploadTypes
}

export default {
  getDocumentsRequest: makeActionCreator(types.GET_DOCUMENTS_REQUEST),
  handlePageChange: makeActionCreator(types.ON_PAGE_CHANGE, 'page'),
  handleRowsChange: makeActionCreator(types.ON_ROWS_CHANGE, 'rowsPerPage'),
  handleSelectAllDocs: makeActionCreator(types.SELECT_ALL_DOCS),
  handleSelectOneDoc: makeActionCreator(types.SELECT_ONE_DOC, 'id'),
  handleBulkUpdate: makeActionCreator(types.BULK_UPDATE_REQUEST, 'updateData', 'selectedDocs'),
  handleBulkDelete: makeActionCreator(types.BULK_DELETE_REQUEST, 'selectedDocs'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  handleSortRequest: makeActionCreator(types.SORT_DOCUMENTS, 'sortBy', 'sortDirection'),
  handleSearchValueChange: searchActions.updateSearchValue,
  handleFormValueChange: searchActions.updateFormValue,
  cleanDocProjectList: makeActionCreator(types.CLEAN_PROJECT_LIST_REQUEST, 'projectMeta'),
  handleBulkProjectRemove: makeActionCreator(types.BULK_REMOVE_PROJECT_REQUEST, 'projectMeta', 'selectedDocs'),
  toggleAllDocs: makeActionCreator(types.ON_TOGGLE_ALL_DOCS)
}
