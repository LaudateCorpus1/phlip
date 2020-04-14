import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import { withRouter } from 'react-router-dom'
import { matchPath } from 'react-router'
import { decodeToken } from 'services/authToken'
import userActions from 'data/users/actions'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import DevLoginForm from './components/DevLoginForm'
import ProdLoginForm from './components/ProdLoginForm'
import moment from 'moment'
import theme from 'services/theme'
import { FlexGrid, Logo } from 'components'

/**
 * Login screen component. Renders the login form.
 */
export class Login extends Component {
  static propTypes = {
    /**
     * Browser history object from 'react-router'
     */
    history: PropTypes.object,
    /**
     * Whether or not there is an active session
     */
    session: PropTypes.bool,
    /**
     * Browser location object from react-router
     */
    location: PropTypes.object,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Any message to be displayed as helper text for the login form (including errors)
     */
    formMessage: PropTypes.string,
    /**
     * Currently logged in user, if any
     */
    currentUser: PropTypes.object,
    /**
     *  current version info
     */
    appVersion: PropTypes.string,
    /**
     * Information about the backend app versioning
     */
    backendInfo: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  componentDidMount() {
    this.props.actions.getBackendInfoRequest()
    document.title = 'PHLIP - Login'
    const match = matchPath(this.props.location.pathname, { path: '/login/verify-user' })
    if (match) {
      const rawToken = this.props.location.search
      const parsedTokens = rawToken.split('&')
      const parsedToken = parsedTokens[0].substring(rawToken.indexOf('=') + 1)
      const parsedToken2 = parsedTokens[1].split('token2=')[1]
      const parsedToken3 = parsedTokens[2].split('token3=')[1]
      const parsedToken4 = parsedTokens[3].split('token4=')[1]
      const samlToken = `'{"nameID": "${parsedToken2}","sessionIndex": "${parsedToken3}","nameIDFormat": "${parsedToken4}"}'`
      const tokenObject = { decodedToken: decodeToken(parsedToken), token: parsedToken, samlToken: samlToken }
      this.props.actions.checkPivUserRequest(tokenObject)
    }
    
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.sessionExpired) {
        this.props.actions.logoutUser(true)
      }
    }
  }
  
  componentDidUpdate(prevProps) {
    if (!prevProps.session && this.props.session) {
      this.props.history.push('/home')
    }
  }
  
  /**
   * Calls a redux action to send an API request to authenticate the user. Invoked when the user clicks the 'submit'
   * button on the form
   * @public
   * @param {object} values
   */
  handleSubmit = values => {
    const { session, actions } = this.props
    if (session) {
      // clear the current session to start fresh
      actions.logoutUser()
    }
    actions.loginUserRequest(values)
  }
  
  render() {
    const headerStyles = {
      backgroundColor: theme.palette.primary.main,
      height: 145
    }
    
    const formStyles = {
      width: 350,
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto'
    }
    
    const LoginView = APP_IS_SAML_ENABLED === '1' ? ProdLoginForm : DevLoginForm
    const appVersion = `${APP_PIPELINE} (${moment.unix(APP_BUILT_TIMESTAMP).format('MM/DD/YYYY  HH:mm:ss')})`
    const beVersion = `${this.props.backendInfo.pipelineId.trim() || ''} - (${this.props.backendInfo.builtTime || ''})`
    
    return (
      <FlexGrid container type="row" justify="center" flex style={{ backgroundColor: '#f5f5f5', overflow: 'auto' }}>
        <FlexGrid padding={25} style={{ margin: 'auto auto' }}>
          <Paper style={formStyles}>
            <FlexGrid container align="center" justify="center" style={headerStyles}>
              <Logo height="auto" width={261} />
            </FlexGrid>
            {LoginView && <LoginView onSubmit={this.handleSubmit} pivError={this.props.formMessage} />}
          </Paper>
          <FlexGrid padding="30px 0 10px" style={{ textAlign: 'center', width: 600, margin: '0 auto' }}>
            <Typography
              variant="caption"
              style={{ color: 'black' }}>You are accessing an information system that may contain
              U.S. Government data. System usage may
              be monitored, recorded, and subject to audit. Unauthorized use of the system is prohibited and may be
              subject to criminal and civil penalties. Use of the system indicates consent to monitoring and recording.
              Administrative personnel remotely accessing the Azure environment: <br />
              <br />
            </Typography>
            <Typography variant="caption" style={{ color: 'black' }}>
              (1) shall maintain their remote computer in a secure manner, in accordance with organizational security
              policies and procedures as defined in Microsoft Remote Connectivity Security Policies; <br />
              (2) shall only access the Azure environment in execution of operational, deployment, and support
              responsibilities using only administrative applications or tools directly related to performing these
              responsibilities; and <br />
              (3) shall not knowingly store, transfer into, or process in the Azure environment data exceeding a FIPS 199
              Low security categorization
            </Typography>
            <br />
            <img
              src="/cdc-hhs-logo.png"
              style={{ height: 55 }}
              alt="Center for Disease Control and Health and Human Services Logo"
            />
            <div style={{ paddingTop: 10 }}>
              <Typography variant="caption" style={{ color: 'black' }}>
                FE Build: {appVersion}
              </Typography>
              <Typography variant="caption" style={{ color: 'black' }}>
                BE Build: {beVersion}
              </Typography>
              {/*<Typography variant="caption" style={{ color: 'black' }}>
               {this.props.backendInfo.databaseName || ''}
               </Typography>*/}
            </div>
          </FlexGrid>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.data.user.currentUser || undefined,
  session: state.scenes.login.session,
  formMessage: state.scenes.login.formMessage,
  backendInfo: state.scenes.login.backendInfo
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ ...actions, ...userActions }, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
