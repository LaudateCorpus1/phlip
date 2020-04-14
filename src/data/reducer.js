import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage/session'
import user from './users/reducer'
import projects from './projects/reducer'
import jurisdictions from './jurisdictions/reducer'

/**
 * Root reducer for the data directory. Combines any reducer from the subdirectories.
 */
const dataPersistConfig = {
  key: 'user',
  storage
}

const projectPersistConfig = {
  key: 'projects',
  storage
}

const jurisdictionPersistConfig = {
  key: 'jurisdictions',
  storage
}

const dataReducer = combineReducers({
  user: persistReducer(dataPersistConfig, user),
  projects: persistReducer(projectPersistConfig, projects),
  jurisdictions: persistReducer(jurisdictionPersistConfig, jurisdictions),
  autocomplete: {
    projects: {},
    jurisdictions: {},
    users: {}
  }
})

export default dataReducer
