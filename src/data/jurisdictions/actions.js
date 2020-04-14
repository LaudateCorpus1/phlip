import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  ADD_JURISDICTION: 'ADD_JURISDICTION',
  GET_JURISDICTION_REQUEST: 'GET_JURISDICTION_REQUEST',
  GET_JURISDICTION_SUCCESS: 'GET_JURISDICTION_SUCCESS',
  GET_JURISDICTION_FAIL: 'GET_JURISDICTION_FAIL',
  FLUSH_STATE: 'FLUSH_STATE'
}

export default {
  getJurisdictionRequest: makeActionCreator(types.GET_JURISDICTION_REQUEST, 'jurisdictionId'),
  addJurisdiction: makeActionCreator(types.ADD_JURISDICTION, 'payload')
}
