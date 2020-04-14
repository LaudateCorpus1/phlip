import uploadLogic from './scenes/Upload/logic'
import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as projectTypes } from 'data/projects/actions'
import { searchUtils, normalize } from 'utils'

/**
 * Search in an array of objects and then matches docs, used for projects / jurisdictions
 * @param matchesArr
 * @param proJurArr
 * @param property
 * @param searchValue
 * @returns {*}
 */
const searchInProOrJur = (matchesArr, proJurArr, property, searchValue) => {
  const matches = searchUtils.searchForMatches(proJurArr, searchValue, ['name']).map(prop => prop.id)
  return matchesArr.filter(doc => doc[property].some(id => matches.includes(id)))
}

/*
 *  Used to determine the search strings and find matching documents
 */
const resetFilter = (docs, stringSearch, projectFilter, jurisdictionFilter, jurisdictions, projects) => {
  let matches = docs
  let pieces = []
  
  const searchFields = {
    name: 'name',
    uploadedBy: 'uploadedByName',
    uploadedDate: 'uploadedDate',
    project: 'projects',
    jurisdiction: 'jurisdictions'
  }
  
  const regEnd = /\)$/
  const regBegin = /^\(/
  
  // Get the different fields that were set
  const searchParams = stringSearch.split(' | ')
  
  // Handle each field // the search is done with AND and not OR when there are multiple fields set
  searchParams.forEach(searchTerm => {
    const colonIndex = searchTerm.indexOf(':')
    
    // there was a key:value field set and not just one string
    if (colonIndex !== -1 && searchFields.hasOwnProperty(searchTerm.substring(0, colonIndex).trim())) {
      let searchKey = searchTerm.substring(0, colonIndex).trim()
      let searchValue = searchTerm.substring(colonIndex + 1).trim()
      
      // checking if the search value is multi-word beginning with a (
      if (regBegin.test(searchValue)) {
        if (regEnd.test(searchValue)) {
          // the whole search string is in the parentheses (i.e. not followed by any other string)
          searchValue = searchValue.replace(regBegin, '')
          searchValue = searchValue.replace(regEnd, '')
        } else {
          // there is no ending parenthesis or it is followed by additional search strings
          pieces = searchValue.split(' ')
          if (pieces.length > 1) {
            let foundEnd = false
            for (let i = 1; i < pieces.length; i++) {
              if (foundEnd) break
              if (pieces[i].endsWith(')')) {
                pieces[0] = pieces[0].replace(regBegin, '')
                pieces[i] = pieces[i].replace(regEnd, '')
                const searchStringParams = pieces.splice(0, i + 1)
                searchValue = searchStringParams.join(' ')
                foundEnd = true
              }
            }
          }
        }
      } else {
        // the search term doesn't have parentheses but is multi-worded, use the first word as the search value to
        // search against the search property and then use the remaining words as individual pieces
        if (searchValue.trim().split(' ').length > 1) {
          pieces = searchValue.split(' ')
          searchValue = pieces[0]
          pieces = pieces.splice(1, pieces.length)
        }
      }
      
      const searchProperty = searchFields[searchKey]
      if (searchProperty === 'projects') {
        matches = projectFilter
          ? matches.filter(doc => doc.projects.includes(projectFilter))
          : searchInProOrJur(matches, projects, 'projects', searchValue)
      } else if (searchProperty === 'jurisdictions') {
        matches = jurisdictionFilter
          ? matches.filter(doc => doc.jurisdictions.includes(jurisdictionFilter))
          : searchInProOrJur(matches, jurisdictions, 'jurisdictions', searchValue)
      } else {
        // the search property is something else so search only that property
        matches = searchUtils.searchForMatches(matches, searchValue, [searchProperty])
      }
      pieces.forEach(piece => {
        const m = searchUtils.searchForMatches(matches, piece, ['uploadedByName', 'uploadedDate', 'name'])
        const j = searchInProOrJur(matches, jurisdictions, 'jurisdictions', piece)
        const p = searchInProOrJur(matches, projects, 'projects', piece)
        matches = Array.from(new Set([...m, ...j, ...p]))
      })
    } else {
      // only a string was entered, no colon :
      const m = searchUtils.searchForMatches(matches, searchTerm, ['uploadedByName', 'uploadedDate', 'name'])
      const j = searchInProOrJur(matches, jurisdictions, 'jurisdictions', searchTerm)
      const p = searchInProOrJur(matches, projects, 'projects', searchTerm)
      matches = Array.from(new Set([...m, ...j, ...p]))
    }
  })
  
  return matches
}

/**
 * Handles determining which documents to use
 */
const pageRowChageLogic = createLogic({
  type: [types.ON_PAGE_CHANGE, types.ON_ROWS_CHANGE, types.SORT_DOCUMENTS],
  transform({ getState, action }, next) {
    const isSearch = getState().scenes.docManage.search.form.searchValue !== ''
    const docState = getState().scenes.docManage.main.list
    const userDocs = normalize.createArrOfObj(docState.documents.byId, docState.documents.userDocs)
    const matches = normalize.createArrOfObj(docState.documents.byId, docState.documents.matches)

    next({
      ...action,
      payload: isSearch
        ? matches
        : docState.showAll
          ? Object.values(docState.documents.byId)
          : userDocs
    })
  }
})

/*
 * Handles updating the visible projects depending of if the user is toggling all docs
 */
const toggleDocsLogic = createLogic({
  type: [types.ON_TOGGLE_ALL_DOCS, types.BULK_REMOVE_PROJECT_REQUEST, types.SEARCH_VALUE_CHANGE],
  transform({ getState, action }, next) {
    const searchState = getState().scenes.docManage.search
    const docState = getState().scenes.docManage.main.list
    const userDocs = normalize.createArrOfObj(docState.documents.byId, docState.documents.userDocs)
    
    next({
      isSearch: searchState.form.searchValue !== '',
      form: searchState.form.params,
      value: searchState.form.searchValue,
      userDocs,
      projects: Object.values(getState().data.projects.byId),
      jurisdictions: Object.values(getState().data.jurisdictions.byId),
      docArr: docState.showAll ? Object.values(docState.documents.byId) : userDocs,
      ...action
    })
  }
})

/**
 * Determines matching docs
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const searchBoxLogic = createLogic({
  type: [types.SEARCH_VALUE_CHANGE, types.ON_TOGGLE_ALL_DOCS],
  transform({ getState, action }, next) {
    const state = getState().scenes.docManage.main.list
    let docs = [...Object.values(state.documents.byId)]
    
    if ((!state.showAll && action.type === types.SEARCH_VALUE_CHANGE) ||
      (state.showAll && action.type === types.ON_TOGGLE_ALL_DOCS)) {
      docs = action.userDocs
    }
    
    const matches = !action.value
      ? docs
      : resetFilter(
        docs,
        action.value,
        action.form.project.id,
        action.form.jurisdiction.id,
        action.jurisdictions,
        action.projects
      )
    
    next({ ...action, payload: matches })
  }
})

/**
 * Gets documents -- when the user goes to the doc management hone page
 * @type {Logic<object, undefined, undefined, {api?: *, docApi?: *, getState?: *}, undefined, string>}
 */
const getDocLogic = createLogic({
  type: types.GET_DOCUMENTS_REQUEST,
  async process({ getState, docApi, api }, dispatch, done) {
    try {
      const user = getState().data.user.currentUser
      const allIds = getState().data.projects.allIds
      let listParam = allIds.length === 0 ? 'projects[]=' : ''
      allIds.forEach((id, i) => listParam = `${listParam}projects[]=${id}${i === allIds.length - 1 ? '' : '&'}`)
      
      let documents = await docApi.getDocs({}, {}, user.role !== 'Admin' ? listParam : '')
      documents = documents.map(document => ({
        ...document,
        uploadedByName: `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
      }))
      dispatch({ type: types.GET_DOCUMENTS_SUCCESS, payload: { documents, userId: user.id } })
      
      let projects = { ...getState().data.projects.byId }
      let jurisdictions = { ...getState().data.jurisdictions.byId }
      
      for (let doc of documents) {
        for (let projectId of doc.projects) {
          if (!projects.hasOwnProperty(projectId)) {
            try {
              const project = await api.getProject({}, {}, { projectId: projectId })
              projects[projectId] = project
              dispatch({ type: projectTypes.ADD_PROJECT, payload: project })
            } catch (err) {
              /* istanbul ignore next */
              console.log('Failed to get project')
            }
          }
        }
        
        for (let jurisdictionId of doc.jurisdictions) {
          if (!jurisdictions.hasOwnProperty(jurisdictionId)) {
            try {
              const jurisdiction = await api.getJurisdiction({}, {}, { jurisdictionId: jurisdictionId })
              jurisdictions[jurisdictionId] = jurisdiction
              dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jurisdiction })
            } catch (err) {
              /* istanbul ignore next */
              console.log('Failed to get jurisdiction')
            }
          }
        }
      }
      done()
    } catch (e) {
      dispatch({ type: types.GET_DOCUMENTS_FAIL, payload: 'We couldn\'t retrieve the documents.' })
      done()
    }
  }
})

/**
 * Bulk updating documents
 * @type {Logic<object, undefined, undefined, {getState?: *, action?: *, docApi?: *}, undefined, string>}
 */
const bulkUpdateLogic = createLogic({
  type: types.BULK_UPDATE_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    const user = getState().data.user.currentUser
    try {
      await docApi.bulkUpdateDoc({ meta: action.updateData, docIds: action.selectedDocs })
      if (['projects', 'jurisdictions'].includes(action.updateData.updateType)) {
        dispatch({
          type: action.updateData.updateType === 'jurisdictions'
            ? jurisdictionTypes.ADD_JURISDICTION
            : projectTypes.ADD_PROJECT,
          payload: action.updateData.updateProJur
        })
      }
      
      let existingDocs = getState().scenes.docManage.main.list.documents.byId
      action.selectedDocs.forEach(docToUpdate => {
        if (action.updateData.updateType === 'status') {
          existingDocs[docToUpdate].status = 'Approved'
        } else {
          const { updateType, updateProJur } = action.updateData
          if (existingDocs[docToUpdate][updateType].indexOf(updateProJur.id) === -1) {
            existingDocs[docToUpdate][updateType] = [
              ...existingDocs[docToUpdate][updateType],
              updateProJur.id
            ]
          }
        }
      })
      
      dispatch({
        type: types.BULK_UPDATE_SUCCESS,
        payload: {
          updatedById: existingDocs,
          sortPayload: [],
          userId: user.id,
          affectsView: false
        }
      })
      done()
    } catch (err) {
      dispatch({
        type: types.BULK_UPDATE_FAIL,
        payload: { error: 'We couldn\'t update the selected documents.' }
      })
      done()
    }
  }
})

/**
 * Bulk deleting documents
 * @type {Logic<object, undefined, undefined, {api?: *, docApi?: *, action?: *, getState?: *}, undefined, string>}
 */
const bulkDeleteLogic = createLogic({
  type: types.BULK_DELETE_REQUEST,
  async process({ getState, docApi, action, api }, dispatch, done) {
    const user = getState().data.user.currentUser
    try {
      await docApi.bulkDeleteDoc({ 'docIds': action.selectedDocs })
      action.selectedDocs.map(doc => {
        try {
          api.cleanAnnotations({}, {}, { docId: doc })
        } catch (err) {
          console.log(`failed to remove annotations for doc: ${doc}`)
        }
      })
      dispatch({ type: types.BULK_DELETE_SUCCESS, payload: { docsDeleted: action.selectedDocs, userId: user.id } })
      done()
    } catch (e) {
      dispatch({ type: types.BULK_DELETE_FAIL, payload: { error: 'We couldn\'t delete the selected documents.' } })
    }
    done()
  }
})

/**
 * Send request to the doc-manage-backend to remove the projectId from all documents
 * when succeed, remove all references to project id from redux store
 */
const cleanDocProjectLogic = createLogic({
  type: types.CLEAN_PROJECT_LIST_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    let projectMeta = action.projectMeta
    try {
      await docApi.cleanProject({}, {}, { 'projectId': projectMeta.id })
      let cleannedDocs = getState().scenes.docManage.main.list.documents.byId
      Object.keys(cleannedDocs).map(docKey => {
        const index = cleannedDocs[docKey].projects.findIndex(el => el === projectMeta.id)
        if (index !== -1) { // found matching projectId
          cleannedDocs[docKey].projects.splice(index, 1) // remove the projectId from array
        }
      })
      dispatch({ type: types.CLEAN_PROJECT_LIST_SUCCESS, payload: cleannedDocs })
      done()
    } catch (e) {
      dispatch({ type: types.CLEAN_PROJECT_LIST_FAIL, payload: { error: 'We couldn\'t update the documents.' } })
    }
    done()
  }
})

/**
 * Send request to the doc-manage-backend to remove the projectId from list of documents
 * when succeed, remove all references to project id from redux store
 */
const bulkRemoveProjectLogic = createLogic({
  type: types.BULK_REMOVE_PROJECT_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    const projectMeta = action.projectMeta
    const selectedDocs = action.selectedDocs
    const user = getState().data.user.currentUser
    const docState = getState().scenes.docManage.main.list
    const searchState = getState().scenes.docManage.search.form
    const isSearch = searchState.searchValue !== ''
    const userDocs = docState.documents.userDocs.slice()
    
    try {
      await docApi.cleanProject({ 'docIds': selectedDocs }, {}, { 'projectId': projectMeta.id })
      let cleanedDocs = docState.documents.byId
      
      selectedDocs.forEach(docKey => {
        const index = cleanedDocs[docKey].projects.findIndex(el => el === projectMeta.id)
        if (index !== -1) {
          cleanedDocs[docKey].projects.splice(index, 1)
          if (cleanedDocs[docKey].projects.length === 0 && user.role !== 'Admin') {
            // needs to be removed from the state
            const { [docKey]: removed, ...otherDocs } = cleanedDocs
            cleanedDocs = otherDocs
            if (userDocs.includes(docKey)) {
              userDocs.splice(userDocs.indexOf(docKey), 1)
            }
          }
        }
      })
      
      const docArr = docState.showAll ? Object.values(cleanedDocs) : normalize.createArrOfObj(cleanedDocs, userDocs)
      const sortPayload = isSearch
        ? resetFilter(
          docArr,
          action.value,
          action.form.project.id,
          action.form.jurisdiction.id,
          action.jurisdictions,
          action.projects
        ) : docArr
      
      dispatch({
        type: types.BULK_UPDATE_SUCCESS,
        payload: {
          updatedById: cleanedDocs,
          sortPayload,
          userId: user.id,
          affectsView: true,
          count: sortPayload.length
        }
      })
      done()
    } catch (e) {
      dispatch({ type: types.BULK_UPDATE_FAIL, payload: { error: 'We couldn\'t update the documents.' } })
    }
    done()
  }
})

export default [
  getDocLogic,
  pageRowChageLogic,
  toggleDocsLogic,
  searchBoxLogic,
  bulkUpdateLogic,
  bulkDeleteLogic,
  cleanDocProjectLogic,
  bulkRemoveProjectLogic,
  ...uploadLogic
]
