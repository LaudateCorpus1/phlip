import { types } from '../actions'
import { docManagementReducer as reducer, INITIAL_STATE as initial } from '../reducer'
import { mockDocuments, orderedByNameDesc, orderedByNameAsc, orderedByDate } from 'utils/testData/documents'

const byId = mockDocuments.byId

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('GET_DOCUMENTS_REQUEST', () => {
    test('should update getDocumentsInProgress flag', () => {
      const action = {
        type: types.GET_DOCUMENTS_REQUEST
      }
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      expect(updatedState.getDocumentsInProgress).toBeTruthy()
    })
  })
  
  describe('GET_DOCUMENTS_SUCCESS', () => {
    test('should normalize action.payload into the documents object in state', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.byId).toEqual({
        '12345': {
          name: 'Doc 1',
          _id: '12345',
          uploadedBy: { firstName: 'test', lastName: 'user', id: 1 }
        },
        '54321': {
          name: 'Doc 2',
          _id: '54321',
          uploadedBy: { firstName: 'test', lastName: 'user', id: 4 }
        }
      })
      
      expect(updatedState.documents.allIds).toEqual(['12345', '54321'])
    })
    
    test('should only show documents uploaded by current user', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState({ rowsPerPage: '2' })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.visible).toEqual(['54321'])
    })
    
    test('should set user docs', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState({ rowsPerPage: '2' })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.userDocs).toEqual(['54321'])
    })
    
    test('should clear showing all documents', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState({ showAll: true })
      const state = reducer(currentState, action)
      expect(state.showAll).toEqual(false)
    })
    
    test('should clear checked documents', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState({ documents: { checked: ['09876'] } })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.checked).toEqual([])
    })
    
    test('should handle if state.rowsPerPage === All', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: {
          documents: [
            { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } },
            { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
          ],
          userId: 4
        }
      }
      
      const currentState = getState({
        rowsPerPage: 'All'
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible.length).toEqual(2)
    })
  })
  
  describe('GET_DOCUMENTS_FAIL', () => {
    test('should set pageError', () => {
      const action = { type: types.GET_DOCUMENTS_FAIL }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.pageError).toEqual('We couldn\'t retrieve the list of documents.')
    })
  })
  
  describe('ON_TOGGLE_ALL_DOCS', () => {
    test('should show all documents if toggling on', () => {
      const action = { type: types.ON_TOGGLE_ALL_DOCS, payload: [] }
      const currentState = getState()
      const state = reducer(currentState, action)
      
      expect(state.showAll).toEqual(true)
    })
    
    test('should show all user docs if toggling off', () => {
      const action = { type: types.ON_TOGGLE_ALL_DOCS, payload: [] }
      const currentState = getState({ showAll: true })
      const state = reducer(currentState, action)
      
      expect(state.showAll).toEqual(false)
    })
    
    test('should reset to page one of the list', () => {
      const action = { type: types.ON_TOGGLE_ALL_DOCS, payload: [] }
      const currentState = getState({ showAll: true, page: 5 })
      const state = reducer(currentState, action)
      
      expect(state.page).toEqual(0)
    })
    
    test('should sort and slice the documents based on user filter', () => {
      const action = {
        type: types.ON_TOGGLE_ALL_DOCS,
        payload: [
          { name: 'bobo', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user', id: 1 } },
          { name: 'alice', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user', id: 4 } }
        ]
      }
      const currentState = getState({ showAll: true, sortBy: 'name', sortDirection: 'asc' })
      const state = reducer(currentState, action)
      
      expect(state.documents.visible).toEqual(['54321', '12345'])
    })
  })
  
  describe('ON_PAGE_CHANGE', () => {
    test('should update page property in state', () => {
      const action = { type: types.ON_PAGE_CHANGE, page: 1, payload: Object.values(mockDocuments.byId) }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.page).toEqual(1)
    })
    
    test('should update documents.visible to show selected page of documents', () => {
      const action = { type: types.ON_PAGE_CHANGE, page: 1, payload: Object.values(mockDocuments.byId) }
      
      const currentState = getState({
        documents: mockDocuments,
        rowsPerPage: '2'
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['6', '7'])
    })
  })
  
  describe('ON_ROWS_CHANGE', () => {
    test('should update rowsPerPage property in state', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: '4', payload: Object.values(mockDocuments.byId) }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.rowsPerPage).toEqual('4')
    })
    
    test('should update documents.visible to show new # of rows per page', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: '5', payload: Object.values(mockDocuments.byId) }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['4', '1', '6', '7', '2'])
    })
    
    test('should handle All rowsPerPage option', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: 'All', payload: Object.values(mockDocuments.byId) }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.visible).toEqual(orderedByDate)
    })
  })
  
  describe('SELECT_ALL_DOCS', () => {
    test('should update allSelect property to false if state.allSelected === true', () => {
      const action = { type: types.SELECT_ALL_DOCS }
      
      const currentState = getState({ allSelected: true })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.allSelected).toEqual(false)
    })
    
    test('should update allSelect property to true if state.allSelected === false', () => {
      const action = { type: types.SELECT_ALL_DOCS }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.allSelected).toEqual(true)
    })
    
    test('should add all document ids to the documents.checked if state.allSelected === false', () => {
      const action = { type: types.SELECT_ALL_DOCS }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.checked).toEqual([
        '4',
        '1'
      ])
    })
    
    test('should remove all document ids from documents.checked if state.allSelected === true', () => {
      const action = { type: types.SELECT_ALL_DOCS }
      
      const currentState = getState({
        allSelected: true,
        documents: { checked: ['1', '2', '3', '4', '5', '6', '7'] }
      })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.checked).toEqual([])
    })
  })
  
  describe('SELECT_ONE_DOC', () => {
    test('should add the action.id to documents.checked if it doesn\'t already exist', () => {
      const action = { type: types.SELECT_ONE_DOC, id: '5' }
      
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.checked).toEqual(['5'])
    })
    
    test('should remove the id that matches action.id if documents.checked already contains action.id', () => {
      const action = { type: types.SELECT_ONE_DOC, id: '5' }
      
      const currentState = getState({ documents: { checked: ['4', '5', '6'] } })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.checked).toEqual(['4', '6'])
    })
  })
  
  describe('UPLOAD_ONE_DOC_COMPLETE', () => {
    test('should add the new doc to the global list if it didn\'t fail', () => {
      const action = {
        type: types.UPLOAD_ONE_DOC_COMPLETE,
        payload: {
          doc:
            {
              name: 'new doc 1',
              _id: '24',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user'
            }
        }
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.byId).toEqual({
        ...mockDocuments.byId,
        '24': {
          name: 'new doc 1',
          _id: '24',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          uploadedByName: 'test user'
        }
      })
      
      expect(updatedState.documents.allIds).toEqual([
        ...mockDocuments.allIds,
        '24'
      ])
    })
    
    test('should not add a document that failed to upload', () => {
      const action = {
        type: types.UPLOAD_ONE_DOC_COMPLETE,
        payload: {
          doc:
            {
              name: 'new doc 1',
              _id: '24',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user'
            },
          failed: true
        }
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState.documents.byId.hasOwnProperty('24')).toEqual(false)
      expect(updatedState.documents.allIds.includes('24')).toEqual(false)
    })
  })
  
  describe('SEARCH_VALUE_CHANGE', () => {
    test('should update visible documents based on user preferences (rows, page, etc.)', () => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        payload: [byId[2], byId[3], byId[5], byId[7]]
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['7', '2', '5', '3'])
    })
    
    test('should clear matches if the user clears their search', () => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        payload: [byId[2], byId[3], byId[5], byId[7]],
        value: ''
      }
  
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.matches).toEqual([])
    })
  })
  
  describe('BULK_DELETE_REQUEST', () => {
    const action = {
      type: types.BULK_DELETE_REQUEST
    }
    const currentState = getState({ documents: mockDocuments })
    const state = reducer(currentState, action)
    
    test('should set that a bulk operation is happening', () => {
      expect(state.bulkOperationInProgress).toEqual(true)
    })
  })
  
  describe('BULK_UPDATE_REQUEST', () => {
    const action = {
      type: types.BULK_UPDATE_REQUEST
    }
    const currentState = getState({ documents: mockDocuments })
    const state = reducer(currentState, action)
  
    test('should set that a bulk operation is happening', () => {
      expect(state.bulkOperationInProgress).toEqual(true)
    })
  })
  
  describe('BULK_REMOVE_PROJECT_REQUEST', () => {
    const action = {
      type: types.BULK_REMOVE_PROJECT_REQUEST
    }
    const currentState = getState({ documents: mockDocuments })
    const state = reducer(currentState, action)
  
    test('should set that a bulk operation is happening', () => {
      expect(state.bulkOperationInProgress).toEqual(true)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('should reset state to initial', () => {
      const action = {
        type: types.FLUSH_STATE
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      
      expect(updatedState).toEqual(initial)
    })
  })
  
  describe('CLOSE_ALERT', () => {
    const action = { type: types.CLOSE_ALERT }
    const currentState = getState({
      apiErrorInfo: {
        text: 'error',
        title: 'error'
      },
      apiErrorOpen: true
    })
    const state = reducer(currentState, action)
    
    test('should clear all alert information', () => {
      expect(state.apiErrorInfo).toEqual({
        text: '',
        title: ''
      })
    })
    
    test('should hide alert', () => {
      expect(state.apiErrorOpen).toEqual(false)
    })
  })
  
  describe('SORT_DOCUMENTS', () => {
    test('should sort documents by name ascending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection: 'asc', payload: Object.values(mockDocuments.byId)
      }
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameAsc)
    })
    
    test('should sort documents by name descending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection: 'desc', payload: Object.values(mockDocuments.byId)
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameDesc)
    })
  })
})
