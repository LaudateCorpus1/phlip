import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiIconButton } from '@material-ui/core/IconButton'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

/**
 * @component
 * Component that is an Icon but functions as a button
 */
export const IconButton = ({ color, onClick, iconSize, style, iconStyle, tooltipText, id, placement, children, disabled, ...otherProps }) => {
  const styles = {
    width: iconSize,
    height: iconSize,
    ...style
  }

  const Button = (
    <MuiIconButton
      onClick={onClick}
      disableRipple
      style={styles}
      {...otherProps}
      disabled={disabled}>
      <Icon color={color} size={iconSize} style={{ ...iconStyle }}>
        {children}
      </Icon>
    </MuiIconButton>
  )

  return (tooltipText.length > 0 && !disabled)
    ? <Tooltip id={id} text={tooltipText} placement={placement}>{Button}</Tooltip>
    : Button
}

IconButton.propTypes = {
  /**
   * Color of icon
   */
  color: PropTypes.string,
  /**
   * Function to call when the component is clicked
   */
  onClick: PropTypes.func,
  /**
   * Size of icon
   */
  iconSize: PropTypes.number,
  /**
   * Style of button wrapper for icon
   */
  style: PropTypes.object,
  /**
   * Override style of icon
   */
  iconStyle: PropTypes.object,
  /**
   * Text shown when hovering over icon button
   */
  tooltipText: PropTypes.string,
  /**
   * Tooltip ID
   */
  id: PropTypes.string,
  /**
   * Tooltip placement
   */
  placement: PropTypes.string,
  /**
   * String of icon name from https://material.io/icons or icon component (for ex. from mdi-material-ui component)
   */
  children: PropTypes.any,
  /**
   * Whether or not the button is disabled
   */
  disabled: PropTypes.bool
}

IconButton.defaultProps = {
  color: 'white',
  iconSize: 24,
  tooltipText: '',
  disabled: false
}

export default IconButton