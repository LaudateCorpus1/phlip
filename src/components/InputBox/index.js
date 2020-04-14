import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

/* istanbul ignore next */
const styles = theme => ({
  textFieldInput: {
    outline: 0,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    borderRadius: 3,
    fontSize: 16,
    padding: '10px 12px',
    whiteSpace: 'pre-wrap',
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  },
  multiline: {
    padding: 0
  }
})

/**
 * A textarea input different from typically @material-ui/core inputs, in that it is a box. Used in Coding / Validation
 * scenes
 */
export const InputBox = props => {
  const { value, onChange, name, rows, classes, ...otherProps } = props

  return (
    <TextField
      value={value}
      onChange={onChange}
      multiline
      type="text"
      name={name}
      fullWidth
      rows={rows}
      InputProps={{
        disableUnderline: true,
        classes: {
          input: classes.textFieldInput,
          root: classes.multiline
        },
        inputProps: {
          'aria-describedby': 'question_text'
        }
      }}
      {...otherProps}
    />
  )
}

InputBox.propTypes = {
  /**
   * Passed in from material ui
   */
  classes: PropTypes.object,
  /**
   * Number of default rows to render
   */
  rows: PropTypes.number,
  /**
   * Text value
   */
  value: PropTypes.string,
  /**
   * Name to give to the input field
   */
  name: PropTypes.string,
  /**
   * Handles when the user makes changes to the text field
   */
  onChange: PropTypes.func
}

InputBox.defaultProps = {
  classes: {},
  rows: 4
}

export default withStyles(styles)(InputBox)
