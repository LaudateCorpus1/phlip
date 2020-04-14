import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Ghost } from 'mdi-material-ui'
import Container from 'components/Layout'
import styles from './no-page.scss'

/**
 * Page displayed when the user tries to access a page that doesn't exist
 */
export const PageNotFound = () => (
  <Container column style={{ justifyContent: 'center', padding: 0 }}>
    <div className={styles.ghost}>
      <Ghost style={{ width: 200, height: 200 }} />
    </div>
    <Typography variant="display3" align="center">
      Uh-oh! We can't find the page you're looking for.
    </Typography>
  </Container>
)

export default PageNotFound