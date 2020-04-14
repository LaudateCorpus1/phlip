import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import styles from './tree-node.scss'

/**
 * This component is used for the scaffolding / container for the Question Node of the coding scheme
 */
export const TreeNode = props => {
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    treeId,
    getPrevRow,
    rowDirection,
    ...otherProps
  } = props
  
  const scaffold = []
  const scaffoldBlockCount = lowerSiblingCounts.length
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = ''
    if (lowerSiblingCount > 0) {
      if (listIndex === 0) {
        // question is the first of many. add a line protruding from the question and one going down
        lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineHalfVerticalBottom}`
      } else if (i === scaffoldBlockCount - 1) {
        // made it to the question itself
        lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineFullVertical}`
      } else {
        // adds a vertical line for children to be added later
        lineClass = styles.lineFullVertical
      }
    } else if (listIndex === 0) {
      // this scaffold bolk represents and this is also the first and only question
      lineClass = styles.lineHalfHorizontalRight
    } else if (i === scaffoldBlockCount - 1) {
      // this is the last scaffold block to process
      lineClass = `${styles.lineHalfVerticalTop} ${styles.lineHalfHorizontalRight}`
    }

    scaffold.push(<div
      key={`pre_${1 + i}`}
      tabIndex={-1}
      style={{ width: scaffoldBlockPxWidth }}
      className={`${styles.lineBlock} ${lineClass}`}
    />)

    if (treeIndex !== listIndex && i === swapDepth) {
      let highlightLineClass = ''
      if (listIndex === swapFrom + swapLength - 1) {
        highlightLineClass = styles.highlightBottomLeftCorner
      } else if (treeIndex === swapFrom) {
        highlightLineClass = styles.highlightTopLeftCorner
      } else {
        highlightLineClass = styles.highlightLineVertical
      }

      scaffold.push(<div
        key={`highlight_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth, left: scaffoldBlockPxWidth * i }}
        className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
        tabIndex={-1}
      />)
    }
  })
  
  return connectDropTarget(
    <div {...otherProps} className={styles.node} tabIndex={-1}>
      {scaffold}
      {Children.map(children, child =>
        cloneElement(child, {
          isOver,
          canDrop,
          draggedNode,
          lowerSiblingCounts,
          listIndex,
          swapFrom,
          swapLength,
          swapDepth
        }))}
    </div>
  )
}

TreeNode.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null
}

TreeNode.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  /**
   * This is of sibling counts, it's used to determine how much scaffolding is used. the length basically represents
   * how nested this question is
   */
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
}

export default TreeNode
