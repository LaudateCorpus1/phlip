import data from 'data/reducer'
import scenes from 'scenes/reducer'
import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'

/**
 * Root reducer for the application. Collects the reducers from data and scenes and sets the redux-form reducer as form.
 * This is what's passed to `createStore` function for redux.
 */
const createRootReducer = dynamicReducers => {
  return combineReducers({
    data,
    scenes,
    form: formReducer,
    ...dynamicReducers
  })
}

export default createRootReducer
