import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { Row, Column } from 'components/Layout'
import Card from 'components/Card'
import Icon from 'components/Icon'
import EmoticonSad from 'mdi-material-ui/EmoticonSad'

/**
 * Used to display errors that should be shown as a part of the page, instead of popup alert
 */
export const CardError = ({ children }) => (
  <Column component={<Card />} displayFlex flex style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <Row>
      <Icon size={175} color="#757575">
        <EmoticonSad style={{ width: 175, height: 175 }} />
      </Icon>
    </Row>
    <Row>
      <Typography variant="display2" style={{ textAlign: 'center' }}>
        {children}
      </Typography>
    </Row>
  </Column>
)

CardError.propTypes = {
  /**
   * Contents of CardError
   */
  children: PropTypes.any
}

export default CardError