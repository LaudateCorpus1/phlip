/**
 * This is all of the redux-logic for the Home ("Project List") scene.
 */
import { createLogic } from 'redux-logic'
import { types } from './actions'
import addEditProjectLogic from './scenes/AddEditProject/logic'
import addEditJurisdictions from './scenes/AddEditJurisdictions/logic'
import { types as projectTypes } from 'data/projects/actions'
import { commonHelpers, normalize, searchUtils } from 'utils'
import { arrayToObject, mapArray } from 'utils/normalize'

/**
 * Sorts the list of projects by bookmarked. Bookmarked projects are sorted first, and then non-bookmark projects are
 * sorted second.
 *
 * @param {Array} projects
 * @param {Array} bookmarkList
 * @param {String} sortBy
 * @param {String} direction
 * @returns {Array}
 */
const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  const bookmarked = commonHelpers.sortListOfObjects(
    projects.filter(project => bookmarkList.includes(project.id)),
    sortBy,
    direction
  )
  const nonBookmarked = commonHelpers.sortListOfObjects(
    projects.filter(project => !bookmarkList.includes(project.id)),
    sortBy,
    direction
  )
  return [...bookmarked, ...nonBookmarked]
}

/**
 * Determines how the list of project should be sorted, by bookmarked, or just by sortBy and direction
 *
 * @param {Array} arr
 * @param {Object} state
 * @returns {Array}
 */
const sortArray = (arr, state) => {
  const { bookmarkList, sortBy, direction, sortBookmarked } = state
  
  return sortBookmarked
    ? arr.some(x => bookmarkList.includes(x.id))
      ? sortProjectsByBookmarked(arr, bookmarkList, sortBy, direction)
      : commonHelpers.sortListOfObjects(arr, sortBy, direction)
    : commonHelpers.sortListOfObjects(arr, sortBy, direction)
}

/**
 * Updates the projects object in state and determines the how to slice the project array
 *
 */
const setProjectValues = (updatedArr, page, rowsPerPage) => {
  const rows = rowsPerPage === 'All' ? updatedArr.length : parseInt(rowsPerPage)
  return {
    visible: normalize.mapArray(commonHelpers.sliceTable(updatedArr, page, rows)),
    matches: normalize.mapArray(updatedArr)
  }
}

/**
 * After every redux action, the state is passed to this function. It makes sure the visibleProject state property is
 * sorted correctly, as well as the rowsPerPage and page.
 *
 * @param {Array} projects
 * @param {Object} projectState
 * @returns {Object}
 */
const getProjectArrays = (projects, projectState) => {
  const { searchValue, page, rowsPerPage } = projectState
  let matches = searchUtils.searchForMatches(projects, searchValue, [
    'name', 'dateLastEdited', 'lastEditedBy'
  ])
  
  let curPage = page
  const updatedProjects = sortArray(projects, projectState)
  
  if (rowsPerPage === 'All') curPage = 0
  
  if (projects.length === 0) return { projects: { visible: [], matches: [] }, projectCount: 0, ...projectState }
  
  if (searchValue !== undefined && searchValue.length > 0) {
    if (matches.length === 0) {
      return {
        ...projectState,
        projects: {
          matches: [],
          visible: []
        },
        projectCount: 0
      }
    } else {
      const updatedMatches = sortArray(matches, projectState)
      return {
        ...projectState,
        projects: {
          ...setProjectValues(updatedMatches, curPage, rowsPerPage)
        },
        projectCount: updatedMatches.length,
        page: curPage
      }
    }
  } else {
    return {
      ...projectState,
      projects: {
        ...setProjectValues(updatedProjects, curPage, rowsPerPage),
        matches: []
      },
      projectCount: updatedProjects.length,
      page: curPage
    }
  }
}

const getUpdatedState = (action, homeState) => {
  const isSort = action.type === types.SORT_PROJECTS
  
  return {
    page: action.payload.page !== undefined ? action.payload.page : homeState.page,
    rowsPerPage: action.payload.rowsPerPage || homeState.rowsPerPage,
    searchValue: action.payload.searchValue !== undefined ? action.payload.searchValue : homeState.searchValue,
    sortBy: action.payload.sortBy || homeState.sortBy,
    direction: isSort ? homeState.direction === 'asc' ? 'desc' : 'asc' : homeState.direction,
    sortBookmarked: action.payload.sortBookmarked !== undefined
      ? action.payload.sortBookmarked
      : isSort
        ? false
        : homeState.sortBookmarked,
    bookmarkList: action.payload.bookmarkList || homeState.bookmarkList
  }
}

/**
 * Handles updating visible projects in the home screen
 * @type {Logic<object, undefined, undefined, {}, undefined, *[]>}
 */
export const updateVisibleProjects = createLogic({
  type: [
    types.UPDATE_PAGE,
    types.UPDATE_ROWS,
    types.SORT_PROJECTS,
    types.SORT_BOOKMARKED,
    types.UPDATE_SEARCH_VALUE,
    types.GET_PROJECTS_REQUEST,
    types.UPDATE_VISIBLE_PROJECTS
  ],
  transform({ getState, action }, next) {
    const projects = Object.values(getState().data.projects.byId)
    const update = getUpdatedState(action, getState().scenes.home.main)
    const projectArrays = getProjectArrays(projects, update)
    
    next({
      ...action,
      payload: action.type === types.GET_PROJECTS_REQUEST ? update : projectArrays
    })
  }
})

/**
 * Updates the list of projects for home after one has been removed
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
export const removeProjectLogic = createLogic({
  type: types.REMOVE_PROJECT,
  transform({ getState, action }, next) {
    const projectState = getState().data.projects
    const update = getUpdatedState(action, getState().scenes.home.main)
    const { [action.projectId]: deleteProject, ...updatedById } = projectState.byId
    const projectArrays = getProjectArrays(Object.values(updatedById), update)
    
    next({
      ...action,
      payload: projectArrays
    })
  }
})

/**
 * Sends a request to the API to get all of the projects
 */
export const getProjectLogic = createLogic({
  type: types.GET_PROJECTS_REQUEST,
  latest: true,
  async process({ api, getState, action }, dispatch, done) {
    try {
      let projects = await api.getProjects({}, {}, {})
      projects = projects.map(project => {
        const currentProject = getState().data.projects.byId[project.id]
        const proj = {
          ...project,
          lastEditedBy: project.lastEditedBy.trim(),
          projectJurisdictions: commonHelpers.sortListOfObjects(project.projectJurisdictions, 'name', 'asc'),
          createdById: project.createdById,
          lastUsersCheck: currentProject ? currentProject.lastUsersCheck : null,
          projectUsers: normalize.makeDistinct(project.projectUsers, 'userId')
        }
        return proj
      })
      
      dispatch({ type: types.GET_PROJECTS_SUCCESS })
      dispatch({
        type: projectTypes.SET_PROJECTS,
        payload: {
          data: {
            allIds: mapArray(projects, 'id'),
            byId: arrayToObject(projects, 'id')
          },
          ...getProjectArrays(projects, action.payload),
          error: false,
          errorContent: '',
          searchValue: '',
          bookmarkList: [...getState().data.user.currentUser.bookmarks]
        }
      })
      
    } catch (err) {
      dispatch({ type: types.GET_PROJECTS_FAIL })
    }
    done()
  }
})

/**
 * Sends a request to the API to get all users associated with a project
 */
export const getProjectUsersLogic = createLogic({
  type: types.GET_PROJECT_USERS_REQUEST,
  transform({ getState, action }, next) {
    const lastCheck = getState().data.projects.byId[action.projectId].lastUsersCheck
    const now = Date.now()
    const oneday = 60 * 60 * 24 * 1000
    next({
      ...action,
      sendRequest: (lastCheck === null || ((now - lastCheck) > oneday))
    })
  },
  async process({ api, getState, action }, dispatch, done) {
    const p = getState().data.projects.byId[action.projectId]
    const pUsers = p.projectUsers
    const allUserObjs = getState().data.user.byId
    
    try {
      if (action.sendRequest) {
        await commonHelpers.handleUserImages(pUsers, allUserObjs, dispatch, api)
      }
      dispatch({
        type: types.GET_PROJECT_USERS_SUCCESS,
        payload: {
          projectId: action.projectId,
          newCheck: action.sendRequest
        }
      })
      
      dispatch({
        type: projectTypes.UPDATE_PROJECT,
        payload: {
          id: action.projectId,
          lastUsersCheck: action.sendRequest ? Date.now() : p.lastUsersCheck
        }
      })
      done()
    } catch (e) {
      dispatch({ type: types.GET_PROJECT_USERS_FAIL, payload: 'We couldn\'t get the updated user profiles for this project.' })
      done()
    }
  }
})

/**
 * Sends a request to bookmark or un-bookmark a project for a user
 */
export const toggleBookmarkLogic = createLogic({
  type: types.TOGGLE_BOOKMARK,
  async process({ api, getState, action }, dispatch, done) {
    try {
      const currentUser = getState().data.user.currentUser
      let add = true
      let bookmarkList = [...currentUser.bookmarks]
      
      if (bookmarkList.includes(action.project.id)) {
        bookmarkList.splice(bookmarkList.indexOf(action.project.id), 1)
        add = false
      } else {
        bookmarkList.push(action.project.id)
      }
      
      const apiObj = {
        userId: currentUser.id,
        projectId: action.project.id
      }
      
      if (add) {
        await api.addUserBookmark({}, {}, apiObj)
      } else {
        await api.removeUserBookmark({}, {}, apiObj)
      }
      
      dispatch({
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: {
          bookmarkList, user: { ...currentUser, bookmarks: bookmarkList }
        }
      })
      
      dispatch({ type: types.UPDATE_VISIBLE_PROJECTS, payload: { bookmarkList } })
      done()
    } catch (err) {
      dispatch({ type: types.TOGGLE_BOOKMARK_FAIL, payload: 'We couldn\'t save your bookmark request.' })
      done()
    }
  }
})

/**
 * Sends a request to get the export data for a project
 */
export const exportDataLogic = createLogic({
  type: types.EXPORT_DATA_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    try {
      const project = getState().scenes.home.main.projectToExport
      const params = action.user ? { type: action.exportType, userId: action.user.userId } : { type: action.exportType }
      const response = await api.exportData({}, { params }, { projectId: project.id })
      dispatch({ type: types.EXPORT_DATA_SUCCESS, payload: response })
      done()
    } catch (err) {
      dispatch({ type: types.EXPORT_DATA_FAIL, payload: 'We couldn\'t export the project.' })
      done()
    }
  }
})

export default [
  updateVisibleProjects,
  removeProjectLogic,
  getProjectLogic,
  getProjectUsersLogic,
  toggleBookmarkLogic,
  exportDataLogic,
  ...addEditProjectLogic,
  ...addEditJurisdictions
]
