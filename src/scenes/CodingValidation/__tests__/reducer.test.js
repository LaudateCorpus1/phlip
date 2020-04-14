import { types } from '../actions'
import {
  INITIAL_STATE,
  COMBINED_INITIAL_STATE,
  default as codingValidationReducer,
  codingReducer as reducer
} from '../reducer'
import {
  schemeById,
  userAnswersCoded,
  schemeOutline,
  schemeUserAnswersEmpty,
  schemeOrder,
  schemeTree,
  mergedUserQuestions
} from 'utils/testData/coding'

const initial = INITIAL_STATE

const getCombinedState = (other = {}) => {
  return JSON.parse(JSON.stringify({
    ...COMBINED_INITIAL_STATE,
    coding: {
      ...initial,
      outline: { ...schemeOutline },
      scheme: {
        byId: { ...schemeById },
        tree: [...schemeTree],
        order: [...schemeOrder]
      },
      userAnswers: { ...userAnswersCoded },
      ...other
    }
  }))
}

const getState = (other = {}) => {
  return JSON.parse(JSON.stringify({
    ...initial,
    outline: { ...schemeOutline },
    scheme: {
      byId: { ...schemeById },
      tree: [...schemeTree],
      order: [...schemeOrder]
    },
    userAnswers: { ...userAnswersCoded },
    ...other
  }))
}

describe('CodingValidation reducer', () => {
  test('coding reducer should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
  
  test('combined reducer should return the combined initial state', () => {
    expect(codingValidationReducer(undefined, {}))
      .toEqual({ ...COMBINED_INITIAL_STATE, coding: { ...COMBINED_INITIAL_STATE.coding, showNextButton: false } })
  })
  
  describe('UPDATE_USER_ANSWER', () => {
    describe('for non category question children', () => {
      describe('binary / multiple choice type questions', () => {
        const action = {
          type: types.UPDATE_USER_ANSWER,
          answerId: 123,
          questionId: 1
        }
        
        test('should update state.userAnswers[1]', () => {
          const currentState = getState({ question: schemeById[1], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = reducer(currentState, action)
          
          expect(state.userAnswers).toEqual({
            ...currentState.userAnswers,
            1: {
              answers: { 123: { schemeAnswerId: 123, pincite: '', annotations: [] } },
              schemeQuestionId: 1,
              comment: ''
            }
          })
        })
        
        test('should copy action.otherUpdates to the question object in state.userAnswers', () => {
          const action = {
            type: types.UPDATE_USER_ANSWER,
            answerId: 123,
            questionId: 1,
            otherUpdates: {
              validatedBy: {
                userId: 1,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          }
          
          const currentState = getState({ question: schemeById[1], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = reducer(currentState, action)
          
          expect(state.userAnswers).toEqual({
            ...currentState.userAnswers,
            1: {
              answers: { 123: { schemeAnswerId: 123, pincite: '', annotations: [] } },
              schemeQuestionId: 1,
              comment: '',
              validatedBy: {
                userId: 1,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          })
        })
        
        test('should update state.scheme.tree[0].isAnswered to true', () => {
          const currentState = getCombinedState({ question: schemeById[1], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = codingValidationReducer(currentState, action)
          
          expect(state.coding.scheme.tree[0]).toEqual({ ...currentState.coding.scheme.tree[0], isAnswered: true })
        })
      })
      
      describe('checkbox / category choice type questions', () => {
        const action = {
          type: types.UPDATE_USER_ANSWER,
          answerId: 90,
          questionId: 2
        }
        
        test('should copy action.otherUpdates to the question object in state.userAnswers', () => {
          const action = {
            type: types.UPDATE_USER_ANSWER,
            answerId: 90,
            questionId: 2,
            otherUpdates: {
              validatedBy: {
                userId: 1,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          }
          
          const currentState = getState({ question: schemeById[2], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = reducer(currentState, action)
          
          expect(state.userAnswers).toEqual({
            ...currentState.userAnswers,
            2: {
              answers: { 90: { schemeAnswerId: 90, pincite: '', annotations: [] } },
              schemeQuestionId: 2,
              comment: '',
              validatedBy: {
                userId: 1,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          })
        })
        
        test('should update state.userAnswers[2]', () => {
          const currentState = getState({ question: schemeById[2], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = reducer(currentState, action)
          
          expect(state.userAnswers).toEqual({
            ...currentState.userAnswers,
            2: {
              comment: '',
              schemeQuestionId: 2,
              answers: {
                90: { schemeAnswerId: 90, pincite: '', annotations: [] }
              }
            }
          })
        })
        
        test('should update state.scheme.tree[1].isAnswered to true', () => {
          const currentState = getCombinedState({ question: schemeById[2], userAnswers: { ...schemeUserAnswersEmpty } })
          const state = codingValidationReducer(currentState, action)
          
          expect(state.coding.scheme.tree[1]).toEqual({ ...currentState.coding.scheme.tree[1], isAnswered: true })
        })
      })
    })
    
    describe('for category child questions', () => {
      xdescribe('binary / multiple choice type questions', () => {
      })
      
      describe('checkbox / category choice type questions', () => {
        test('should copy action.otherUpdates to the question object in state.userAnswers', () => {
          const action = {
            type: types.UPDATE_USER_ANSWER,
            answerId: 432,
            questionId: 4,
            otherUpdates: {
              validatedBy: {
                userId: 1,
                firstName: 'Test',
                lastName: 'User'
              }
            }
          }
          
          const currentState = getState({ question: schemeById[4], selectedCategoryId: 20, selectedCategory: 1 })
          const state = reducer(currentState, action)
          
          expect(state.userAnswers[4][20]).toEqual({
            answers: { 432: { schemeAnswerId: 432, pincite: '', annotations: [] } },
            schemeQuestionId: 4,
            comment: '',
            validatedBy: {
              userId: 1,
              firstName: 'Test',
              lastName: 'User'
            },
            categoryId: 20,
            flag: {
              notes: '',
              raisedBy: {},
              type: 0
            },
            hasMadePost: false,
            isNewCodedQuestion: false,
            id: 43
          })
        })
        
        describe('if action.answerId was already present in state.userAnswers', () => {
          test('should remove answer from state.userAnswers[4][10] if the answer was already present', () => {
            const action = {
              type: types.UPDATE_USER_ANSWER,
              answerId: 432,
              questionId: 4
            }
            
            const currentState = getState({ question: schemeById[4], selectedCategoryId: 10, selectedCategory: 0 })
            const state = reducer(currentState, action)
            
            expect(state.userAnswers).toEqual({
              ...currentState.userAnswers,
              4: {
                10: {
                  answers: {},
                  schemeQuestionId: 4,
                  comment: '',
                  validatedBy: {
                    userId: 1,
                    firstName: 'Test',
                    lastName: 'User'
                  },
                  categoryId: 10,
                  flag: {
                    notes: '',
                    raisedBy: {},
                    type: 0
                  },
                  hasMadePost: false,
                  id: 42,
                  isNewCodedQuestion: false
                },
                ...currentState.userAnswers[4]
              }
            })
          })
          
          test('should update state.scheme.tree[2].children[0].isAnswered to false', () => {
            const action = {
              type: types.UPDATE_USER_ANSWER,
              answerId: 432,
              questionId: 4
            }
            
            const currentState = getCombinedState({
              question: schemeById[4],
              selectedCategoryId: 10,
              selectedCategory: 0
            })
            
            const state = codingValidationReducer(currentState, action)
            
            expect(state.coding.scheme.tree[2].children[0].isAnswered).toEqual(false)
          })
          
          test('should update state.scheme.tree[2][0].completedProgress to 0', () => {
            const action = {
              type: types.UPDATE_USER_ANSWER,
              answerId: 432,
              questionId: 4
            }
            
            const currentState = getCombinedState({
              question: schemeById[4],
              selectedCategoryId: 10,
              selectedCategory: 0
            })
            const state = codingValidationReducer(currentState, action)
            
            expect(state.coding.scheme.tree[2].children[0].completedProgress).toEqual(0)
          })
        })
      })
    })
  })
  
  describe('SAVE_USER_ANSWER_SUCCESS', () => {
    test('should set state.unsavedChanges to true if there are messages in the queue', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          id: 10,
          questionId: 1,
          answerId: 23
        }
      }
      
      const currentState = getState({
        question: schemeById[1],
        userAnswers: {
          ...userAnswersCoded
        },
        scheme: {
          byId: schemeById,
          tree: []
        },
        messageQueue: ['lalala']
      })
      
      const state = reducer(currentState, action)
      expect(state.unsavedChanges).toEqual(true)
    })
    
    test('should set state.unsavedChanges to false if there are no messages in the queue', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          id: 10,
          questionId: 1,
          answerId: 23
        }
      }
      
      const currentState = getState({
        question: schemeById[1],
        userAnswers: {
          ...userAnswersCoded
        },
        scheme: {
          byId: schemeById,
          tree: []
        },
        messageQueue: []
      })
      
      const state = reducer(currentState, action)
      expect(state.unsavedChanges).toEqual(false)
    })
    
    describe('for regular, non-category questions', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          id: 10,
          questionId: 1,
          answerId: 23
        }
      }
      
      const currentState = getState({
        question: schemeById[1],
        scheme: {
          byId: schemeById,
          tree: []
        }
      })
      
      const state = reducer(currentState, action)
      
      test('should set the id from action.payload.id in userAnswers[questionId]', () => {
        expect(state.userAnswers[1].id).toEqual(10)
      })
      
      test('should set state.answerErrorContent to null', () => {
        expect(state.answerErrorContent).toEqual(null)
      })
    })
    
    describe('for category questions', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          id: 22,
          questionId: 4,
          answerId: 432,
          selectedCategoryId: 10
        }
      }
      
      const currentState = getState({
        question: schemeById[4],
        scheme: {
          byId: schemeById,
          tree: []
        },
        selectedCategoryId: 10
      })
      
      const state = reducer(currentState, action)
      
      test('should set the id from action.payload.id in userAnswers[questionId][selectedCategoryId]', () => {
        expect(state.userAnswers[4][10].id).toEqual(22)
      })
      
      test('should set state.answerErrorContent to null', () => {
        expect(state.answerErrorContent).toEqual(null)
      })
    })
  })
  
  describe('SAVE_USER_ANSWER_REQUEST', () => {
    describe('for regular, non-category questions', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_REQUEST,
        payload: {
          id: 10,
          questionId: 1,
          answerId: 23
        }
      }
      
      const currentState = getState({
        question: schemeById[1],
        scheme: {
          byId: schemeById,
          tree: []
        }
      })
      
      const state = reducer(currentState, action)
      
      test('should hasMadePost to true for userAnswers[questionId]', () => {
        expect(state.userAnswers[1].hasMadePost).toEqual(true)
      })
    })
    
    describe('for category questions', () => {
      const action = {
        type: types.SAVE_USER_ANSWER_REQUEST,
        payload: {
          id: 22,
          questionId: 4,
          answerId: 432,
          selectedCategoryId: 10
        }
      }
      
      const currentState = getState({
        question: schemeById[4],
        scheme: {
          byId: schemeById,
          tree: []
        },
        selectedCategoryId: 10
      })
      
      const state = reducer(currentState, action)
      
      test('should set hasMadePost to true for userAnswers[questionId][selectedCategoryId]', () => {
        expect(state.userAnswers[4][10].hasMadePost).toEqual(true)
      })
    })
  })
  
  describe('ADD_REQUEST_TO_QUEUE', () => {
    const action = {
      type: types.ADD_REQUEST_TO_QUEUE,
      payload: {
        queueId: '1-2-3',
        timeQueued: 1555419224,
        questionObj: {
          id: 4
        }
      }
    }
    
    const currentState = getState({
      messageQueue: [
        { questionObj: { id: 10 }, timeQueued: 1555419016, queueId: '1-2-4' },
        { questionObj: { id: 3 }, timeQueued: 1555332616, queueId: '1-2-3' }
      ]
    })
    
    const state = reducer(currentState, action)
    test('should remove old queued messages from state.messageQueue', () => {
      const index = state.messageQueue.findIndex(message => message.questionObj.id === 3)
      expect(index).toEqual(-1)
    })
    
    test('should not remove messages with a different queueId', () => {
      expect(state.messageQueue[0]).toEqual({
        questionObj: { id: 10 }, timeQueued: 1555419016, queueId: '1-2-4'
      })
    })
    
    test('should add action.payload to the end of state.messageQueue', () => {
      expect(state.messageQueue[1]).toEqual({ questionObj: { id: 4 }, timeQueued: 1555419224, queueId: '1-2-3' })
    })
    
    test('should set state.unsavedChanges to true', () => {
      expect(state.unsavedChanges).toEqual(true)
    })
  })
  
  describe('REMOVE_REQUEST_FROM_QUEUE', () => {
    const action = {
      type: types.REMOVE_REQUEST_FROM_QUEUE,
      payload: {
        questionObj: {
          id: 4
        },
        timeQueued: 1555419224,
        queueId: 12345
      }
    }
    
    const currentState = getState({
      messageQueue: [
        { questionObj: { id: 1 }, queueId: 1234, timeQueued: 1555419224 },
        { questionObj: { id: 10 }, queueId: 12345, timeQueued: 1555419016 }
      ]
    })
    
    const state = reducer(currentState, action)
    
    test(
      'should remove messages from state.messageQueue with queueId === action.payload.queueId and timeQueued < action.payload.timeQueued',
      () => {
        expect(state.messageQueue.length).toEqual(1)
        expect(state.messageQueue).toEqual([{ questionObj: { id: 1 }, queueId: 1234, timeQueued: 1555419224 }])
      }
    )
  })
  
  describe('SEND_QUEUE_REQUESTS', () => {
    test('should set state.unsavedChanges to true', () => {
      const action = { type: types.SEND_QUEUE_REQUESTS }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.unsavedChanges).toEqual(true)
    })
  })
  
  describe('SAVE_USER_ANSWER_FAIL', () => {
    const action = { type: types.SAVE_USER_ANSWER_FAIL, payload: { questionId: 1 } }
    const currentState = getState({
      question: schemeById[1], scheme: { byId: schemeById, tree: [] }
    })
    const state = reducer(currentState, action)
    test('should set state.answerErrorContent to "We couldn\'t save your answer for this question."', () => {
      expect(state.answerErrorContent).toEqual('We couldn\'t save your answer for this question.')
    })
    
    describe('should set hasMadePost to false for question at state.userAnswers[action.payload.questionId]', () => {
      test('should work for regular non-category questions', () => {
        const action = {
          type: types.SAVE_USER_ANSWER_FAIL,
          payload: { questionId: 1 }
        }
        
        const currentState = getState({
          question: schemeById[1], scheme: {
            byId: schemeById,
            tree: []
          }
        })
        const state = reducer(currentState, action)
        expect(state.userAnswers[1].hasMadePost).toEqual(false)
      })
      
      test('should work for category questions', () => {
        const action = { type: types.SAVE_USER_ANSWER_FAIL, payload: { questionId: 4, selectedCategoryId: 10 } }
        const currentState = getState({
          question: schemeById[4], scheme: { byId: schemeById, tree: [] }
        })
        const state = reducer(currentState, action)
        expect(state.userAnswers[4][10].hasMadePost).toEqual(false)
      })
    })
  })
  
  describe('OBJECT_EXISTS', () => {
    const action = {
      type: types.OBJECT_EXISTS, payload: {
        questionId: 1, object: {
          id: 201, answers: {
            21: {
              schemeAnswerId: 21, pincite: 'yolo'
            }
          }
        }
      }
    }
    
    const currentState = getState({
      question: schemeById[1],
      scheme: {
        byId: schemeById,
        tree: []
      }
    })
    
    const state = reducer(currentState, action)
    test(
      'should set state.answerErrorContent to "Something about this question has changed since you loaded the page. We couldn\'t save your answer."',
      () => {
        expect(state.answerErrorContent)
          .toEqual('Something about this question has changed since you loaded the page. We couldn\'t save your answer.')
      }
    )
    
    test('should set state.objectExists to true', () => {
      expect(state.objectExists).toEqual(true)
    })
    
    describe('should set userAnswers[action.payload.questionId] to action.payload.object', () => {
      test('should work for regular non - category questions', () => {
        const action = {
          type: types.OBJECT_EXISTS,
          payload: {
            questionId: 1,
            object: {
              id: 201, answers:
                {
                  21:
                    {
                      schemeAnswerId: 21, pincite:
                        'yolo'
                    }
                }
            }
          }
        }
        const currentState = getState({ question: schemeById[1], scheme: { byId: schemeById, tree: [] } })
        const state = reducer(currentState, action)
        
        expect(state.userAnswers[1].id).toEqual(201)
        expect(state.userAnswers[1].answers).toEqual({ 21: { schemeAnswerId: 21, pincite: 'yolo' } })
        expect(state.userAnswers[1].hasMadePost).toEqual(false)
      })
      
      test('should work for category questions', () => {
        const action = {
          type: types.OBJECT_EXISTS, payload: {
            questionId: 4,
            object: {
              id: 201,
              answers: {
                21: {
                  schemeAnswerId: 21, pincite: 'yolo'
                }
              }
            },
            selectedCategoryId: 10
          }
        }
        const currentState = getState({ question: schemeById[4], scheme: { byId: schemeById, tree: [] } })
        const state = reducer(currentState, action)
        
        expect(state.userAnswers[4][10].id).toEqual(201)
        expect(state.userAnswers[4][10].answers).toEqual({ 21: { schemeAnswerId: 21, pincite: 'yolo' } })
        expect(state.userAnswers[4][10].hasMadePost).toEqual(false)
      })
    })
  })
  
  describe('ON_CHANGE_COMMENT', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment'
      }
      
      const currentState = getState({
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: { 1: { schemeAnswerId: 1 } },
            comment: ''
          }
        }, question: { id: 2 }
      })
      
      const state = reducer(currentState, action)
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: { schemeQuestionId: 2, answers: { 1: { schemeAnswerId: 1 } }, comment: 'new comment' }
      })
    })
    
    test('should handle category questions', () => {
      const action = {
        type: types.ON_CHANGE_COMMENT,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        comment: 'new comment for cat 1'
      }
      
      const currentState = getState({
        question: {
          text: 'la la la',
          questionType: 2,
          id: 2,
          parentId: 0,
          positionInParent: 1,
          possibleAnswers: [{ id: 90, text: 'check 1' }, { id: 91, text: 'check 2' }],
          isCategoryQuestion: true
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: { answers: { 5: { schemeAnswerId: 5 } }, comment: 'comment for cat 1', flag: {} },
            2: { answers: {}, comment: 'comment for cat 2', flag: {} }
          }
        },
        selectedCategory: 0,
        selectedCategoryId: 3,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })
      
      const state = reducer(currentState, action)
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: { answers: { 5: { schemeAnswerId: 5 } }, comment: 'new comment for cat 1', flag: {} },
          2: { answers: {}, comment: 'comment for cat 2', flag: {} }
        }
      })
    })
  })
  
  describe('ON_CHANGE_PINCITE', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }
      
      const currentState = getState({
        question: { questionType: 3, id: 2 },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: { 1: { schemeAnswerId: 1, pincite: '' }, 4: { schemeAnswerId: 4, pincite: '' } },
            comment: ''
          }
        }
      })
      
      const state = reducer(currentState, action)
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: {
          schemeQuestionId: 2,
          answers: { 1: { schemeAnswerId: 1, pincite: '' }, 4: { schemeAnswerId: 4, pincite: 'this is a pincite' } },
          comment: ''
        }
      })
    })
    
    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CHANGE_PINCITE,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1,
        answerId: 4,
        pincite: 'this is a pincite'
      }
      
      const currentState = getState({
        question: { questionType: 3, isCategoryQuestion: true, id: 2 },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: { answers: { 4: { schemeAnswerId: 4, pincite: 'pincite!' } }, comment: '' },
            2: { answers: { 4: { schemeAnswerId: 4, pincite: '' } }, comment: '' }
          }
        },
        selectedCategory: 1,
        selectedCategoryId: 2,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: { answers: { 4: { schemeAnswerId: 4, pincite: 'pincite!' } }, comment: '' },
          2: { answers: { 4: { schemeAnswerId: 4, pincite: 'this is a pincite' } }, comment: '' }
        }
      })
    })
  })
  
  describe('ON_SAVE_ANNOTATION', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_SAVE_ANNOTATION,
        questionId: 1,
        answerId: 123,
        annotation: {
          text: 'text annotation',
          rects: []
        },
        citation: '123-123'
      }
      
      const currentState = getState({ question: schemeById[1], userAnswers: { ...userAnswersCoded } })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...userAnswersCoded,
        1: {
          ...userAnswersCoded[1],
          answers: {
            ...userAnswersCoded[1].answers,
            123: {
              ...userAnswersCoded[1].answers[123],
              pincite: `${userAnswersCoded[1].answers[123].pincite}; 123-123`,
              annotations: [{ text: 'text annotation', rects: [] }]
            }
          }
        }
      })
    })
    
    test('should handle category child questions', () => {
      const action = {
        type: types.ON_SAVE_ANNOTATION,
        questionId: 4,
        answerId: 432,
        annotation: {
          text: 'text annotation', rects: []
        },
        citation: '123-123'
      }
      
      const currentState = getState({
        question: schemeById[4],
        selectedCategory: 0,
        selectedCategoryId: 10,
        categories: [{ id: 10, text: 'cat 1' }, { id: 20, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        4: {
          ...currentState.userAnswers[4],
          10: {
            ...currentState.userAnswers[4][10],
            answers: {
              432: {
                ...currentState.userAnswers[4][10].answers[432],
                pincite: '123-123',
                annotations: [{ text: 'text annotation', rects: [] }]
              }
            }
          }
        }
      })
    })
  })
  
  describe('ON_REMOVE_ANNOTATION', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_REMOVE_ANNOTATION,
        index: 1,
        questionId: 1,
        answerId: 123
      }
      
      const currentState = getState({
        question: schemeById[1],
        userAnswers: {
          ...userAnswersCoded,
          1: {
            ...userAnswersCoded[1],
            answers: {
              123: {
                ...userAnswersCoded[1].answers[123],
                annotations: [{ text: 'text annotation', rects: [] }, { text: 'text annotation 2', rects: [] }]
              }
            }
          }
        }
      })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...userAnswersCoded,
        1: {
          ...userAnswersCoded[1],
          answers: {
            ...userAnswersCoded[1].answers,
            123: {
              ...userAnswersCoded[1].answers[123],
              annotations: [{ text: 'text annotation', rects: [] }]
            }
          }
        }
      })
    })
    
    test('should handle category child questions', () => {
      const action = {
        type: types.ON_REMOVE_ANNOTATION,
        index: 0,
        questionId: 4,
        answerId: 432
      }
      
      const currentState = getState({
        question: schemeById[4],
        userAnswers: {
          ...userAnswersCoded,
          4: {
            ...userAnswersCoded[4],
            10: {
              ...userAnswersCoded[4][10],
              answers: {
                432: {
                  ...userAnswersCoded[4][10].answers[432],
                  annotations: [{ text: 'text annotation', rects: [] }]
                }
              }
            }
          }
        },
        selectedCategory: 0,
        selectedCategoryId: 10,
        categories: [{ id: 10, text: 'cat 1' }, { id: 20, text: 'cat 2' }]
      })
      
      const state = reducer(currentState, action)
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        4: {
          ...currentState.userAnswers[4],
          10: {
            ...currentState.userAnswers[4][10],
            answers: {
              432: {
                ...currentState.userAnswers[4][10].answers[432],
                annotations: []
              }
            }
          }
        }
      })
    })
  })
  
  describe('ON_CHANGE_CATEGORY', () => {
    const action = {
      type: types.ON_CHANGE_CATEGORY,
      selection: 1
    }
    
    const currentState = getState({
      question: schemeById[4],
      categories: [{ id: 9 }, { id: 10 }]
    })
    
    const state = reducer(currentState, action)
    
    test('should set state.selectedCategory to action.selection', () => {
      expect(state.selectedCategory).toEqual(1)
    })
    
    test('should set state.selectedCategoryId to state.categories[action.selection].id', () => {
      expect(state.selectedCategoryId).toEqual(10)
    })
  })
  
  describe('RESET_ANSWER', () => {
    describe('if question is not a category question', () => {
      const action = {
        type: types.RESET_ANSWER,
        questionId: 3
      }
      
      const currentState = getState({
        question: schemeById[3],
        answerSnapshot: userAnswersCoded[3],
        usersAnswers: {
          ...userAnswersCoded,
          3: {
            ...userAnswersCoded[3],
            answers: {
              20: { schemeAnswerId: 20, pincite: '', annotations: [], textAnswer: null }
            }
          }
        }
      })
      const state = reducer(currentState, action)
      
      test('should reset the answer to the initial state', () => {
        expect(state.userAnswers[3].answers.hasOwnProperty(10)).toEqual(true)
        expect(state.userAnswers[3].answers[10]).toEqual({
          schemeAnswerId: 10,
          pincite: '',
          annotations: [{ text: '323123', id: 4, docId: '12344' }, { text: 'hi hi', id: 1, docId: '12344' }],
          textAnswer: null
        })
      })
    })
    
    describe('if question is a category question', () => {
      const action = { type: types.RESET_ANSWER, questionId: 4 }
      const currentState = getState({
        question: schemeById[4],
        answerSnapshot: userAnswersCoded[4][10],
        selectedCategoryId: 10,
        usersAnswers: {
          ...userAnswersCoded,
          4: {
            ...userAnswersCoded[4],
            10: { schemeAnswerId: 20, pincite: '', annotations: [], textAnswer: 'this is a text answer' }
          }
        }
      })
      const state = reducer(currentState, action)
      
      test('should reset the answer for only selected category to the initial state', () => {
        expect(state.userAnswers[4].hasOwnProperty(10)).toEqual(true)
        expect(state.userAnswers[4][10]).toEqual({
          answers: { 432: { schemeAnswerId: 432, pincite: '', annotations: [], textAnswer: null } },
          comment: '',
          schemeQuestionId: 4,
          flag: {
            notes: '',
            raisedBy: {},
            type: 0
          },
          isNewCodedQuestion: false,
          categoryId: 10,
          hasMadePost: false,
          id: 42
        })
        expect(state.userAnswers[4][20]).toEqual({
          ...userAnswersCoded[4][20]
        })
      })
    })
  })
  
  describe('SET_UNSAVED_CHANGES', () => {
    const action = { type: types.SET_UNSAVED_CHANGES, unsavedChanges: true }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set whether there are unsaved changes', () => {
      expect(state.unsavedChanges).toEqual(true)
    })
  })
  
  describe('GET_QUESTION_SUCCESS', () => {
    const payload = {
      updatedState: {
        question: schemeById[2],
        userAnswers: userAnswersCoded,
        scheme: {
          byId: schemeById,
          tree: schemeTree,
          order: schemeOrder
        }
      },
      question: schemeById[2],
      currentIndex: 1,
      errors: {}
    }
    
    const action = { type: types.GET_QUESTION_SUCCESS, payload }
    const currentState = getState({ question: schemeById[1] })
    const state = reducer(currentState, action)
    
    test('should update state with action.payload.updatedState', () => {
      expect(state.question).toEqual(schemeById[2])
    })
    
    describe('when new question is not a category question', () => {
      const action = { type: types.GET_QUESTION_SUCCESS, payload }
      const currentState = getState({ question: schemeById[1] })
      
      const state = reducer(currentState, action)
      test('should set state.selectedCategory to 0', () => {
        expect(state.selectedCategory).toEqual(0)
      })
      
      test('should set state.selectedCategoryId to null', () => {
        expect(state.selectedCategoryId).toEqual(null)
      })
      
      test('should set state.categories to undefined', () => {
        expect(state.categories).toEqual(undefined)
      })
      
      test('should initialize state.userAnswers[action.payload.questionId]', () => {
        expect(state.userAnswers[2]).toEqual({
          answers: {},
          flag: {
            raisedBy: {},
            notes: '',
            type: 0
          },
          isNewCodedQuestion: true,
          hasMadePost: false,
          schemeQuestionId: 2,
          comment: ''
        })
      })
    })
    
    describe('when new question is a category question', () => {
      const action = {
        type: types.GET_QUESTION_SUCCESS,
        payload: {
          ...payload,
          updatedState: {
            ...payload.updatedState,
            question: schemeById[4],
            selectedCategory: 0
          },
          question: schemeById[4],
          currentIndex: 3
        }
      }
      
      const currentState = getState({ question: schemeById[1] })
      const state = reducer(currentState, action)
      
      test('should set state.categories to the selected answer choices of the parent question', () => {
        expect(state.categories).toEqual([
          { id: 10, text: 'category 2', order: 2 },
          { id: 20, text: 'category 3', order: 3 }
        ])
      })
      
      test('should set state.selectedCategory to action.payload.updatedState.selectedCategory', () => {
        expect(state.selectedCategory).toEqual(0)
      })
      
      test('should set state.selectedCategoryId to state.categories[action.payload.selectedCategory].id', () => {
        expect(state.selectedCategoryId).toEqual(10)
      })
      
      test('should initialize state.userAnswers[action.payload.questionId][category] for each category', () => {
        expect(state.userAnswers[4].hasOwnProperty('10')).toEqual(true)
        expect(state.userAnswers[4].hasOwnProperty('20')).toEqual(true)
      })
      
      test(
        'should initialize state.userAnswers with empty answer obj for each category if no existing answers are present',
        () => {
          const action = {
            type: types.GET_QUESTION_SUCCESS,
            payload: {
              ...payload,
              updatedState: {
                ...payload.updatedState,
                question: schemeById[4],
                selectedCategory: 0,
                userAnswers: {
                  ...userAnswersCoded,
                  3: {
                    ...userAnswersCoded[3],
                    answers: {
                      ...userAnswersCoded[3].answers,
                      5: { schemeAnswerId: 5, categoryId: 5 }
                    }
                  }
                }
              },
              question: schemeById[4],
              currentIndex: 3
            }
          }
          
          const currentState = getState({
            question: schemeById[1],
            userAnswers: {
              ...userAnswersCoded,
              3: {
                ...userAnswersCoded[3],
                answers: {
                  ...userAnswersCoded[3].answers,
                  5: { schemeAnswerId: 5, categoryId: 5 }
                }
              }
            }
          })
          
          const state = reducer(currentState, action)
          
          expect(state.userAnswers[4][5]).toEqual({
            answers: {},
            categoryId: 5,
            schemeQuestionId: 4,
            flag: {
              notes: '',
              raisedBy: {},
              type: 0
            },
            hasMadePost: false,
            isNewCodedQuestion: true,
            comment: ''
          })
        }
      )
      
      test('should initialize state.userAnswers and keep existing answers', () => {
        expect(state.userAnswers[4][10]).toEqual({
          answers: {
            432: {
              annotations: [],
              pincite: '',
              schemeAnswerId: 432,
              textAnswer: null
            }
          },
          categoryId: 10,
          schemeQuestionId: 4,
          flag: {
            notes: '',
            raisedBy: {},
            type: 0
          },
          isNewCodedQuestion: false,
          hasMadePost: false,
          id: 42,
          comment: ''
        })
      })
    })
    
    describe('when new question.parentId === 0', () => {
      const action = {
        type: types.GET_QUESTION_SUCCESS,
        payload
      }
      
      const currentState = getState({ question: schemeById[1] })
      const state = reducer(currentState, action)
      
      test('should set state.selectedCategory to 0', () => {
        expect(state.selectedCategory).toEqual(0)
      })
      
      test('should set state.selectedCategoryId to null', () => {
        expect(state.selectedCategoryId).toEqual(null)
      })
      
      test('should set state.categories to undefined', () => {
        expect(state.categories).toEqual(undefined)
      })
    })
    
    test('should no open an alert if there are no errors', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
    
    test('should set state.questionChangeLoader to false', () => {
      expect(state.questionChangeLoader).toEqual(false)
    })
    
    test('should set state.isChangingQuestion to false', () => {
      expect(state.isChangingQuestion).toEqual(false)
    })
    
    test('should set state.unsavedChanges to false', () => {
      expect(state.unsavedChanges).toEqual(false)
    })
    
    describe('handling errors', () => {
      const action = {
        type: types.GET_QUESTION_SUCCESS,
        payload: {
          ...payload,
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          }
        }
      }
      
      const currentState = getState({ question: schemeById[1] })
      const state = reducer(currentState, action)
      
      test('should open an alert if there are errors', () => {
        expect(state.apiErrorAlert.text).toEqual('omg this is an error.\n\nomg this is another error.')
        expect(state.apiErrorAlert.open).toEqual(true)
      })
    })
  })
  
  describe('GET_OUTLINE_SUCCESS', () => {
    const action = {
      type: types.GET_OUTLINE_SUCCESS,
      payload: {
        userAnswers: userAnswersCoded,
        scheme: {
          byId: schemeById,
          tree: schemeTree,
          order: schemeOrder
        },
        mergedUserQuestions: null,
        areJurisdictionsEmpty: false,
        isSchemeEmpty: false,
        outline: schemeOutline,
        question: schemeById[3],
        errors: {},
        user: {
          role: 'Admin'
        }
      }
    }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.userAnswers to action.payload.userAnswers', () => {
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
    
    test('should set state.question to action.payload.question', () => {
      expect(state.question).toEqual(schemeById[3])
    })
    
    test('should set state.scheme to action.payload.scheme', () => {
      expect(state.scheme).toEqual({ byId: schemeById, tree: schemeTree, order: schemeOrder })
    })
    
    test('should set state.outline to action.payload.outline', () => {
      expect(state.outline).toEqual(schemeOutline)
    })
    
    test('should set state.categories to undefined', () => {
      expect(state.categories).toEqual(undefined)
    })
    
    test('should set state.areJurisdictionsEmpty to action.payload.areJurisdictionsEmpty', () => {
      expect(state.areJurisdictionsEmpty).toEqual(false)
    })
    
    test('should set state.isSchemeEmpty to action.payload.isSchemeEmpty', () => {
      expect(state.isSchemeEmpty).toEqual(false)
    })
    
    test('should set state.schemeError to null', () => {
      expect(state.schemeError).toEqual(null)
    })
    
    test('should set state.isLoadingPage to false', () => {
      expect(state.isLoadingPage).toEqual(false)
    })
    
    test('should set state.getRequestInProgress to false', () => {
      expect(state.getRequestInProgress).toEqual(false)
    })
    
    test('should set state.showPageLoader to false', () => {
      expect(state.showPageLoader).toEqual(false)
    })
    
    test('should not open an alert if there are no errors', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
    
    test('should set not disable all if action.payload.errors.codedValQuestions does not exist', () => {
      expect(state.disableAll).toEqual(false)
    })
    
    describe('handling errors', () => {
      const action = {
        type: types.GET_OUTLINE_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          isSchemeEmpty: false,
          areJurisdictionsEmpty: false,
          outline: schemeOutline,
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          },
          user: {
            role: 'Admin'
          }
        }
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should open an alert if there are errors', () => {
        expect(state.apiErrorAlert.text).toEqual('omg this is an error.\n\nomg this is another error.')
      })
      
      test('should disable all actions if failure when retrieving answers', () => {
        expect(state.disableAll).toEqual(true)
      })
    })
    
    describe('setting the getting started text', () => {
      const baseAction = {
        type: types.GET_OUTLINE_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          mergedUserQuestions: null,
          outline: schemeOutline,
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          }
        }
      }
      const currentState = getState()
      
      describe('if the user is a coder', () => {
        const action = {
          ...baseAction,
          payload: {
            ...baseAction.payload,
            user: {
              role: 'Coder'
            },
            areJurisdictionsEmpty: true,
            isSchemeEmpty: false
          }
        }
        
        const state = reducer(currentState, action)
        
        test('should set the text', () => {
          expect(state.gettingStartedText)
            .toEqual('The coordinator for this project has not created a coding scheme or added jurisdictions.')
        })
      })
      
      describe('if the user is not a coder', () => {
        const uAction = {
          ...baseAction,
          payload: {
            ...baseAction.payload,
            user: {
              role: 'Admin'
            }
          }
        }
        
        test('should set if only jurisdictions are empty', () => {
          const action = {
            ...uAction,
            payload: {
              ...uAction.payload,
              areJurisdictionsEmpty: true,
              isSchemeEmpty: false
            }
          }
          
          const state = reducer(currentState, action)
          expect(state.gettingStartedText).toEqual('You must add jurisdictions to the project before coding.')
        })
        
        test('should set if only scheme is empty', () => {
          const action = {
            ...uAction,
            payload: {
              ...uAction.payload,
              areJurisdictionsEmpty: false,
              isSchemeEmpty: true
            }
          }
          
          const state = reducer(currentState, action)
          expect(state.gettingStartedText).toEqual('You must add questions to the coding scheme before coding.')
        })
        
        test('should set if both jurisdictions and scheme are empty', () => {
          const action = {
            ...uAction,
            payload: {
              ...uAction.payload,
              areJurisdictionsEmpty: true,
              isSchemeEmpty: true
            }
          }
          
          const state = reducer(currentState, action)
          expect(state.gettingStartedText)
            .toEqual('You must add jurisdictions and questions to the coding scheme before coding.')
        })
      })
    })
  })
  
  describe('GET_OUTLINE_SUCCESS Validation', () => {
    const action = {
      type: types.GET_OUTLINE_SUCCESS,
      payload: {
        userAnswers: userAnswersCoded,
        scheme: {
          byId: schemeById,
          tree: schemeTree,
          order: schemeOrder
        },
        areJurisdictionsEmpty: false,
        isSchemeEmpty: false,
        outline: schemeOutline,
        question: schemeById[3],
        errors: {},
        mergedUserQuestions,
        user: {
          role: 'Admin'
        }
      }
    }
    const currentState = getState({ page: 'validation' })
    const state = reducer(currentState, action)
    
    test('should set state.userAnswers to action.payload.userAnswers', () => {
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
    
    test('should set state.question to action.payload.question', () => {
      expect(state.question).toEqual(schemeById[3])
    })
    
    test('should set state.scheme to action.payload.scheme', () => {
      expect(state.scheme).toEqual({ byId: schemeById, tree: schemeTree, order: schemeOrder })
    })
    
    test('should set state.outline to action.payload.outline', () => {
      expect(state.outline).toEqual(schemeOutline)
    })
    
    test('should set state.categories to undefined', () => {
      expect(state.categories).toEqual(undefined)
    })
    
    test('should set state.areJurisdictionsEmpty to action.payload.areJurisdictionsEmpty', () => {
      expect(state.areJurisdictionsEmpty).toEqual(false)
    })
    
    test('should set state.isSchemeEmpty to action.payload.isSchemeEmpty', () => {
      expect(state.isSchemeEmpty).toEqual(false)
    })
    
    test('should set state.schemeError to null', () => {
      expect(state.schemeError).toEqual(null)
    })
    
    test('should set state.isLoadingPage to false', () => {
      expect(state.isLoadingPage).toEqual(false)
    })
    
    test('should set state.getRequestInProgress to false', () => {
      expect(state.getRequestInProgress).toEqual(false)
    })
    
    test('should set state.showPageLoader to false', () => {
      expect(state.showPageLoader).toEqual(false)
    })
    
    test('should not open an alert if there are no errors', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
    
    test(
      'should set not disable all actions if there were no errors',
      () => {
        expect(state.disableAll).toEqual(false)
      }
    )
    
    test('should set state.mergedUserQuestions to action.payload.mergedUserQuestions', () => {
      expect(state.mergedUserQuestions).toEqual(mergedUserQuestions)
    })
    
    describe('handling errors', () => {
      const action = {
        type: types.GET_OUTLINE_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          isSchemeEmpty: false,
          areJurisdictionsEmpty: false,
          mergedUserQuestions,
          outline: schemeOutline,
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          },
          user: {
            role: 'Admin'
          }
        }
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should open an alert if there are errors', () => {
        expect(state.apiErrorAlert.text).toEqual('omg this is an error.\n\nomg this is another error.')
      })
      
      test('should disable all actions if failure when retrieving answers', () => {
        expect(state.disableAll).toEqual(true)
      })
    })
    
    describe('setting the getting started text', () => {
      const currentState = getState({ page: 'validation' })
      const baseAction = {
        type: types.GET_OUTLINE_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          mergedUserQuestions,
          outline: schemeOutline,
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          },
          user: {
            role: 'Admin'
          }
        }
      }
      
      test('should set if only jurisdictions are empty', () => {
        const action = {
          ...baseAction,
          payload: {
            ...baseAction.payload,
            areJurisdictionsEmpty: true,
            isSchemeEmpty: false
          }
        }
        const state = reducer(currentState, action)
        expect(state.gettingStartedText).toEqual('This project doesn\'t have jurisdictions.')
      })
      
      test('should set if only scheme is empty', () => {
        const action = {
          ...baseAction,
          payload: {
            ...baseAction.payload,
            areJurisdictionsEmpty: false,
            isSchemeEmpty: true
          }
        }
        const state = reducer(currentState, action)
        expect(state.gettingStartedText).toEqual('This project doesn\'t have a coding scheme.')
      })
      
      test('should set if both jurisdictions and scheme are empty', () => {
        const action = {
          ...baseAction,
          payload: {
            ...baseAction.payload,
            areJurisdictionsEmpty: true,
            isSchemeEmpty: true
          }
        }
        const state = reducer(currentState, action)
        expect(state.gettingStartedText).toEqual('This project does not have a coding scheme or jurisdictions.')
      })
    })
  })
  
  describe('GET_OUTLINE_REQUEST', () => {
    const action = { type: types.GET_OUTLINE_REQUEST }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.isLoadingPage to true', () => {
      expect(state.isLoadingPage).toEqual(true)
    })
    
    test('should set state.getRequestInProgress to true', () => {
      expect(state.getRequestInProgress).toEqual(true)
    })
  })
  
  describe('GET_OUTLINE_FAIL', () => {
    const action = { type: types.GET_OUTLINE_FAIL, payload: 'Failed to get scheme' }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.schemeError to action.payload', () => {
      expect(state.schemeError).toEqual('Failed to get scheme')
    })
    
    test('should set state.isLoadingPage to false', () => {
      expect(state.isLoadingPage).toEqual(false)
    })
    
    test('should set state.showPageLoader to false', () => {
      expect(state.showPageLoader).toEqual(false)
    })
    
    test('should set state.getRequestInProgress to false', () => {
      expect(state.getRequestInProgress).toEqual(false)
    })
  })
  
  describe('ON_SAVE_RED_FLAG_SUCCESS', () => {
    const action = {
      type: types.ON_SAVE_RED_FLAG_SUCCESS,
      payload: { type: 1, notes: 'red flag', raisedBy: { userId: 1 } }
    }
    
    const currentState = getState({
      question: schemeById[1],
      scheme: { byId: schemeById, tree: schemeTree }
    })
    
    const state = reducer(currentState, action)
    
    test('should set state.question.flags[] to be action.payload', () => {
      expect(state.question.flags).toEqual([{ type: 1, notes: 'red flag', raisedBy: { userId: 1 } }])
    })
    
    test('should set state.scheme.byId[state.question.id].flags to be action.payload', () => {
      expect(state.scheme.byId[1].flags).toEqual([{ type: 1, notes: 'red flag', raisedBy: { userId: 1 } }])
    })
    
    test('should set state.unsavedChanges to false', () => {
      expect(state.unsavedChanges).toEqual(false)
    })
  })
  
  describe('ON_SAVE_RED_FLAG_FAIL', () => {
    const action = { type: types.ON_SAVE_RED_FLAG_FAIL }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should open an alert with "We couldn\'t save the flag for this question."', () => {
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t save the flag for this question.')
      expect(state.apiErrorAlert.open).toEqual(true)
    })
  })
  
  describe('ON_SAVE_FLAG', () => {
    const action = { type: types.ON_SAVE_FLAG, flagInfo: { notes: 'my flag', raisedBy: { userId: 1 }, type: 1 } }
    const currentState = getState({
      scheme: { byId: schemeById, tree: schemeTree },
      userAnswers: userAnswersCoded,
      question: schemeById[1]
    })
    const state = reducer(currentState, action)
    
    test('should set state.unsavedChanges to true', () => {
      expect(state.unsavedChanges).toEqual(true)
    })
    
    describe('should update state.userAnswers with new flag info', () => {
      test('should handle non-category questions', () => {
        const currentState = getState({
          scheme: { byId: schemeById, tree: schemeTree },
          userAnswers: userAnswersCoded,
          question: schemeById[1]
        })
        const state = reducer(currentState, action)
        expect(state.userAnswers[1].flag).toEqual({
          notes: 'my flag',
          raisedBy: { userId: 1 },
          type: 1
        })
      })
      
      test('should handle category questions', () => {
        const currentState = getState({
          scheme: { byId: schemeById, tree: schemeTree },
          userAnswers: userAnswersCoded,
          question: schemeById[4],
          selectedCategoryId: 10
        })
        const state = reducer(currentState, action)
        expect(state.userAnswers[4][10].flag).toEqual({
          notes: 'my flag',
          raisedBy: { userId: 1 },
          type: 1
        })
      })
    })
  })
  
  describe('GET_USER_CODED_QUESTIONS_SUCCESS', () => {
    const action = {
      type: types.GET_USER_CODED_QUESTIONS_SUCCESS,
      payload: {
        userAnswers: userAnswersCoded,
        scheme: {
          byId: schemeById,
          tree: schemeTree,
          order: schemeOrder
        },
        question: schemeById[3],
        errors: {}
      }
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.userAnswers to action.payload.userAnswers', () => {
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
    
    test('should set state.question to action.payload.question', () => {
      expect(state.question).toEqual(schemeById[3])
    })
    
    test('should set state.scheme to action.payload.scheme', () => {
      expect(state.scheme).toEqual({ byId: schemeById, tree: schemeTree, order: schemeOrder })
    })
    
    test('should not open an alert if there are no errors', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
    
    test('should not disable all if there were no errors', () => {
      expect(state.disableAll).toEqual(false)
    })
    
    test('should set state.isLoadingPage to false', () => {
      expect(state.isLoadingPage).toEqual(false)
    })
    
    test('should set state.showPageLoader to false', () => {
      expect(state.showPageLoader).toEqual(false)
    })
    
    describe('handling errors', () => {
      const action = {
        type: types.GET_USER_CODED_QUESTIONS_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          }
        }
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should open an alert if there are errors', () => {
        expect(state.apiErrorAlert.text).toEqual('omg this is an error.\n\nomg this is another error.')
        expect(state.apiErrorAlert.open).toEqual(true)
      })
      
      test('should disable all actions if failure when retrieving answers', () => {
        expect(state.disableAll).toEqual(true)
      })
    })
  })
  
  describe('GET_USER_CODED_QUESTIONS_REQUEST', () => {
    const action = { type: types.GET_USER_CODED_QUESTIONS_REQUEST }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should clear disabling rules', () => {
      expect(state.disableAll).toEqual(false)
    })
    
    test('should set state.isLoadingPage to true', () => {
      expect(state.isLoadingPage).toEqual(true)
    })
  })
  
  describe('GET_USER_VALIDATED_QUESTIONS_REQUEST', () => {
    const action = { type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should clear disabling rules', () => {
      expect(state.disableAll).toEqual(false)
    })
    
    test('should set state.isLoadingPage to true', () => {
      expect(state.isLoadingPage).toEqual(true)
    })
  })
  
  describe('ON_SAVE_RED_FLAG_REQUEST', () => {
    const action = { type: types.ON_SAVE_RED_FLAG_REQUEST }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.unsavedChanges to true', () => {
      expect(state.unsavedChanges).toEqual(true)
    })
  })
  
  describe('CLEAR_FLAG_SUCCESS', () => {
    const current = {
      question: schemeById[1],
      scheme: {
        byId: schemeById,
        tree: schemeTree,
        order: schemeOrder
      },
      mergedUserQuestions
    }
    
    describe('if flag is red', () => {
      const action = { type: types.CLEAR_FLAG_SUCCESS, payload: { type: 1 } }
      const currentState = getState(current)
      const state = reducer(currentState, action)
      
      test('should set state.question.flags to an empty array', () => {
        expect(state.question.flags).toEqual([])
      })
      
      test('should set state.scheme.byId[state.question.id].flags to an empty array', () => {
        expect(state.scheme.byId[1].flags).toEqual([])
      })
    })
    
    describe('if flag is green or yellow', () => {
      describe('if state.question is not a category question', () => {
        test(
          'should remove the flag with id: action.payload.flagId from the question in state.mergedUserQuestions if there is no comment attached',
          () => {
            const action = { type: types.CLEAR_FLAG_SUCCESS, payload: { type: 2, flagId: 4 } }
            const currentState = getState(current)
            const state = reducer(currentState, action)
            expect(state.mergedUserQuestions[1].flagsComments).toEqual([])
          }
        )
        
        test('should keep the flagsComments object but without the flag information if a comment is present', () => {
          const action = { type: types.CLEAR_FLAG_SUCCESS, payload: { type: 2, flagId: 5 } }
          const currentState = getState({ ...current, question: schemeById[3] })
          const state = reducer(currentState, action)
          expect(state.mergedUserQuestions[3].flagComments)
            .toEqual([{ comment: 'this is my comment', raisedBy: { userId: 3 } }])
        })
      })
      
      describe('if state.question is a category question', () => {
        const action = { type: types.CLEAR_FLAG_SUCCESS, payload: { type: 2, flagId: 2 } }
        const currentState = getState({ ...current, question: schemeById[4], selectedCategoryId: 10 })
        const state = reducer(currentState, action)
        test(
          'should remove the flag with id: action.payload.flagId from the question in state.mergedUserQuestions',
          () => {
            expect(state.mergedUserQuestions[4][10].flagsComments)
              .toEqual([{ id: 1, type: 3, notes: 'flag notes', comment: '', raisedBy: { userId: 2 } }])
          }
        )
      })
    })
  })
  
  describe('APPLY_ANSWER_TO_ALL', () => {
    const currentState = getState({
      question: schemeById[4],
      categories: [{ id: 10, text: 'cat 1' }, { id: 20, text: 'cat 2' }],
      selectedCategoryId: 10
    })
    
    test('should apply answers to all categories in state.userAnswers', () => {
      const action = {
        type: types.ON_APPLY_ANSWER_TO_ALL,
        jurisdictionId: 1,
        projectId: 3,
        questionId: 4
      }
      
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        4: {
          10: { ...currentState.userAnswers[4][10] },
          20: {
            ...currentState.userAnswers[4][20],
            answers: { 432: { schemeAnswerId: 432, pincite: '', annotations: [], textAnswer: null } }
          }
        }
      })
    })
  })
  
  describe('ON_CLEAR_ANSWER', () => {
    test('should handle regular questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }
      
      const currentState = getState({
        question: {
          questionType: 3,
          id: 2
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            answers: {
              1: {
                schemeAnswerId: 1,
                pincite: ''
              },
              4: {
                schemeAnswerId: 4,
                pincite: ''
              }
            },
            comment: ''
          }
        }
      })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: {
          schemeQuestionId: 2,
          answers: {},
          comment: ''
        }
      })
    })
    
    test('should handle category child questions', () => {
      const action = {
        type: types.ON_CLEAR_ANSWER,
        questionId: 2,
        projectId: 1,
        jurisdictionId: 1
      }
      
      const currentState = getState({
        question: {
          id: 2,
          questionType: 4,
          isCategoryQuestion: true
        },
        userAnswers: {
          2: {
            schemeQuestionId: 2,
            3: {
              answers: { 4: { schemeAnswerId: 4, pincite: 'pincite!' } },
              comment: ''
            },
            2: {
              answers: { 4: { schemeAnswerId: 4, pincite: '' } },
              comment: ''
            }
          }
        },
        selectedCategory: 0,
        selectedCategoryId: 3,
        categories: [{ id: 3, text: 'cat 1' }, { id: 2, text: 'cat 2' }]
      })
      const state = reducer(currentState, action)
      
      expect(state.userAnswers).toEqual({
        ...currentState.userAnswers,
        2: {
          schemeQuestionId: 2,
          3: { answers: {}, comment: '' },
          2: { answers: { 4: { schemeAnswerId: 4, pincite: '' } }, comment: '' }
        }
      })
    })
    
    describe('clearing previously selected categories', () => {
      test('should remove children from scheme.tree for the category question', () => {
        const currentState = getCombinedState({
          question: schemeById[3]
        })
        
        const action = {
          type: types.ON_CLEAR_ANSWER,
          questionId: 3,
          projectId: 1,
          jurisdictionId: 1
        }
        
        const state = codingValidationReducer(currentState, action)
        expect(state.coding.scheme.tree[2].children).toEqual([])
      })
      
      test('should set isAnswered to false for scheme.tree index for question', () => {
        const currentState = getCombinedState({
          question: schemeById[3]
        })
        
        const action = {
          type: types.ON_CLEAR_ANSWER,
          questionId: 3,
          projectId: 1,
          jurisdictionId: 1
        }
        
        const state = codingValidationReducer(currentState, action)
        expect(state.coding.scheme.tree[2].isAnswered).toEqual(false)
      })
    })
  })
  
  describe('DISMISS_API_ALERT', () => {
    const action = { type: types.DISMISS_API_ALERT, errorType: 'answerErrorContent' }
    const currentState = getState({ answerErrorContent: 'blep' })
    const state = reducer(currentState, action)
    
    test('should set state[action.errorType] to null', () => {
      expect(state.answerErrorContent).toEqual(null)
    })
    
    test('should set state.objectExists to false', () => {
      expect(state.objectExists).toEqual(false)
    })
  })
  
  describe('ON_SHOW_PAGE_LOADER', () => {
    const action = { type: types.ON_SHOW_PAGE_LOADER }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.showPageLoader to true', () => {
      expect(state.showPageLoader).toEqual(true)
    })
  })
  
  describe('ON_SHOW_QUESTION_LOADER', () => {
    const action = { type: types.ON_SHOW_QUESTION_LOADER }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.questionChangeLoader to true', () => {
      expect(state.questionChangeLoader).toEqual(true)
    })
  })
  
  describe('GET_NEXT_QUESTION', () => {
    const action = { type: types.GET_NEXT_QUESTION }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.isChangingQuestion to true', () => {
      expect(state.isChangingQuestion).toEqual(true)
    })
  })
  
  describe('GET_PREV_QUESTION', () => {
    const action = { type: types.GET_PREV_QUESTION }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.isChangingQuestion to true', () => {
      expect(state.isChangingQuestion).toEqual(true)
    })
  })
  
  describe('ON_QUESTION_SELECTED_IN_NAV', () => {
    const action = { type: types.ON_QUESTION_SELECTED_IN_NAV }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.isChangingQuestion to true', () => {
      expect(state.isChangingQuestion).toEqual(true)
    })
  })
  
  describe('CLEAR_FLAG_FAIL', () => {
    const action = { type: types.CLEAR_FLAG_FAIL }
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should open an alert with "We couldn\'t clear this flag."', () => {
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t clear this flag.')
      expect(state.apiErrorAlert.open).toEqual(true)
    })
  })
  
  describe('GET_USER_VALIDATED_QUESTIONS_SUCCESS', () => {
    const action = {
      type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
      payload: {
        userAnswers: userAnswersCoded,
        scheme: {
          byId: schemeById,
          tree: schemeTree,
          order: schemeOrder
        },
        question: schemeById[3],
        errors: {},
        mergedUserQuestions
      }
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set state.userAnswers to action.payload.userAnswers', () => {
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
    
    test('should set state.question to action.payload.question', () => {
      expect(state.question).toEqual(schemeById[3])
    })
    
    test('should set state.scheme to action.payload.scheme', () => {
      expect(state.scheme).toEqual({ byId: schemeById, tree: schemeTree, order: schemeOrder })
    })
    
    test('should set state.mergedUserQuestions to action.payload.mergedUserQuestions', () => {
      expect(state.mergedUserQuestions).toEqual(mergedUserQuestions)
    })
    
    test('should not open an alert if there are no errors', () => {
      expect(state.apiErrorAlert.open).toEqual(false)
    })
    
    test('should not disable all actions if there were no errors', () => {
      expect(state.disableAll).toEqual(false)
    })
    
    test('should set state.isLoadingPage to false', () => {
      expect(state.isLoadingPage).toEqual(false)
    })
    
    test('should set state.showPageLoader to false', () => {
      expect(state.showPageLoader).toEqual(false)
    })
    
    describe('handling errors', () => {
      const action = {
        type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
        payload: {
          userAnswers: userAnswersCoded,
          scheme: {
            byId: schemeById,
            tree: schemeTree,
            order: schemeOrder
          },
          question: schemeById[3],
          errors: {
            schemeError: 'omg this is an error.',
            codedValQuestions: 'omg this is another error.'
          },
          mergedUserQuestions
        }
      }
      
      const currentState = getState()
      const state = reducer(currentState, action)
      
      test('should open an alert if there are errors', () => {
        expect(state.apiErrorAlert.text).toEqual('omg this is an error.\n\nomg this is another error.')
        expect(state.apiErrorAlert.open).toEqual(true)
      })
      
      test('should disable all actions if failure when retrieving answers', () => {
        expect(state.disableAll).toEqual(true)
      })
    })
  })
  
  describe('BULK_VALIDATION_REQUEST', () => {
    test('should set that a request is in progress', () => {
      const action = { type: types.BULK_VALIDATION_REQUEST }
      const currentState = getState()
      const state = reducer(currentState, action)
      expect(state.validationInProgress).toEqual(true)
    })
  })
  
  describe('BULK_VALIDATION_SUCCESS', () => {
    const updated = {
      1: {
        answers: {
          234: {
            id: 100,
            schemeAnswerId: 234,
            pincite: 'new pincite',
            annotations: [],
            textAnswer: null
          }
        },
        schemeQuestionId: 1,
        comment: '',
        flag: {
          notes: '',
          raisedBy: {},
          type: 0
        },
        hasMadePost: false,
        id: 10019,
        isNewCodedQuestion: false
      }
    }
    
    const action = {
      type: types.BULK_VALIDATION_SUCCESS,
      payload: {
        updatedUserAnswers: updated,
        otherStateUpdates: {
          question: { ...schemeById[1] }
        }
      }
    }
    const currentState = getState({ validationInProgress: true, question: schemeById[1] })
    const state = reducer(currentState, action)
    
    test('should set updated validator answers', () => {
      expect(state.userAnswers).toEqual(updated)
    })
    
    test('should set that the validation request has ended', () => {
      expect(state.validationInProgress).toEqual(false)
    })
    
    test('should take a snapshot of the new question', () => {
      expect(state.answerSnapshot).toEqual(updated[1])
    })
    
    test('should set any other state updates', () => {
      expect(state.question).toEqual(schemeById[1])
    })
    
    test('should take a snapshot if the current question is a category question', () => {
      const updatedCat = {
        4: {
          5: {
            answers: {
              432: { schemeAnswerId: 432, pincite: '', annotations: [], textAnswer: null }
            },
            categoryId: 5,
            isNewCodedQuestion: false,
            id: 22,
            hasMadePost: false,
            comment: '',
            schemeQuestionId: 4,
            flag: {
              notes: '',
              raisedBy: {},
              type: 0
            }
          }
        }
      }
      
      const action = {
        type: types.BULK_VALIDATION_SUCCESS,
        payload: {
          updatedUserAnswers: updatedCat,
          otherStateUpdates: {
            question: { ...schemeById[4] }
          }
        }
      }
      
      const currentState = getState({
        validationInProgress: true,
        question: schemeById[4],
        selectedCategoryId: 5
      })
      
      const state = reducer(currentState, action)
      expect(state.answerSnapshot).toEqual(updatedCat[4][5])
    })
  })
  
  describe('BULK_VALIDATION_FAIL', () => {
    const action = {
      type: types.BULK_VALIDATION_FAIL
    }
    
    const currentState = getState({ validationInProgress: true })
    const state = reducer(currentState, action)
    
    test('should open an alert to inform the user of the failure', () => {
      expect(state.apiErrorAlert.open).toEqual(true)
      expect(state.apiErrorAlert.text).toEqual('We couldn\'t save your validation request.')
    })
    
    test('should set that the validation request has finished', () => {
      expect(state.validationInProgress).toEqual(false)
    })
  })
  
  describe('CLEAR_VALIDATION_PROGRESS', () => {
    const action = {
      type: types.CLEAR_VALIDATION_PROGRESS
    }
    
    const currentState = getState({ validationInProgress: true })
    const state = reducer(currentState, action)
    
    test('should stop the validation request', () => {
      expect(state.validationInProgress).toEqual(false)
    })
  })
  
  describe('SET_PAGE', () => {
    test('should set state.page to action.page', () => {
      const action = {
        type: types.SET_PAGE,
        page: 'validation'
      }
      const currentState = getState()
      const state = reducer(currentState, action)
      
      expect(state.page).toEqual('validation')
    })
  })
  
  describe('ON_CLOSE_SCREEN', () => {
    test('should return initial state', () => {
      const action = { type: types.ON_CLOSE_SCREEN }
      const currentState = getState({ question: schemeById[4], userAnswers: userAnswersCoded })
      const state = reducer(currentState, action)
      expect(state).toEqual({ ...INITIAL_STATE })
    })
  })
  
  describe('CLEAR_FLAG', () => {
    test('should return state', () => {
      const action = { type: types.CLEAR_FLAG }
      const currentState = getState({ question: schemeById[4], userAnswers: userAnswersCoded })
      const state = reducer(currentState, action)
      expect(state.question).toEqual(schemeById[4])
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
  })
  
  describe('CLEAR_RED_FLAG', () => {
    test('should return state', () => {
      const action = { type: types.CLEAR_RED_FLAG }
      const currentState = getState({ question: schemeById[4], userAnswers: userAnswersCoded })
      const state = reducer(currentState, action)
      expect(state.question).toEqual(schemeById[4])
      expect(state.userAnswers).toEqual(userAnswersCoded)
    })
  })
  
  describe('CLOSE_API_ERROR_ALERT', () => {
    test('should close the alert', () => {
      const action = { type: types.CLOSE_API_ERROR_ALERT }
      const currentState = getState({ apiErrorAlert: { open: true, text: 'blep' } })
      const state = reducer(currentState, action)
      expect(state.apiErrorAlert.open).toEqual(false)
      expect(state.apiErrorAlert.text).toEqual('blep')
    })
  })
})
