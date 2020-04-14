import actions, { types } from '../actions'

describe('Home actions creators', () => {
  test('should create an action to get projects', () => {
    const expectedAction = {
      type: types.GET_PROJECTS_REQUEST,
      payload: { searchValue: undefined }
    }
    expect(actions.getProjectsRequest({})).toEqual(expectedAction)
  })

  test('should create an action update projects', () => {
    const project = { name: 'Project 1' }
    const expectedAction = {
      type: types.UPDATE_PROJECT_REQUEST,
      project
    }

    expect(actions.updateProjectRequest(project)).toEqual(expectedAction)
  })

  test('should create an action to toggle bookmark', () => {
    const project = { id: 12345, name: 'project 1' }
    const expectedAction = {
      type: types.TOGGLE_BOOKMARK,
      project
    }

    expect(actions.toggleBookmark(project)).toEqual(expectedAction)
  })

  test('should create an action to sort projects', () => {
    const sortBy = 'name'
    const expectedAction = {
      type: types.SORT_PROJECTS,
      payload: { sortBy }
    }

    expect(actions.sortProjects(sortBy)).toEqual(expectedAction)
  })

  test('should create an action to update page number', () => {
    const page = 1
    const expectedAction = {
      type: types.UPDATE_PAGE,
      payload: { page }
    }

    expect(actions.updatePage(page)).toEqual(expectedAction)
  })

  test('should create an action to update rows per page', () => {
    const rowsPerPage = 5
    const expectedAction = {
      type: types.UPDATE_ROWS,
      payload: { rowsPerPage }
    }

    expect(actions.updateRows(rowsPerPage)).toEqual(expectedAction)
  })

  test('should create an action to toggle sort by bookmarked', () => {
    expect(actions.sortBookmarked(false)).toEqual({ type: types.SORT_BOOKMARKED, payload: { sortBookmarked: false } })
  })

  test('should create an action to update search value', () => {
    expect(actions.updateSearchValue('la')).toEqual({ type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'la' } })
  })

  test('should create an action delete project', () => {
    const project = { name: 'Project 1' }
    const expectedAction = {
      type: types.DELETE_PROJECT_REQUEST,
      project
    }

    expect(actions.deleteProjectRequest(project)).toEqual(expectedAction)
  })
  
  test('should create an action to export data', () => {
    const action = { type: types.EXPORT_DATA_REQUEST, exportType: 'numeric', user: null }
    expect(actions.exportDataRequest('numeric', null)).toEqual(action)
  })
  
  test('should create an action to clear project export dialog', () => {
    const action = { type: types.CLEAR_PROJECT_TO_EXPORT }
    expect(actions.clearProjectToExport()).toEqual(action)
  })
  
  test('should create an action to dismiss api alerts', () => {
    const action = { type: types.DISMISS_API_ERROR }
    expect(actions.dismissApiError()).toEqual(action)
  })
  
  test('should create an action to set project export dialog', () => {
    const action = { type: types.SET_PROJECT_TO_EXPORT, project: { id: 1, name: 'blep' } }
    expect(actions.setProjectToExport({ id: 1, name: 'blep' })).toEqual(action)
  })
})
