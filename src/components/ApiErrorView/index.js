import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Icon from 'components/Icon'
import { Row } from 'components/Layout'
import EmoticonSad from 'mdi-material-ui/EmoticonSad'

/**
 * Alert that is not a popup specifically for API errors
 */
export const ApiErrorView = ({ error }) => {
  return (
    <div style={{ position: 'relative', top: '20%' }}>
      <Row displayFlex style={{ justifyContent: 'center' }}>
        <Icon size={175} color="#757575">
          <EmoticonSad style={{ width: 175, height: 175 }} />
        </Icon>
      </Row>
      <Row displayFlex style={{ justifyContent: 'center' }}>
        <Typography variant="display2" style={{ textAlign: 'center' }}>
          Uh-oh! Something went wrong. {error} Please try again later.
        </Typography>
      </Row>
    </div>
  )
}

ApiErrorView.propTypes = {
  /**
   * Content what you want the view to show
   */
  error: PropTypes.string
}

ApiErrorView.defaultProps = {
  error: ''
}

export default ApiErrorView