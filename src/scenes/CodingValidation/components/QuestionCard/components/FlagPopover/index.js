import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import { Flag, AlertOctagon } from 'mdi-material-ui'
import classNames from 'classnames'
import Popover from './components/Popover'
import styles from '../../card-styles.scss'
import { TableCell, Table, TableRow, IconButton, Icon, Button, SimpleInput, RadioGroup, FlexGrid } from 'components'

/**
 * Gets the radio button label display for regular flags
 * @param color
 * @param text
 * @param disabled
 * @returns {*}
 */
const getFlagText = (color, text, disabled) => (
  <FlexGrid container align="center" type="row">
    <Icon color={disabled ? '#bdbdbd' : color} style={{ paddingRight: 5 }}>flag</Icon>
    <span style={{ color: disabled ? '#bdbdbd' : 'black' }}>{text}</span>
  </FlexGrid>
)

/**
 * Checks to see if the current user is the one who saved the red flag on the question (if it exists)
 * @param questionFlags
 * @param user
 * @returns {*}
 */
const checkForRedFlag = (questionFlags, user) => questionFlags.filter(flag => flag.raisedBy.userId === user.id)

export class FlagPopover extends Component {
  static defaultProps = {
    userFlag: {
      notes: '',
      type: 0
    },
    questionFlags: []
  }
  
  static propTypes = {
    userFlag: PropTypes.object,
    questionFlags: PropTypes.array,
    onSaveFlag: PropTypes.func,
    user: PropTypes.object,
    disableAll: PropTypes.bool,
    questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    categoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      redFlagOpen: false,
      otherFlagOpen: false,
      updatedFlag: { ...props.userFlag },
      userRedFlag: checkForRedFlag(props.questionFlags, props.user)[0] || { notes: '', type: 3 },
      inEditMode: props.questionFlags.length === 0,
      helperText: '',
      choiceHelperText: ''
    }
    
    this.userFlagColors = {
      1: {
        type: 1,
        color: '#2E7D32',
        label: 'Flag for analysis',
        text: getFlagText('#2E7D32', 'Flag for analysis', props.questionFlags.length > 0),
        disabled: props.questionFlags.length > 0 || props.disableAll
      },
      2: {
        type: 2,
        color: '#CE4A00',
        label: 'Notify Coordinator',
        text: getFlagText('#CE4A00', 'Notify coordinator', props.questionFlags.length > 0),
        disabled: props.questionFlags.length > 0 || props.disableAll
      }
    }
  }
  
  componentDidUpdate(prevProps) {
    const { questionId, questionFlags, user, userFlag, disableAll, categoryId } = this.props
    
    // This is question wide red flag. We need to update it when the question changes
    if (prevProps.questionId !== questionId || prevProps.questionFlags.length !== questionFlags.length) {
      this.setState({
        userRedFlag: checkForRedFlag(questionFlags, user)[0] || { notes: '', type: 3 },
        inEditMode: questionFlags.length === 0
      })
      
      this.setState({
        updatedFlag: { ...userFlag }
      })
      
      for (let type in this.userFlagColors) {
        this.userFlagColors[type] = {
          ...this.userFlagColors[type],
          text: getFlagText(
            this.userFlagColors[type].color,
            this.userFlagColors[type].label,
            questionFlags.length > 0
          ),
          disabled: questionFlags.length > 0 || disableAll
        }
      }
    }
    
    // Category has changed so we need to update the 'user flag' since that is specific to categories
    if (prevProps.categoryId !== categoryId) {
      this.setState({
        updatedFlag: { ...userFlag }
      })
    }
  }
  
  /**
   * Opens red flag popover
   */
  onOpenRedPopover = () => {
    this.setState({
      redFlagOpen: !this.state.redFlagOpen,
      otherFlagOpen: false,
      helperText: '',
      inEditMode: this.props.questionFlags.length === 0,
      userRedFlag: checkForRedFlag(this.props.questionFlags, this.props.user)[0] || { notes: '', type: 3 }
    })
  }
  
  /**
   * Closes red flag popover
   */
  onCloseRedPopover = () => {
    this.setState({
      redFlagOpen: false,
      helperText: ''
    })
  }
  
  /**
   * Sets helper text if the type or notes are empty; calls prop method to actually save red flag
   * @param e
   */
  onSaveRedPopover = e => {
    e.preventDefault()
    if (this.state.userRedFlag.notes.length === 0) {
      this.setState({
        helperText: 'Required'
      })
    } else {
      this.props.onSaveFlag(this.state.userRedFlag)
      this.setState({
        inEditMode: false,
        helperText: ''
      })
    }
  }
  
  /**
   * Sets helper text if notes field is empty
   * @param e
   */
  checkNotes = e => {
    this.setState({
      helperText: e.target.value === '' ? 'Required' : ''
    })
  }
  
  /**
   * Handles update event for red flag notes
   * @param event
   */
  onUpdateRedFlagNotes = event => {
    this.setState({
      userRedFlag: {
        ...this.state.userRedFlag,
        notes: event.target.value
      }
    })
  }
  
  /**
   * Enables edit mode for the red flag form
   */
  toggleEditMode = () => {
    this.setState({
      inEditMode: !this.state.inEditMode,
      userRedFlag: this.state.userRedFlag.notes === null ? { notes: '', type: 3 } : this.state.userRedFlag,
      helperText: ''
    })
  }
  
  /**
   * Opens regular flag form
   */
  onOpenOtherPopover = () => {
    this.setState({
      redFlagOpen: false,
      otherFlagOpen: !this.state.otherFlagOpen,
      helperText: ''
    })
  }
  
  /**
   * Closes the regular flag form
   */
  onCloseOtherPopover = () => {
    this.setState({
      otherFlagOpen: false,
      updatedFlag: this.props.userFlag,
      helperText: '',
      choiceHelperText: ''
    })
  }
  
  /**
   * Sets helper text if the type or notes are empty; calls prop method to actually save regular flag
   * @param e
   */
  onSaveOtherPopover = e => {
    const { updatedFlag } = this.state
    e.preventDefault()
    if (updatedFlag.type === 0 || updatedFlag.notes === '') {
      this.setState({
        helperText: updatedFlag.notes === '' ? 'Required' : '',
        choiceHelperText: updatedFlag.type === 0 ? 'Required' : ''
      })
    } else {
      this.props.onSaveFlag(updatedFlag)
      this.setState({
        otherFlagOpen: false,
        helperText: '',
        choiceHelperText: ''
      })
    }
  }
  
  /**
   * User has change from one flag type to the other in the regular flag form
   * @param type
   * @returns {Function}
   */
  onChangeFlagType = type => value => {
    this.setState({
      updatedFlag: {
        ...this.state.updatedFlag,
        type
      }
    })
  }
  
  /**
   * Updates the notes for the regular flag
   * @param event
   */
  onChangeFlagNotes = event => {
    this.setState({
      updatedFlag: {
        ...this.state.updatedFlag,
        notes: event.target.value
      }
    })
  }
  
  render() {
    const { questionFlags, user, disableAll, userFlag } = this.props
    const { redFlagOpen, inEditMode, helperText, choiceHelperText, userRedFlag, otherFlagOpen, updatedFlag } = this.state
    
    return (
      <FlexGrid container type="row" align="center" flex style={{ width: 'unset', height: 24 }}>
        <Popover
          title="Stop Coding This Question"
          open={redFlagOpen}
          target={{
            icon: <AlertOctagon
              className={classNames({
                [styles.icon]: questionFlags.length === 0,
                [styles.stopIconFlag]: questionFlags.length > 0
              })}
            />,
            style: { maxHeight: 500 },
            tooltip: 'Stop coding this question',
            id: 'stop-coding-question'
          }}
          onOpen={this.onOpenRedPopover}
          onClose={this.onCloseRedPopover}>
          <FlexGrid
            container
            align="center"
            padding="10px 0 0"
            style={{ minWidth: 500, width: 500, minHeight: 200, maxHeight: 500, flexWrap: 'nowrap' }}>
            {(questionFlags.length > 0 && !inEditMode) &&
            <div style={{ overflow: 'auto', width: '100%' }}>
              <Table style={{ width: '90%', maxWidth: 500, margin: '10px 16px', tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" style={{ width: '30%' }}>Raised By</TableCell>
                    <TableCell padding="checkbox" style={{ width: '60%' }}>Notes</TableCell>
                    {(questionFlags[0].raisedBy.userId === user.id && !disableAll) &&
                    <TableCell padding="checkbox" style={{ width: '10%' }}>Edit</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionFlags.map((flag, index) => (
                    <TableRow key={`red-flag-${index}`}>
                      <TableCell padding="checkbox" style={{ maxWidth: 150, width: 150 }}>
                        {`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        style={{ maxWidth: 300, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {flag.notes}
                      </TableCell>
                      {(flag.raisedBy.userId === user.id && !disableAll) &&
                      <TableCell padding="checkbox" style={{ width: 48, paddingRight: 12 }}>
                        <IconButton onClick={this.toggleEditMode} color="#5f6060">edit</IconButton>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>}
            {inEditMode &&
            <form onSubmit={this.onSaveRedPopover} style={{ alignSelf: 'stretch', flex: 1, minWidth: 500, width: 500 }}>
              <FlexGrid padding={16} flex>
                <SimpleInput
                  value={userRedFlag.notes}
                  onChange={this.onUpdateRedFlagNotes}
                  shrinkLabel={true}
                  id="flag-notes"
                  onBlur={this.checkNotes}
                  error={helperText !== ''}
                  label="Notes"
                  required
                  disabled={disableAll}
                  helperText={helperText}
                  placeholder="Enter Notes"
                  multiline={false}
                  type="text"
                />
              </FlexGrid>
            </form>}
            <FlexGrid container type="row" padding={16} style={{ alignSelf: 'flex-end' }}>
              <Button
                onClick={this.onCloseRedPopover}
                raised={false}
                color="accent"
                value={inEditMode ? 'Cancel' : 'Close'}
              />
              {inEditMode && <Button
                type="submit"
                onClick={this.onSaveRedPopover}
                raised={false}
                color="accent"
                disabled={disableAll}
                value="Save"
              />}
            </FlexGrid>
          </FlexGrid>
        </Popover>
        <Popover
          title="Flags"
          open={otherFlagOpen}
          target={{
            icon: <Flag
              className={classNames({
                [styles.icon]: userFlag.type === 0,
                [styles.greenFlagIcon]: userFlag.type === 1,
                [styles.yellowFlagIcon]: userFlag.type === 2
              })}
            />,
            color: userFlag.type !== 0 ? this.userFlagColors[userFlag.type].color : '#757575',
            tooltip: 'Flag this question',
            id: 'flag-question'
          }}
          onOpen={this.onOpenOtherPopover}
          onClose={this.onCloseOtherPopover}>
          <form onSubmit={this.onSaveOtherPopover}>
            <FlexGrid flex padding={16} style={{ minWidth: 450 }}>
              <RadioGroup
                selected={updatedFlag.type}
                choices={Object.values(this.userFlagColors)}
                onChange={this.onChangeFlagType}
                error={choiceHelperText !== ''}
                label="Flag Type"
                required
                helperText={choiceHelperText}
              />
            </FlexGrid>
            <FlexGrid flex padding={16}>
              <SimpleInput
                value={updatedFlag.notes}
                onChange={this.onChangeFlagNotes}
                shrinkLabel={true}
                id="flag-notes"
                label="Notes"
                disabled={questionFlags.length > 0 || disableAll}
                error={helperText !== ''}
                onBlur={this.checkNotes}
                helperText={helperText}
                placeholder="Enter Notes"
                multiline={false}
                required
                type="text"
              />
            </FlexGrid>
            <FlexGrid container type="row" flex justify="flex-end" padding={16}>
              <Button type="button" onClick={this.onCloseOtherPopover} raised={false} color="accent" value="Cancel" />
              <Button
                type="submit"
                onClick={this.onSaveOtherPopover}
                raised={false}
                color="accent"
                disabled={questionFlags.length > 0 || disableAll}
                value="Save"
              />
            </FlexGrid>
          </form>
        </Popover>
      </FlexGrid>)
  }
}

export default FlagPopover
