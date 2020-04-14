import { createLogic } from 'redux-logic'
import { types } from './actions'

const getJurisdictionLogic = createLogic({
  type: types.GET_JURISDICTION_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const jurisdiction = await api.getJurisdiction({}, {}, { jurisdictionId: action.jurisdictionId })
      dispatch({
        type: types.GET_JURISDICTION_SUCCESS, payload: { ...jurisdiction }
      })
    } catch (err) {
      dispatch({ type: types.GET_JURISDICTION_FAIL })
    }
    done()
  }
})

export default [
  getJurisdictionLogic
]