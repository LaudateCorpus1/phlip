import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiButton } from '@material-ui/core/Button'
import { withTheme } from '@material-ui/core/styles'

/**
 * Basic button based on @material-ui/core
 * @component
 */
export class Button extends React.Component {
  static propTypes = {
    /**
     * Content of the button
     */
    value: PropTypes.any,
    /**
     * Color of the button
     */
    color: PropTypes.string,
    /**
     * Handles when the button is clicked
     */
    onClick: PropTypes.func,
    /**
     * Whether or not the button is a raised button
     */
    raised: PropTypes.bool,
    /**
     * Project theme provided by @material-ui/core
     */
    theme: PropTypes.object,
    /**
     * Is the button displayed in a list? List buttons have a particular style
     */
    listButton: PropTypes.bool,
    /**
     * Is the button disabled
     */
    disabled: PropTypes.bool,
    /**
     *  reference to the button element
     */
    refer: PropTypes.bool
  }
  
  static defaultProps = {
    raised: true,
    color: 'primary',
    listButton: false,
    disabled: false
  }
  
  constructor(props) {
    super(props)
  }
  
  onFocus = () => {
    this.setState({
      focused: true
    })
  }
  
  render() {
    const { value, color, onClick, raised, theme, textColor, listButton, style, children, disabled, ...otherProps } = this.props
    const buttonColor = color === 'accent' ? 'secondary' : 'default'
    const variant = raised ? 'raised' : 'text'
    const styles = {
      color: (raised || listButton)
        ? disabled
          ? `rgba(0, 0, 0, 0.26)`
          : textColor
            ? textColor
            : 'white'
        : theme.palette[color]
          ? theme.palette[color].main
          : color || '',
      fontWeight: 400,
      backgroundColor: raised
        ? disabled
          ? `rgba(0, 0, 0, 0.12)`
          : theme.palette[color]
            ? theme.palette[color].main
            : color
        : listButton
          ? theme.palette.primary.light
          : '',
      ...style
    }
    
    if (value) {
      return (
        <MuiButton
          variant={variant}
          color={buttonColor}
          onClick={onClick}
          style={styles}
          disabled={disabled}
          onFocus={this.onFocus}
          {...otherProps}>
          {value}
        </MuiButton>
      )
    } else {
      return (
        <MuiButton
          variant={variant}
          color={buttonColor}
          onClick={onClick}
          disabled={disabled}
          style={styles}
          {...otherProps}>
          {children}
        </MuiButton>
      )
    }
  }
}

export default withTheme()(Button)
