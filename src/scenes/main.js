import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import IdleTimer from 'react-idle-timer'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography'
import actions from './actions'
import Home from './Home'
import DocumentManagement from './DocumentManagement'
import Admin from './Admin'
import CodingScheme from './CodingScheme'
import Protocol from './Protocol'
import AddEditProject from './Home/scenes/AddEditProject'
import AddEditJurisdictions from './Home/scenes/AddEditJurisdictions'
import JurisdictionForm from './Home/scenes/AddEditJurisdictions/components/JurisdictionForm'
import DocumentView from './DocumentView'
import CodingValidation from './CodingValidation'
import Upload from './DocumentManagement/scenes/Upload'
import AddEditQuestion from './CodingScheme/scenes/AddEditQuestion'
import AddEditUser from './Admin/scenes/AddEditUser'
import { AppHeader, FlexGrid, ApiErrorAlert, Button } from 'components'
import Modal, { ModalContent, ModalTitle } from 'components/Modal'

const modalPaths = [
  '/project/add',
  '/project/edit/:id',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit',
  '/docs/upload',
  '/project/:id/coding-scheme/add',
  '/project/:id/coding-scheme/edit/:questionId',
  '/admin/new/user',
  '/admin/edit/user/:id',
  '/user/profile',
  '/user/profile/avatar'
]

const FIVE_MINUTES = 300000
const TEN_MINUTES = 600000
const ONE_MINUTE = 60000
const BELL = '\u{1F514}'

/**
 * Main scenes component for views that require a login (i.e. everything but the Login view). All of the react-router
 * routes are set here.
 *
 * @param match
 * @param location
 * @param role
 * @param otherProps
 * @param dispatch
 * @param isRefreshing
 * @returns {*}
 * @constructor
 */
export class Main extends Component {
  static propTypes = {
    history: PropTypes.object,
    pdfFile: PropTypes.any,
    actions: PropTypes.object,
    location: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    user: PropTypes.object,
    pdfError: PropTypes.any,
    previousLocation: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.helpPdfRef = React.createRef()
    this.idleRef = React.createRef()
    this.previousLocation =
      props.previousLocation !== props.location
        ? props.previousLocation
        : props.location
    
    this.state = {
      menuOpen: false,
      menuTabs: [
        {
          label: 'Project List',
          active: !props.history.location.pathname.startsWith('/docs'),
          location: '/home',
          icon: 'dvr',
          id: 'project-list'
        },
        {
          label: 'Document Management',
          active: props.history.location.pathname.startsWith('/docs'),
          location: '/docs',
          icon: 'description',
          id: 'doc-manage'
        }
      ],
      logoutIdleAlertOpen: false,
      logoutAlertTime: '5:00',
      lastFiveMinutes: false
    }
  }
  
  componentDidMount() {
    this.previousTitle = document.title
    document.addEventListener('visibilitychange', this.handleTabVisibilityChange)
  }
  
  componentDidUpdate(prevProps) {
    const { pdfFile, location, actions } = this.props
    const { menuTabs } = this.state
    
    if (prevProps.pdfFile === null && pdfFile !== null) {
      this.openHelpPdf(pdfFile)
    }
    
    const prev = prevProps.location.pathname.split('/')[1]
    const current = location.pathname.split('/')[1]
    
    const tabs = [...menuTabs]
    
    if (!location.state || !location.state.modal) {
      this.previousLocation = location
      actions.setPreviousLocation(location)
    }
    
    if (prev !== current) {
      if (current === 'docs') {
        tabs[1].active = true
        tabs[0].active = false
      } else {
        tabs[0].active = true
        tabs[1].active = false
      }
      
      this.setState({ menuTabs: tabs })
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.userLogoutTimer)
  }
  
  /**
   * Handles when the top level menu changes
   * @param index
   */
  handleTabChange = index => {
    const { history } = this.props
    const { menuTabs } = this.state
    
    const newLocation = menuTabs[index].location
    history.push(newLocation)
    this.setState({
      menuTabs: menuTabs.map((tab, i) => ({
        ...tab,
        active: index === i
      }))
    })
  }
  
  /**
   * Logs out a user
   */
  handleLogoutUser = () => {
    const { actions } = this.props
    actions.logoutUser()
  }
  
  /**
   * Handles when the user click 'Help Guide' in the avatar menu
   * @public
   */
  handleDownloadPdf = () => {
    const { actions } = this.props
    this.handleToggleMenu()
    actions.downloadPdfRequest()
  }
  
  /**
   * Creates an object url from the pdfFile and attaches the hidden `<a>` element to it
   * @public
   * @param pdfFile
   */
  openHelpPdf = pdfFile => {
    const { actions } = this.props
    
    const url = URL.createObjectURL(pdfFile)
    this.helpPdfRef.current.href = url
    this.helpPdfRef.current.download = 'PHLIP-Help-Guide.pdf'
    this.helpPdfRef.current.click()
    actions.clearPdfFile()
  }
  
  /**
   * Closes the error alert when the user clicks 'dismiss'
   * @public
   */
  closeDownloadErrorAlert = () => {
    const { actions } = this.props
    actions.resetDownloadError()
  }
  
  /**
   * Opens user menu in header
   */
  handleToggleMenu = () => {
    const { menuOpen } = this.state
    this.setState({ menuOpen: !menuOpen })
  }
  
  /**
   * Navigates to the User Management page (clicked from the user menu). Open the user management page is the user
   * is an Admin, otherwise just open the profile modal
   */
  handleOpenAdminPage = () => {
    const { history, user } = this.props
    const { menuTabs } = this.state
    
    const tabs = [...menuTabs]
    
    if (menuTabs[1].active) {
      tabs[1].active = false
      tabs[0].active = true
    }
    
    this.setState({
      menuOpen: false,
      menuTabs: tabs
    })
    
    if (user.role === 'Admin') {
      history.push('/admin')
    } else {
      history.push({
        pathname: '/user/profile',
        state: {
          isEdit: Boolean(user.avatar),
          avatar: user.avatar,
          userId: user.id,
          modal: true,
          selfUpdate: true
        }
      })
    }
  }
  
  /**
   * Logs out the user after they've been idle for too long (15 minutes)
   */
  logoutUserOnIdle = () => {
    const { actions } = this.props
    actions.logoutUser(true)
    clearInterval(this.userLogoutTimer)
  }
  
  /**
   * Shows an alert to let the user know that they will be logged out in 5 minutes. Shows when the user has been idle
   * for 10 minutes
   */
  handleUserIdle = () => {
    // the user has been idle for ten minutes, show an alert and start counting down 5 minutes
    this.previousTitle = document.title
    this.startUserLogoutTimer()
  }
  
  /**
   * The user is no longer idle so we reset the timer to 10 minutes
   */
  handleUserActive = () => {
    const { lastFiveMinutes } = this.state
    if (lastFiveMinutes) {
      this.setState({
        lastFiveMinutes: false,
        logoutIdleAlertOpen: false,
        logoutAlertTime: '5:00'
      }, () => this.idleRef.current.reset())
      document.title = this.previousTitle
      clearInterval(this.userLogoutTimer)
    }
  }
  
  /**
   * Handles when the app tab becomes visible or not
   */
  handleTabVisibilityChange = () => {
    const isVisible = document.visibilityState === 'visible'
    document.title = isVisible
      ? this.previousTitle
      : document.title
  }
  
  /**
   * Updates the page title to show the user how log it will be until they are logged out. Starts showing after 10
   * minutes of inactivity.
   */
  startUserLogoutTimer = () => {
    this.setState({ lastFiveMinutes: true, logoutIdleAlertOpen: true })
    this.logoutCountdown = FIVE_MINUTES
    this.userLogoutTimer = setInterval(() => {
      let timeString = ''
      if (this.logoutCountdown <= ONE_MINUTE) {
        timeString = `${this.logoutCountdown / 1000} seconds`
      } else {
        const minutes = Math.floor(this.logoutCountdown / 60000)
        let seconds = (this.logoutCountdown / 1000) % 60
        seconds = seconds === 0 ? '00' : seconds < 10 ? `0${seconds}` : seconds
        timeString = `${minutes}:${seconds}`
      }
      this.setState({ logoutAlertTime: timeString })
      if (document.visibilityState !== 'visible') {
        document.title = document.title === '...'
          ? `${BELL} Session Expiring`
          : '...'
      }
      
      this.logoutCountdown -= 1000
      if (this.logoutCountdown === -1000) {
        // user has been inactive for the remaining 5 minutes, so we log them out.
        this.logoutUserOnIdle()
      }
    }, 1000)
  }
  
  render() {
    const { location, actions, isLoggedIn, isRefreshing, user, pdfError } = this.props
    const { menuTabs, menuOpen, logoutIdleAlertOpen, logoutAlertTime } = this.state
    
    // This is for jurisdictions / add/edit project modals. We want the modals to be displayed on top of the home
    // screen, so we check if it's one of those routes and if it is set the location to /home
    const isModal = !!(modalPaths.some(path => matchPath(location.pathname, { path }) !== null) &&
      (location.state && location.state.modal && location !== this.previousLocation))
    
    if (!isRefreshing && isLoggedIn) actions.startRefreshJwt()
    
    const containerType = location.pathname.endsWith('/code') || location.pathname.endsWith('/validate')
      ? 'row'
      : 'column'
    
    const switchLocation = isModal
      ? this.previousLocation
      : location
    
    return (
      <FlexGrid container type="column" flex style={{ overflow: 'hidden' }}>
        <IdleTimer
          ref={this.idleRef}
          timeout={TEN_MINUTES}
          onIdle={this.handleUserIdle} // this is called only after the user has been idle for the time set in timeout
          onActive={this.handleUserActive}
          stopOnIdle
        />
        <AppHeader
          user={user}
          tabs={menuTabs}
          open={menuOpen}
          onLogoutUser={this.handleLogoutUser}
          onToggleMenu={this.handleToggleMenu}
          onDownloadPdf={this.handleDownloadPdf}
          onTabChange={this.handleTabChange}
          onOpenAdminPage={this.handleOpenAdminPage}
        />
        <Modal open={logoutIdleAlertOpen} id="logout-idle-alert">
          <ModalTitle style={{ display: 'flex', alignItems: 'center' }} title="Session Expiring" />
          <ModalContent style={{ minWidth: 350 }}>
            <Typography variant="body1">
              You'll be logged out in {logoutAlertTime}. Click the 'Continue' button below to stay logged in.
            </Typography>
          </ModalContent>
          <FlexGrid container type="row" align="center" justify="flex-end" style={{ margin: 20 }}>
            <Button raised={false} onClick={this.handleUserActive} color="secondary">
              Continue
            </Button>
          </FlexGrid>
        </Modal>
        <FlexGrid container type={containerType} flex style={{ backgroundColor: '#f5f5f5', height: '100%' }}>
          <Switch location={switchLocation}>
            <Route path="/docs/:id/view" component={DocumentView} />
            <Route path="/docs" component={DocumentManagement} />
            <Route path="/project/:id/:view(code|validate)/:jid/:qid" component={CodingValidation} />
            <Route path="/project/:id/:view(code|validate)" component={CodingValidation} />
            <Route path="/admin" component={Admin} />
            <Route strict path="/project/:id/coding-scheme" component={CodingScheme} />
            <Route strict path="/project/:id/protocol" component={Protocol} />
            <Route path="/home" component={Home} />
            <Route path="/" exact render={() => <Redirect to={{ pathname: '/home' }} />} />
          </Switch>
          <Route path="/project/edit/:id" component={AddEditProject} />
          <Route path="/project/add" component={AddEditProject} />
          <Route path="/project/:id/jurisdictions" component={AddEditJurisdictions} />
          <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
          <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
          <Route path="/docs/upload" component={Upload} />
          <Route path="/project/:id/coding-scheme/add" component={AddEditQuestion} />
          <Route path="/project/:id/coding-scheme/edit/:questionId" component={AddEditQuestion} />
          <Route path="/admin/new/user" component={AddEditUser} />
          <Route path="/admin/edit/user/:id" component={AddEditUser} />
          <Route path="/user/profile" component={AddEditUser} />
          <ApiErrorAlert content={pdfError} open={pdfError !== ''} onCloseAlert={this.closeDownloadErrorAlert} />
          <a style={{ display: 'none' }} ref={this.helpPdfRef} />
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    user: state.data.user.currentUser,
    pdfError: state.scenes.main.pdfError,
    pdfFile: state.scenes.main.pdfFile,
    isRefreshing: state.scenes.main.isRefreshing,
    previousLocation: state.scenes.main.previousLocation
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Main)
