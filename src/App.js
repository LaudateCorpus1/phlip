import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { Router } from 'react-router-dom'
import { history } from 'services/store'
import theme from 'services/theme'
import Scenes from 'scenes'
import { hot } from 'react-hot-loader'

/**
 * Main App component. Sets up the BrowserRouter for react-router, the theme for @material-ui/core and the provider / store
 * for redux
 */
export class App extends Component {
  render() {
    return (
      <Router history={history}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <MuiThemeProvider theme={theme}>
            <Scenes />
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </Router>
    )
  }
}

export default hot(module)(App)
