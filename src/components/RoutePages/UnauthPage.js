import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Ghost } from 'mdi-material-ui'
import Container from 'components/Layout'
import styles from './no-page.scss'

/**
 * Page displayed when a user tries to access a page they are not authorized to.
 */
export const UnauthPage = () => (
  <Container column style={{ justifyContent: 'center', padding: 0 }}>
    <div className={styles.ghost}>
      <Ghost style={{ width: 200, height: 200 }} />
    </div>
    <Typography variant="display3" align="center">
      Please contact your administrator to view this page.
    </Typography>
  </Container>
)

export default UnauthPage