import { schemeById, schemeFromApi } from 'utils/testData/coding'

export const schemeTreeFromApi = [
  { ...schemeById[1] },
  { ...schemeById[2] },
  {
    ...schemeById[3],
    expanded: true,
    childQuestions: [{ ...schemeById[4] }]
  },
  { ...schemeById[5] }
]

export const expandedSchemeTree = [
  { ...schemeFromApi[0], expanded: true },
  { ...schemeFromApi[1], expanded: true },
  {
    ...schemeFromApi[2],
    expanded: true,
    children: [{ ...schemeFromApi[3], expanded: true }]
  },
  { ...schemeFromApi[4], expanded: true }
]

export { schemeOutline, schemeFromApi, schemeTree } from './coding'
