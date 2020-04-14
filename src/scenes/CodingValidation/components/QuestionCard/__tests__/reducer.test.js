import { types } from '../actions'
import reducer, { INITIAL_STATE } from '../reducer'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('CodingValidation - Card Reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  describe('SET_ALERT', () => {
    const action = {
      type: types.SET_ALERT, alert: {
        text: 'bloop scoop',
        open: true,
        title: 'alert'
      }
    }
    const currentState = getState({
      alert: {
        text: 'bloop',
        open: false
      }
    })
    
    const state = reducer(currentState, action)
    test('should open the alert', () => {
      expect(state.alert.open).toEqual(true)
    })
    
    test('should set the alert details', () => {
      expect(state.alert.title).toEqual('alert')
      expect(state.alert.text).toEqual('bloop scoop')
    })
  })
  
  describe('CLOSE_ALERT', () => {
    test('should close the alert', () => {
      const action = { type: types.CLOSE_ALERT }
      const currentState = getState({
        alert: {
          text: 'bloop',
          open: true
        }
      })
      
      const state = reducer(currentState, action)
      expect(state.alert.open).toEqual(false)
    })
  })
  
  describe('CHANGE_TOUCHED_STATUS', () => {
    test('should set the touched status of the question card', () => {
      const action = { type: types.CHANGE_TOUCHED_STATUS, touched: true }
      const currentState = getState({ touched: false })
      const state = reducer(currentState, action)
      expect(state.touched).toEqual(true)
    })
  })
  
  describe('SET_HEADER_TEXT', () => {
    test('should set the question card header text', () => {
      const action = { type: types.SET_HEADER_TEXT, text: 'Saving...' }
      const currentState = getState({ header: 'All changes saved' })
      const state = reducer(currentState, action)
      expect(state.header).toEqual('Saving...')
    })
  })
  
  describe('SET_RESET_STATUS', () => {
    test('should set whether or not to show reset button', () => {
      const action = { type: types.SET_RESET_STATUS, canReset: true }
      const currentState = getState({ canReset: false })
      const state = reducer(currentState, action)
      expect(state.canReset).toEqual(true)
    })
  })
  
  describe('ON_CLOSE_SCREEN', () => {
    test('should reset everything when leaving the page', () => {
      const action = { type: types.ON_CLOSE_SCREEN }
      const currentState = getState({ header: 'All changes saved', touched: true, canReset: true })
      const state = reducer(currentState, action)
      expect(state).toEqual(INITIAL_STATE)
    })
  })
})
