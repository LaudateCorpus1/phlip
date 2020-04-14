import actions, { types } from '../actions'

describe('DocumentView action creators', () => {
  test('should create an action to init state', () => {
    const expectedAction = {
      type: types.INIT_STATE_WITH_DOC,
      doc: {
        name: 'test doc'
      }
    }
    expect(actions.initState({ name: 'test doc' })).toEqual(expectedAction)
  })

  test('should create an action to get document contents', () => {
    const expectedAction = {
      type: types.GET_DOCUMENT_CONTENTS_REQUEST,
      id: '1212'
    }

    expect(actions.getDocumentContentsRequest('1212')).toEqual(expectedAction)
  })

  test('should create an action to clear document', () => {
    const expectedAction = {
      type: types.CLEAR_DOCUMENT
    }

    expect(actions.clearDocument()).toEqual(expectedAction)
  })

  test('should create an action to enable edit document', () => {
    const expectedAction = {
      type: types.EDIT_DOCUMENT
    }

    expect(actions.editDocument()).toEqual(expectedAction)
  })

  test('should create an action to disable edit document', () => {
    const expectedAction = {
      type: types.CLOSE_EDIT
    }

    expect(actions.closeEdit()).toEqual(expectedAction)
  })

  test('should create an action to add a project or jurisdiction', () => {
    const expectedAction = {
      type: types.ADD_PRO_JUR,
      property: 'project',
      value: { name: 'project 1', id: 1 }
    }

    expect(actions.addProJur('project', { name: 'project 1', id: 1 })).toEqual(expectedAction)
  })

  test('should create an action to delete a project or jurisdiction', () => {
    const expectedAction = {
      type: types.DELETE_PRO_JUR,
      property: 'jurisdiction',
      value: 3
    }

    expect(actions.deleteProJur('jurisdiction', 3)).toEqual(expectedAction)
  })

  test('should create an action to update document property', () => {
    const expectedAction = {
      type: types.UPDATE_DOC_PROPERTY,
      property: 'status',
      value: 'Approved'
    }

    expect(actions.updateDocumentProperty('status', 'Approved')).toEqual(expectedAction)
  })

  test('should create an action to send a request to update document', () => {
    const expectedAction = {
      type: types.UPDATE_DOC_REQUEST,
      property: null,
      value: null
    }

    expect(actions.updateDocRequest(null, null)).toEqual(expectedAction)
  })

  test('should create an action to send a request to delete document', () => {
    const expectedAction = {
      type: types.DELETE_DOCUMENT_REQUEST,
      id: 4
    }

    expect(actions.deleteDocRequest(4)).toEqual(expectedAction)
  })
})
