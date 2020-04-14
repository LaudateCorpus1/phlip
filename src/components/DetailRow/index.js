import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Row } from 'components/Layout'

export const DetailRow = ({ component, type, name, disabled, label, ...otherProps }) => {
  return (
    <Row style={{ paddingBottom: 25 }}>
      <Field
        component={component}
        type={type}
        name={name}
        label={label}
        disabled={disabled}
        shrinkLabel
        disableUnderline={disabled}
        {...otherProps}
      />
    </Row>
  )
}

DetailRow.propTypes = {
  component: PropTypes.any,
  type: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string
}

export default DetailRow