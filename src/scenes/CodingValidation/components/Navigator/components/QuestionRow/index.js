import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import navStyles from './nav-styles.scss'
import { Icon, Progress } from 'components'

export const QuestionRow = ({ item, children, treeLength, onQuestionSelected }) => {
  let scaffold = []
  let className = ''
  const textColor = '#A6B6BB'

  const questionTextStyles = {
    color: item.isCurrent === true
      ? '#72defd'
      : item.isAnswered
        ? textColor
        : item.completedProgress === 100
          ? textColor
          : 'white',
    fontWeight: 300,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
    outline: 0
  }

  const rowStyles = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: 40,
    outline: 0
  }

  item.ancestorSiblings.forEach((count, i) => {
    if (count > 0) {
      if (item.parentId === 0 && item.positionInParent === 0) {
        if (item.children && item.children.length > 0) {
          className = navStyles.navParentFirst
        } else {
          className = `${navStyles.navQuestionNoChildren} ${navStyles.navFirstNoChildren}`
        }
      } else if (i === item.ancestorSiblings.length - 1) {
        if (item.children && item.children.length > 0) {
          className = `${navStyles.navParent}`
        } else {
          className = `${navStyles.navChild} ${navStyles.navQuestionNoChildren}`
        }
      } else {
        className = `${navStyles.navChild}`
      }
    } else if (item.parentId === 0 && item.positionInParent === 0) {
      if (item.children && item.children.length > 0) {
        className = ''
      } else {
        className = navStyles.navQuestionNoChildren
      }
    } else if (i === item.ancestorSiblings.length - 1) {
      if (item.children && item.children.length > 0) {
        className = `${navStyles.navParentLast}`
      } else {
        className = `${navStyles.navChildLast} ${navStyles.navQuestionNoChildren}`
      }
    } else {
      className = navStyles.navRow
    }

    scaffold.push(<div key={`${item.id}-scaffold-${i}`} className={className} style={{ left: 23 * i }} />)
  })

  return (
    <>
      {scaffold}
      <div
        role="row"
        style={{ ...rowStyles, marginLeft: 23 * item.indent, cursor: 'pointer', outline: 0 }}
        onClick={() => onQuestionSelected('nav', item)}
        aria-label="Click to show this question"
        aria-rowindex={item.treeIndex}>
        <span
          style={{ minWidth: 20, minHeight: 20, maxHeight: 20, maxWidth: 20, outline: 0 }}
          tabIndex={-1}>{children}
        </span>
        <Typography tabIndex={-1} style={questionTextStyles} noWrap aria-label="Question number and text">
          {item.number && <span>{`${item.number}. `}</span>}
          {item.text}
        </Typography>
        {item.questionType === 2 &&
        <Icon
          size={12}
          aria-label="Question is of type cateogry"
          color={questionTextStyles.color}
          style={{ paddingRight: 5 }}>filter_none
        </Icon>}
        {item.hasOwnProperty('flags') && item.flags.length > 0 &&
        <Icon
          aria-label="Question has a red flag"
          role="gridcell"
          color={questionTextStyles.color}
          size={17}>
          report
        </Icon>}
        {item.hasOwnProperty('completedProgress') && item.completedProgress < 100 &&
        <Progress
          aria-label={`Question is ${item.completedProgress} percent answered`}
          containerStyles={{ marginLeft: item.hasOwnProperty('flags') && item.flags.length > 0 ? 5 : 0 }}
          progress={item.completedProgress}
        />}
        {(item.isAnswered || (item.hasOwnProperty('completedProgress') && item.completedProgress === 100)) &&
        <Icon
          aria-label="Question has been answered"
          role="gridcell"
          color="#38E37F"
          size={19}>check
        </Icon>}
      </div>
    </>
  )
}

QuestionRow.propTypes = {
  item: PropTypes.object,
  treeLength: PropTypes.number,
  children: PropTypes.node,
  onQuestionSelected: PropTypes.func
}

export default QuestionRow
