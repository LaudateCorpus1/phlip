import actions, { types } from '../actions'

describe('Document management - Upload action creators', () => {
  test('should create an action to start uploading documents', () => {
    const expectedAction = {
      type: types.UPLOAD_DOCUMENTS_START,
      selectedDocs: [{ name: 'blah' }]
    }

    expect(actions.uploadDocumentsStart([{ name: 'blah' }])).toEqual(expectedAction)
  })

  test('should create an action to update a document property', () => {
    const expectedAction = {
      type: types.UPDATE_DOC_PROPERTY,
      index: 1,
      property: 'name',
      value: 'newName'
    }

    expect(actions.updateDocumentProperty(1, 'name', 'newName')).toEqual(expectedAction)
  })

  test('should create an action to add documents to the selected list', () => {
    const expectedAction = {
      type: types.ADD_SELECTED_DOCS,
      selectedDocs: [{ name: 'doc1' }, { name: 'doc2' }]
    }
    expect(actions.addSelectedDocs([{ name: 'doc1' }, { name: 'doc2' }])).toEqual(expectedAction)
  })

  test('should create an action to clear selected files list', () => {
    const expectedAction = {
      type: types.CLEAR_SELECTED_FILES
    }
    expect(actions.clearSelectedFiles()).toEqual(expectedAction)
  })

  test('should create an action to remove a doc from the selected list', () => {
    const expectedAction = {
      type: types.REMOVE_DOC,
      index: 1
    }
    expect(actions.removeDoc(1)).toEqual(expectedAction)
  })

  test('should create an action to close the alert', () => {
    const expectedAction = {
      type: types.CLOSE_ALERT
    }
    expect(actions.closeAlert()).toEqual(expectedAction)
  })

  test('should create an action to open alert with text', () => {
    const expectedAction = {
      type: types.OPEN_ALERT,
      text: 'alert text',
      title: 'alert title'
    }
    expect(actions.openAlert('alert text', 'alert title')).toEqual(expectedAction)
  })

  test('should create an action to remove a duplicate file', () => {
    const expectedAction = {
      type: types.REMOVE_DUPLICATE,
      index: 1,
      fileName: 'duplicate file name'
    }

    expect(actions.removeDuplicate(1, 'duplicate file name')).toEqual(expectedAction)
  })

  test('should create an action to extract info', () => {
    const fd = new FormData()
    fd.append('file', { name: 'infofile' })

    const expectedAction = {
      type: types.EXTRACT_INFO_REQUEST,
      infoSheetFormData: fd,
      infoSheet: { name: 'infofile' }
    }

    expect(actions.extractInfoRequest(fd, { name: 'infofile' })).toEqual(expectedAction)
  })

  test('should create an action to reset no project error', () => {
    const expectedAction = {
      type: types.RESET_FAILED_UPLOAD_VALIDATION
    }

    expect(actions.resetFailedUploadValidation()).toEqual(expectedAction)
  })

  test('should create an action to toggle edit mode on a row and property', () => {
    const expectedAction = {
      type: types.TOGGLE_ROW_EDIT_MODE,
      index: 1,
      property: 'citation'
    }

    expect(actions.toggleRowEditMode(1, 'citation')).toEqual(expectedAction)
  })

  test('should create an action to clear jurisdiction suggestions from a row', () => {
    const expectedAction = {
      type: types.CLEAR_ROW_JURISDICTION_SUGGESTIONS,
      index: 2
    }

    expect(actions.clearRowJurisdictionSuggestions(2)).toEqual(expectedAction)
  })

  test('should create an action to merge info sheet with selected docs', () => {
    const expectedAction = {
      type: types.MERGE_INFO_WITH_DOCS,
      docs: [{ name: 'doc 1' }]
    }

    expect(actions.mergeInfoWithDocs([{ name: 'doc 1' }])).toEqual(expectedAction)
  })
  
  test('should create an action to set extracting info progress', () => {
    const expectedAction = {
      type: types.SET_INFO_REQUEST_IN_PROGRESS
    }
    
    expect(actions.setInfoRequestProgress()).toEqual(expectedAction)
  })
})
