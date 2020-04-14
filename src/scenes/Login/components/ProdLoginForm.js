import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { Button, FlexGrid } from 'components'

/* global APP_SAML_REQUEST_URL */
const ProdLoginForm = ({ pivError }) => (
  <FlexGrid container padding={30}>
    <FlexGrid container type="row" justify="center" align="center">
      <Typography>
        You must be registered with SAMS and required to sign in with your CDC account below, otherwise
        you will receive a sign in error.
      </Typography>
    </FlexGrid>
    <FlexGrid container type="row" flex padding="20px 0 0" justify="center">
      <FlexGrid padding={16}>
        <Button href={APP_SAML_REQUEST_URL} type="button" color="secondary" value="PIV Login" />
      </FlexGrid>
    </FlexGrid>
    {pivError && <Typography color="error" align="center">{pivError}</Typography>}
  </FlexGrid>
)

ProdLoginForm.propTypes = {
  pivError: PropTypes.string
}

export default ProdLoginForm
