import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { reduxForm, Field } from 'redux-form'
import validate from './validate'
import Divider from '@material-ui/core/Divider'
import { FlexGrid, TextInput, Button } from 'components'

let DevLoginForm = ({ handleSubmit, pristine, error, submitting, pivError }) => (
  <form onSubmit={handleSubmit}>
    <FlexGrid container justify="space-around" align="center">
      <FlexGrid padding={16} style={{ width: 280, boxSizing: 'border-box' }}>
        <Field name="email" label="Email" component={TextInput} smallLabel={false} />
      </FlexGrid>
    </FlexGrid>
    <FlexGrid container type="row" justify="center" align="center">
      {error && <Typography color="error" align="center">{error}</Typography>}
      {pivError && <Typography color="error" align="center">{pivError}</Typography>}
    </FlexGrid>
    <FlexGrid container type="row" flex justify="center" padding={16}>
      <Button type="submit" color="secondary" value="Login" disabled={pristine || submitting} />
    </FlexGrid>
    <Divider />
  </form>
)

DevLoginForm = reduxForm({
  form: 'login',
  validate
})(DevLoginForm)

DevLoginForm.propTypes = {
  theme: PropTypes.object,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  reset: PropTypes.any,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  pivError: PropTypes.string
}

export default DevLoginForm
