import { types } from '../actions'
import { types as codingTypes } from 'scenes/CodingValidation/actions'
import reducer, { INITIAL_STATE } from '../reducer'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

const documentPayload = [
  {
    name: 'document 1',
    _id: '1234',
    uploadedDate: new Date('12/10/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate: new Date('08/06/2019')
  },
  {
    name: 'document 2',
    _id: '5678',
    uploadedDate: new Date('12/09/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate: new Date('08/08/2019')
  },
  {
    name: 'document 3.docx',
    _id: '9101',
    uploadedDate: new Date('02/10/2018'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate: null
  }
]

const annotations = [
  { userId: 4, docId: '1234', isValidatorAnswer: false },
  { userId: 3, docId: '1234', isValidatorAnswer: false },
  { userId: 5, docId: '1234', isValidatorAnswer: true },
  { userId: 1, docId: '5678', isValidatorAnswer: false },
  { userId: 2, docId: '5678', isValidatorAnswer: false },
  { userId: 5, docId: '9101', isValidatorAnswer: true },
  { userId: 4, docId: '9101', isValidatorAnswer: false },
  { userId: 1, docId: '9101', isValidatorAnswer: false }
]

const users = [
  { userId: 1, isValidator: false, enabled: false },
  { userId: 2, isValidator: false, enabled: false },
  { userId: 3, isValidator: false, enabled: false },
  { userId: 4, isValidator: false, enabled: false },
  { userId: 5, isValidator: true, enabled: false }
]

const documents = {
  byId: {
    1234: { ...documentPayload[0], uploadedByName: 'test user', effectiveDate : new Date('08/06/2019') },
    5678: { ...documentPayload[1], uploadedByName: 'test user', effectiveDate : new Date('08/08/2019') },
    9101: { ...documentPayload[2], uploadedByName: 'test user', effectiveDate : null }
  },
  allIds: ['1234', '5678', '9101'],
  ordered: ['9101', '1234', '5678'],
  orderedEff: ['5678','1234','9101']
}

describe('CodingValidation - DocumentList reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })

  describe('GET_APPROVED_DOCUMENTS_REQUEST', () => {
    const action = {
      type: types.GET_APPROVED_DOCUMENTS_REQUEST
    }

    const state = reducer(getState(), action)
    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })

    test('should set state.enabledAnswerId to an empty string', () => {
      expect(state.enabledAnswerId).toEqual('')
    })

    test('should set state.annotationModeEnabled to false', () => {
      expect(state.annotationModeEnabled).toEqual(false)
    })
  })

  describe('GET_APPROVED_DOCUMENTS_SUCCESS', () => {
    const action = {
      type: types.GET_APPROVED_DOCUMENTS_SUCCESS,
      payload: documentPayload
    }

    describe('state.documents', () => {
      const state = reducer(getState(), action)

      test('should normalize action.payload into state.documents.byId', () => {
        expect(state.documents.byId).toEqual(documents.byId)
      })

      test('should put all ids into state.documents.allIds', () => {
        expect(state.documents.allIds).toEqual(documents.allIds)
      })

      // test('should order documents by uploaded date', () => {
      //   expect(state.documents.ordered).toEqual(documents.ordered)
      // })
      test('should order documents by effective date', () => {
        expect(state.documents.ordered).toEqual(documents.orderedEff)
      })
    })

    describe('opened / selected document', () => {
      test('should clear state.docSelected if current doc selected _id is not in action.payload', () => {
        const state = reducer(getState({ docSelected: true, openedDoc: { _id: '4444' } }), action)
        expect(state.docSelected).toEqual(false)
        expect(state.openedDoc).toEqual({})
      })

      test('should keep state.docSelected and state.openedDoc if _id is in action.payload', () => {
        const state = reducer(getState({ docSelected: true, openedDoc: { _id: '9101', content: {} } }), action)
        expect(state.docSelected).toEqual(true)
        expect(state.openedDoc).toEqual({ _id: '9101', content: {} })
      })
    })
  })

  describe('GET_APPROVED_DOCUMENTS_FAIL', () => {
    const action = { type: types.GET_APPROVED_DOCUMENTS_FAIL }
    const currentState = getState()
    const state = reducer(currentState, action)

    test('should set error information object', () => {
      expect(state.apiError.text).toEqual('We couldn\'t get the list of approved documents.')
      expect(state.apiError.title).toEqual('Request failed')
      expect(state.apiError.alertOrView).toEqual('view')
    })

    test('should display error', () => {
      expect(state.apiError.open).toEqual(true)
    })
  })

  describe('GET_DOC_CONTENTS_REQUEST', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_REQUEST,
      id: '1234'
    }

    const currentState = getState({ documents })

    test('should set state.openedDoc', () => {
      const state = reducer(currentState, action)
      expect(state.openedDoc).toEqual({
        _id: '1234',
        name: 'document 1'
      })
    })
  })

  describe('GET_DOC_CONTENTS_SUCCESS', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_SUCCESS,
      payload: { data: {} }
    }

    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
    const state = reducer(currentState, action)

    test('should set state.docSelected to true', () => {
      expect(state.docSelected).toEqual(true)
    })

    test('should add action.payload to state.openedDoc.content', () => {
      expect(state.openedDoc).toEqual({
        _id: '1234',
        name: 'document 1',
        content: { data: {} }
      })
    })

    test('should filter out annotations for the opened doc', () => {
      const currentState = getState({
        documents,
        openedDoc: { _id: '1234', name: 'document 1' },
        annotations: {
          all: annotations,
          filtered: []
        },
        annotationUsers: {
          all: users,
          filtered: []
        }
      })
      const state = reducer(currentState, action)
      expect(state.annotations.filtered).toEqual([
        { userId: 4, docId: '1234', isValidatorAnswer: false },
        { userId: 3, docId: '1234', isValidatorAnswer: false },
        { userId: 5, docId: '1234', isValidatorAnswer: true }
      ])
      expect(state.annotationUsers.filtered).toEqual([
        { userId: 4, isValidator: false },
        { userId: 3, isValidator: false },
        { userId: 5, isValidator: true }
      ])
    })
  })

  describe('GET_DOC_CONTENTS_FAIL', () => {
    const action = {
      type: types.GET_DOC_CONTENTS_FAIL
    }

    const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
    const state = reducer(currentState, action)

    test('should set state.docSelected to true', () => {
      expect(state.docSelected).toEqual(true)
    })

    test('should set error information', () => {
      expect(state.apiError.title).toEqual('')
      expect(state.apiError.text).toEqual('We couldn\'t get the document contents.')
      expect(state.apiError.alertOrView).toEqual('view')
    })

    test('should display error', () => {
      expect(state.apiError.open).toEqual(true)
    })
  })

  describe('CLEAR_DOC_SELECTED', () => {
    const action = { type: types.CLEAR_DOC_SELECTED }
    const currentState = getState({
      documents,
      openedDoc: { _id: '1234', name: 'document 1' },
      apiErrorInfo: { title: 'title', text: 'text' },
      apiErrorOpen: true
    })
    const state = reducer(currentState, action)

    test('should clear state.openedDoc', () => {
      expect(state.openedDoc).toEqual({})
    })

    test('should set state.docSelected to false', () => {
      expect(state.docSelected).toEqual(false)
    })

    test('should clear error information', () => {
      expect(state.apiError.text).toEqual('')
      expect(state.apiError.title).toEqual('')
    })

    test('should set hide error', () => {
      expect(state.apiError.open).toEqual(false)
    })
  })

  describe('TOGGLE_ANNOTATION_MODE', () => {
    describe('toggling on annotation mode', () => {
      const action = {
        type: types.TOGGLE_ANNOTATION_MODE,
        enabled: true,
        answerId: 4,
        questionId: 3,
        annotations,
        users
      }
      const currentState = getState({ currentAnnotationIndex: 10 })
      const state = reducer(currentState, action)

      test('should set state.enabledAnswerId to action.answerId', () => {
        expect(state.enabledAnswerId).toEqual(4)
      })

      test('should set annotations', () => {
        expect(state.annotations.all).toEqual(annotations)
      })

      test('should update the visible annotations if a document is opened', () => {
        const currentState = getState({ currentAnnotationIndex: 0, openedDoc: { _id: '5678' }, docSelected: true })
        const state = reducer(currentState, action)
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '5678', isValidatorAnswer: false },
          { userId: 2, docId: '5678', isValidatorAnswer: false }
        ])
      })

      test('should set annotation users', () => {
        expect(state.annotationUsers.all).toEqual(users)
      })

      test('should set state.annotationModeEnabled to true', () => {
        expect(state.annotationModeEnabled).toEqual(true)
      })

      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })

      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })

    describe('toggling off annotation mode', () => {
      const action = {
        type: types.TOGGLE_ANNOTATION_MODE,
        enabled: false,
        answerId: 4,
        questionId: 3,
        annotations: [],
        users: []
      }
      const currentState = getState({ currentAnnotationIndex: 10 })
      const state = reducer(currentState, action)

      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })

      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })

      test('should set state.annotations to an empty array', () => {
        expect(state.annotations.all).toEqual([])
        expect(state.annotations.filtered).toEqual([])
      })

      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })

      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
  })

  describe('TOGGLE_CODER_ANNOTATIONS', () => {
    describe('when toggling on annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        isUserAnswerSelected: false
      }

      const currentState = getState({
        enabledAnswerId: 4,
        annotations: {
          all: annotations,
          filtered: annotations
        },
        annotationUsers: {
          all: users,
          filtered: users
        },
        openedDoc: {
          _id: '9101'
        }
      })
      const state = reducer(currentState, action)

      test('should set whether the current user or validator answer is selected ', () => {
        expect(state.isUserAnswerSelected).toEqual(false)
      })

      test('should set state.enabledUserId to action.enabledUserId', () => {
        expect(state.enabledUserId).toEqual(1)
      })

      test('should filter annotations for selected user', () => {
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '9101', isValidatorAnswer: false }
        ])
      })

      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })

    describe('when toggle \'all\' annotations', () => {
      const action = {
        type: types.TOGGLE_CODER_ANNOTATIONS,
        answerId: 4,
        userId: 'All',
        isUserAnswerSelected: false
      }

      const currentState = getState({
        enabledAnswerId: 4,
        enabledUserId: 1,
        isUserAnswerSelected: false,
        openedDoc: {
          _id: '5678',
          content: {}
        },
        annotations: {
          all: annotations,
          filtered: [{ docId: '5678', userId: 1 }]
        },
        annotationUsers: {
          all: users,
          filtered: [
            { userId: 1, isValidator: false, enabled: true },
            { userId: 2, isValidator: false, enabled: false }
          ]
        }
      })

      const state = reducer(currentState, action)

      test('should scroll to top', () => {
        expect(state.scrollTop).toEqual(true)
      })

      test('should set user id to all', () => {
        expect(state.enabledUserId).toEqual('All')
      })

      test('should set filtered annotations to all for opened document', () => {
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '5678', isValidatorAnswer: false },
          { userId: 2, docId: '5678', isValidatorAnswer: false }
        ])
      })

      test('should set disable all avatars for users for opened document', () => {
        expect(state.annotationUsers.filtered).toEqual([
          { userId: 1, isValidator: false, enabled: false },
          { userId: 2, isValidator: false, enabled: false }
        ])
      })

      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })
  })

  describe('TOGGLE_VIEW_ANNOTATIONS', () => {
    describe('when turning off view', () => {
      const action = {
        type: types.TOGGLE_VIEW_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        annotations: [],
        users: []
      }

      const currentState = getState({
        enabledAnswerId: 4,
        enabledUserId: 1,
        isUserAnswerSelected: true,
        openedDoc: {
          _id: '1234',
          content: {}
        },
        annotations: {
          all: annotations,
          filtered: [{ docId: '5678', userId: 1 }]
        },
        annotationUsers: {
          all: users,
          filtered: [{ userId: 1, isValidator: false }]
        }
      })

      const state = reducer(currentState, action)

      test('should clear state.enabledAnswerId', () => {
        expect(state.enabledAnswerId).toEqual('')
      })

      test('should clear selected user id', () => {
        expect(state.enabledUserId).toEqual('')
      })

      test('should set state.annotationModeEnabled to false', () => {
        expect(state.annotationModeEnabled).toEqual(false)
      })

      test('should clear annotations', () => {
        expect(state.annotations.all).toEqual([])
        expect(state.annotations.filtered).toEqual([])
      })

      test('should clear annotation users', () => {
        expect(state.annotationUsers.all).toEqual([])
        expect(state.annotationUsers.filtered).toEqual([])
      })

      test('should set state.enabledUserId to an empty string', () => {
        expect(state.enabledUserId).toEqual('')
      })

      test('should reset current annotation index to 0', () => {
        expect(state.currentAnnotationIndex).toEqual(0)
      })
    })

    describe('when turning on view', () => {
      const action = {
        type: types.TOGGLE_VIEW_ANNOTATIONS,
        answerId: 4,
        userId: 1,
        annotations,
        users
      }

      const currentState = getState()
      const state = reducer(currentState, action)

      test('should show annotations for selected answer id', () => {
        expect(state.enabledAnswerId).toEqual(4)
      })

      test('should show all users annotations by default', () => {
        expect(state.enabledUserId).toEqual('All')
      })

      test('should include all annotations if no doc is selected', () => {
        expect(state.annotations.all).toEqual(annotations)
        expect(state.annotations.filtered).toEqual(annotations)
      })

      test('should include all users if no doc is selected', () => {
        expect(state.annotationUsers.all).toEqual(users)
        expect(state.annotationUsers.filtered).toEqual(users)
      })

      test('should only show annotations for document if doc is selected', () => {
        const currentState = getState({ openedDoc: { _id: '5678' }, docSelected: true })
        const state = reducer(currentState, action)
        expect(state.annotations.filtered).toEqual([
          { userId: 1, docId: '5678', isValidatorAnswer: false },
          { userId: 2, docId: '5678', isValidatorAnswer: false }
        ])
      })

      test('should only show users who annotated on document if doc is selected', () => {
        const currentState = getState({ openedDoc: { _id: '5678' }, docSelected: true })
        const state = reducer(currentState, action)
        expect(state.annotationUsers.filtered).toEqual([
          { userId: 1, isValidator: false, enabled: false },
          { userId: 2, isValidator: false, enabled: false }
        ])
      })
    })
  })

  describe('TOGGLE_OFF_VIEW', () => {
    const action = { type: types.TOGGLE_OFF_VIEW }
    const currentState = getState({
      enabledAnswerId: 4,
      enabledUserId: 1,
      currentAnnotationIndex: 4,
      annotations: {
        all: annotations,
        filtered: [{ docId: '5678', userId: 1 }]
      },
      annotationUsers: {
        all: users,
        filtered: [{ userId: 1, isValidator: false }]
      }
    })
    const state = reducer(currentState, action)

    test('should clear all annotations when the user disables viewing annotations', () => {
      expect(state.annotations).toEqual({
        all: [],
        filtered: []
      })
      expect(state.annotationUsers).toEqual({
        all: [],
        filtered: []
      })
    })

    test('should reset the current annotation for the finder', () => {
      expect(state.currentAnnotationIndex).toEqual(0)
    })
  })

  describe('UPDATE_ANNOTATIONS', () => {
    const action = {
      type: types.UPDATE_ANNOTATIONS,
      enabled: true,
      answerId: 4,
      questionId: 3,
      annotations,
      users
    }

    const currentState = getState({ currentAnnotationIndex: 10 })
    const state = reducer(currentState, action)

    test('should update annotations', () => {
      expect(state.annotations.all).toEqual(annotations)
    })

    test('should update the visible annotations if a document is opened', () => {
      const currentState = getState({ currentAnnotationIndex: 0, openedDoc: { _id: '5678' }, docSelected: true })
      const state = reducer(currentState, action)
      expect(state.annotations.filtered).toEqual([
        { userId: 1, docId: '5678', isValidatorAnswer: false },
        { userId: 2, docId: '5678', isValidatorAnswer: false }
      ])
    })

    test('should update annotation users', () => {
      expect(state.annotationUsers.all).toEqual(users)
    })
  })

  describe('HIDE_ANNO_MODE_ALERT', () => {
    test('should not show the alert again if the user checks the box', () => {
      const action = { type: types.HIDE_ANNO_MODE_ALERT }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.shouldShowAnnoModeAlert).toEqual(false)
    })
  })

  describe('CHANGE_ANNOTATION_INDEX', () => {
    const action = { type: types.CHANGE_ANNOTATION_INDEX, index: 10 }
    const currentState = getState()
    const state = reducer(currentState, action)

    test('should change current annotation index to number passed', () => {
      expect(state.currentAnnotationIndex).toEqual(10)
    })
  })

  describe('GET_QUESTION_SUCCESS', () => {
    describe('when the user changes questions', () => {
      const action = { type: codingTypes.GET_QUESTION_SUCCESS }
      const currentState = getState({
        enabledAnswerId: 4,
        enabledUserId: 1,
        isUserAnswerSelected: true,
        openedDoc: {
          _id: '1234',
          content: {}
        },
        annotations: {
          all: annotations,
          filtered: [{ docId: '5678', userId: 1 }]
        },
        annotationUsers: {
          all: users,
          filtered: [{ userId: 1, isValidator: false }]
        }
      })
      const state = reducer(currentState, action)

      test('should clear out any saved annotations', () => {
        expect(state.annotations).toEqual({
          all: [],
          filtered: []
        })
        expect(state.annotationUsers).toEqual({
          all: [],
          filtered: []
        })
      })

      test('should turn off all annotation mode', () => {
        expect(state.enabledUserId).toEqual('')
        expect(state.enabledAnswerId).toEqual('')
        expect(state.isUserAnswerSelected).toEqual(false)
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('shdould set state to initial state', () => {
      const action = { type: types.FLUSH_STATE }
      const currentState = getState({ documents, openedDoc: { _id: '1234', name: 'document 1' } })
      const state = reducer(currentState, action)
      expect(state).toEqual(INITIAL_STATE)
    })

    test('should overwrite showing annotation alert if the action is not logout', () => {
      const action = { type: types.FLUSH_STATE, isLogout: true }
      const currentState = getState({
        documents,
        openedDoc: { _id: '1234', name: 'document 1' },
        shouldShowAnnoModeAlert: false
      })
      const state = reducer(currentState, action)
      expect(state.shouldShowAnnoModeAlert).toEqual(true)
    })
  })

  describe('RESET_SCROLL_TOP', () => {
    test('should set that the document should not scroll to the top', () => {
      const action = { type: types.RESET_SCROLL_TOP }
      const currentState = getState({ scrollTop: true })
      const state = reducer(currentState, action)
      expect(state.scrollTop).toEqual(false)
    })
  })

  describe('DOWNLOAD_DOCUMENTS_REQUEST', () => {
    test('should set that a request is in progress', () => {
      const action = { type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 'all' }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.downloading.id).toEqual('all')
    })

    test('should not set the document name if the user is downloading all', () => {
      const action = { type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 'all' }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.downloading.name).toEqual('')
    })

    test('should remove the extension and add .pdf from the document name if the user is downloading just one', () => {
      const action = { type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 9101 }
      const currentState = getState({ documents })
      const state = reducer(currentState, action)
      expect(state.downloading.name).toEqual('document 3.pdf')
    })
  })

  describe('DOWNLOAD_DOCUMENTS_SUCCESS', () => {
    test('should set the content of the document', () => {
      const action = { type: types.DOWNLOAD_DOCUMENTS_SUCCESS, payload: 'doc content' }
      const currentState = getState({ documents, downloading: { id: 'all', name: '', content: '' } })
      const state = reducer(currentState, action)
      expect(state.downloading.content).toEqual('doc content')
    })
  })

  describe('DOWNLOAD_DOCUMENTS_FAIL', () => {
    const action = { type: types.DOWNLOAD_DOCUMENTS_FAIL, payload: 'failed' }
    const currentState = getState({ documents, downloading: { id: 'all', name: '', content: '' } })
    const state = reducer(currentState, action)

    test('should show an alert to the user with the error', () => {
      expect(state.apiError.text).toEqual('failed')
      expect(state.apiError.alertOrView).toEqual('alert')
      expect(state.apiError.open).toEqual(true)
      expect(state.apiError.title).toEqual('')
    })

    test('should clear any download document information', () => {
      expect(state.downloading).toEqual({
        name: '',
        content: '',
        id: ''
      })
    })
  })

  describe('CLEAR_DOWNLOAD', () => {
    const action = { type: types.CLEAR_DOWNLOAD }
    const currentState = getState({ documents, downloading: { id: 'all', name: '', content: '' } })
    const state = reducer(currentState, action)

    test('should clear any download document information', () => {
      expect(state.downloading).toEqual({
        name: '',
        content: '',
        id: ''
      })
    })
  })

  describe('CLEAR_API_ERROR', () => {
    const action = { type: types.CLEAR_API_ERROR }
    const currentState = getState({ apiError: { open: true, text: 'error', title: '', alertOrView: 'alert' } })
    const state = reducer(currentState, action)

    test('should close the api error or alert', () => {
      expect(state.apiError.open).toEqual(false)
    })
  })
})
