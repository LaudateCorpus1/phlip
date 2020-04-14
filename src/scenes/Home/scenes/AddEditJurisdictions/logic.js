import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { commonHelpers, updater } from 'utils'

/**
 * Logic for getting the jursidictions for a project
 */
export const getJurisdictionsLogic = createLogic({
  type: types.GET_PROJECT_JURISDICTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECT_JURISDICTIONS_SUCCESS,
    failType: types.GET_PROJECT_JURISDICTION_FAIL
  },
  async process({ action, api }) {
    return await api.getProjectJurisdictions({}, {}, { projectId: action.projectId })
  }
})

/**
 * Sends a request to add a jurisdiction to the project, adds the jurisdiction to state.scenes.home reducer for the
 * project and updates the edited fields for that project as well, upon success
 */
export const addJurisdictionLogic = createLogic({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const project = getState().data.projects.byId[action.projectId]
    try {
      const jurisdiction = await api.addJurisdictionToProject(action.jurisdiction, {}, { projectId: action.projectId })
      dispatch({
        type: types.ADD_PROJECT_JURISDICTION_SUCCESS,
        payload: { ...jurisdiction }
      })
      
      dispatch({
        type: projectTypes.UPDATE_PROJECT,
        payload: {
          ...project,
          projectJurisdictions: commonHelpers.sortListOfObjects(
            [...project.projectJurisdictions, jurisdiction],
            'name',
            'asc'
          )
        }
      })
      
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PROJECT_JURISDICTION_FAIL,
        payload: 'We couldn\'t add the jurisdiction. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to update a jurisdiction for a project. Updates the project in state.scenes.home reducer, updates the
 * edited fields for the project upon success
 */
export const updateJurisdictionLogic = createLogic({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    try {
      const project = getState().data.projects.byId[action.projectId]
      const updatedJurisdiction = await api.updateJurisdictionInProject(action.jurisdiction, {}, {
        projectId: action.projectId,
        jurisdictionId: action.projectJurisdictionId
      })
      
      dispatch({
        type: types.UPDATE_PROJECT_JURISDICTION_SUCCESS,
        payload: { ...updatedJurisdiction }
      })
  
      dispatch({
        type: projectTypes.UPDATE_PROJECT,
        payload: {
          ...project,
          projectJurisdictions: updater.updateByProperty(updatedJurisdiction, project.projectJurisdictions, 'id')
        }
      })
      
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_PROJECT_JURISDICTION_FAIL,
        payload: 'We couldn\'t update the jurisdiction. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to add a preset list of jurisdictions to a project. Adds the new jurisdictions to the project in the
 * state.scenes.home reducer, updates edited fields for project upon success
 */
export const addPresetJurisdictionLogic = createLogic({
  type: types.ADD_PRESET_JURISDICTION_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const project = getState().data.projects.byId[action.projectId]
    try {
      const presetJurisdictions = await api.addPresetJurisdictionList(
        action.jurisdiction,
        {},
        { projectId: action.projectId }
      )
      dispatch({
        type: types.ADD_PRESET_JURISDICTION_SUCCESS,
        payload: [...presetJurisdictions]
      })
  
      dispatch({
        type: projectTypes.UPDATE_PROJECT,
        payload: {
          ...project,
          projectJurisdictions: commonHelpers.sortListOfObjects(
            [...project.projectJurisdictions, ...presetJurisdictions],
            'name',
            'asc'
          )
        }
      })
      
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PRESET_JURISDICTION_FAIL,
        payload: 'We couldn\'t add the list of jurisdictions. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Searches the master jurisdiction list at the API to find matching jurisdictions. This is for the autocomplete text
 * field for the jurisdiction name.
 */
export const searchJurisdictionList = createLogic({
  type: types.SEARCH_JURISDICTION_LIST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.SET_JURISDICTION_SUGGESTIONS
  },
  async process({ action, api }) {
    return await api.searchJurisdictionList({}, {
      params: {
        name: action.searchString
      }
    }, {})
  }
})

/**
 * Sends a request to delete a jurisdiction from the project, upon successful deletion -- removes the jurisdiction from
 * the project in the state.scenes.home reducer, updates edited fields for project
 */
export const deleteJurisdictionLogic = createLogic({
  type: types.DELETE_JURISDICTION_REQUEST,
  async process({ getState, action, api }, dispatch, done) {
    try {
      const project = getState().data.projects.byId[action.projectId]
      
      await api.deleteProjectJurisdiction({}, {}, {
        projectId: action.projectId,
        jurisdictionId: action.jurisdictionId
      })
      
      dispatch({
        type: types.DELETE_JURISDICTION_SUCCESS,
        jurisdictionId: action.jurisdictionId
      })
  
      const currentJurisdictions = [...project.projectJurisdictions]
      
      dispatch({
        type: types.DELETE_JURISDICTION_FROM_PROJECT,
        payload: {
          jurisdictionId: action.jurisdictionId,
          projectId: action.projectId
        }
      })
  
      dispatch({
        type: projectTypes.UPDATE_PROJECT,
        payload: {
          ...project,
          projectJurisdictions: currentJurisdictions.filter(value => value.id !== action.jurisdictionId)
        }
      })
      
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (e) {
      dispatch({
        type: types.DELETE_JURISDICTION_FAIL,
        payload: 'We couldn\'t delete the jurisdiction.'
      })
    }
    done()
  }
})

/**
 * This is to add the current user to the action so that lastEditedBy field can be updated. The action is then sent to
 * the reducer for each type.
 */
export const updateFieldsLogic = createLogic({
  type: [
    types.ADD_PROJECT_JURISDICTION_REQUEST,
    types.UPDATE_PROJECT_JURISDICTION_REQUEST,
    types.ADD_PRESET_JURISDICTION_REQUEST
  ],
  transform({ action, getState }, next) {
    const userId = getState().data.user.currentUser.id
    next({
      ...action,
      jurisdiction: { ...action.jurisdiction, userId }
    })
  }
})

export default [
  updateFieldsLogic,
  getJurisdictionsLogic,
  addJurisdictionLogic,
  updateJurisdictionLogic,
  searchJurisdictionList,
  addPresetJurisdictionLogic,
  deleteJurisdictionLogic
]
