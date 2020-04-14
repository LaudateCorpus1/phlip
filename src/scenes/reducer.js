import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage/session'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'
import codingScheme from './CodingScheme/reducer'
import docManage from './DocumentManagement/reducer'
import protocol from './Protocol/reducer'
import docView from './DocumentView/reducer'
import codingValidation from './CodingValidation/reducer'
import { types } from './actions'

const INITIAL_STATE = {
  pdfError: '',
  pdfFile: null,
  isRefreshing: false,
  previousLocation: {},
  backendInfo : null
}

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.DOWNLOAD_PDF_REQUEST:
      return {
        ...state,
        pdfFile: null
      }

    case types.DOWNLOAD_PDF_FAIL:
      return {
        ...state,
        pdfError: 'We couldn\'t download the help guide.'
      }

    case types.DOWNLOAD_PDF_SUCCESS:
      return {
        ...state,
        pdfError: '',
        pdfFile: new Blob([action.payload], { type: 'application/pdf' })
      }

    case types.CLEAR_PDF_FILE:
      return {
        ...state,
        pdfFile: null
      }

    case types.RESET_DOWNLOAD_PDF_ERROR:
      return {
        ...state,
        pdfError: ''
      }

    case types.REFRESH_JWT:
      return {
        ...state,
        isRefreshing: true
      }
      
    case types.SET_PREVIOUS_LOCATION:
      return {
        ...state,
        previousLocation: action.location
      }

    case types.GET_BACKEND_INFO_SUCCESS:
      return {
        ...state,
        backendInfo: action.payload
      }
      
    case types.GET_BACKEND_INFO_FAIL:
      return {
        ...state,
        backendInfo: null
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

/**
 * Create the scenes root reducer by combining all of the reducers for each scene into one. It can be accessed at
 * state.scenes. All reducers defined here are accessible by doing state.scenes.reducerName, where reducerName is the
 * name of the reducer. For example, if I wanted to access the home reducer, I would use state.scenes.home. It also
 * sets up redux-persist for home and admin reducers.
 */
const scenesReducer = combineReducers({
  main: persistReducer({ storage, key: 'main', blacklist: ['isRefreshing'] }, mainReducer),
  home: persistReducer({ storage, key: 'home', blacklist: ['addEditJurisdictions'] }, home),
  admin: persistReducer({ storage, key: 'admin' }, admin),
  docManage: persistReducer({ storage, key: 'docManage', blacklist: ['upload', 'search'] }, docManage),
  codingValidation,
  codingScheme,
  login,
  protocol,
  docView
})

export default scenesReducer
