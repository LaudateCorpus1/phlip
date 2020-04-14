import { commonHelpers } from 'utils'
import { map } from 'react-sortable-tree'

/**
 * Get node key for the tree (this is used by react-sortable-tree lib)
 *
 * @param {Object} node
 * @param {Number} treeIndex
 * @returns {Number}
 */
export const getNodeKey = ({ node, treeIndex }) => {
  return treeIndex
}

/**
 * Sorts questions based on position in parent
 *
 * @param {Array} questions
 * @returns {Array}
 */
export const sortQuestions = questions => {
  const sortedChildren = map({
    treeData: questions,
    getNodeKey,
    callback: ({ node }) => {
      if (node.children) {
        node.children = commonHelpers.sortListOfObjects(node.children, 'positionInParent', 'asc')
      }
      return node
    },
    ignoreCollapsed: false
  })
  return commonHelpers.sortListOfObjects(sortedChildren, 'positionInParent', 'asc')
}

/**
 * This determines how deep in the tree a question is
 *
 * @param {String} numberString
 * @returns {Number}
 */
const getIndent = numberString => numberString.split('.').length > 1 ? numberString.split('.').length - 1 : 0

/**
 * Sets the children of all nodes in a tree, while keeping a full list of all nodes
 *
 * @param {Object} node
 * @param {Number} number
 * @param {Array} fullList
 * @param {Object} numbering
 * @param {Array} order
 * @returns {Object} {{ fullList: Array, node: Object, numbering: Object, order: Array }}
 */
const setChildren = (node, number, fullList, numbering, order) => {
  node.indent = getIndent(number)
  node.number = number

  const { children, ...fullNode } = { ...node }

  fullList.push({ ...fullNode })
  numbering[node.id] = { number }
  order.push(node.id)

  if (node.children) {
    node.expanded = true
    node.children = node.children.map((child, i) => {
      return setChildren(child, `${number}.${i + 1}`, fullList, numbering, order).node
    })
  }

  return { fullList, node, numbering, order }
}

/**
 * Takes questions an creates a tree with question numbering (1, 1.1, 2, etc.) as well gets the order of the questions
 *
 * @param {Array} questions
 * @returns {{ questionsWithNumbers: Array, order: Array, tree: Array }}
 */
export const getQuestionNumbers = questions => {
  let order = [], numbering = {}, tree = [], fullList = []

  questions.map((question, i) => {
    const out = setChildren(question, `${i + 1}`, fullList, numbering, order)
    fullList = out.fullList
    numbering = out.numbering
    order = out.order
    tree.push({ ...out.node })
  })

  return { questionsWithNumbers: fullList, order, tree }
}