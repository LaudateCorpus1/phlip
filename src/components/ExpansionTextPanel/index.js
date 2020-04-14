import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import IconButton from 'components/IconButton'
import Typography from '@material-ui/core/Typography'
import { Row } from 'components/Layout'
import Paper from '@material-ui/core/Paper'
import { Manager, Reference, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuDown from 'mdi-material-ui/MenuDown'

/**
 * Block of text that is kind of like an Accordion. Displays beginning or all of text depending on length and size
 * available for component. On click of arrow button, all text is displayed in a popover atop of where the dropdown
 * button icon is.
 */
export class ExpansionTextPanel extends Component {
  static propTypes = {
    /**
     * Text content of the popover
     */
    text: PropTypes.string,
    /**
     * Props for the Typography component
     */
    textProps: PropTypes.object,
    /**
     * Props for the IconButton component for the dropdown arrow
     */
    dropdownIconProps: PropTypes.object
  }
  
  static defaultProps = {
    dropdownIconProps: {}
  }
  
  constructor(props, context) {
    super(props, context)

    this.expandButtonRef = null

    this.state = {
      open: false
    }
  }

  /**
   * Closes the popover
   * @public
   */
  onClosePopper = () => {
    this.setState({
      open: false
    })
  }

  /**
   * Opens the popover
   * @public
   */
  onOpenPopper = () => {
    this.setState({
      open: true
    })
  }

  render() {
    const { text, textProps, dropdownIconProps } = this.props
    const { tooltipText, ...other } = dropdownIconProps
    const { open } = this.state

    return (
      <Row flex displayFlex style={{ alignItems: 'center', overflow: 'hidden' }}>
        <Typography noWrap {...textProps} style={{ flex: 1, minWidth: 0, color: '#b2b4b4' }}>
          {text}
        </Typography>
        <Manager>
          <Reference innerRef={node => this.expandButtonRef = findDOMNode(node)}>
            {({ ref }) => {
              return (
                <div ref={ref}>
                  <IconButton
                    onClick={open ? this.onClosePopper : this.onOpenPopper}
                    color="#768f99"
                    tooltipText={open ? '' : tooltipText}
                    {...other}>
                    <MenuDown />
                  </IconButton>
                </div>
              )
            }}
          </Reference>
          <Popper placement="top-end" eventsEnabled={open}>
            {({ ref, placement, style }) => {
              return (
                open &&
                <ClickAwayListener onClickAway={this.onClosePopper}>
                  <div ref={ref} data-placement={placement} style={{ ...style, zIndex: 1 }}>
                    <Paper
                      elevation={8}
                      style={{
                        maxWidth: 450,
                        padding: 25,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        maxHeight: 500,
                        overflow: 'auto'
                      }}>
                      <Typography {...textProps}>{text}</Typography>
                    </Paper>
                  </div>
                </ClickAwayListener>
              )
            }}
          </Popper>
        </Manager>
      </Row>
    )
  }
}

export default ExpansionTextPanel