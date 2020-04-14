import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { persistStore } from 'redux-persist'
import rootLogic from 'logic'
import createRootReducer from 'reducer'
import createApiHandler, { projectApiInstance, docApiInstance } from '../api'
import calls from '../api/calls'
import docCalls from '../api/docManageCalls'
import createBrowserHistory from 'history/createBrowserHistory'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let persistor, history, api, docApi

/**
 * Redux store initialization
 */
const configureStore = () => {
  history = createBrowserHistory()
  api = createApiHandler({ history }, projectApiInstance, calls)
  docApi = createApiHandler({ history }, docApiInstance, docCalls)
  
  const store = createStore(
    createRootReducer(),
    composeEnhancers(applyMiddleware(createLogicMiddleware(rootLogic, { api, docApi, history })))
  )
  
  store.dynamicReducers = { autocomplete: {} }
  store.injectReducer = (key, reducer) => {
    store.dynamicReducers[key] = reducer
    store.replaceReducer(createRootReducer(store.dynamicReducers))
    return store
  }
  
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../reducer', () => {
      store.replaceReducer(createRootReducer())
    })
  }
  
  persistor = persistStore(store, null, () => store.getState())
  
  return { store, persistor }
}

export {
  configureStore,
  persistor,
  history,
  api
}
