import { createLogic } from 'redux-logic'
import { types } from './actions'

const JURISDICTION_SUGGESTION_REQUEST = `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`
const PROJECT_SUGGESTION_REQUEST = `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`
const INITIAL_PROJECT_SUGGESTION_REQUEST = `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_PROJECT`

const actionToType = {
  [`${JURISDICTION_SUGGESTION_REQUEST}`]: 'jurisdiction',
  [`${PROJECT_SUGGESTION_REQUEST}`]: 'project',
  [`${INITIAL_PROJECT_SUGGESTION_REQUEST}`]: 'project'
}

/**
 * Validates that the request should go through
 * @type {Logic<object, undefined, undefined, {action?: *, getState?: *}, undefined, string>}
 */
const getStateSuffix = createLogic({
  type: [JURISDICTION_SUGGESTION_REQUEST, PROJECT_SUGGESTION_REQUEST, INITIAL_PROJECT_SUGGESTION_REQUEST],
  latest: true,
  validate({ action, getState }, allow, reject) {
    const suffix = action.suffix.slice(1).toLowerCase()
    const type = actionToType[action.type]
    const state = getState()[`autocomplete.${type}.${suffix}`]
    let allowAction = false
    
    allowAction = state !== undefined
      ? Object.keys(state.selectedSuggestion).length === 0
        ? true
        : state.selectedSuggestion.name !== action.searchString
      : true
    
    if (allowAction) {
      allow(action)
    } else {
      reject()
    }
  }
})

/**
 * Gets suggestions for jurisdiction
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *}, undefined, string>}
 */
const getJurisdictionSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
  latest: true,
  async process({ action, api }, dispatch, done) {
    try {
      const jurisdictions = await api.searchJurisdictionList({}, {
        params: {
          name: action.searchString
        }
      }, {})
      if (action.index !== undefined && action.index !== null) {
        dispatch({
          type: `${types.SEARCH_ROW_SUGGESTIONS_SUCCESS}_JURISDICTION${action.suffix}`,
          payload: { suggestions: jurisdictions, index: action.index }
        })
      } else {
        dispatch({
          type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_JURISDICTION${action.suffix}`,
          payload: jurisdictions
        })
      }
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_JURISDICTION${action.suffix}` })
    }
    done()
  }
})

/**
 * Gets project suggestions
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *}, undefined, string>}
 */
const getProjectSuggestionsLogic = createLogic({
  type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
  latest: true,
  async process({ api, action }, dispatch, done) {
    try {
      let projects = await api.searchProjectList({}, {
        params: {
          name: action.searchString
        }
      }, {})
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT${action.suffix}`, payload: projects })
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_PROJECT${action.suffix}` })
    }
    done()
  }
})

/**
 * Returns a list of projects for the user
 */
const getProjectsByUserLogic = createLogic({
  type: [types.GET_INITIAL_PROJECT_SUGGESTION_REQUEST, `${types.GET_INITIAL_SUGGESTIONS_REQUEST}_PROJECT`],
  latest: true,
  async process({ api, action }, dispatch, done) {
    try {
      let projects = await api.searchProjectListByUser({}, {
        params: {
          userId: action.userId,
          count: action.count
        }
      }, {})
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT${action.suffix}`, payload: projects })
    } catch (err) {
      dispatch({ type: `${types.SEARCH_FOR_SUGGESTIONS_FAIL}_PROJECT${action.suffix}` })
    }
    done()
  }
})

export default [
  getStateSuffix,
  getJurisdictionSuggestionsLogic,
  getProjectSuggestionsLogic,
  getProjectsByUserLogic
]
