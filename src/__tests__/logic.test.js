import { createMockStore } from 'redux-logic-test'
import logic from '../logic'
import { types } from 'data/users/actions'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

jest.mock('services/authToken/index.js', () => ({
  __esModule: true,
  default: {
    logout: jest.fn()
  },
  logout: jest.fn(),
  getSamlToken: jest.fn(() => `'${JSON.stringify({ nameID: 'bloop', sessionIndex: 2, nameIDFormat: 'nameFormat' })}'`)
}))

jest.mock('services/store/index.js', () => ({
  __esModule: true,
  default: {},
  persistor: {
    flush: jest.fn(),
    purge: jest.fn()
  }
}))

global.location = { href: '' }

import { logout } from 'services/authToken'
import { persistor } from 'services/store'

describe('App Root Logic', () => {
  const setupStore = (other = {}) => {
    return createMockStore({
      initialState: {
        data: {
          user: {
            currentUser: { id: 4, firstName: 'Test', lastName: 'User', token: 'thisisatoken' }
          }
        },
        ...other
      },
      logic
    })
  }

  describe('Logging out', () => {
    test('should log the user out', done => {
      const store = setupStore()
      store.dispatch({ type: types.LOGOUT_USER })
      store.whenComplete(() => {
        expect(logout.mock.calls.length).toEqual(1)
        logout.mockClear()
        done()
      })
    })

    test('should flush redux state', done => {
      const spy = jest.spyOn(persistor, 'purge')
      const store = setupStore()
      store.dispatch({ type: types.LOGOUT_USER })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })

    describe('if sams authentication is enabled', () => {
      test('should logout the user from the app', done => {
        const store = setupStore()
        global.APP_IS_SAML_ENABLED = '1'
        store.dispatch({ type: types.LOGOUT_USER })
        store.whenComplete(() => {
          expect(logout.mock.calls.length).toEqual(2)
          logout.mockClear()
          done()
        })
      })

      test('should logout the user in sams', done => {
        const mock = new MockAdapter(axios)
        global.APP_IS_SAML_ENABLED = '1'
        mock.onGet('/logout').reply(200, '#logout')
        const store = setupStore()
        store.dispatch({ type: types.LOGOUT_USER })
        store.whenComplete(() => {
          expect(logout).toHaveBeenCalled()
          done()
        })
      })
    })
  })
})
