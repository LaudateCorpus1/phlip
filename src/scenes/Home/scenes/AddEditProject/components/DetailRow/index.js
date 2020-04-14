import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import FlexGrid from 'components/FlexGrid'

export const DetailRow = props => {
  const { component, type, name, disabled, label, shrinkLabel, ...otherProps } = props
  
  return (
    <FlexGrid padding="0 0 25px">
      <Field
        component={component}
        type={type}
        name={name}
        label={label}
        shrinkLabel={shrinkLabel}
        disabled={disabled}
        disableUnderline={disabled}
        {...otherProps}
      />
    </FlexGrid>
  )
}

DetailRow.propTypes = {
  component: PropTypes.any,
  type: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  shrinkLabel: PropTypes.bool
}

export default DetailRow
