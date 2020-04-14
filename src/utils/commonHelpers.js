import { types as userTypes } from 'data/users/actions'

/**
 * Slices a table (data) for pagination
 *
 * @param {Array} data
 * @param {Number} page
 * @param {Number} rowsPerPage
 * @returns {Array}
 */
export const sliceTable = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

/**
 * Sorts a list of objects based on the parameter sortBy
 *
 * @param {Array} list
 * @param {*} sortBy
 * @param {String} direction
 * @returns {Array}
 */
export const sortListOfObjects = (list, sortBy, direction) => {
  return (
    direction === 'asc'
      ? list.sort((a, b) => (a[sortBy] < b[sortBy]
        ? -1
        : a[sortBy] > b[sortBy]
          ? 1
          : 0))
      : list.sort((a, b) => (b[sortBy] < a[sortBy]
        ? -1
        : b[sortBy] > a[sortBy]
          ? 1
          : 0))
  )
}

/**
 * Sorts a list of objects based on the parameter sortBy with special handling for null value
 *
 * @param {Array} list
 * @param {*} sortBy
 * @param {String} direction
 * @returns {Array}
 */
export const sortListOfObjectsWithNull = (list, sortBy, direction) => {
  return (
    direction === 'asc'
      ? list.sort((a, b) => (a[sortBy]===null)-(b[sortBy]===null) || +(a[sortBy]>b[sortBy])||-(a[sortBy]<b[sortBy]))
      : list.sort((a, b) => (a[sortBy]===null)-(b[sortBy]===null) || -(a[sortBy]>b[sortBy])||+(a[sortBy]<b[sortBy]))
  )
}
/**
 * Generates a key and ID as props for a table
 *
 * @param {*} id
 * @returns {function(id: String): {id: *, key: String}}
 */
const generateUniqueProps = id => header => ({
  id: `${id}-${header}`,
  key: `${id}-${header}`
})

/**
 * Checks if a string if multi-word based on spaces
 * @param str
 * @returns {boolean}
 */
export const checkIfMultiWord = str => {
  return str.split(' ').length > 1
}

/**
 * Handles determining if getting avatars is needed
 * @param users
 * @param allUserObjs
 * @param dispatch
 * @param api
 * @returns {Promise<any>}
 */
export const handleUserImages = (users, allUserObjs, dispatch, api) => {
  let avatar, errors = {}
  const now = Date.now()
  const oneday = 60 * 60 * 24 * 1000

  return new Promise(async (resolve, reject) => {
    if (users.length === 0) {
      resolve({ errors })
    }
    for (let i = 0; i < users.length; i++) {
      const { userId, ...coder } = users[i]
      let needsCheck = true, update = false
      try {
        if (allUserObjs.hasOwnProperty(userId)) {
          if ((now - allUserObjs[userId].lastCheck) > oneday) {
            needsCheck = true
            update = true
          } else {
            needsCheck = false
          }
        }

        if (needsCheck) {
          try {
            avatar = await api.getUserImage({}, {}, { userId })
          } catch (err) {
            errors = { userImages: 'failed to get some user images.' }
            avatar = ''
          }

          dispatch({
            type: update
              ? userTypes.UPDATE_USER
              : userTypes.ADD_USER,
            payload: {
              id: userId,
              ...coder,
              avatar,
              lastCheck: now
            }
          })
        }
      } catch (error) {
        errors = { userImages: 'Failed to get user images' }
      }
      if (i === users.length - 1) {
        resolve({ errors })
      }
    }
  })
}

/**
 * Removes the extension, if it exists from string
 * @param string
 * @returns {*}
 */
export const removeExtension = string => {
  const pieces = [...string.split('.')]
  let name = string, extension = ''
  if (pieces.length > 0) {
    extension = pieces[pieces.length - 1]
    pieces.pop()
    name = pieces.join('.')
  }

  return { name, extension }
}

const signatures = {
  '25504446': ['pdf'],
  '7B5C7274': ['doc', 'rtf'],
  '504B34': ['docx', 'odt', 'xlsx']
}

/**
 * Determines the file type of a document selected for upload
 */
export const getFileType = file => {
  return new Promise(async (resolve, reject) => {
    const filereader = new FileReader()
    filereader.onload = evt => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result)
        const { extension } = removeExtension(file.name)
        let bytes = [], fileType = undefined
        uint.forEach(byte => bytes.push(byte.toString(16)))
        const hex = bytes.join('').toUpperCase()
        const types = signatures[hex]
        if (types !== undefined) {
          if (extension === '') {
            fileType = types[0]
          } else {
            const type = types.find(type => type === extension)
            fileType =
              type !== undefined
                ? type
                : extension
          }
        }

        resolve({ ...file, fileType })
      }
    }

    const blob = file.slice(0, 4)
    filereader.readAsArrayBuffer(blob)
  })
}

/**
 * custom sort for document list in validation screen
 */
export const docListSort = (list, sortBy1, sortBy2, direction, group = undefined) => {
  let sorted = sortListOfObjectsWithNull(list, sortBy1, direction)
  if (group) {
    let grouped = {}
    for (let i = 0; i < sorted.length; i += 1) {
      if (!grouped[sorted[i][sortBy2]]) {
        grouped[sorted[i][sortBy2]] = []
      }
      grouped[sorted[i][sortBy2]].push(sorted[i])
    }
    const uniqueDocName = Array.from(new Set(sorted.map(a => a[sortBy2])))
      .map(x => {
        return sorted.find(a => a[sortBy2] === x)
      })
    let mergedList = []
    uniqueDocName.forEach(item => {
      grouped[item[sortBy2]].forEach(doc => {
        mergedList.push(doc)
      })
    })
    return mergedList
  } else {
    return sorted
  }
}

export default {
  sliceTable,
  sortListOfObjects,
  generateUniqueProps,
  checkIfMultiWord,
  handleUserImages,
  removeExtension,
  getFileType,
  docListSort
}
