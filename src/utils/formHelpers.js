import moment from 'moment'

/**
 * Validates that a field is required
 *
 * @param {*} value
 * @returns {?String}
 */
export const validateRequired = value => value ? undefined : 'Required'

/**
 * Validates that an input of type array has values
 *
 * @param {Array} arr
 * @returns {?String}
 */
export const validateRequiredArray = arr => arr.length > 0 ? undefined : 'Required'

/**
 * Validates that a date is required
 *
 * @param {*} value
 * @returns {?String}
 */
export const validateDate = value => {
  return value === 'mm/dd/yyyy' || value === undefined ? 'Required' : undefined
}

/**
 * Validates the range of two dates
 *
 * @param {Object} values
 * @param {Object} currentErrors
 * @returns {Object}
 */
export const validateDateRanges = (values, currentErrors) => {
  let errors = { ...currentErrors }

  if (moment(values.endDate).isBefore(moment(values.startDate))) {
    errors.endDate = 'End date must be later than start date'
    errors.startDate = 'Start date must be earlier than end date'
  }

  return errors
}

/**
 * Trims the whitespace from a string
 *
 * @param {String} str
 * @returns {String}
 */
export const trimWhitespace = str => str.trim()

/**
 * Capitalizes the frist letter of a sentence
 *
 * @param {String} text
 * @returns {String}
 */
export const capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)
