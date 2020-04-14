import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'
import { projects, defaultSorted } from 'utils/testData/projectsHome'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Project Data reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('SET_PROJECT', () => {
    const action = { type: types.SET_PROJECTS, payload: { data: { byId: projects, allIds: defaultSorted } } }
    const currentState = getState({
      byId: { 1: { name: 'blah' } },
      allIds: [1]
    })
    const state = reducer(currentState, action)
    
    test('should set projects by id', () => {
      expect(state.byId).toEqual(projects)
    })
    
    test('should set all project ids', () => {
      expect(state.allIds).toEqual(defaultSorted)
    })
  })
  
  describe('ADD_PROJECT', () => {
    const action = {
      type: types.ADD_PROJECT,
      payload: {
        id: 3,
        name: 'project 3',
        projectJurisdictions: []
      }
    }
    
    test('should add project to the full list', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.byId.hasOwnProperty(3)).toEqual(true)
      expect(state.byId[3]).toEqual({ id: 3, name: 'project 3', projectJurisdictions: [] })
    })
    
    test('should add the project id to the id list if it is not already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[1]).toEqual(3)
    })
    
    test('should not add project id to list if it is already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [3, 1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[0]).toEqual(3)
      expect(state.allIds[1]).toEqual(1)
    })
  })
  
  describe('GET_PROJECT_SUCCESS', () => {
    const action = {
      type: types.GET_PROJECT_SUCCESS,
      payload: {
        id: 3,
        name: 'project 3',
        projectJurisdictions: []
      }
    }
    
    test('should add project to the full list', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.byId.hasOwnProperty(3)).toEqual(true)
      expect(state.byId[3]).toEqual({ id: 3, name: 'project 3', projectJurisdictions: [] })
    })
    
    test('should add the project id to the id list if it is not already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[1]).toEqual(3)
    })
    
    test('should not add project id to list if it is already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [3, 1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[0]).toEqual(3)
      expect(state.allIds[1]).toEqual(1)
    })
  })
  
  describe('UPDATE_PROJECT', () => {
    const action = {
      type: types.UPDATE_PROJECT,
      payload: {
        id: 3,
        name: 'project 3',
        projectJurisdictions: []
      }
    }
    
    test('should add project to the full list', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.byId.hasOwnProperty(3)).toEqual(true)
      expect(state.byId[3]).toEqual({ id: 3, name: 'project 3', projectJurisdictions: [] })
    })
    
    test('should add the project id to the id list if it is not already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[1]).toEqual(3)
    })
    
    test('should not add project id to list if it is already in there', () => {
      const currentState = getState({
        byId: { 1: { name: 'blah', projectJurisdictions: [] } },
        allIds: [3, 1]
      })
      const state = reducer(currentState, action)
      
      expect(state.allIds.length).toEqual(2)
      expect(state.allIds[0]).toEqual(3)
      expect(state.allIds[1]).toEqual(1)
    })
  })
  
  describe('UPDATE_EDITED_FIELDS', () => {
    const action = { type: types.UPDATE_EDITED_FIELDS, user: 'Test User', projectId: 4 }
    const currentState = getState({
      byId: projects, allIds: defaultSorted
    })
    const state = reducer(currentState, action)
    
    test('should set current user as last edited by for action.projectId', () => {
      expect(state.byId[4].lastEditedBy).toEqual('Test User')
    })
  })
  
  describe('REMOVE_PROJECT', () => {
    const action = { type: types.REMOVE_PROJECT, projectId: 3 }
    const currentState = getState({
      byId: projects, allIds: defaultSorted
    })
    const state = reducer(currentState, action)
    test('should remove deleted project from projects by id', () => {
      expect(state.byId.hasOwnProperty(3)).toEqual(false)
    })
    
    test('should remove project id from all ids', () => {
      expect(state.allIds.indexOf(3)).toEqual(-1)
    })
  })
  
  describe('FLUSH_STATE', () => {
    test('should return initial state', () => {
      const action = {
        type: types.FLUSH_STATE
      }
      
      const currentState = getState({
        byId: { 1: { name: 'blah' } },
        allIds: [1]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
})
