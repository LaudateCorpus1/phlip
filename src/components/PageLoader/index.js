import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Container from 'components/Layout'
import CircularLoader from 'components/CircularLoader'

/**
 * Displays a circular loader in a container with a message
 */
export const PageLoader = ({ circularLoaderType, circularLoaderProps, message, messageText }) => {
  return (
    <Container flex alignItems="center" style={{ justifyContent: 'center' }}>
      {message && <Typography variant="display2">{messageText}</Typography>}
      <CircularLoader type={circularLoaderType} {...circularLoaderProps} />
    </Container>
  )
}

PageLoader.defaultProps = {
  circularLoaderType: 'indeterminate',
  circularLoaderProps: {
    color: 'primary',
    size: 50
  },
  message: true,
  messageText: 'Loading...'
}

PageLoader.propTypes = {
  /**
   * Type of loader, based on @material-ui/core's CircularProgress component
   */
  circularLoaderType: PropTypes.string,
  /**
   * Any props to pass to CircularLoader
   */
  circularLoaderProps: PropTypes.object,
  /**
   * Whether or not to display a message
   */
  message: PropTypes.bool,
  /**
   * Contents of message to display
   */
  messageText: PropTypes.string
}

export default PageLoader