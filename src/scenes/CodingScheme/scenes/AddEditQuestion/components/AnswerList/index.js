import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../SelectInput'
import { Field } from 'redux-form'
import { FlexGrid, Button } from 'components'
import * as questionTypes from '../../constants'

/**
 * Renders a list of answer text fields or an answer text box if the question is a TextField question
 */
export const AnswerList = props => {
  const { fields, answerType, isEdit, canModify } = props
  return (
    answerType !== questionTypes.TEXT_FIELD
    && (
      <FlexGrid>
        {fields.map((answer, index, fields) => {
          return (
            <Fragment key={index}>
              <FlexGrid>
                <Field
                  id={`possibleAnswers${index}-text`}
                  name={`${answer}.text`}
                  type="text"
                  answerType={answerType}
                  placeholder={answerType === questionTypes.CATEGORY ? 'Add tab' : 'Add answer'}
                  handleDelete={() => fields.remove(index)}
                  component={SelectInput}
                  isEdit={isEdit}
                  canModify={canModify}
                  index={index}
                  fields={fields}
                  handleDown={() => fields.swap(index, index + 1)}
                  handleUp={() => fields.swap(index, index - 1)}
                  currentValue={fields.get(index)}
                  label={(index === 0 && answerType !== questionTypes.CATEGORY) ? 'Answers'
                    : (index === 0 && answerType === questionTypes.CATEGORY) ? 'Category/Tabs' : ''}
                />
              </FlexGrid>
            </Fragment>
          )
        })}

        {(canModify && answerType !== questionTypes.BINARY)
        && <Button
          value="Add more"
          type="button"
          color="accent"
          raised={false}
          style={{ marginLeft: 32, fontWeight: 'normal' }}
          onClick={() => fields.push({ isNew: true, order: fields.length })}
        />}
      </FlexGrid>
    )
  )
}

AnswerList.propTypes = {
  fields: PropTypes.object,
  answerType: PropTypes.number,
  isEdit: PropTypes.bool,
  canModify: PropTypes.bool
}

export default AnswerList
