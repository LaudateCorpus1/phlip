import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTableRow } from '@material-ui/core/TableRow'

/**
 * Simple wrapper for @material-ui/core's TableRow component
 */
export const TableRow = ({ children, ...otherProps }) => {
  return (
    <MuiTableRow {...otherProps}>
      {children}
    </MuiTableRow>
  )
}

TableRow.propTypes = {
  /**
   * Contents of table row, most likely TableCell components
   */
  children: PropTypes.node
}

export default TableRow