import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Button, Icon, Avatar, RadioButtonLabel, CircularLoader } from 'components'
import Modal, { ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import theme from 'services/theme'

export class BulkValidate extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onConfirmValidate: PropTypes.func,
    onClose: PropTypes.func,
    users: PropTypes.array,
    validationInProgress: PropTypes.bool
  }
  
  state = {
    activeStep: 0,
    selections: {
      scope: null,
      user: null,
      confirm: false
    }
  }
  
  componentDidUpdate(prevProps) {
    const { open } = this.props
    if (prevProps.open && !open) {
      this.setState({
        selections: {
          scope: null,
          user: null,
          confirm: false
        },
        activeStep: 0
      })
    }
  }
  
  /**
   * Choose between question, jurisdiction, or project
   * @param scope
   */
  handleSelectScope = scope => () => {
    const { selections } = this.state
    
    this.setState({
      selections: {
        ...selections,
        scope
      },
      activeStep: selections.scope === null ? 1 : 0
    })
  }
  
  /**
   * For when the user selects the coder to use as the answers
   * @param user
   * @returns {Function}
   */
  handleSelectUser = user => () => {
    const { selections } = this.state
    this.setState({
      selections: {
        ...selections,
        user: {
          ...user,
          username: `${user.firstName} ${user.lastName}`
        }
      },
      activeStep: selections.user === null ? 2 : 1
    })
  }
  
  /**
   * For when the user is on the last step of the modal and confirms the bulk validate
   */
  handleConfirmValidate = () => {
    const { onConfirmValidate, validationInProgress } = this.props
    const { selections } = this.state
    
    if (!validationInProgress) {
      this.setState({
        selections: {
          ...selections,
          confirm: true
        }
      })
      onConfirmValidate(selections.scope, selections.user)
    }
  }
  
  /**
   * goes back an active step
   */
  handleGoBackStep = () => {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep - 1
    })
  }
  
  /**
   * goes back an active step
   */
  handleGoForwardStep = () => {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep + 1
    })
  }
  
  /**
   * Handles clearing information when closing
   */
  handleClose = () => {
    const { onClose } = this.props
    onClose()
    this.setState({
      activeStep: 0,
      selections: {
        user: null,
        scope: null,
        confirm: false
      }
    })
  }
  
  render() {
    const { open, users, validationInProgress } = this.props
    const { activeStep, selections } = this.state
    
    const steps = [
      { label: 'Select Scope', completed: selections.scope !== null },
      { label: 'Select User', completed: selections.user !== null },
      { label: 'Confirm', completed: selections.confirm }
    ]
    
    const scopes = [
      {
        text: [
          'Validate the current question.'
        ],
        title: 'Question',
        scope: 'question'
      },
      {
        text: [
          'Validate every question in the current jurisdiction.'
        ],
        title: 'Jurisdiction',
        scope: 'jurisdiction'
      },
      {
        text: [
          'Validate every question and jurisdiction in the current project.'
        ],
        title: 'Project',
        scope: 'project'
      }
    ]
    
    return (
      <Modal open={open} onClose={this.handleClose} maxWidth="md" hideOverflow>
        <ModalTitle
          title="Validate"
          buttons={<Button
            raised={false}
            color="accent"
            disabled={validationInProgress}
            onClick={this.handleClose}>
            Close
          </Button>}
        />
        <Divider />
        <ModalContent style={{ display: 'flex', padding: 0 }}>
          <FlexGrid container flex style={{ height: '100%' }}>
            <FlexGrid container flex padding="24px 12px" style={{ backgroundColor: '#f4f4f4' }}>
              {activeStep === 0 &&
              <FlexGrid container flex type="row" id="scope-step">
                {scopes.map((scope, i) => {
                  const isScopeSelected = selections.scope === scope.scope
                  return (
                    <FlexGrid
                      container
                      flex
                      key={`scope-${i}`}
                      padding="35px 35px 60px"
                      style={{
                        border: isScopeSelected
                          ? `2px solid ${theme.palette.secondary.main}`
                          : `1px solid rgba(0, 0, 0, 0.12)`,
                        backgroundColor: 'white',
                        margin: '0 12px',
                        width: '33%'
                      }}>
                      <FlexGrid container style={{ height: '100%' }}>
                        <Typography
                          variant="display1"
                          align="center"
                          style={{ color: 'black', marginBottom: 25 }}>{scope.title}</Typography>
                        <Typography variant="body1" align="center">{scope.text[0]}</Typography>
                      </FlexGrid>
                      {!isScopeSelected &&
                      <Button
                        color="secondary"
                        onClick={this.handleSelectScope(scope.scope)}
                        style={{ alignSelf: 'center', width: '75%' }}>
                        Select
                      </Button>}
                      {isScopeSelected &&
                      <FlexGrid container type="row" align="center" justify="center">
                        <Icon color="secondary" size={24}>check_circle</Icon>
                        <Typography variant="title" align="center" style={{ marginLeft: 4 }}>Selected!</Typography>
                      </FlexGrid>}
                    </FlexGrid>
                  )
                })}
              </FlexGrid>}
              {activeStep === 1 &&
              <FlexGrid
                container
                flex
                padding={35}
                id="user-step"
                style={{ backgroundColor: 'white', margin: '0 12px', border: `1px solid rgba(0, 0, 0, 0.12)` }}>
                <FlexGrid container>
                  <FlexGrid container>
                    <Typography variant="display1" style={{ color: 'black' }}>User</Typography>
                    <Typography style={{ paddingTop: 7, paddingBottom: 15 }} variant="body1">
                      Select the user whose coding data you would like to use as the validated codes.
                    </Typography>
                  </FlexGrid>
                  <List>
                    {users.map((user, i) => {
                      const isUserSelected = selections.user !== null && selections.user.userId === user.userId
                      return (
                        <ListItem
                          button
                          key={`select-user-${i}`}
                          style={{
                            padding: 10,
                            backgroundColor: isUserSelected ? `rgba(233, 233, 233, 0.68)` : ''
                          }}
                          onClick={this.handleSelectUser(user)}>
                          <ListItemAvatar>
                            <Avatar userId={user.userId} style={{ width: 25, height: 25 }} />
                          </ListItemAvatar>
                          <ListItemText
                            style={{ padding: 0 }}
                            primaryTypographyProps={{
                              variant: 'body1',
                              style: {
                                marginLeft: 10,
                                fontSize: '1rem',
                                fontWeight: 300,
                                lineHeight: 'normal'
                              }
                            }}
                            primary={`${user.firstName}${' '}${user.lastName}`}
                          />
                          <RadioButtonLabel
                            checked={isUserSelected}
                            onChange={this.handleSelectUser(user)}
                            labelStyle={{
                              width: 24, height: 24
                            }}
                          />
                        </ListItem>
                      )
                    })}
                  </List>
                </FlexGrid>
              </FlexGrid>}
              {activeStep === 2 && <FlexGrid
                container
                flex
                padding={35}
                id="confirm-step"
                style={{ backgroundColor: 'white', margin: '0 12px', border: `1px solid rgba(0, 0, 0, 0.12)` }}>
                <FlexGrid container style={{ marginBottom: 100 }}>
                  <Typography variant="display1" style={{ color: 'black' }}>Confirmation</Typography>
                  <FlexGrid container type="row" padding="30px 0 0">
                    <FlexGrid container flex style={{ marginRight: 50, flexBasis: '60%' }}>
                      <FlexGrid>
                        <Typography variant="headline">Scope: {capitalizeFirstLetter(selections.scope)}</Typography>
                        <Typography variant="headline">
                          User: {selections.user.username}
                        </Typography>
                      </FlexGrid>
                      <Typography variant="body1" style={{ paddingTop: 20, marginBottom: 10 }}>
                        You are going to validate this <strong>{selections.scope}</strong> using the coding data from{' '}
                        <strong>{selections.user.username}</strong>
                        .{' '}
                        {selections.scope === 'question' &&
                        `If ${selections.user.firstName} has not coded this question, the current validated answer will not change.`}
                        {selections.scope !== 'question' &&
                        `${selections.user.firstName}'s coding data will be used to validate every question they have coded within this ${selections.scope}.
                     For questions that ${selections.user.firstName} has not modified or coded, the current validated answers will remain the same.`}
                      </Typography>
                      <Typography variant="body1">
                        If you would like to select a different scope or user, use the 'Back' button at the bottom of this
                        modal to navigate to different steps.
                      </Typography>
                    </FlexGrid>
                    <FlexGrid
                      flex
                      padding={25}
                      container
                      style={{ backgroundColor: 'rgba(202, 80, 114, 0.28)', flexBasis: '40%' }}>
                      <FlexGrid container type="row" align="center">
                        <Icon color="error" size={25}>warning</Icon>
                        <Typography variant="headline" style={{ marginLeft: 4 }}>WARNING</Typography>
                      </FlexGrid>
                      <Typography variant="body1" style={{ paddingTop: 25 }}>
                        This will <strong>overwrite all</strong> current validated answers, annotations, comments, and pincites
                        for questions that {selections.user.username} has coded. There is no ‘UNDO’ option for this action.
                      </Typography>
                    </FlexGrid>
                  </FlexGrid>
                </FlexGrid>
                <FlexGrid justify="center" container type="row">
                  <Button
                    disabled={validationInProgress}
                    style={{ color: validationInProgress ? theme.palette.secondary.main : 'white', width: '25%' }}
                    color="secondary"
                    onClick={this.handleConfirmValidate}>
                    <span style={{ marginRight: 4 }}>Validate</span>
                    {validationInProgress && <CircularLoader color="secondary" size={15} />}
                  </Button>
                </FlexGrid>
              </FlexGrid>}
            </FlexGrid>
            <Divider />
            <FlexGrid container type="row" padding="24px 24px" style={{ backgroundColor: 'white', minHeight: 36 }}>
              <FlexGrid flex container type="row" align="center" justify="flex-start" style={{ flexBasis: '25%' }}>
                {activeStep !== 0 &&
                <Button
                  color="white"
                  style={{ color: 'black', width: '40%' }}
                  onClick={this.handleGoBackStep}>
                  Back
                </Button>}
              </FlexGrid>
              <FlexGrid flex container type="row" justify="center" style={{ flexBasis: '50%' }}>
                {steps.map((step, i) => {
                  return (
                    <FlexGrid container type="row" align="center" key={step.label}>
                      {i !== 0 &&
                      <FlexGrid
                        style={{
                          width: 150,
                          margin: '0 10px',
                          borderTop: `1px solid ${i <= activeStep ? theme.palette.primary.main : '#aeaeae'}`
                        }}
                      />}
                      <FlexGrid
                        circular
                        style={{
                          backgroundColor: i <= activeStep ? theme.palette.primary.main : '#aeaeae',
                          width: 20,
                          height: 20,
                          padding: 0
                        }}
                      />
                    </FlexGrid>
                  )
                })}
              </FlexGrid>
              <FlexGrid flex container type="row" align="center" justify="flex-end" style={{ flexBasis: '25%' }}>
                {(activeStep !== 2 && steps[activeStep].completed) &&
                <Button
                  color="white"
                  style={{ color: 'black', width: '40%' }}
                  onClick={this.handleGoForwardStep}>
                  Next
                </Button>}
              </FlexGrid>
            </FlexGrid>
          </FlexGrid>
        </ModalContent>
      </Modal>
    )
  }
}

export default BulkValidate
