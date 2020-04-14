import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from '@material-ui/core/styles'
import { withRouter, Link } from 'react-router-dom'
import { FlexGrid, IconButton, CircleIcon, Button, Typography } from 'components'

/**
 * This is the header at the top of every page with the back button and page title
 */
export const PageHeader = props => {
  const {
    projectName, pageTitle, projectId, protocolButton, entryScene,
    otherButton, children, history, checkoutButton, onBackButtonClick, theme, icon
  } = props

  return (
    <FlexGrid
      container
      type="row"
      align="center"
      justify="space-between"
      padding="0 0 15px 0"
      style={{ height: 36, minHeight: 36 }}>
      <FlexGrid container flex type="row" align="center">
        {!entryScene
          ? (<IconButton
            iconSize={30}
            color="black"
            onClick={onBackButtonClick ? onBackButtonClick : () => history.goBack()}
            aria-label="Go back">arrow_back
          </IconButton>)
          : <CircleIcon circleColor="error" iconColor="white" circleSize="24px" iconSize="16px">{icon}</CircleIcon>
        }
        <Typography variant="title" style={{ paddingRight: 10, paddingLeft: 5 }}>{pageTitle}</Typography>
        {projectName !== '' &&
        <>
          <Typography variant="title">
            <span style={{ color: theme.palette.secondary.pageHeader }}>{projectName}</span>
          </Typography>
        </>}
        {otherButton.show &&
        <div style={{ marginLeft: 15 }}>
          {otherButton.isLink
            ? <Button
              value={otherButton.text}
              color="white"
              textColor={theme.palette.secondary.text}
              component={Link}
              to={{ pathname: `${otherButton.path}`, state: { ...otherButton.state } }}
              {...otherButton.props}
            />
            : <Button
              value={otherButton.text}
              color="white"
              style={otherButton.style}
              textColor={theme.palette.secondary.text}
              onClick={otherButton.onClick}
              {...otherButton.props}
            />}
        </div>}
      </FlexGrid>
      <FlexGrid container type="row" flex align="center" justify="flex-end" style={{ position: 'relative' }}>
        {children}
        {protocolButton &&
        <Button
          value="Protocol"
          component={Link}
          to={`/project/${projectId}/protocol`}
          aria-label="View and Edit Protocol"
          style={{ backgroundColor: 'white', color: 'black', marginLeft: 15 }}
        />}
        {checkoutButton && checkoutButton.show === true &&
        <div style={{ marginLeft: 15 }}>
          <Button value={checkoutButton.text} color="accent" {...checkoutButton.props} />
        </div>}
      </FlexGrid>
    </FlexGrid>
  )
}

PageHeader.propTypes = {
  /**
   * Name of the project
   */
  projectName: PropTypes.string,
  /**
   * Title  of the page to be displayed next to projectName
   */
  pageTitle: PropTypes.string,
  /**
   * ID of project for this page
   */
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Whether or not to show the Protocol button
   */
  protocolButton: PropTypes.bool,
  /**
   * Any other button to show
   */
  otherButton: PropTypes.object,
  /**
   * This should be anything that you want to display between the protocol button and project name / page title
   */
  children: PropTypes.any,
  /**
   * Browser history object
   */
  history: PropTypes.object,
  /**
   * For coding scheme and 'checkout' button will be shown
   */
  checkoutButton: PropTypes.object,
  /**
   * If defined, when clicking the back button this function will be called instead of just history.goBack()
   */
  onBackButtonClick: PropTypes.func,
  /**
   * Theme object provided by @material-ui/core
   */
  theme: PropTypes.object
}

PageHeader.defaultProps = {
  otherButton: {}
}

export default withRouter(withTheme()(PageHeader))