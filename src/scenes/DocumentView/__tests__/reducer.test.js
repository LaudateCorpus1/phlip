import { docViewReducer as reducer, INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

const sampleDocument = {
  name: 'document',
  id: 5,
  projects: [1, 2],
  jurisdictions: [3, 4],
  status: 'Draft',
  content: {}
}

describe('DocumentView reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('INIT_STATE_WITH_DOC', () => {
    test('should set state.document to action.doc', () => {
      const action = {
        type: types.INIT_STATE_WITH_DOC,
        doc: {
          name: 'doc',
          id: 4
        }
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.document).toEqual({
        name: 'doc',
        id: 4,
        content: {}
      })
    })
  })

  describe('GET_DOCUMENT_CONTENTS_REQUEST', () => {
    test('should set state.documentRequestInProgress to true', () => {
      const action = {
        type: types.GET_DOCUMENT_CONTENTS_REQUEST
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documentRequestInProgress).toEqual(true)
    })
  })

  describe('EDIT_DOCUMENT', () => {
    const action = {
      type: types.EDIT_DOCUMENT
    }

    const currentState = getState({
      document: sampleDocument
    })

    const updatedState = reducer(currentState, action)

    test('should set state.documentForm to state.document', () => {
      expect(updatedState.documentForm).toEqual(sampleDocument)
    })

    test('should set state.inEditMode to true', () => {
      expect(updatedState.inEditMode).toEqual(true)
    })
  })

  describe('CLOSE_EDIT', () => {
    const action = {
      type: types.CLOSE_EDIT
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: sampleDocument
    })

    const updatedState = reducer(currentState, action)

    test('should set state.documentForm to an empty object', () => {
      expect(updatedState.documentForm).toEqual({})
    })

    test('should set state.inEditMode to false', () => {
      expect(updatedState.inEditMode).toEqual(false)
    })
  })

  describe('GET_DOCUMENT_CONTENTS_SUCCESS', () => {
    const action = {
      type: types.GET_DOCUMENT_CONTENTS_SUCCESS,
      payload: {
        data: [11111]
      }
    }

    const currentState = getState({
      document: sampleDocument
    })

    const updatedState = reducer(currentState, action)

    test('should set state.document.content to action.payload', () => {
      expect(updatedState.document.content).toEqual({ data: [11111] })
    })

    test('should set state.documentRequestInProgress to false', () => {
      expect(updatedState.documentRequestInProgress).toEqual(false)
    })
  })

  describe('ADD_PRO_JUR', () => {
    describe('action.property === projects', () => {
      const action = {
        type: types.ADD_PRO_JUR,
        property: 'projects',
        value: { name: 'new project', id: 5 }
      }

      const currentState = getState({
        document: sampleDocument,
        documentForm: sampleDocument
      })

      const updatedState = reducer(currentState, action)

      test('should add a project to documentForm.projects', () => {
        expect(updatedState.documentForm.projects).toEqual([1, 2, 5])
      })

      test('should not update state.document', () => {
        expect(updatedState.document).toEqual(sampleDocument)
      })
    })

    describe('action.property === jurisdictions', () => {
      const action = {
        type: types.ADD_PRO_JUR,
        property: 'jurisdictions',
        value: { name: 'florida', id: 10 }
      }

      const currentState = getState({
        document: sampleDocument,
        documentForm: sampleDocument
      })

      const updatedState = reducer(currentState, action)

      test('should add a jurisdiction to documentForm.jursidictions', () => {
        expect(updatedState.documentForm.jurisdictions).toEqual([3, 4, 10])
      })

      test('should not update state.document', () => {
        expect(updatedState.document).toEqual(sampleDocument)
      })
    })
  })

  describe('DELETE_PRO_JUR', () => {
    describe('action.property === projects', () => {
      const action = {
        type: types.DELETE_PRO_JUR,
        property: 'projects',
        value: { name: 'new project', id: 2 }
      }

      const currentState = getState({
        document: sampleDocument,
        documentForm: sampleDocument
      })

      const updatedState = reducer(currentState, action)

      test('should delete action.value.id from documentForm.projects', () => {
        expect(updatedState.documentForm.projects).toEqual([1])
      })

      test('should not update state.document', () => {
        expect(updatedState.document).toEqual(sampleDocument)
      })
    })

    describe('action.property === jurisdictions', () => {
      const action = {
        type: types.DELETE_PRO_JUR,
        property: 'jurisdictions',
        value: { name: 'florida', id: 4 }
      }

      const currentState = getState({
        document: sampleDocument,
        documentForm: sampleDocument
      })

      const updatedState = reducer(currentState, action)

      test('should delete action.value.id from documentForm.jursidictions', () => {
        expect(updatedState.documentForm.jurisdictions).toEqual([3])
      })

      test('should not update state.document', () => {
        expect(updatedState.document).toEqual(sampleDocument)
      })
    })

  })

  describe('UPDATE_DOC_PROPERTY', () => {
    const action = {
      type: types.UPDATE_DOC_PROPERTY,
      property: 'status',
      value: 'Approved'
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: sampleDocument
    })
    const updatedState = reducer(currentState, action)

    test('should set state.documentForm[property] to action.value', () => {
      expect(updatedState.documentForm.status).toEqual('Approved')
    })

    test('should not update state.document', () => {
      expect(updatedState.document).toEqual(sampleDocument)
    })
  })

  describe('UPDATE_DOC_REQUEST', () => {
    const action = {
      type: types.UPDATE_DOC_REQUEST
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: sampleDocument
    })

    const updatedState = reducer(currentState, action)

    test('should set state.documentUpdateInProgress to true', () => {
      expect(updatedState.documentUpdateInProgress).toEqual(true)
    })
  })

  describe('UPDATE_DOC_SUCCESS', () => {
    const action = {
      type: types.UPDATE_DOC_SUCCESS
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: {
        ...sampleDocument,
        projects: [1, 2, 10],
        jurisdictions: [3, 4, 7]
      },
      documentUpdateInProgress: true,
      inEditMode: true
    })

    const updatedState = reducer(currentState, action)

    test('should set state.documentUpdateInProgress to false', () => {
      expect(updatedState.documentUpdateInProgress).toEqual(false)
    })

    test('should set state.document to state.documentForm', () => {
      expect(updatedState.document).toEqual({
        ...sampleDocument,
        projects: [1, 2, 10],
        jurisdictions: [3, 4, 7]
      })
    })

    test('should set state.documentForm to an empty object', () => {
      expect(updatedState.documentForm).toEqual({})
    })

    test('should set state.inEditMode to false', () => {
      expect(updatedState.inEditMode).toEqual(false)
    })
  })

  describe('CLEAR_DOCUMENT', () => {
    const action = {
      type: types.CLEAR_DOCUMENT
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: {
        ...sampleDocument,
        projects: [1, 2, 10],
        jurisdictions: [3, 4, 7]
      },
      documentUpdatingInProgress: true,
      inEditMode: true
    })

    const updatedState = reducer(currentState, action)
    test('should set state.document to initial object object', () => {
      expect(updatedState.document).toEqual({
        projects: [],
        jurisdictions: [],
        content: {}
      })
    })

    test('should set state.documentForm to an empty object', () => {
      expect(updatedState.documentForm).toEqual({})
    })

    test('should set state.inEditMode to false', () => {
      expect(updatedState.inEditMode).toEqual(false)
    })
  })

  describe('DELETE_DOCUMENT_REQUEST', () => {
    const action = {
      type: types.DELETE_DOCUMENT_REQUEST
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: sampleDocument
    })

    const updatedState = reducer(currentState, action)

    test('should set state.documentDeleteInProgress to true', () => {
      expect(updatedState.documentDeleteInProgress).toEqual(true)
    })
  })

  describe('DELETE_DOCUMENT_SUCCESS', () => {
    const action = {
      type: types.DELETE_DOCUMENT_SUCCESS
    }

    const currentState = getState({
      document: sampleDocument,
      documentForm: {
        ...sampleDocument,
        projects: [1, 2, 10],
        jurisdictions: [3, 4, 7]
      },
      documentDeleteInProgress: true,
      inEditMode: true
    })

    const updatedState = reducer(currentState, action)
    test('should set state.documentDeleteInProgress to false', () => {
      expect(updatedState.documentDeleteInProgress).toEqual(false)
    })
    test('should set state.documentDeleteError to false', () => {
      expect(updatedState.documentDeleteError).toEqual(false)
    })

  })
})
