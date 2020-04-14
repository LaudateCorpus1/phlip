import actions, { types } from '../actions'

describe('Data - Project Action Creators', () => {
  test('should create an action to add a project', () => {
    const expected = { type: types.ADD_PROJECT, payload: { id: 1, name: 'project' } }
    expect(actions.addProject({ id: 1, name: 'project' })).toEqual(expected)
  })
  
  test('should create an action to get a project', () => {
    const expected = { type: types.GET_PROJECT_REQUEST, projectId: 1 }
    expect(actions.getProjectRequest(1)).toEqual(expected)
  })
})
