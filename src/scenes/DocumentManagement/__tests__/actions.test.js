import actions, { types } from '../actions'

describe('Document management actions creators', () => {
  test('should create an action to get documents', () => {
    const expectedAction = {
      type: types.GET_DOCUMENTS_REQUEST
    }
    expect(actions.getDocumentsRequest()).toEqual(expectedAction)
  })
  
  test('should create an action to select all documents', () => {
    const expectedAction = {
      type: types.SELECT_ALL_DOCS
    }
    
    expect(actions.handleSelectAllDocs()).toEqual(expectedAction)
  })
  
  test('should create an action to change table page', () => {
    const expectedAction = {
      type: types.ON_PAGE_CHANGE,
      page: 1
    }
    
    expect(actions.handlePageChange(1)).toEqual(expectedAction)
  })
  
  test('should create an to change rows per page', () => {
    const expectedAction = {
      type: types.ON_ROWS_CHANGE,
      rowsPerPage: 15
    }
    
    expect(actions.handleRowsChange(15)).toEqual(expectedAction)
  })
  
  test('should create an action to select one file', () => {
    const expectedAction = {
      type: types.SELECT_ONE_DOC,
      id: '134354324526'
    }
    
    expect(actions.handleSelectOneDoc('134354324526')).toEqual(expectedAction)
  })
  
  test('should create an action to sort the documents', () => {
    const expectedAction = {
      type: types.SORT_DOCUMENTS,
      sortBy: 'name',
      sortDirection: 'desc'
    }
  
    expect(actions.handleSortRequest('name','desc')).toEqual(expectedAction)
  })
  
  test('should create an action to remove a project from selected document', () => {
    const expectedAction = {
      type: types.BULK_REMOVE_PROJECT_REQUEST,
      projectMeta: 1,
      selectedDocs: [1, 2]
    }
    expect(actions.handleBulkProjectRemove(1, [1, 2])).toEqual(expectedAction)
  })
  
  test('should create an action to toggle all docs', () => {
    const action = {
      type: types.ON_TOGGLE_ALL_DOCS
    }
    
    expect(actions.toggleAllDocs()).toEqual(action)
  })
})
