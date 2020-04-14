import React from 'react'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { FlexGrid, IconButton } from 'components'
import * as questionTypes from '../../constants'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  disabled: {
    color: 'black'
  }
}

/**
 * Renders the dropdown so the user can select question type
 * @param props
 * @returns {*}
 * @constructor
 */
export const SelectInput = props => {
  const {
    canModify, name, label, answerType, type, input, classes,
    index, currentValue, meta: { active, touched, error, warning },
    handleDelete, handleUp, handleDown, fields, isEdit, ...custom
  } = props

  return (
    <FlexGrid container type="row">
      <FlexGrid style={{ marginTop: 8 }}>
        {(() => {
          switch (answerType) {
            case questionTypes.BINARY:
            case questionTypes.MULTIPLE_CHOICE:
              return <Radio disabled />
            case questionTypes.CATEGORY:
            case questionTypes.CHECKBOXES:
              return <Checkbox disabled />
            default:
              break
          }
        })()}
      </FlexGrid>
      <FlexGrid flex>
        <FormControl error={Boolean(touched && error && !active || warning)} fullWidth>
          <InputLabel htmlFor={name} shrink required={index === 0}>{label}</InputLabel>
          <Input
            id={name}
            {...input}
            type={type}
            {...custom}
            disabled={!canModify}
            classes={{
              disabled: classes.disabled
            }}
          />
          {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </FlexGrid>
      <FlexGrid container type="row" align="center">
        {canModify && (answerType !== questionTypes.BINARY &&
          <FlexGrid container>
            <IconButton
              color="action"
              iconSize={36}
              disableRipple={false}
              disabled={!index - 1 >= 0}
              aria-label="Move answer choice up one position"
              id={`move-answer-${index}-up`}
              onClick={handleUp}>
              arrow_drop_up
            </IconButton>
            <IconButton
              color="action"
              iconSize={36}
              style={{ marginTop: -16 }}
              disableRipple={false}
              disabled={index + 1 === fields.length}
              aria-label="Move answer choice down one position"
              id={`move-answer-${index}-down`}
              onClick={handleDown}>
              arrow_drop_down
            </IconButton>
          </FlexGrid>)}
        {canModify &&
        <FlexGrid>
          {currentValue.isNew
            ? (
              <IconButton
                color="action"
                onClick={handleDelete}
                iconSize={20}
                aria-label={`Delete ${index} answer`}
                id={`delete-answer-${index}`}>
                delete
              </IconButton>
            )
            : (answerType === questionTypes.BINARY || isEdit)
              ? null
              : (
                <IconButton
                  color="action"
                  onClick={handleDelete}
                  iconSize={23}
                  style={{ height: '20px !important' }}
                  aria-label={`Delete ${index} answer`}
                  id={`delete-answer-${index}`}>
                  delete
                </IconButton>
              )
          }
        </FlexGrid>}
      </FlexGrid>
    </FlexGrid>
  )
}

SelectInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  input: PropTypes.any,
  meta: PropTypes.object,
  handleDelete: PropTypes.func,
  multiline: PropTypes.bool
}

SelectInput.defaultProps = {
  meta: {}
}

export default withStyles(styles)(SelectInput)
