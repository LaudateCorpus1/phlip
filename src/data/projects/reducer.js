import { types } from './actions'
import { commonHelpers } from 'utils'

export const INITIAL_STATE = {
  byId: {},
  allIds: [],
  count: 0
}

const projectReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_PROJECTS:
      return {
        byId: action.payload.data.byId,
        allIds: action.payload.data.allIds
      }
    
    case types.GET_PROJECT_SUCCESS:
    case types.ADD_PROJECT:
    case types.UPDATE_PROJECT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            ...action.payload,
            projectJurisdictions: action.payload.projectJurisdictions
              ? commonHelpers.sortListOfObjects(action.payload.projectJurisdictions, 'name', 'asc')
              : state.byId[action.payload.id].projectJurisdictions
          }
        },
        allIds: state.allIds.indexOf(action.payload.id) === -1
          ? [...state.allIds, action.payload.id]
          : [...state.allIds]
      }
    
    case types.UPDATE_EDITED_FIELDS:
      let project = state.byId[action.projectId]
      return {
        ...state,
        byId: {
          ...state.byId,
          [project.id]: {
            ...project,
            lastEditedBy: action.user,
            dateLastEdited: new Date().toISOString()
          }
        },
        allIds: state.allIds
      }
    
    case types.REMOVE_PROJECT:
      const { [action.projectId]: deleteProject, ...updatedById } = state.byId
      const updatedAllIds = state.allIds.filter(value => value !== action.projectId)
      return {
        ...state,
        byId: updatedById,
        allIds: updatedAllIds
      }
    
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

export default projectReducer
