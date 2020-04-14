import projectLogic from './projects/logic'
import jurisdictionLogic from './jurisdictions/logic'
import autocompleteLogic from './autocomplete/logic'

export default [
  ...projectLogic,
  ...jurisdictionLogic,
  ...autocompleteLogic
]