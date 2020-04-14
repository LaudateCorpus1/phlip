import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SortableTree from 'react-sortable-tree'
import { withRouter } from 'react-router-dom'
import TreeNode from './components/TreeNode'
import QuestionNode from './components/QuestionNode'
import * as questionTypes from '../../scenes/AddEditQuestion/constants'

/**
 * Determines whether or not the location that the user is trying to drop the node to is allowed
 * @param node
 * @param nextParent
 * @param prevParent
 * @param outline
 * @param questions
 * @returns {boolean}
 */
const canDrop = (node, nextParent, prevParent, outline, questions) => {
  if (node.isCategoryQuestion) {
    if (nextParent === null || nextParent.id !== prevParent.id) return false
    else return true
  } else {
    if (nextParent === null) return true
    if (nextParent.questionType === questionTypes.CATEGORY) return false

    const grandParentId = outline[nextParent.id].parentId
    let canDrop = true
    questions.map(question => {
      if (question.id === grandParentId) {
        canDrop = question.questionType !== questionTypes.CATEGORY
      }
    })
    return canDrop
  }
}

export class Scheme extends Component {
  static propTypes = {
    /**
     * List of questions in the scheme in tree form
     */
    questions: PropTypes.array,
    /**
     * When the user changes something about the question
     */
    onQuestionTreeChange: PropTypes.func,
    /**
     * Outline of the scheme
     */
    outline: PropTypes.object,
    /**
     * The list of questions in the scheme but flat
     */
    flatQuestions: PropTypes.array,
    /**
     * When the user moves a node
     */
    onQuestionNodeMove: PropTypes.func,
    /**
     * Project ID for which this coding scheme applies
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * If the user has checked out the coding scheme
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * If the coding scheme is checked out
     */
    hasLock: PropTypes.bool,
    /**
     * User requests to delete a question
     */
    onDeleteQuestion: PropTypes.func,
    /**
     * If the project is locked
     */
    projectLocked: PropTypes.bool,
    /**
     * Browser history
     */
    history: PropTypes.object
  }
  
  /**
   * Opens the add / edit question form
   */
  handleOpenAddEditModal = (addOrEdit, node, canModify, path) => {
    const { history, projectId } = this.props
    const locationState = addOrEdit === 'add' ? 'parentDefined' : 'questionDefined'
    const pathname = addOrEdit === 'add'
      ? `/project/${projectId}/coding-scheme/${addOrEdit}`
      : `/project/${projectId}/coding-scheme/${addOrEdit}/${node.id}`
    
    history.push({
      pathname,
      state: { [locationState]: { ...node }, path, canModify, modal: true }
    })
  }

  render() {
    const {
      questions, flatQuestions, onQuestionTreeChange, onQuestionNodeMove, projectLocked, projectId, outline,
      lockedByCurrentUser, hasLock, onDeleteQuestion
    } = this.props

    return (
      <SortableTree
        theme={{
          nodeContentRenderer: QuestionNode,
          treeNodeRenderer: TreeNode,
          scaffoldBlockPxWidth: 100,
          slideRegionSize: 50,
          rowHeight: 75
        }}
        treeData={questions}
        onChange={onQuestionTreeChange}
        onMoveNode={onQuestionNodeMove}
        style={{ flex: '1 0 50%' }}
        reactVirtualizedListProps={{ overscanRowCount: 10, containerRole: 'list' }}
        generateNodeProps={() => {
          return {
            projectId,
            canModify: projectLocked ? false : hasLock && lockedByCurrentUser,
            onDeleteQuestion,
            onOpenAddEditModal: this.handleOpenAddEditModal
          }
        }}
        canDrag={projectLocked ? false : hasLock && lockedByCurrentUser}
        canDrop={({ node, nextParent, prevParent }) => canDrop(node, nextParent, prevParent, outline, flatQuestions)}
        isVirtualized
      />
    )
  }
}

export default withRouter(Scheme)
