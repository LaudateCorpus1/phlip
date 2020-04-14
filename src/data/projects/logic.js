import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as jurTypes } from 'data/jurisdictions/actions'

/**
 * Gets a specific project from the API
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *}, undefined, string>}
 */
const getProjectLogic = createLogic({
  type: types.GET_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const project = await api.getProject({}, {}, { projectId: action.projectId })
      dispatch({
        type: types.GET_PROJECT_SUCCESS, payload: { ...project }
      })
    } catch (err) {
      dispatch({ type: types.GET_PROJECT_FAIL })
    }
    done()
  }
})

/**
 * Updates the dateLastEdited and lastEditedBy fields for a project, based on the action.projectId
 */
export const updateFieldsLogic = createLogic({
  type: types.UPDATE_EDITED_FIELDS,
  transform({ action, getState }, next) {
    const currentUser = getState().data.user.currentUser
    const user = `${currentUser.firstName} ${currentUser.lastName}`
    next({
      ...action,
      user,
      projectId: action.projectId
    })
  }
})

/**
 * Process jurisdictions after setting projects
 */
export const processJurs = createLogic({
  type: types.SET_PROJECTS,
  process({ action, getState }, dispatch, done) {
    const projects = Object.values(getState().data.projects.byId)
    let jurisdictions = { ...getState().data.jurisdictions.byId }
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      for (let j=0; j < project.projectJurisdictions.length; j++) {
        const jurisdiction = project.projectJurisdictions[j]
        if (!jurisdictions.hasOwnProperty(jurisdiction.jurisdictionId)) {
          const jur = {
            id: jurisdiction.jurisdictionId,
            name: jurisdiction.name
          }
          jurisdictions[jurisdiction.jurisdictionId] = jur
          dispatch({ type: jurTypes.ADD_JURISDICTION, payload: jur })
        }
      }
    }
    done()
  }
})

export default [
  getProjectLogic,
  processJurs,
  updateFieldsLogic
]
