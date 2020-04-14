import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Snackbar, FlexGrid, Avatar, Icon, Tooltip } from 'components'
import PinciteTextField from '../PinciteTextField'
import Button from '@material-ui/core/Button'
import theme from 'services/theme'
import ValidationAvatar from '../CodingValidationAvatar'

const PinciteAvatar = ({ answerObj, user, size }) => {
  return (
    <Tooltip text={user.username} key={`user-${user.id}-${answerObj.pincite}-${answerObj.schemeAnswerId}`}>
      <Avatar
        avatar={user.avatar}
        initials={user.initials}
        aria-label={`${user.username}'s pincite: ${answerObj.pincite}`}
        userName={user.username}
        small={size === 'small'}
        style={{
          margin: '0 10px 0 0',
          outline: 0,
          backgroundColor: '#e9e9e9',
          color: 'black'
        }}
      />
    </Tooltip>
  )
}

PinciteAvatar.propTypes = {
  answerObj: PropTypes.object,
  user: PropTypes.object,
  size: PropTypes.oneOf(['big', 'small'])
}

/**
 * List of pincites in the validation screen
 */
export class PinciteList extends Component {
  static propTypes = {
    answerList: PropTypes.array,
    userImages: PropTypes.object,
    validatorObj: PropTypes.object,
    isAnswered: PropTypes.bool,
    handleChangePincite: PropTypes.func,
    alwaysShow: PropTypes.bool,
    avatarSize: PropTypes.oneOf(['big', 'small']),
    textFieldProps: PropTypes.object,
    validatorStyles: PropTypes.object,
    showAvatar: PropTypes.bool
  }
  
  static defaultProps = {
    avatarSize: 'small',
    alwaysShow: false,
    answerList: [],
    userImages: {},
    isAnswered: false,
    textFieldProps: {},
    validatorStyles: {},
    showAvatar: true
  }
  
  state = {
    expanded: false,
    copied: false
  }
  
  /**
   * Hides or closes the list of pincites
   * @public
   */
  handleToggle = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
  
  /**
   * Sets a timeout to show the snackbar to let user know pincite has been copied
   * @public
   */
  handlePinciteCopy = () => {
    this.setState({ copied: true })
    setTimeout(this.handleCloseSnackbar, 3500)
  }
  
  /**
   * Clears pincite copied snackbar
   * @public
   */
  handleCloseSnackbar = () => {
    this.setState({ copied: false })
    clearTimeout()
  }
  
  render() {
    const {
      answerList, userImages, handleChangePincite, validatorObj, isAnswered,
      alwaysShow, avatarSize, textFieldProps, validatorStyles, showAvatar
    } = this.props
    const { expanded, copied } = this.state
    
    const pincitesExist = (answerList.filter(answer => answer.pincite ? answer.pincite.length > 0 : false)).length >
      0 || isAnswered || alwaysShow
    
    return (
      pincitesExist &&
      <FlexGrid container align="flex-start" flex style={{ marginBottom: 15 }}>
        <Snackbar
          open={copied}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={this.handleCloseSnackbar}
          content={<span>Pincite copied!</span>}
          action={
            <Button
              key="close-snackbar"
              style={{ color: 'white' }}
              size="small"
              onClick={this.handleCloseSnackbar}>
              OK
            </Button>
          }
        />
        {!alwaysShow &&
        <FlexGrid
          container
          type="row"
          align="center"
          padding="5px 0px 8px 0px"
          onClick={this.handleToggle}
          style={{ cursor: 'pointer' }}>
          <Typography variant="body1" color="secondary">
            {expanded ? 'Hide pincites' : 'Show pincites'}
          </Typography>
          <Icon color={theme.palette.secondary.main}>
            {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </Icon>
        </FlexGrid>}
        <Collapse in={alwaysShow ? true : expanded} style={{ alignSelf: 'stretch' }}>
          <FlexGrid container align="flex-start">
            {answerList.map((answer, i) => {
              const hasPincite = answer.pincite !== null ? answer.pincite.length > 0 : false
              const user = userImages[answer.userId]
              return (
                hasPincite && <CopyToClipboard
                  text={answer.pincite}
                  onCopy={hasPincite && this.handlePinciteCopy}
                  key={`${user.username}-pincite`}>
                  <FlexGrid container type="row" align="flex-start" style={{ cursor: 'pointer', marginBottom: 8 }}>
                    {showAvatar &&
                    <ValidationAvatar user={user} size={avatarSize} style={{ marginRight: 10 }} />}
                    <Typography
                      align="center"
                      style={{
                        textAlign: 'left',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        color: theme.palette.greyText
                      }}>
                      {alwaysShow && <span style={{ color: theme.palette.secondary.main }}>Pincite: </span>}
                      {answer.pincite}
                    </Typography>
                  </FlexGrid>
                </CopyToClipboard>
              )
            })}
            {isAnswered &&
            <FlexGrid container type="row" align="center" style={{ alignSelf: 'stretch', ...validatorStyles }}>
              {showAvatar &&
              <ValidationAvatar
                user={userImages[validatorObj.userId]}
                size={avatarSize}
                style={{ marginRight: 10, cursor: 'default' }}
              />}
              <PinciteTextField
                handleChangePincite={handleChangePincite}
                pinciteValue={validatorObj.pincite}
                schemeAnswerId={validatorObj.schemeAnswerId}
                style={{ padding: 0, ...textFieldProps }}
              />
            </FlexGrid>}
          </FlexGrid>
        </Collapse>
      </FlexGrid>
    )
  }
}

export default PinciteList
