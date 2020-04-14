import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { FlexGrid, IconButton } from 'components'
import theme from 'services/theme'

export const FooterNavigate = props => {
  const { getQuestion, currentIndex, showNextButton } = props
  
  const styles = {
    fontSize: 14,
    color: theme.palette.primary.main
  }
  
  const rowStyles = {
    height: 60,
    alignSelf: currentIndex === 0 ? 'flex-end' : ''
  }
  
  return (
    <FlexGrid container type="row" align="center" justify="space-between" padding="0 10px" style={rowStyles}>
      {currentIndex !== 0 &&
      <FlexGrid
        container
        type="row"
        style={{ cursor: 'pointer' }}
        aria-label="Go to previous question"
        onClick={getQuestion('prev', currentIndex - 1)}>
        <IconButton color="#767676" aria-label="Go to previous question">navigate_before</IconButton>
        <Typography variant="body2">
          <span style={{ ...styles, paddingLeft: 5, userSelect: 'none' }}>Previous question</span>
        </Typography>
      </FlexGrid>}
      {showNextButton &&
      <FlexGrid
        container
        type="row"
        flex={currentIndex === 0}
        aria-label="Go to next question"
        style={{ cursor: 'pointer' }}
        onClick={getQuestion('next', currentIndex + 1)}>
        <Typography variant="body2">
          <span style={{ ...styles, paddingRight: 5, userSelect: 'none' }}>Next question</span>
        </Typography>
        <IconButton color="#767676" aria-label="Go to next question">navigate_next</IconButton>
      </FlexGrid>}
    </FlexGrid>
  )
}

FooterNavigate.propTypes = {
  currentIndex: PropTypes.number,
  getQuestion: PropTypes.func,
  showNextButton: PropTypes.bool
}

export default FooterNavigate
