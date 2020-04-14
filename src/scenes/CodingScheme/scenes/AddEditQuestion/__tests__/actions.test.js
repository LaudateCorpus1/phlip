import actions, { types } from '../actions'

describe('CodingScheme - AddEditQuestion action creators', () => {
  test('should create an action to add a question', () => {
    const expected = { type: types.ADD_QUESTION_REQUEST, question: { id: 1 }, projectId: 4, parentId: 0 }
    expect(actions.addQuestionRequest({ id: 1 }, 4, 0)).toEqual(expected)
  })
  
  test('should create an action to add a child question', () => {
    const expected = {
      type: types.ADD_CHILD_QUESTION_REQUEST,
      question: { id: 1 },
      projectId: 4,
      parentId: 2,
      parentNode: { id: 2 },
      path: [1, 3]
    }
    
    expect(actions.addChildQuestionRequest({ id: 1 }, 4, 2, { id: 2 }, [1, 3])).toEqual(expected)
  })
  
  test('should create an action to update a question', () => {
    const expected = {
      type: types.UPDATE_QUESTION_REQUEST,
      question: { id: 1 },
      projectId: 4,
      questionId: 10,
      path: [1, 3]
    }
    expect(actions.updateQuestionRequest({ id: 1 }, 4, 10, [1, 3])).toEqual(expected)
  })
  
  test('should create an action to reset form error', () => {
    const expected = { type: types.RESET_ALERT_ERROR }
    expect(actions.resetFormError()).toEqual(expected)
  })
  
  test('should create an action to update type', () => {
    const expected = { type: types.UPDATE_TYPE }
    expect(actions.updateType()).toEqual(expected)
  })
})
