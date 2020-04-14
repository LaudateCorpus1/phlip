import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

describe('Admin Logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })

  const setupStore = (state = {}) => {
    return createMockStore({
      initialState: state,
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }

  test('should get user list and dispatch GET_USERS_SUCCESS when successful', done => {
    mock.onGet('/users').reply(200, [
      { id: 1, firstName: 'Test' },
      { id: 2, firstName: 'Tester' }
    ])

    const store = setupStore()
    store.dispatch({ type: types.GET_USERS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_USERS_REQUEST },
        {
          type: types.GET_USERS_SUCCESS,
          payload: [{ id: 1, firstName: 'Test' }, { id: 2, firstName: 'Tester' }]
        }
      ])
      done()
    })
  })

  test('should get user list and dispatch GET_USER_FAIL on failure', done => {
    mock.onGet('/users').reply(500)

    const store = setupStore()
    store.dispatch({ type: types.GET_USERS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_USERS_REQUEST },
        {
          type: types.GET_USERS_FAIL,
          error: true,
          payload: { error: 'failed to get users' }
        }
      ])
      done()
    })
  })
})