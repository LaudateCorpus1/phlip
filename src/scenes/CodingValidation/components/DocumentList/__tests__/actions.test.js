import actions, { types } from '../actions'

describe('CodingValidation - DocumentList action creators', () => {
  test('should create an action to get approved documents', () => {
    const expectedAction = {
      type: types.GET_APPROVED_DOCUMENTS_REQUEST,
      projectId: 1,
      jurisdictionId: 32,
      page: 'coding'
    }

    expect(actions.getApprovedDocumentsRequest(1, 32, 'coding')).toEqual(expectedAction)
  })

  test('should create an action to clear selected / enabled document', () => {
    const expectedAction = {
      type: types.CLEAR_DOC_SELECTED
    }

    expect(actions.clearDocSelected()).toEqual(expectedAction)
  })

  test('should create an action to get document contents', () => {
    const expectedAction = {
      type: types.GET_DOC_CONTENTS_REQUEST,
      id: 123123
    }

    expect(actions.getDocumentContentsRequest(123123)).toEqual(expectedAction)
  })

  test('should create an action to save the annotation', () => {
    const expectedAction = {
      type: types.ON_SAVE_ANNOTATION,
      annotation: { text: 'test annotation' },
      answerId: 4,
      questionId: 3
    }

    expect(actions.saveAnnotation({ text: 'test annotation' }, 4, 3)).toEqual(expectedAction)
  })

  test('should create an action to remove the annotation', () => {
    const expectedAction = {
      type: types.ON_REMOVE_ANNOTATION,
      index: 4,
      answerId: 4,
      questionId: 3
    }

    expect(actions.removeAnnotation(4, 4, 3)).toEqual(expectedAction)
  })

  test('should create an action to toggle annotation mode', () => {
    const expectedAction = {
      type: types.TOGGLE_ANNOTATION_MODE,
      questionId: 3,
      answerId: 4,
      enabled: true
    }

    expect(actions.toggleAnnotationMode(3, 4, true)).toEqual(expectedAction)
  })
  
  test('should create an action toggle view mode for annotations', () => {
    const expectedAction = {
      type: types.TOGGLE_VIEW_ANNOTATIONS,
      questionId: 3,
      answerId: 4,
      users: []
    }
  
    expect(actions.toggleViewAnnotations(3, 4, [])).toEqual(expectedAction)
  })
  
  test('should create an action to change current annotation index', () => {
    const expectedAction = {
      type: types.CHANGE_ANNOTATION_INDEX,
      index: 42
    }
    
    expect(actions.changeAnnotationIndex(42)).toEqual(expectedAction)
  })
  
  test('should create an action to download documents', () => {
    const expected = { type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 'all' }
    expect(actions.downloadDocumentsRequest('all')).toEqual(expected)
  })
})
