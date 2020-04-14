import React from 'react'
import PropTypes from 'prop-types'
import MuiChip from '@material-ui/core/Chip'

export const Chip = (props, key) => {
  const { text, isDisabled, handleClick, handleDelete, className, ...otherProps } = props
  return (
    <MuiChip
      key={key}
      onDelete={handleDelete}
      onClick={handleClick}
      style={{
        pointerEvents: isDisabled ? 'none' : undefined,
        backgroundColor: props.color
      }}
      label={text}
      className={className}
      {...otherProps}
    />
  )
}

Chip.propTypes = {
  /**
   * Text to show in the chip
   */
  text: PropTypes.string,

  /**
   * Is the user focused on the chip
   */
  isFocused: PropTypes.bool,

  /**
   * Is the chip disabled
   */
  isDisabled: PropTypes.bool,

  /**
   * Function to handle when the user clicks the chip
   */
  handleClick: PropTypes.func,

  /**
   * Function to handle when the user deletes a chip
   */
  handleDelete: PropTypes.func,

  /**
   * Any classname to apply to chip
   */
  className: PropTypes.string
}

export default Chip