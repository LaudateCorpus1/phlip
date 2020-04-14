import { types } from '../actions'
import { mainReducer as reducer, INITIAL_STATE as initial } from '../reducer'
import { types as projectTypes } from 'data/projects/actions'

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Home reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('SET_PROJECTS', () => {
    const currentState = getState()
    const state = reducer(
      currentState,
      {
        type: projectTypes.SET_PROJECTS,
        payload: {
          projects: {
            visible: [1, 2],
            matches: []
          },
          bookmarkList: [],
          error: false,
          errorContent: '',
          searchValue: ''
        }
      }
    )
    
    test('it should set projects', () => {
      expect(state.projects).toEqual({
        visible: [1, 2],
        matches: []
      })
    })
    
    test('should set the rest of the payload items', () => {
      expect(state.bookmarkList).toEqual([])
      expect(state.error).toEqual(false)
      expect(state.errorContent).toEqual('')
      expect(state.searchValue).toEqual('')
    })
  })
  
  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set state.bookmarkList to action.payload.bookmarkList', () => {
      const currentState = getState()
      const state = reducer(currentState, {
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: { bookmarkList: [1, 2, 3] }
      })
      
      expect(state.bookmarkList).toEqual([1, 2, 3])
    })
  })
  
  describe('SORT_PROJECTS', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.SORT_PROJECTS, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('SORT_BOOKMARKED', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.SORT_BOOKMARKED, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('UPDATE_ROWS', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.UPDATE_ROWS, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('UPDATE_PAGE', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.UPDATE_PAGE, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('UPDATE_SEARCH_VALUE', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.UPDATE_SEARCH_VALUE, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('UPDATE_VISIBLE_PROJECTS', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.UPDATE_VISIBLE_PROJECTS, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('REMOVE_PROJECT', () => {
    test('should set action.payload to state', () => {
      const action = { type: types.REMOVE_PROJECT, payload: { projects: { visible: [2], matches: [2] } } }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projects).toEqual({ visible: [2], matches: [2] })
    })
  })
  
  describe('GET_PROJECTS_FAIL', () => {
    const state = reducer(getState({}), { type: types.GET_PROJECTS_FAIL })
    test('should set state.errorContent', () => {
      expect(state.errorContent).toEqual('We couldn\'t retrieve the project list. Please try again later.')
    })
    
    test('should set state.error to true', () => {
      expect(state.error).toEqual(true)
    })
  })
  
  describe('GET_PROJECTS_REQUEST', () => {
    test('shouldn\'t change anything in state', () => {
      const currentState = getState()
      const state = reducer(currentState, { type: types.GET_PROJECTS_REQUEST })
      expect(state).toEqual(initial)
    })
  })
  
  describe('GET_PROJECTS_SUCCESS', () => {
    test('shouldn\'t change anything in state', () => {
      const currentState = getState()
      const state = reducer(currentState, { type: types.GET_PROJECTS_SUCCESS })
      expect(state).toEqual(initial)
    })
  })
  
  describe('SET_PROJECT_TO_EXPORT', () => {
    test('should set all project to export metadata', () => {
      const action = {
        type: types.SET_PROJECT_TO_EXPORT,
        project: {
          id: 4,
          projectUsers: [{ userId: 1 }, { userId: 4 }],
          name: 'Test Project'
        }
      }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.projectToExport.projectUsers).toEqual([{ userId: 1 }, { userId: 4 }])
      expect(state.projectToExport.id).toEqual(4)
      expect(state.projectToExport.text).toEqual('')
      expect(state.projectToExport.name).toEqual('Test Project')
    })
  })
  
  describe('CLEAR_PROJECT_TO_EXPORT', () => {
    test('should close the dialog and clear any info about project selected', () => {
      const action = { type: types.CLEAR_PROJECT_TO_EXPORT }
      const currentState = getState({
        projectToExport: {
          id: 4,
          projectUsers: [{ userId: 1 }, { userId: 4 }],
          name: 'Test Project',
          text: 'blabla'
        }
      })
      const state = reducer(currentState, action)
      expect(state.projectToExport).toEqual(initial.projectToExport)
    })
  })
  
  describe('EXPORT_DATA_REQUEST', () => {
    const action = {
      type: types.EXPORT_DATA_REQUEST,
      exportType: 'numeric',
      user: { userId: 1, firstName: 'test', lastName: 'user' }
    }
    const currentState = getState({
      projectToExport: {
        id: 4,
        projectUsers: [{ userId: 1 }, { userId: 4 }],
        name: 'Test Project',
        text: 'blabla'
      }
    })
    const state = reducer(currentState, action)
    
    test('should set the export type', () => {
      expect(state.projectToExport.exportType).toEqual('numeric')
    })
    
    test('should set the user being exported if not null', () => {
      expect(state.projectToExport.user).toEqual({
        id: 1,
        firstName: 'test',
        lastName: 'user'
      })
    })
    
    test('if no user selected, then the user id should be val', () => {
      const action = { type: types.EXPORT_DATA_REQUEST, exportType: 'numeric', user: null }
      const currentState = getState({
        projectToExport: {
          id: 4,
          projectUsers: [{ userId: 1 }, { userId: 4 }],
          name: 'Test Project',
          text: 'blabla'
        }
      })
      const state = reducer(currentState, action)
      expect(state.projectToExport.user).toEqual({ id: 'val' })
    })
    
    test('should set that exporting is happening', () => {
      expect(state.exporting).toEqual(true)
    })
  })
  
  describe('EXPORT_DATA_SUCCESS', () => {
    const action = { type: types.EXPORT_DATA_SUCCESS, payload: 'file-text' }
    
    const currentState = getState({
      projectToExport: {
        id: 4,
        projectUsers: [{ userId: 1 }, { userId: 4 }],
        name: 'Test Project',
        text: 'blabla',
        user: {
          id: 1,
          firstName: 'test',
          lastName: 'user'
        },
        exportType: 'numeric'
      }
    })
    const state = reducer(currentState, action)
    
    test('should set the actual file content for download', () => {
      expect(state.projectToExport.text).toEqual('file-text')
    })
    
    test('should set that exporting ins no longer happening', () => {
      expect(state.exporting).toEqual(false)
    })
  })
  
  describe('EXPORT_DATA_FAIL', () => {
    const action = { type: types.EXPORT_DATA_FAIL, payload: 'We couldn\'t export this project.' }
  
    const currentState = getState({
      projectToExport: {
        id: 4,
        projectUsers: [{ userId: 1 }, { userId: 4 }],
        name: 'Test Project',
        text: 'blabla',
        user: {
          id: 1,
          firstName: 'test',
          lastName: 'user'
        },
        exportType: 'numeric'
      }
    })
    const state = reducer(currentState, action)
    test('should open an alert to inform the user of the errors that happened', () => {
      expect(state.apiErrorAlert.open).toEqual(true)
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t export this project.')
    })
    
    test('should set that exporting ins no longer happening', () => {
      expect(state.exporting).toEqual(false)
    })
  })
  
  describe('GET_PROJECT_USERS_FAIL', () => {
    const action = { type: types.GET_PROJECT_USERS_FAIL, payload: 'We couldn\'t get updated user profiles.' }
  
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should open an alert to inform the user of the errors that happened', () => {
      expect(state.apiErrorAlert.open).toEqual(true)
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t get updated user profiles.')
    })
  })
  
  describe('TOGGLE_BOOKMARK_FAIL', () => {
    const action = { type: types.TOGGLE_BOOKMARK_FAIL, payload: 'We couldn\'t save your bookmark request.' }
  
    const currentState = getState()
    const state = reducer(currentState, action)
  
    test('should open an alert to inform the user of the errors that happened', () => {
      expect(state.apiErrorAlert.open).toEqual(true)
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t save your bookmark request.')
    })
  })
  
  describe('DISMISS_API_ERROR', () => {
    const action = { type: types.DISMISS_API_ERROR }
  
    const currentState = getState({
      apiErrorAlert: {
        open: true,
        text: 'We couldn\'t save your bookmark request.'
      }
    })
    const state = reducer(currentState, action)
    
    test('should close the api alert', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
  })
  
  describe('TOGGLE_PROJECT', () => {
    test('should close the project if the project is already open', () => {
      const action = { type: types.TOGGLE_PROJECT, projectId: 4 }
  
      const currentState = getState({ openProject: 4 })
      const state = reducer(currentState, action)
      expect(state.openProject).toEqual(0)
    })
    
    test('should open the new project if the project is not already open', () => {
      const action = { type: types.TOGGLE_PROJECT, projectId: 4 }
  
      const currentState = getState({ openProject: 0 })
      const state = reducer(currentState, action)
      expect(state.openProject).toEqual(4)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('should set state to initial state, expect for rowsPerPage', () => {
      const state = reducer(getState({ rowsPerPage: 5 }), { type: types.FLUSH_STATE })
      expect(state).toEqual(getState({ rowsPerPage: 5, projects: { visible: [], matches: [] } }))
    })
  })
})
