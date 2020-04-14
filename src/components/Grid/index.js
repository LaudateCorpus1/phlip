import React from 'react'
import PropTypes from 'prop-types'

const Grid = props => {
  const { rowSizing, columnSizing, autoRowSizing, autoColumnSizing, style, children, ...otherProps } = props
  const styles = {
    display: 'grid',
    gridTemplateColumns: columnSizing,
    gridTemplateRows: rowSizing,
    gridAutoRows: autoRowSizing,
    gridAutoColumns: autoColumnSizing,
    ...style
  }

  return (
    <div style={styles} {...otherProps}>{children}</div>
  )
}

Grid.propTypes = {
  rowSizing: PropTypes.any,
  columnSizing: PropTypes.any,
  autoRowSizing: PropTypes.any,
  autoColumnSizing: PropTypes.any,
  style: PropTypes.object,
  children: PropTypes.any
}

export default Grid