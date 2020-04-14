import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { removeExtension } from 'utils/commonHelpers'

const stateLookup = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
}

const allowedTypes = [
  'pdf',
  'rtf',
  'odt',
  'doc',
  'docx'
]

const DCStrings = ['DC', 'District of Columbia', 'Washington, DC', 'Washington, DC (federal district)']

const valueDefaults = {
  jurisdictions: { searchValue: '', suggestions: [], name: '' },
  citation: '',
  effectiveDate: ''
}

/**
 * Used to create a regular expression from a template literal
 * @param input
 * @returns {RegExp}
 */
const reg = input => {
  return new RegExp(input, 'g')
}

/**
 * Uploads files
 * @param docApi
 * @param action
 * @param dispatch
 * @param state
 * @param user
 * @returns {Promise<any>}
 */
const upload = (docApi, action, dispatch, state, user) => {
  let failed = []
  return new Promise(async (resolve, reject) => {
    for (const [index, doc] of action.selectedDocs.entries()) {
      const { file, ...otherProps } = doc
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('userFirstName', user.firstName)
      formData.append('userLastName', user.lastName)
      formData.append('files', file, doc.name)
      formData.append('metadata', JSON.stringify({ [doc.name]: otherProps }))
      
      let docProps = {}, uploadFail = false
      
      try {
        const uploadedDoc = await docApi.upload(formData)
        const { content, ...otherDocProps } = uploadedDoc.files[0]
        docProps = { ...otherDocProps, uploadedByName: `${user.firstName} ${user.lastName}` }
      } catch (err) {
        failed.push(doc.name)
        uploadFail = true
      }
      dispatch({ type: types.UPLOAD_ONE_DOC_COMPLETE, payload: { doc: docProps, index, failed: uploadFail } })
    }
    resolve({ failed })
  })
}

/**
 * Determines the jurisdiction search string to use
 * @param jurisdictionName
 * @returns {{searchString: (*|string), isState: boolean}}
 */
export const determineSearchString = jurisdictionName => {
  let searchString = jurisdictionName, isState = true
  
  if (DCStrings.includes(jurisdictionName)) {
    searchString = 'Washington, DC (federal district)'
  } else if (stateLookup[jurisdictionName] !== undefined) {
    searchString = `${stateLookup[jurisdictionName]} (state)`
  } else {
    const jur = Object.values(stateLookup).find(state => {
      const regex = reg(`(${state})\\s?(\\(state\\))?`)
      const match = jurisdictionName.search(regex)
      return match !== -1
    })
    if (jur !== undefined) {
      searchString = `${jur} (state)`
    } else {
      isState = false
    }
  }
  
  return { isState, searchString }
}

/**
 * Merges Excel upload sheet with documents selected
 * @param info
 * @param docs
 * @param api
 * @returns {Promise<any>}
 */
export const mergeInfoWithDocs = (info, docs, api) => {
  return new Promise(async (resolve, reject) => {
    let merged = [], jurLookup = {}, missingJurisdiction = false
    for (const doc of docs) {
      let { name: nameWithoutExt, extension } = removeExtension(doc.name.value)
      if (!allowedTypes.includes(extension)) {
        nameWithoutExt = doc.name.value
      }
      if (info.hasOwnProperty(nameWithoutExt)) {
        let d = { ...doc }, jurs = []
        const docInfo = info[nameWithoutExt]
        Object.keys(valueDefaults).map(key => {
          d[key] = {
            ...d[key],
            editable: docInfo[key] === null,
            inEditMode: false,
            value: docInfo[key] === null ? valueDefaults[key] : docInfo[key],
            error: '',
            fromMetaFile: docInfo[key] !== null
          }
        })
        
        if (docInfo.jurisdictions.name !== null) {
          const { searchString, isState } = determineSearchString(docInfo.jurisdictions.name)
          if (jurLookup.hasOwnProperty(searchString)) {
            jurs = [jurLookup[searchString]]
            d.jurisdictions = { ...d.jurisdictions, value: { ...jurs[0] } }
          } else {
            if (!isState) {
              d.jurisdictions = {
                inEditMode: true,
                error: '',
                value: { ...valueDefaults['jurisdictions'], searchValue: docInfo.jurisdictions.name },
                editable: true,
                fromMetaFile: false
              }
              missingJurisdiction = true
            } else {
              jurs = await api.searchJurisdictionList({}, { params: { name: searchString } }, {})
              jurLookup[searchString] = jurs[0]
              d.jurisdictions = { ...d.jurisdictions, value: { ...jurs[0] } }
            }
          }
        } else {
          d.jurisdictions = {
            inEditMode: false,
            error: '',
            value: valueDefaults['jurisdictions'],
            editable: true,
            fromMetaFile: false
          }
          missingJurisdiction = true
        }
        merged = [...merged, d]
      } else {
        missingJurisdiction = true
        merged = [...merged, doc]
      }
    }
    resolve({ merged, missingJurisdiction })
  })
}

/**
 * check for duplicated documents that selected for upload
 * @param uploadDocs
 * @param documents
 * @returns {Promise<any>}
 */
export const checkDocsDup = (uploadDocs, documents) => {
  let matchedDocs = []
  
  for (const doc of Object.values(documents)) {
    const matchedName = uploadDocs.find(upDoc => upDoc.name === doc.name)
    if (matchedName !== undefined) {
      if (doc.jurisdictions.indexOf(matchedName.jurisdictions[0]) !== -1 &&
        doc.projects.indexOf(matchedName.projects[0]) !== -1) {
        matchedDocs.push(matchedName)
      }
    }
  }
  
  return matchedDocs
}

/**
 * Handles extracting info from an excel spreadsheet and merging if with docs already selected
 */
const extractInfoLogic = createLogic({
  type: types.EXTRACT_INFO_REQUEST,
  async process({ action, getState, docApi, api }, dispatch, done) {
    const state = getState().scenes.docManage.upload.list
    const docs = state.selectedDocs
    try {
      const info = await docApi.extractInfo(action.infoSheetFormData)
      if (docs.length === 0) {
        dispatch({ type: types.EXTRACT_INFO_SUCCESS_NO_DOCS, payload: info })
      } else {
        const { merged, missingJurisdiction } = await mergeInfoWithDocs(info, docs, api)
        dispatch({ type: types.EXTRACT_INFO_SUCCESS, payload: { info, merged, missingJurisdiction } })
      }
    } catch (err) {
      dispatch({ type: types.EXTRACT_INFO_FAIL })
    }
    done()
  }
})

/**
 * Logic for when the user uploads an excel document before selecting docs
 */
const mergeInfoWithDocsLogic = createLogic({
  type: types.MERGE_INFO_WITH_DOCS,
  async transform({ action, getState, api }, next) {
    const docs = action.docs.map(doc => {
      let d = {}
      Object.keys(doc).forEach(prop => {
        d[prop] = { editable: prop !== 'name', value: doc[prop], error: '', inEditMode: false }
      })
      return d
    })
    const { merged, missingJurisdiction } = await mergeInfoWithDocs(
      getState().scenes.docManage.upload.list.extractedInfo,
      docs,
      api
    )
    next({ ...action, payload: { merged, missingJurisdiction } })
  }
})

/**
 * Logic for handling when the user clicks 'upload' in the modal. Verifies that there are no errors on upload
 */
const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_START,
  validate({ getState, action }, allow, reject) {
    const state = getState().scenes.docManage.upload
    const selectedProject = action.project
    const selectedJurisdiction = action.jurisdiction
    let jurs = selectedJurisdiction.hasOwnProperty('id') ? { [selectedJurisdiction.id]: selectedJurisdiction } : {}
    
    if (Object.keys(selectedProject).length === 0) {
      reject({ type: types.REJECT_NO_PROJECT_SELECTED, error: 'You must associate these documents with a project.' })
    } else if (!selectedProject.hasOwnProperty('id')) {
      reject({
        type: types.REJECT_NO_PROJECT_SELECTED,
        error: 'You must select a valid project from the autocomplete list.'
      })
    } else {
      // Go through each file in the list and check if they have a jurisdiction associated with it
      const noJurs = state.list.selectedDocs.filter(doc => {
        if (doc.jurisdictions.value.hasOwnProperty('id') && !jurs.hasOwnProperty(doc.jurisdictions.value.id)) {
          jurs[doc.jurisdictions.value.id] = doc.jurisdictions.value
        }
        return !doc.jurisdictions.value.hasOwnProperty('id') || !doc.jurisdictions.value.id
      })
      
      if (noJurs.length === 0) {
        // all files have a jurisdiction, so allow the upload
        allow({ ...action, jurisdictions: Object.values(jurs) })
      } else {
        // some files do not have a jurisdiction so disallow the upload
        reject({
          type: types.REJECT_EMPTY_JURISDICTIONS,
          error: 'You must select a jurisdiction from the drop-down list at the top to apply to all files or select a jurisdiction from the drop-down list for each file.',
          invalidDocs: noJurs
        })
      }
    }
  },
  async process({ docApi, action, getState }, dispatch, done) {
    const state = getState().scenes.docManage.upload
    const user = getState().data.user.currentUser
    const anyDuplicates = checkDocsDup(action.selectedDocs, getState().scenes.docManage.main.list.documents.byId)
    if (!state.list.hasVerified && anyDuplicates.length > 0) {
      dispatch({
        type: types.VERIFY_RETURN_DUPLICATE_FILES,
        payload: anyDuplicates
      })
      done()
    } else {
      const { failed } = await upload(docApi, action, dispatch, state, user)
      
      action.jurisdictions.forEach(jur => dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jur }))
      dispatch({ type: projectTypes.ADD_PROJECT, payload: { ...action.project } })
      if (failed.length > 0) {
        dispatch({
          type: types.UPLOAD_DOCUMENTS_FINISH_WITH_FAILS,
          payload: { error: 'We couldn\'t upload the documents. Please try again later.', failed }
        })
        done()
      } else {
        dispatch({ type: types.UPLOAD_DOCUMENTS_FINISH_SUCCESS })
        done()
      }
    }
  }
})

export default [
  uploadRequestLogic,
  extractInfoLogic,
  mergeInfoWithDocsLogic
]
