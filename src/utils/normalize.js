import moment from 'moment'

/**
 * Creates an array of objects
 * @param byIdLookup
 * @param arrOfIds
 * @returns {*}
 */
export const createArrOfObj = (byIdLookup, arrOfIds) => {
  return arrOfIds.reduce((arr, id) => {
    return [...arr, { ...byIdLookup[id] }]
  }, [])
}

/**
 * Makes an array the items in the array are a property from items in the array
 *
 * @param {Array} arr
 * @param {String} key
 * @returns {Array}
 */
export const mapArray = (arr, key = 'id') => arr.map(p => p[key])

/**
 * Makes an object from an array of objects where the keys of the object are a property of the object in the array
 *
 * @param {Array} arr
 * @param {String} key
 * @param {Object} otherProps
 * @returns {Object}
 */
export const arrayToObject = (arr, key = 'id', otherProps = {}) => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: { ...item, ...otherProps }
  }), {})
})

/**
 * Gets the initials (first character of first name, first character of lastName)
 *
 * @param {String} firstName
 * @param {String} lastName
 * @returns {String}
 */
export const getInitials = (firstName, lastName) => {
  return lastName.length
    ? firstName[0] + lastName[0]
    : firstName[0] + ''
}

/**
 *
 * @param arr
 * @param index
 * @param updatedItem
 * @returns {...*[]}
 */
export const updateItemAtIndex = (arr, index, updatedItem) => {
  arr.splice(index, 1, updatedItem)
  return [...arr]
}

/**
 * Update an object
 * @param oldObject
 * @param newObject
 */
export const updateObject = (oldObject, newObject) => {
  return {
    ...oldObject,
    ...newObject
  }
}

/**
 * Converts a date time to local timezone
 * @param dateTime
 * @returns {string}
 */
export const convertToLocalDateTime = dateTime => {
  return moment.utc(dateTime).local().format('M/D/YYYY, h:mm A')
}

/**
 * Converts a date to local timesize
 * @param date
 * @returns {string}
 */
export const convertToLocalDate = date => {
  return moment(date).format('M/D/YYYY')
}

/**
 * Makes an array of objects be distinct
 */
export const makeDistinct = (array, property) => {
  return Array.from(new Set(array.map(obj => obj[property]))).map(prop => ({
    [property]: prop,
    ...array.find(obj => obj[property] === prop)
  }))
}

export default {
  mapArray,
  arrayToObject,
  getInitials,
  updateItemAtIndex,
  convertToLocalDateTime,
  convertToLocalDate,
  makeDistinct,
  createArrOfObj
}
