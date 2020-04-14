import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTableCell } from '@material-ui/core/TableCell'

/**
 * Wrapper for @material-ui/core's TableCell component
 */
export const TableCell = ({ style, padding, children, ...otherProps }) => {
  return (
    <MuiTableCell padding={padding} style={{ ...style, minWidth: '1%' }} {...otherProps}>
      {children}
    </MuiTableCell>
  )
}

TableCell.propTypes = {
  /**
   * Override style of table cell
   */
  style: PropTypes.object,
  /**
   * Contents of table cell
   */
  children: PropTypes.node,
  /**
   * How much padding to add to table cell, based on @material-ui/core's options
   */
  padding: PropTypes.string
}

TableCell.defaultProps = {
  padding: 'default'
}

export default TableCell
