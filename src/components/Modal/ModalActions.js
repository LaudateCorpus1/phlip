import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import Button from 'components/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    margin: '20px'
  },
  referred: {
    background: 'blue'
  }
}

/**
 * Wrapper for @material-ui/core's DialogActions component. These actions will be displayed as buttons at the bottom of
 * the modal
 */
export class ModalActions extends Component {
  static propTypes = {
    /**
     * Should the action buttons be raised
     */
    raised: PropTypes.bool,
    /**
     * The list of actions to render
     */
    actions: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any,
      disabled: PropTypes.bool,
      type: PropTypes.string,
      onClick: PropTypes.func,
      preferred: PropTypes.bool,
      otherProps: PropTypes.object,
      myButton: PropTypes.string
    })),
    /**
     * Style classes object supplied by @material-ui/core
     */
    classes: PropTypes.object
  }
  
  static defaultProps = {
    raised: false,
    actions: [],
    classes: {}
  }
  
  constructor(props, context) {
    super(props, context)
    this.preferredChoice = null
  }
  
  componentDidMount() {
    if (this.preferredChoice) {
      this.preferredChoice.focus()
    }
  }
  
  render() {
    const { actions, raised, classes, ...otherProps } = this.props
    const chkPreferredChoice = (action, i) => {
      if (action.value === undefined) {
        return false
      } else {
        if (typeof (action.value) === 'string' && actions.length === 1) {
          return true
        } else {
          return action.preferred
        }
      }
    }
    
    return (
      <DialogActions classes={{ root: classes.root }} {...otherProps} >
        {actions.map((action, i) => (
          <Button
            key={action.value}
            raised={raised}
            value={action.value}
            type={action.type}
            id={`modal-action-${i}`}
            color="accent"
            disabled={action.disabled || false}
            onClick={action.onClick}
            buttonRef={chkPreferredChoice(action, i) ? (elem => (this.preferredChoice = elem)) : null}
            style={chkPreferredChoice(action, i) ? { backgroundColor: 'rgba(4, 132, 132, 0.08)' } : ''}
            {...action.otherProps}
          />
        ))}
      </DialogActions>
    )
  }
  
}

export default withStyles(styles)(ModalActions)
