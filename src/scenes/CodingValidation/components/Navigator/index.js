import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from 'react-virtualized/dist/commonjs/List'
import navStyles from './nav-styles.scss'
import QuestionRow from './components/QuestionRow'
import { connect } from 'react-redux'
import { IconButton, Icon } from 'components'
import Resizable from 're-resizable'

/* istanbul ignore next */
const ResizeHandle = () => (
  <Icon style={{ width: 15, minWidth: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    more_vert
  </Icon>
)

/**
 * @component
 * Navigator
 */
export class Navigator extends Component {
  static propTypes = {
    currentQuestion: PropTypes.object,
    handleQuestionSelected: PropTypes.func,
    selectedCategory: PropTypes.number,
    tree: PropTypes.array
  }
  
  constructor(props, context) {
    super(props, context)
    this.QuestionList = React.createRef()
  }
  
  state = {
    height: '100%',
    width: 300,
    list: {
      height: document.body.clientHeight,
      width: 300
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps && this.QuestionList.current !== null) {
      this.QuestionList.current.recomputeRowHeights()
      this.QuestionList.current.forceUpdate()
    }
  }
  
  /**
   * Renders a specific question in the navigator
   * @param item
   * @param key
   * @param treeIndex
   * @param treeLength
   * @param ancestorSiblings
   * @returns {*[]}
   */
  questionRenderer = ({ item, key, treeIndex, treeLength, ancestorSiblings = [] }) => {
    const { handleQuestionSelected, selectedCategory, currentQuestion } = this.props
    
    const onClick = event => {
      event.stopPropagation()
      item.expanded = !item.expanded
      if (this.QuestionList.current !== null) {
        this.QuestionList.current.recomputeRowHeights()
        this.QuestionList.current.forceUpdate()
      }
    }
    
    let props = {
      item: {
        ...item,
        ancestorSiblings,
        treeIndex
      },
      treeLength,
      onQuestionSelected: handleQuestionSelected
    }
    
    const iconProps = { iconSize: 20, color: '#A6B6BB', onClick }
    let children = []
    let itemEl = null
    
    if ((item.id === currentQuestion.id && !item.isCategoryQuestion) ||
      (item.schemeQuestionId === currentQuestion.id && treeIndex === selectedCategory)) {
      props.item.isCurrent = true
    } else {
      props.item.isCurrent = false
    }
    
    if (item.children && item.children.length > 0) {
      if (item.expanded) {
        itemEl = <IconButton {...iconProps} aria-label="Click to collapse">remove_circle_outline</IconButton>
      } else {
        itemEl = <IconButton {...iconProps} aria-label="Click to expand">add_circle_outline</IconButton>
      }
      
      children = item.children.map((child, index) => {
        return this.questionRenderer({
          item: child,
          key: key + '-' + index,
          treeIndex: index,
          treeLength: item.children.length,
          ancestorSiblings: [...ancestorSiblings, item.children.length - index - 1]
        })
      })
      
      children = item.expanded ? children : []
    }
    
    return [<QuestionRow key={key} {...props}>{itemEl}</QuestionRow>, ...children]
  }
  
  /**
   * Renders the wrapping row for a question in the navigator
   * @param params
   * @returns {boolean|*}
   */
  rowRenderer = params => {
    const tree = this.props.tree
    
    return (
      tree.length !== 0
      && tree[params.index] !== undefined
      && (
        <div
          style={{ ...params.style, outline: 'none' }}
          key={`tree-${params.index}`}
          role="row"
          aria-rowindex={params.index}>
          {this.questionRenderer({
            item: tree[params.index],
            key: params.index,
            treeIndex: params.index,
            treeLength: tree.length,
            ancestorSiblings: [tree.length - params.index - 1]
          })}
        </div>
      )
    )
  }
  
  /*
   * Rows are considered at the root level. so if a root item has children, to get the full height of the row, you have
   * to get the number of all children and multiply it by the row height, 40 px
   */
  getExpandedItemCount = item => {
    let count = 1
    
    if (item.expanded) {
      count += item.children
        .map(this.getExpandedItemCount)
        .reduce((total, count) => {
          return total + count
        }, 0)
    }
    
    return count
  }
  
  /**
   * Determines the row wrapper height depending on if questions are expanded
   * @param tree
   * @returns {function(*): number}
   */
  rowHeight = tree => params => this.getExpandedItemCount(tree[params.index]) * 40
  
  /**
   * When the navigator resizing stops set the width
   * @param e
   * @param direction
   * @param ref
   * @param d
   */
  onResizeStop = (e, direction, ref, d) => {
    const { width, list } = this.state
  
    this.setState({
      width: width + d.width,
      list: {
        width: width + d.width,
        height: list.height
      }
    })
  }
  
  /**
   * Updates the list width so the question text gets re-rendered
   * @param e
   * @param direction
   * @param ref
   * @param d
   */
  onResize = (e, direction, ref, d) => {
    const { width, list } = this.state
    
    this.setState({
      list: {
        width: width + d.width,
        height: list.height
      }
    })
  }
  
  render() {
    const questionTree = this.props.tree
    const { width, list } = this.state
    
    return (
      <Resizable
        size={{ width, height: '100%' }}
        minWidth="40"
        maxWidth="90%"
        style={{ position: 'unset', display: 'flex' }}
        onResize={this.onResize}
        onResizeStop={this.onResizeStop}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        handleComponent={{ right: ResizeHandle }}
        handleStyles={{
          right: {
            top: 'unset',
            position: 'unset',
            display: 'flex',
            width: 15,
            minWidth: 15,
            paddingLeft: 2,
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
            right: 0
          }
        }}
        defaultSize={{ width: 300, height: '100%' }}>
        <div
          style={{
            backgroundColor: '#3A4041',
            overflow: 'hidden',
            flex: '1 1 auto',
            borderRight: 0,
            outline: 'none',
            display: 'flex',
            paddingRight: width <= 15 ? 0 : 10
          }}>
          <List
            className={navStyles.navScroll}
            style={{ height: list.height, paddingLeft: 10, paddingRight: 20, outline: 'none' }}
            rowCount={questionTree.length}
            rowHeight={this.rowHeight(questionTree)}
            rowRenderer={this.rowRenderer}
            width={list.width}
            height={list.height}
            overscanRowCount={0}
            ref={this.QuestionList}
          />
        </div>
      </Resizable>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    tree: state.scenes.codingValidation.coding.scheme === null ? [] : state.scenes.codingValidation.coding.scheme.tree,
    currentQuestion: state.scenes.codingValidation.coding.question || {}
  }
}

export default connect(mapStateToProps, null)(Navigator)
