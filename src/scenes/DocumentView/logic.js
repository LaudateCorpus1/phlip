import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as codingTypes } from 'scenes/CodingValidation/components/DocumentList/actions'
import { types as docManageTypes } from 'scenes/DocumentManagement/actions'

/**
 * Retrieves the actual document contents
 */
const getDocumentContentsLogic = createLogic({
  type: [types.GET_DOCUMENT_CONTENTS_REQUEST, codingTypes.GET_DOC_CONTENTS_REQUEST],
  async process({ getState, docApi, action }, dispatch, done) {
    try {
      const { content } = await docApi.getDocumentContents({}, {}, { docId: action.id })
      dispatch({
        type: action.type === types.GET_DOCUMENT_CONTENTS_REQUEST
          ? types.GET_DOCUMENT_CONTENTS_SUCCESS
          : codingTypes.GET_DOC_CONTENTS_SUCCESS,
        payload: content
      })
    } catch (err) {
      dispatch({
        type: action.type === types.GET_DOCUMENT_CONTENTS_REQUEST
          ? types.GET_DOCUMENT_CONTENTS_FAIL
          : codingTypes.GET_DOC_CONTENTS_FAIL,
        payload: 'We couldn\'t retrieve the contents for this document.'
      })
    }
    done()
  }
})

/**
 * Handles sending updates for a document to doc management server
 */
const updateDocLogic = createLogic({
  type: types.UPDATE_DOC_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    const selectedDoc = getState().scenes.docView.meta.documentForm
    let updatedDoc = {}
    
    try {
      if (['jurisdictions', 'projects'].includes(action.property)) {
        if (action.updateType === 'add') {
          updatedDoc = await docApi.addToDocArray(
            {},
            {},
            { docId: selectedDoc._id, updateType: action.property, newId: parseInt(action.value.id) }
          )
  
          dispatch({
            type: action.property === 'jurisdictions' ? jurisdictionTypes.ADD_JURISDICTION : projectTypes.ADD_PROJECT,
            payload: action.value
          })
        } else {
          updatedDoc = await docApi.removeFromDocArray(
            {},
            {},
            { docId: selectedDoc._id, updateType: action.property, removeId: parseInt(action.value.id) }
          )
        }
      } else {
        updatedDoc = await docApi.updateDoc({
          status: selectedDoc.status,
          effectiveDate: selectedDoc.effectiveDate !== undefined
            ? selectedDoc.effectiveDate
            : '',
          citation: selectedDoc.citation
        }, {}, { docId: selectedDoc._id })
      }
      
      dispatch({
        type: types.UPDATE_DOC_SUCCESS,
        payload: updatedDoc._id
      })
      done()
    } catch (err) {
      dispatch({
        type: types.UPDATE_DOC_FAIL,
        error: action.property === 'projects' || action.property === 'jurisdictions'
          ? `We couldn\'t ${action.updateType} the ${action.property.slice(0, -1)} ${action.updateType === 'add'
            ? 'to'
            : 'from'} the document.`
          : 'We couldn\'t update the document.'
      })
      done()
    }
  }
})

/**
 * Handles deleting a document from the doc management server
 */
const deleteDocLogic = createLogic({
  type: types.DELETE_DOCUMENT_REQUEST,
  async process({ docApi, action, getState, api }, dispatch, done) {
    try {
      await docApi.deleteDoc({}, {}, { 'docId': action.id })
      try {
        api.cleanAnnotations({}, {}, { 'docId': action.id })
      } catch (err) {
        console.log(`failed to remove annotations for doc: ${action.id}`)
      }
      dispatch({
        type: types.DELETE_DOCUMENT_SUCCESS,
        payload: action.id
      })
      dispatch({
        type: docManageTypes.DELETE_DOC_SUCCESS,
        payload: { docsDeleted: [action.id] }
      })
      done()
    } catch (err) {
      dispatch({
        type: types.DELETE_DOCUMENT_FAIL,
        payload: { error: 'We couldn\'t delete the document.' }
      })
      done()
    }
  }
})

export default [
  getDocumentContentsLogic, updateDocLogic, deleteDocLogic
]
