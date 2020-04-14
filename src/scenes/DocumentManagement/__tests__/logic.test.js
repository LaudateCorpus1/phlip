import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance, projectApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'
import { mockDocuments } from 'utils/testData/documents'

const projects = {
  12: { name: 'Project 1', id: 12 },
  5: { name: 'Overwatch', id: 5 },
  44: { name: 'Zero Dawn', id: 44 },
  11: { name: 'Test Project', id: 11 }
}

const jurisdictions = {
  1: { name: 'Ohio', id: 1 },
  2: { name: 'Georgia (state)', id: 2 },
  33: { name: 'Florida', id: 33 },
  200: { name: 'Puerto Rico', id: 200 }
}

describe('Document Management logic', () => {
  let mock, apiMock
  
  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)
  
  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = (data = {}, docManage = {}, searchForm = {}) => {
    return createMockStore({
      initialState: {
        data: {
          jurisdictions: {
            byId: jurisdictions,
            allIds: [1, 2, 33, 200]
          },
          projects: {
            byId: projects,
            allIds: [12, 5, 44, 11]
          },
          user: {
            currentUser: {
              role: 'Admin',
              id: 4
            }
          },
          ...data
        },
        scenes: {
          docManage: {
            main: {
              list: {
                documents: JSON.parse(JSON.stringify(mockDocuments)),
                showAll: true,
                ...docManage
              }
            },
            search: {
              form: {
                params: {
                  project: {
                    id: null
                  },
                  jurisdiction: {
                    id: null
                  }
                },
                searchValue: '',
                ...searchForm
              }
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }
  
  const byId = mockDocuments.byId
  
  describe('SEARCH VALUE CHANGE', () => {
    test('should handle a basic search string and set state.documents.visible to only matching document ids', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'ohio',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[1], byId[2], byId[5], byId[6]])
        done()
      })
    })
    
    test('should handle a multi-worded string without named filter', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'document: about',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([])
        done()
      })
    })
    
    test('should handle multiple words inside parentheses in a named filter', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'name:(document about bugs)',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[7]])
        done()
      })
    })
    
    test('should handle a search string with one named filters', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'name:(document about)',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[5], byId[6], byId[7]])
        done()
      })
    })
    
    test('should handle a search string with multiple named filters', done => {
      const date = '10/10/2010'
      
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: `name: (document about) | uploadedDate:["${date}","${date}"]`,
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[7]])
        done()
      })
    })
    
    test('should handle if named filter only has one parentheses', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'name:(document about',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([])
        done()
      })
    })
    
    test('should handle if one named filter followed by free text', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'jurisdiction: florida project',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[2], byId[3], byId[5]])
        done()
      })
    })
    
    test('should handle if jurisdiction filter is defined', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'jurisdiction: georgia',
        form: {
          project: {},
          jurisdiction: {
            id: 2
          }
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[3], byId[7]])
        done()
      })
    })
    
    test('should handle if project filter is defined', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'project: overwatch',
        form: {
          project: {
            id: 5
          },
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[4], byId[5]])
        done()
      })
    })
    
    test('should handle if searching by project without selecting from list', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'project: overwatch',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[4], byId[5]])
        done()
      })
    })
    
    test('should handle if a mutli-worded search string is followed by a single string', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'name:(document about) bugs bloop blep',
        form: {
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([])
        done()
      })
    })
    
    test('should handle if only "from" date entered', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'uploadedDate: ["10/10/2010",""]',
        form: {
          uploadedDate1: '10/10/2010',
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        //expect(store.actions[0].payload).toEqual(['4', '1', '6', '7'])
        expect(store.actions[0].payload).toEqual([byId[1], byId[4], byId[6], byId[7]])
        done()
      })
    })
    
    test('should handle if only to date entered', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'uploadedDate: ["","10/10/2010"]',
        form: {
          uploadedDate2: '10/10/2010',
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[2], byId[3], byId[5], byId[7]])
        done()
      })
    })
    
    test('should handle if both to and from dates are entered', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'uploadedDate: ["10/10/2010","10/10/2010"]',
        form: {
          uploadedDate1: '10/10/2010',
          uploadedDate2: '10/10/2010',
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[7]])
        done()
      })
    })
    
    test('should handle if "from" date is greater than "to" date entered', done => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        value: 'uploadedDate: ["10/10/2015","10/10/2010"]',
        form: {
          uploadedDate1: '10/10/2015',
          uploadedDate2: '10/10/2010',
          project: {},
          jurisdiction: {}
        }
      }
      
      const store = setupStore()
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].payload).toEqual([byId[6], byId[7]])
        done()
      })
    })
  })
  
  describe('TOGGLING SHOW ALL DOCUMENTS', () => {
    test('should set action with form information', done => {
      const action = {
        type: types.ON_TOGGLE_ALL_DOCS
      }
      
      const store = setupStore({}, {}, {
        searchValue: 'uploadedDate: ["10/10/2015","10/10/2010"]',
        params: {
          uploadedDate1: '10/10/2015',
          uploadedDate2: '10/10/2010',
          project: {},
          jurisdiction: {}
        }
      })
      
      store.dispatch(action)
      store.whenComplete(() => {
        expect(store.actions[0].form).toEqual({
          uploadedDate1: '10/10/2015',
          uploadedDate2: '10/10/2010',
          project: {},
          jurisdiction: {}
        })
        expect(store.actions[0].value).toEqual('uploadedDate: ["10/10/2015","10/10/2010"]')
        done()
      })
    })
    
    describe('when toggling off show all', () => {
      const action = {
        type: types.ON_TOGGLE_ALL_DOCS
      }
      
      test('should use user documents and should filter if form is populated', done => {
        const store = setupStore({}, {}, {
          searchValue: 'uploadedDate: ["10/10/2015","10/10/2010"]',
          params: {
            uploadedDate1: '10/10/2015',
            uploadedDate2: '10/10/2010',
            project: {},
            jurisdiction: {}
          }
        })
        
        store.dispatch(action)
        store.whenComplete(() => {
          expect(store.actions[0].payload).toEqual([byId[6]])
          done()
        })
      })
      
      test('should send all documents as filtered if form is not populated', done => {
        const store = setupStore({}, {}, {})
        store.dispatch(action)
        store.whenComplete(() => {
          expect(store.actions[0].payload).toEqual([byId[2], byId[3], byId[6]])
          done()
        })
      })
    })
    
    describe('when toggle on show all', () => {
      const action = {
        type: types.ON_TOGGLE_ALL_DOCS
      }
      
      test('should use all documents and should filter if form is populated', done => {
        const store = setupStore({}, { showAll: false }, {
          searchValue: 'uploadedDate: ["10/10/2015","10/10/2010"]',
          params: {
            uploadedDate1: '10/10/2015',
            uploadedDate2: '10/10/2010',
            project: {},
            jurisdiction: {}
          }
        })
        
        store.dispatch(action)
        store.whenComplete(() => {
          expect(store.actions[0].payload).toEqual([byId[6], byId[7]])
          done()
        })
      })
      
      test('should send all documents as filtered if form is not populated', done => {
        const store = setupStore({}, { showAll: false }, {})
        store.dispatch(action)
        store.whenComplete(() => {
          expect(store.actions[0].payload).toEqual(Object.values(mockDocuments.byId))
          done()
        })
      })
    })
  })
  
  describe('GET DOCUMENTS', () => {
    describe('getting documents successfully', () => {
      test('should get document list and dispatch GET_DOCUMENTS_SUCCESS on success', done => {
        mock.onGet('/docs').reply(200, Object.values(mockDocuments.byId))
        const store = setupStore()
        store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })
        store.whenComplete(() => {
          expect(store.actions[1].type).toEqual(types.GET_DOCUMENTS_SUCCESS)
          done()
        })
      })
      
      test('should call an api to get jurisdictions only if the jurisdiction does not exist in state', done => {
        const jurSpy = jest.spyOn(api, 'getJurisdiction')
        mock.onGet('/docs').reply(200, Object.values(mockDocuments.byId))
        apiMock.onGet('/projects/1').reply(200, { name: 'Test Project', id: 1 })
        apiMock.onGet('/jurisdictions/1').reply(200, { id: 1, name: 'Ohio' })
        apiMock.onGet('/jurisdictions/2').reply(200, { id: 2, name: 'Georgia (state)' })
        const store = setupStore({
          jurisdictions: {
            byId: {
              33: { name: 'Florida', id: 33 },
              200: { name: 'Puerto Rico', id: 200 }
            },
            allIds: [33, 200]
          }
        }, {})
        
        store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })
        store.whenComplete(() => {
          expect(jurSpy).toHaveBeenCalledTimes(2)
          done()
        })
      })
      
      test('should call an api to get projects only if the project does not exist in state', done => {
        const proSpy = jest.spyOn(api, 'getProject')
        mock.onGet('/docs').reply(200, Object.values(mockDocuments.byId))
        apiMock.onGet('/projects/44').reply(200, { name: 'Zero Dawn', id: 44 })
        apiMock.onGet('/projects/11').reply(200, { name: 'Test Project', id: 11 })
        const store = setupStore({
          projects: {
            byId: {
              12: { name: 'Project 1', id: 12 },
              5: { name: 'Overwatch', id: 5 }
            },
            allIds: [12, 5]
          }
        }, {})
        
        store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })
        store.whenComplete(() => {
          expect(proSpy).toHaveBeenCalledTimes(2)
          done()
        })
      })
    })
    
    describe('failing to get documents', () => {
      test('should try to get document list and dispatch GET_DOCUMENTS_FAIL', done => {
        mock.onGet('/docs').reply(500)
        
        const store = setupStore()
        store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })
        
        store.whenComplete(() => {
          expect(store.actions).toEqual([
            { type: types.GET_DOCUMENTS_REQUEST },
            {
              type: types.GET_DOCUMENTS_FAIL,
              payload: 'We couldn\'t retrieve the documents.'
            }
          ])
          done()
        })
      })
    })
  })
  
  describe('Bulk Delete', () => {
    test('should delete selected documents and dispatch BULK_DELETE_SUCCESS on success', done => {
      mock.onPost('/docs/bulkDelete').reply(200, { n: 2, ok: 1 })
      apiMock.onDelete('/cleanup/1/annotations').reply(200, {})
      const store = setupStore([
        {
          name: 'Doc 1',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1]
        },
        {
          name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' },
          projects: [1], jurisdictions: [1]
        }
      ])
      
      store.dispatch({ type: types.BULK_DELETE_REQUEST, selectedDocs: ['1', '2'] })
      
      store.whenComplete(() => {
        expect(store.actions[1].payload.docsDeleted).toEqual(['1', '2'])
        done()
      })
    })
  })
  
  describe('Bulk Update', () => {
    test('should update jurisdiction of selected documents and dispatch BULK_UPDATE_SUCCESS on success', done => {
      mock.onPost('/docs/bulkUpdate').reply(200)
      
      const store = setupStore()
      store.dispatch({
        type: types.BULK_UPDATE_REQUEST,
        updateData: {
          updateType: 'jurisdictions',
          updateProJur: { id: 2, name: 'Georgia (state)' }
        },
        selectedDocs: [1, 2]
      })
      
      store.whenComplete(() => {
        expect(store.actions[2].payload.updatedById).toEqual({
          ...mockDocuments.byId,
          1: {
            ...mockDocuments.byId[1],
            jurisdictions: [1, 2]
          },
          2: {
            ...mockDocuments.byId[2],
            jurisdictions: [1, 33, 2]
          }
        })
        done()
      })
    })
    
    test('should update status of selected documents and dispatch BULK_UPDATE_SUCCESS on success', done => {
      mock.onPost('/docs/bulkUpdate').reply(200)
      const store = setupStore()
      store.dispatch({
        type: types.BULK_UPDATE_REQUEST,
        updateData: {
          updateType: 'status'
        },
        selectedDocs: [1, 2]
      })
      
      store.whenComplete(() => {
        expect(store.actions[1].payload.updatedById).toEqual({
          ...mockDocuments.byId,
          1: {
            ...mockDocuments.byId[1],
            status: 'Approved'
          },
          2: {
            ...mockDocuments.byId[2],
            status: 'Approved'
          }
        })
        done()
      })
    })
  })
  
  describe('Cleaning Project List', () => {
    test('should remove project id if exist from documents and dispatch CLEAN_PROJECT_SUCCESS on success', done => {
      mock.onPut('/docs/cleanProjectList/5').reply(200, { n: 2, ok: 1 })
      
      const store = setupStore()
      store.dispatch({
        type: types.CLEAN_PROJECT_LIST_REQUEST,
        projectMeta: {
          id: 5,
          name: 'Zero Dawn'
        }
      })
      
      store.whenComplete(() => {
        expect(store.actions[1]).toEqual({
          type: types.CLEAN_PROJECT_LIST_SUCCESS,
          payload: {
            ...mockDocuments.byId,
            4: {
              ...mockDocuments.byId[4],
              projects: []
            },
            5: {
              ...mockDocuments.byId[5],
              projects: [12]
            }
          }
        })
        done()
      })
    })
  })
  
  describe('bulk remove project from selected docs', () => {
    describe('if search fields are populated', () => {
      describe('if show all is toggled', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 2, ok: 1 })
          store = setupStore(
            {},
            {},
            { searchValue: 'ohio' }
          )
          
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [1, 2]
          })
        })
        
        const clean = {
          ...mockDocuments.byId,
          1: {
            ...mockDocuments.byId[1],
            projects: []
          },
          2: {
            ...mockDocuments.byId[2],
            projects: [11]
          }
        }
        
        test('should pass in the full updated object of all documents', done => {
          store.whenComplete(() => {
            expect(store.actions[1].payload.updatedById).toEqual(clean)
            done()
          })
        })
        
        test('should pass in only documents that match the populated search filter', done => {
          store.whenComplete(() => {
            expect(store.actions[1].payload.sortPayload).toEqual([clean[1], clean[2], clean[5], clean[6]])
            done()
          })
        })
      })
      
      describe('if only showing documents uploaded by current user', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 1, ok: 1 })
          store = setupStore({}, { showAll: false }, { searchValue: 'ohio' })
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [2]
          })
        })
        
        test(
          'should pass in only documents uploaded by current user and those that match the search form for sorting',
          done => {
            store.whenComplete(() => {
              const clean = {
                ...mockDocuments.byId,
                2: {
                  ...mockDocuments.byId[2],
                  projects: [11]
                }
              }
              expect(store.actions[1].payload.sortPayload).toEqual([clean[2], clean[6]])
              done()
            })
          }
        )
        
        test('should pass in cleaned all documents', done => {
          store.whenComplete(() => {
            const clean = {
              ...mockDocuments.byId,
              2: {
                ...mockDocuments.byId[2],
                projects: [11]
              }
            }
            expect(store.actions[1].payload.updatedById).toEqual(clean)
            done()
          })
        })
      })
    })
    
    describe('if search fields are not populated', () => {
      describe('if show all is toggled', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 2, ok: 1 })
          store = setupStore({}, {}, {})
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [1, 2]
          })
        })
        
        test('should pass in all documents in state as the sorting list', done => {
          const clean = {
            ...mockDocuments.byId,
            1: {
              ...mockDocuments.byId[1],
              projects: []
            },
            2: {
              ...mockDocuments.byId[2],
              projects: [11]
            }
          }
          
          store.whenComplete(() => {
            expect(store.actions[1].payload.sortPayload).toEqual(Object.values(clean))
            expect(store.actions[1].payload.updatedById).toEqual(clean)
            done()
          })
        })
        
        test('should set that it affects the view', done => {
          store.whenComplete(() => {
            expect(store.actions[1].payload.affectsView).toEqual(true)
            done()
          })
        })
      })
      
      describe('if only showing documents uploaded by current user', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 1, ok: 1 })
          store = setupStore({}, { showAll: false }, {})
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [2]
          })
        })
        
        test('should pass in only documents uploaded by current user for sorting', done => {
          store.whenComplete(() => {
            const clean = {
              ...mockDocuments.byId,
              2: {
                ...mockDocuments.byId[2],
                projects: [11]
              }
            }
            expect(store.actions[1].payload.sortPayload).toEqual([clean[2], clean[3], clean[6]])
            done()
          })
        })
        
        test('should pass in cleaned all documents', done => {
          store.whenComplete(() => {
            const clean = {
              ...mockDocuments.byId,
              2: {
                ...mockDocuments.byId[2],
                projects: [11]
              }
            }
            expect(store.actions[1].payload.updatedById).toEqual(clean)
            done()
          })
        })
      })
    })
    
    describe('if the user deletes the last remaining project from a document', () => {
      describe('if the user is not an admin', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 2, ok: 1 })
          store = setupStore({
            user: {
              currentUser: {
                role: 'Coder',
                id: 4
              }
            }
          }, {}, {})
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [1, 2]
          })
        })
  
        test('should remove the document entirely', done => {
          store.whenComplete(() => {
            expect(store.actions[1].payload.updatedById.hasOwnProperty(1)).toEqual(false)
            done()
          })
        })
      })
      
      describe('if the user is an admin', () => {
        let store
        beforeEach(() => {
          mock.onPut('/docs/cleanProjectList/12').reply(200, { n: 2, ok: 1 })
          store = setupStore()
          store.dispatch({
            type: types.BULK_REMOVE_PROJECT_REQUEST,
            projectMeta: { id: 12 },
            selectedDocs: [1, 2]
          })
        })
  
        test('should not remove the document entirely', done => {
          store.whenComplete(() => {
            expect(store.actions[1].payload.updatedById.hasOwnProperty(1)).toEqual(true)
            done()
          })
        })
      })
    })
  })
})
