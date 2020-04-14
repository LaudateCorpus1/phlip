import makeActionCreator from 'utils/makeActionCreator'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'

export const types = {
  FORM_VALUE_CHANGE: 'FORM_VALUE_CHANGE',
  SEARCH_VALUE_CHANGE: 'SEARCH_VALUE_CHANGE',
  CLEAR_FORM: 'CLEAR_FORM',
  CLEAR_SEARCH_STRING: 'CLEAR_SEARCH_STRING'
}

export default {
  updateSearchValue: makeActionCreator(types.SEARCH_VALUE_CHANGE, 'value', 'form'),
  updateFormValue: makeActionCreator(types.FORM_VALUE_CHANGE, 'property', 'value'),
  clearForm: makeActionCreator(types.CLEAR_FORM),
  clearSearchString: makeActionCreator(types.CLEAR_SEARCH_STRING)
}

export const projectAutocomplete = {
  ...makeAutocompleteActionCreators('PROJECT', '_SEARCH')
}
