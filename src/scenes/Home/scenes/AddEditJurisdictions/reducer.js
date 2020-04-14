import { types } from './actions'
import { normalize, searchUtils } from 'utils'

export const INITIAL_STATE = {
  jurisdictions: { byId: {}, allIds: [] },
  visibleJurisdictions: [],
  searchValue: '',
  suggestions: [],
  suggestionValue: '',
  jurisdiction: {},
  goBack: false,
  formError: null,
  deleteError: null,
  isLoadingJurisdictions: false,
  showJurisdictionLoader: false,
  form: {
    values: {
      name: ''
    }
  },
  searching: false
}

/**
 * Reducer for the AddEditJurisdictions scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
const addEditJurisdictionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_PROJECT_JURISDICTIONS_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: normalize.arrayToObject(action.payload),
          allIds: normalize.mapArray(action.payload)
        },
        visibleJurisdictions: normalize.mapArray(action.payload),
        formError: null,
        error: false,
        errorContent: '',
        goBack: false,
        showJurisdictionLoader: false,
        isLoadingJurisdictions: false
      }

    case types.UPDATE_PROJECT_JURISDICTION_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: { ...state.jurisdictions.byId, [action.payload.id]: action.payload },
          allIds: state.jurisdictions.allIds
        },
        formError: null,
        goBack: true,
        suggestionValue: ''
      }

    case types.ADD_PROJECT_JURISDICTION_SUCCESS:
      return {
        ...state,
        jurisdictions: {
          byId: {
            ...state.jurisdictions.byId,
            [action.payload.id]: action.payload
          },
          allIds: [action.payload.id, ...state.jurisdictions.allIds]
        },
        visibleJurisdictions: [action.payload.id, ...state.visibleJurisdictions],
        goBack: true,
        suggestionValue: ''
      }

    case types.ADD_PRESET_JURISDICTION_SUCCESS:
      const newIds = normalize.mapArray(action.payload)
      return {
        ...state,
        jurisdictions: {
          byId: { ...normalize.arrayToObject(action.payload), ...state.jurisdictions.byId },
          allIds: [...newIds, ...state.jurisdictions.allIds]
        },
        visibleJurisdictions: [...newIds, ...state.visibleJurisdictions],
        goBack: true
      }

    case types.DELETE_JURISDICTION_SUCCESS:
      const currentIds = { ...state.jurisdictions.byId }
      delete currentIds[action.jurisdictionId]

      const indexOfId = state.jurisdictions.allIds.findIndex(value => value === action.jurisdictionId)
      const allIds = [ ...state.jurisdictions.allIds ]
      allIds.splice(indexOfId, 1)

      const visible = [ ...state.visibleJurisdictions ]
      visible.splice(indexOfId, 1)

      return {
        ...state,
        jurisdictions: {
          byId: { ...currentIds },
          allIds: [ ...allIds ]
        },
        visibleJurisdictions: [ ...visible ],
        goBack: true
      }

    case types.UPDATE_JURISDICTION_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue,
        visibleJurisdictions: action.searchValue === ''
          ? state.jurisdictions.allIds
          : normalize.mapArray(searchUtils.searchForMatches(Object.values(state.jurisdictions.byId), action.searchValue, [
            'name', 'startDate', 'endDate'
          ]))
      }

    case types.UPDATE_SUGGESTION_VALUE:
      return {
        ...state,
        suggestionValue: action.suggestionValue,
        form: {
          ...state.form,
          values: {
            ...state.form.values,
            name: action.suggestionValue
          }
        },
        jurisdiction: Object.keys(state.jurisdiction).length > 0 ? {} : { ...state.jurisdiction }
      }

    case types.SET_JURISDICTION_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload,
        searching: false
      }

    case types.ON_CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      }

    case types.ON_JURISDICTION_SELECTED:
      return {
        ...state,
        jurisdiction: { ...action.jurisdiction },
        suggestionValue: action.jurisdiction.name,
        form: {
          ...state.form,
          values: {
            ...state.form.values,
            name: action.jurisdiction.name
          }
        },
        searching: false
      }

    case types.CLEAR_JURISDICTIONS:
      return {
        ...state,
        suggestionValue: '',
        suggestions: [],
        jurisdiction: {},
        visibleJurisdictions: [],
        searchValue: '',
        goBack: false
      }

    case types.ADD_PROJECT_JURISDICTION_FAIL:
    case types.UPDATE_PROJECT_JURISDICTION_FAIL:
    case types.ADD_PRESET_JURISDICTION_FAIL:
      return {
        ...state,
        formError: action.payload,
        goBack: false
      }

    case types.DELETE_JURISDICTION_FAIL:
      return {
        ...state,
        deleteError: action.payload
      }

    case types.DISMISS_DELETE_ERROR_ALERT:
      return {
        ...state,
        deleteError: null
      }

    case types.GET_PROJECT_JURISDICTION_FAIL:
      return {
        ...state,
        error: true,
        errorContent: 'We couldn\'t get the jurisdictions for this project.',
        showJurisdictionLoader: false,
        isLoadingJurisdictions: false
      }

    case types.RESET_FORM_ERROR:
      return {
        ...state,
        formError: null,
        goBack: false
      }

    case types.GET_PROJECT_JURISDICTIONS_REQUEST:
      return {
        ...state,
        isLoadingJurisdictions: true
      }

    case types.INITIALIZE_FORM:
      return {
        ...state,
        form: {
          initial: action.values,
          registeredFields: action.values,
          values: action.values
        }
      }

    case types.SET_FORM_VALUES:
      return {
        ...state,
        form: {
          ...state.form,
          values: {
            ...state.form.values,
            [action.prop]: action.value
          }
        }
      }

    case types.RESET_FORM_VALUES:
      return {
        ...state,
        form: {
          ...state.form,
          values: state.form.initial
        }
      }

    case types.SHOW_JURISDICTION_LOADER:
      return {
        ...state,
        showJurisdictionLoader: true
      }

    case types.SEARCH_JURISDICTION_LIST:
      return {
        ...state,
        searching: true
      }
      
    case types.DELETE_JURISDICTION_REQUEST:
    case types.UPDATE_PROJECT_JURISDICTION_REQUEST:
    case types.ADD_PROJECT_JURISDICTION_REQUEST:
    case types.ADD_PRESET_JURISDICTION_REQUEST:
    default:
      return state
  }
}

export default addEditJurisdictionsReducer
