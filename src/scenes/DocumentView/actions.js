import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  INIT_STATE_WITH_DOC: 'INIT_STATE_WITH_DOC',
  GET_DOCUMENT_CONTENTS_REQUEST: 'GET_DOCUMENT_CONTENTS_REQUEST',
  GET_DOCUMENT_CONTENTS_SUCCESS: 'GET_DOCUMENT_CONTENTS_SUCCESS',
  GET_DOCUMENT_CONTENTS_FAIL: 'GET_DOCUMENT_CONTENTS_FAIL',
  UPDATE_DOC_SUCCESS: 'UPDATE_DOC_VIEW_SUCCESS',
  CLEAR_DOCUMENT: 'CLEAR_DOCUMENT',
  EDIT_DOCUMENT: 'EDIT_DOCUMENT',
  CLOSE_EDIT: 'CLOSE_EDIT',
  DELETE_PRO_JUR: 'DELETE_PRO_JUR',
  ADD_PRO_JUR: 'ADD_PRO_JUR',
  CLOSE_ALERT: 'CLOSE_ALERT',
  OPEN_ALERT: 'OPEN_ALERT',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_VIEW_PROPERTY',
  UPDATE_DOC_FAIL: 'UPDATE_DOC_VIEW_FAIL',
  UPDATE_DOC_REQUEST: 'UPDATE_DOC_VIEW_REQUEST',
  DELETE_DOCUMENT_REQUEST: 'DELETE_DOCUMENT_REQUEST',
  DELETE_DOCUMENT_SUCCESS: 'DELETE_DOCUMENT_SUCCESS',
  DELETE_DOCUMENT_FAIL: 'DELETE_DOCUMENT_FAIL'
}

export default {
  initState: makeActionCreator(types.INIT_STATE_WITH_DOC, 'doc'),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOCUMENT_CONTENTS_REQUEST, 'id'),
  clearDocument: makeActionCreator(types.CLEAR_DOCUMENT),
  editDocument: makeActionCreator(types.EDIT_DOCUMENT),
  closeEdit: makeActionCreator(types.CLOSE_EDIT),
  addProJur: makeActionCreator(types.ADD_PRO_JUR, 'property', 'value'),
  deleteProJur: makeActionCreator(types.DELETE_PRO_JUR, 'property', 'value'),
  updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'property', 'value'),
  updateDocRequest: makeActionCreator(types.UPDATE_DOC_REQUEST, 'property', 'value', 'updateType'),
  openAlert: makeActionCreator(types.OPEN_ALERT, 'text', 'title'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  deleteDocRequest: makeActionCreator(types.DELETE_DOCUMENT_REQUEST, 'id')
}
