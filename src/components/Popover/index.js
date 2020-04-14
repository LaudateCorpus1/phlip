import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import { Manager, Popper, Reference } from 'react-popper'

/**
 * Popover component that displays a
 */
export class Popover extends Component {
  constructor(props, context) {
    super(props, context)
  }

  state = {
    open: true
  }

  target = null

  onOpenTooltip = () => {
    this.setState({
      open: true
    })
  }

  onCloseTooltip = () => {
    this.setState({
      open: false
    })
  }

  render() {
    const tooltipStyles = {
      backgroundColor: '#6d6d6d',
      opacity: this.state.open ? .9 : 0,
      color: 'white',
      padding: 8,
      borderRadius: 2,
      fontSize: 10,
      fontFamily: 'Roboto',
      transform: this.state.open ? 'scale(1)' : 'scale(0)'
    }

    return (
      <Manager>
        <Reference>
          {({ targetProps }) => (
            React.cloneElement(this.props.children, {
              ...this.props.children.props,
              onMouseEnter: this.onOpenTooltip,
              onMouseLeave: this.onCloseTooltip,
              ref: node => {
                this.target = findDOMNode(node)
                targetProps.ref(this.target)
              }
            })
          )}
        </Reference>
        <Popper
          placement="top"
          eventsEnabled={this.state.open}
          modifiers={{
            preventOverflow: {
              enabled: false
            }
          }}
          style={{ zIndex: this.state.open ? 1200 : 0 }}>
          {({ popperProps, restProps }) => {
            return (
              <div {...popperProps} {...restProps} style={{ ...popperProps.style, ...restProps.style }}>
                <div style={tooltipStyles}>{this.props.title}</div>
              </div>
            )
          }}
        </Popper>
      </Manager>
    )
  }
}

Popover.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
}

export default Popover