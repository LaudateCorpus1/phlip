import actions, { types } from '../actions'

describe('CodingValidation scene actions creators', () => {
  test('should create an action to get the next question', () => {
    const expectedAction = {
      type: types.GET_NEXT_QUESTION,
      id: 1,
      newIndex: 2,
      projectId: 1,
      jurisdictionId: 1
    }

    expect(actions.getNextQuestion(1, 2, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to get previous question', () => {
    const expectedAction = {
      type: types.GET_PREV_QUESTION,
      id: 1,
      newIndex: 2,
      projectId: 1,
      jurisdictionId: 1
    }

    expect(actions.getPrevQuestion(1, 2, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to get question in nav', () => {
    const expectedAction = {
      type: types.ON_QUESTION_SELECTED_IN_NAV,
      question: {},
      newIndex: null,
      projectId: 1,
      jurisdictionId: 1
    }

    expect(actions.onQuestionSelectedInNav({}, null, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to apply answer to all', () => {
    const expectedAction = {
      type: types.ON_APPLY_ANSWER_TO_ALL,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1
    }

    expect(actions.applyAnswerToAll(1, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to update the answer data', () => {
    const expectedAction = {
      type: types.UPDATE_USER_ANSWER,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      answerId: 1,
      answerValue: 1
    }
    expect(actions.updateUserAnswer(1, 1, 1, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to handle comment change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_COMMENT,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      comment: 'comment'
    }
    expect(actions.onChangeComment(1, 1, 1, 'comment')).toEqual(expectedAction)
  })

  test('should create an action to handle pincite change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_PINCITE,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      answerId: 1,
      pincite: 'pincite'
    }

    expect(actions.onChangePincite(1, 1, 1, 1, 'pincite')).toEqual(expectedAction)
  })

  test('should create an action to handle category change', () => {
    const expectedAction = {
      type: types.ON_CHANGE_CATEGORY,
      selection: 1
    }

    expect(actions.onChangeCategory(1)).toEqual(expectedAction)
  })

  test('should create an action to update edited by fields', () => {
    const expectedAction = {
      type: types.UPDATE_EDITED_FIELDS,
      projectId: 1
    }

    expect(actions.updateEditedFields(1)).toEqual(expectedAction)
  })

  test('should create an action to handle close code screen', () => {
    const expectedAction = {
      type: types.ON_CLOSE_SCREEN
    }

    expect(actions.onCloseScreen()).toEqual(expectedAction)
  })

  test('should create an action to clear answer errors', () => {
    const expectedAction = {
      type: types.CLEAR_ANSWER_ERROR
    }

    expect(actions.clearAnswerError()).toEqual(expectedAction)
  })

  test('should create an action to dismiss api alert', () => {
    const expectedAction = {
      type: types.DISMISS_API_ALERT,
      errorType: 'save'
    }

    expect(actions.dismissApiAlert('save')).toEqual(expectedAction)
  })

  test('should create an action to handle clearing answers', () => {
    const expectedAction = {
      type: types.ON_CLEAR_ANSWER,
      questionId: 1,
      projectId: 1,
      jurisdictionId: 1
    }

    expect(actions.onClearAnswer(1, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to show question loader', () => {
    const expectedAction = {
      type: types.ON_SHOW_QUESTION_LOADER
    }

    expect(actions.showQuestionLoader()).toEqual(expectedAction)
  })

  test('should create an action to show page loader', () => {
    const expectedAction = {
      type: types.ON_SHOW_PAGE_LOADER
    }

    expect(actions.showPageLoader()).toEqual(expectedAction)
  })

  test('should create an action to save the answer data', () => {
    const expectedAction = {
      type: types.SAVE_USER_ANSWER_REQUEST,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1
    }
    expect(actions.saveUserAnswerRequest(1, 1, 1)).toEqual(expectedAction)
  })

  test('should create an action to add request to queue', () => {
    const expectedAction = {
      type: types.ADD_REQUEST_TO_QUEUE,
      payload: {}
    }

    expect(actions.addRequestToQueue({})).toEqual(expectedAction)
  })

  test('should create an action to change touched status', () => {
    const expectedAction = {
      type: types.CHANGE_TOUCHED_STATUS
    }

    expect(actions.changeTouchedStatus()).toEqual(expectedAction)
  })

  test('should create an action to get a question', () => {
    const expectedAction = {
      type: types.GET_QUESTION_REQUEST,
      questionId: 1,
      projectId: 1
    }

    expect(actions.getQuestionRequest(1,1)).toEqual(expectedAction)
  })

  test('should create an action to get outline', () => {
    const expectedAction = {
      type: types.GET_OUTLINE_REQUEST,
      projectId: 1,
      jurisdictionId: 1
    }
    expect(actions.getOutlineRequest(1, 1)).toEqual(expectedAction)
  })

  test('should create an action to get user coded questions', () => {
    const expectedAction = {
      type: types.GET_USER_CODED_QUESTIONS_REQUEST,
      projectId: 1,
      jurisdictionId: 23
    }

    expect(actions.getUserCodedQuestions(1, 23)).toEqual(expectedAction)
  })

  test('should create an action to handle to save flag info', () => {
    const expectedAction = {
      type: types.ON_SAVE_FLAG,
      projectId: 1,
      jurisdictionId: 1,
      questionId: 1,
      flagInfo: { notes: 'lalala', type: 1 }
    }

    expect(actions.onSaveFlag(1, 1, 1, { notes: 'lalala', type: 1 })).toEqual(expectedAction)
  })

  test('should create an action to handle to save red flag info', () => {
    const expectedAction = {
      type: types.ON_SAVE_RED_FLAG_REQUEST,
      projectId: 1,
      questionId: 1,
      flagInfo: { notes: 'lalala', type: 3 }
    }

    expect(actions.onSaveRedFlag(1, 1, { notes: 'lalala', type: 3 })).toEqual(expectedAction)
  })

  test('should create an action to get user validated questions', () => {
    const expectedAction = {
      type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
      projectId: 2,
      jurisdictionId: 42
    }

    expect(actions.getUserValidatedQuestionsRequest(2, 42)).toEqual(expectedAction)
  })

  test('should create an action to clear flag', () => {
    const expectedAction = {
      type: types.CLEAR_FLAG,
      flagId: 2,
      projectId: 2,
      jurisdictionId: 2,
      questionId: 2
    }

    expect(actions.clearFlag(2,2,2,2)).toEqual(expectedAction)
  })

  test('should create an action to clear a red flag', () => {
    const expectedAction = {
      type: types.CLEAR_RED_FLAG,
      flagId: 2,
      questionId: 2,
      projectId: 2
    }

    expect(actions.clearRedFlag(2,2,2)).toEqual(expectedAction)
  })
})
