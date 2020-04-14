import actions, { types } from '../actions'

describe('Home scene - AddEditProject actions creators', () => {
  test('should create an action to add a project', () => {
    const project = { name: 'New Project' }
    const expectedAction = {
      type: types.ADD_PROJECT_REQUEST,
      project
    }

    expect(actions.addProjectRequest(project)).toEqual(expectedAction)
  })

  test('should create an action indicating add project was successful', () => {
    const payload = { name: 'New Project' }
    const expectedAction = {
      type: types.ADD_PROJECT_SUCCESS,
      payload
    }

    expect(actions.addProjectSuccess(payload)).toEqual(expectedAction)
  })

  test('should create an action to update a project', () => {
    const updatedProject = { name: 'new name' }
    const expectedAction = {
      type: types.UPDATE_PROJECT_REQUEST,
      project: updatedProject
    }

    expect(actions.updateProjectRequest(updatedProject)).toEqual(expectedAction)
  })

  test('should create an action to indicate updating project was successfully', () => {
    const payload = { name: 'Project 1' }
    const expectedAction = {
      type: types.UPDATE_PROJECT_SUCCESS,
      payload
    }

    expect(actions.updateProjectSuccess(payload)).toEqual(expectedAction)
  })

  test('should create an action to delete a project', () => {
    const deletedProject = { name: 'new name' }
    const expectedAction = {
      type: types.DELETE_PROJECT_REQUEST,
      project: deletedProject
    }

    expect(actions.deleteProjectRequest(deletedProject)).toEqual(expectedAction)
  })

  test('should create an action to indicate deleting project was successfully', () => {
    const payload = { name: 'Project 1' }
    const expectedAction = {
      type: types.DELETE_PROJECT_SUCCESS,
      payload
    }

    expect(actions.deleteProjectSuccess(payload)).toEqual(expectedAction)
  })
})
