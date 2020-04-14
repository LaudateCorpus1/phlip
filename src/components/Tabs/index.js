import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import { default as MuiTabs } from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
})

/**
 * Renders a collection of selectable material design tabs around content
 */
export const Tabs = ({ tabs, selectedTab, onChangeTab, children, classes, theme }) => {
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          backgroundColor: theme.palette.secondary.tabs,
          color: theme.palette.secondary.main,
          zIndex: 'unset'
        }}
        elevation={0}>
        <MuiTabs
          value={selectedTab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          scrollable
          scrollButtons="on">
          {tabs.map(tab => (
            <Tab key={tab.id} label={tab.text} />
          ))}
        </MuiTabs>
      </AppBar>
      {children}
    </div>
  )
}

Tabs.propTypes = {
  /**
   * The tabs to be displayed
   */
  tabs: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    id: PropTypes.any
  })),
  /**
   * Currently selected tab which is the index of the tab in the tabs array
   */
  selectedTab: PropTypes.number,
  /**
   * Function to call when the user changes tabs
   */
  onChangeTab: PropTypes.func,
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Theme from @material-ui/core
   */
  theme: PropTypes.object,
  /**
   * Content that that tabs should wrap
   */
  children: PropTypes.any
}

export default withStyles(styles, { withTheme: true })(Tabs)
