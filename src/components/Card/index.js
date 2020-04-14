import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'

const baseStyle = { flex: '1' }

/**
 * Card based on @material-ui/core's Card (raised paper)
 */
export const Card = ({ children, style, ...otherProps }) => {
  return (
    <Paper style={{ ...baseStyle, ...style }} {...otherProps}>
      {children}
    </Paper>
  )
}

Card.propTypes = {
  /**
   * Items to be rendered on the card
   */
  children: PropTypes.node,

  /**
   * Style of the card
   */
  style: PropTypes.object
}

export default Card