import React from 'react'
import PropTypes from 'prop-types'

export const FlexGrid = props => {
  const { type, flex, container, align, justify, children, style, padding, raised, circular, ...otherProps } = props

  const elStyle = {
    display: container ? 'flex' : 'block',
    ...container ? {
      alignItems: align,
      justifyContent: justify
    } : {},
    padding,
    ...raised ? {
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
      borderRadius: circular ? '50%' : 2,
      backgroundColor: 'white'
    } : {},
    ...circular ? { borderRadius: '50%', padding: '2em' } : {},
    ...flex ? { flex: '1 1 auto', minHeight: 0 } : {},
    ...container ? { flexDirection: type } : {},
    ...style
  }

  return (
    <div style={elStyle} {...otherProps}>{children}</div>
  )
}

const alignJustifyTypes = [
  'normal',
  'flex-start',
  'flex-end',
  'center',
  'self-start',
  'self-end',
  'baseline',
  'stretch',
  'safe',
  'unsafe',
  'space-between',
  'space-around',
  'space-evenly'
]

FlexGrid.defaultProps = {
  type: 'column',
  flex: false,
  container: false,
  align: 'stretch',
  justify: 'stretch',
  style: {},
  padding: 0,
  raised: false,
  circular: false
}

FlexGrid.propTypes = {
  /**
   * Flex direction
   */
  type: PropTypes.oneOf(['row', 'column']),
  /**
   * Whether or not this element should flex
   */
  flex: PropTypes.bool,
  /**
   * Determines if display:flex is set
   */
  container: PropTypes.bool,
  /**
   * Value to pass to align-items
   */
  align: PropTypes.oneOf(alignJustifyTypes),
  /**
   * Value to pass to justify-content
   */
  justify: PropTypes.oneOf(alignJustifyTypes),
  /**
   * Any overriding style to pass to component
   */
  style: PropTypes.object,
  /**
   * Is it a card component
   */
  raised: PropTypes.bool,
  /**
   * Sets border-radius to 50%
   */
  circular: PropTypes.bool,
  /**
   * Padding to be added to component
   */
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Contents of component
   */
  children: PropTypes.any
}

export default FlexGrid
