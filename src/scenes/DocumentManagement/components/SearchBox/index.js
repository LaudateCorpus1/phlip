import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Button, Icon, DatePicker, Typography, withAutocompleteMethods } from 'components'
import SearchBar from 'components/SearchBox'
import TextField from '@material-ui/core/TextField'
import ButtonBase from '@material-ui/core/ButtonBase'
import { Manager, Reference, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import actions from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { checkIfMultiWord } from 'utils/commonHelpers'
import { AccountBox, Alphabetical, City, Clipboard, CalendarBlank } from 'mdi-material-ui'
import Autosuggest from 'react-autosuggest'
import { withStyles } from '@material-ui/core/styles'

/* istanbul ignore next */
const styles = () => ({
  suggestionsContainerOpenAbsolute: {
    width: '100%',
    maxHeight: 500,
    overflow: 'auto',
    position: 'absolute',
    '& div:last-child': {
      borderBottom: 'none'
    }
  },
  container: {
    width: '100%',
    position: 'relative'
  }
})

export class SearchBox extends Component {
  static propTypes = {
    form: PropTypes.object,
    searchValue: PropTypes.string,
    searchBarValue: PropTypes.string,
    actions: PropTypes.object,
    currentUser: PropTypes.object,
    projectAutocompleteProps: PropTypes.object,
    projectAutoActions: PropTypes.object,
    jurisdictionAutocompleteProps: PropTypes.object,
    jurisdictionAutoActions: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    this.buttonRef = null
  }
  
  state = {
    isFocused: false,
    showFilterForm: false,
    datePicker1Open: false,
    datePicker2Open: false
  }
  
  componentWillUnmount() {
    this.clearForm()
    this.props.actions.clearSearchString()
  }
  
  /**
   * Users focus changes
   * @param focused
   */
  handleFocusChange = focused => {
    this.setState({
      isFocused: focused,
      showFilterForm: false
    })
  }
  
  /**
   * User has changed a search field in the advanced form
   * @param property
   * @param value
   */
  handleFormValueChange = (property, value) => {
    if (property.includes('uploadedDate') && value === null) {
      value = ''
    }
    this.props.actions.updateFormValue(property, value)
  }
  
  /**
   * User has enter a search value in the basic search form
   * @param e
   */
  handleSearchFieldChange = e => {
    if (e.target.value === '') {
      this.clearForm()
    }
    this.props.actions.updateSearchValue(e.target.value, this.props.form)
  }
  
  /**
   * User has clicked 'enter' or clicked the submit button on the form
   */
  handleSearchFormSubmit = () => {
    const searchString = this.buildSearchFilter()
    this.props.actions.updateSearchValue(searchString, this.props.form)
    this.handleToggleForm()
  }
  
  /**
   * Closes the form if the date pickers aren't open
   * @param e
   */
  handleClickAway = e => {
    if (!this.state.datePicker1Open && !this.state.datePicker2Open) {
      this.clearForm()
      if (e.path[1] !== this.buttonRef) {
        this.handleToggleForm(e)
      }
    }
  }
  
  /**
   * Clears the search form
   */
  clearForm = () => {
    const { projectAutoActions, jurisdictionAutoActions, actions } = this.props
    actions.clearForm()
    projectAutoActions.clearAll()
    jurisdictionAutoActions.clearAll()
  }
  
  /**
   * Opens / closes the form
   */
  handleToggleForm = () => {
    this.setState({ showFilterForm: !this.state.showFilterForm })
  }
  
  /**
   * Builds the search string based on what the user has populated
   * @returns {string}
   */
  buildSearchFilter = () => {
    const { form, projectAutocompleteProps, jurisdictionAutocompleteProps } = this.props
    const projectSearchValue = projectAutocompleteProps.searchValue
    const jurisdictionSearchValue = jurisdictionAutocompleteProps.searchValue
    
    const params = ['name', 'uploadedBy']
    
    let searchTerms = []
    params.forEach((key, index) => {
      if (form[key] !== '') {
        let p = form[key]
        if (checkIfMultiWord(p)) {
          p = `(${p})`
        }
        searchTerms.push(key.concat(':', p))
      }
    })
    
    if (form.uploadedDate1 && form.uploadedDate2) {
      let dBegin = moment.utc(form.uploadedDate1).local().format('MM/DD/YYYY')
      let dEnd = moment.utc(form.uploadedDate2).local().format('MM/DD/YYYY')
      // check if dates in valid order:  dBegin should be older than dEnd
      if (dBegin > dEnd) {
        const tmpDate = dBegin
        dBegin = dEnd
        dEnd = tmpDate
      }
      let p = `["${dBegin}","${dEnd}"]`
      searchTerms.push(`uploadedDate:${p}`)
    } else if (form.uploadedDate1 &&
      (form.uploadedDate2 === '' || form.uploadedDate2 === undefined)) {
      let dBegin = moment.utc(form.uploadedDate1).local().format('MM/DD/YYYY')
      let p = `["${dBegin}",""]`
      searchTerms.push(`uploadedDate:${p}`)
    } else if ((form.uploadedDate1 === '' || form.uploadedDate1 === undefined) &&
      form.uploadedDate2) {
      let dEnd = moment.utc(form.uploadedDate2).local().format('MM/DD/YYYY')
      let p = `["","${dEnd}"]`
      searchTerms.push(`uploadedDate:${p}`)
    }
    
    if (projectSearchValue !== '') {
      let z = projectSearchValue
      if (form.project.id !== null) {
        z = form.project.name
      }
      if (checkIfMultiWord(z)) {
        z = `(${z})`
      }
      searchTerms.push(`project:${z}`)
    }
    
    if (jurisdictionSearchValue !== '') {
      let z = jurisdictionSearchValue
      if (form.jurisdiction.id !== null) {
        z = form.jurisdiction.name
      }
      if (checkIfMultiWord(z)) {
        z = `(${z})`
      }
      searchTerms.push(`jurisdiction:${z}`)
    }
    
    return searchTerms.join(' | ')
  }
  
  /**
   * Opens the date picker for start date
   */
  handleOpenDatePicker2 = () => {
    this.setState({ datePicker2Open: true })
  }
  
  /**
   * Closes the date picker for end date
   */
  handleCloseDatePicker2 = () => {
    this.setState({ datePicker2Open: false })
  }
  
  /**
   * Opens the date picker for start date
   */
  handleOpenDatePicker1 = () => {
    this.setState({ datePicker1Open: true })
  }
  
  /**
   * Closes the date picker for start date
   */
  handleCloseDatePicker1 = () => {
    this.setState({ datePicker1Open: false })
  }
  
  onKeyPress = e => {
    if (e.which === 13 && this.state.showFilterForm) {
      this.handleSearchFormSubmit()
    }
  }
  
  render() {
    const {
      form: {
        uploadedDate1,
        uploadedBy,
        name,
        uploadedDate2
      },
      searchBarValue,
      projectAutocompleteProps,
      jurisdictionAutocompleteProps,
      classes
    } = this.props
    
    const { showFilterForm, isFocused } = this.state
    
    const iconColor = '#949494'
    
    const boxStyle = {
      backgroundColor: 'white',
      borderRadius: showFilterForm ? '5px 5px 0 0' : '5px',
      border: `1px solid rgba(${189}, ${189}, ${189}, ${.33}`,
      display: 'flex',
      alignItems: 'center',
      padding: 5,
      flex: 1,
      boxShadow: isFocused
        ? '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
        : 'none'
    }
    
    const formRowStyles = {
      marginBottom: 20
    }
    
    const formRowFontStyles = {
      color: '#5f6368',
      letterSpacing: .2,
      fontWeight: 300,
      paddingLeft: 5,
      fontSize: 13,
      width: '25%',
      maxWidth: '25%'
    }
    
    const formRowFontStyles2 = {
      color: '#5f6368',
      letterSpacing: .2,
      fontWeight: 300,
      fontSize: 13,
      marginRight: 10
    }
    
    const inputProps = {
      style: {
        padding: 0,
        fontSize: 13
      }
    }
    
    return (
      <Manager>
        <Reference>
          {({ ref }) => {
            return (
              <div ref={ref} style={boxStyle}>
                <SearchBar
                  placeholder="Search documents"
                  fullWidth
                  searchValue={searchBarValue}
                  handleSearchValueChange={this.handleSearchFieldChange}
                  searchIcon="search"
                  InputProps={{
                    onFocus: () => this.handleFocusChange(true),
                    onBlur: () => this.handleFocusChange(false),
                    inputProps: { style: { fontSize: 15, padding: 0 } }
                  }}
                />
                <ButtonBase buttonRef={node => this.buttonRef = node} disableRipple onClick={this.handleToggleForm}>
                  <Icon color={iconColor}>arrow_drop_down</Icon>
                </ButtonBase>
              </div>
            )
          }}
        </Reference>
        <Popper
          placement="bottom-start"
          eventsEnabled={showFilterForm}
          style={{ pointerEvents: showFilterForm ? 'auto' : 'none' }}>
          {({ placement, ref, style }) => {
            return (
              showFilterForm &&
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <div
                  data-placement={placement}
                  style={{ ...style, width: '100%', zIndex: 5, maxHeight: 450 }}
                  ref={ref}
                  tabIndex="0"
                  onKeyPress={this.onKeyPress}>
                  <FlexGrid container type="column" padding={24} raised>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <Alphabetical
                        style={{
                          color: 'white',
                          backgroundColor: '#757575',
                          fontSize: 15,
                          borderRadius: 3,
                          marginLeft: 2,
                          marginRight: 2,
                          marginTop: 1
                        }}
                      />
                      <Typography variant="body2" style={formRowFontStyles}>
                        Name
                      </Typography>
                      <TextField
                        fullWidth
                        inputProps={inputProps}
                        value={name}
                        onChange={e => this.handleFormValueChange('name', e.target.value)}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <AccountBox style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="uploaded-by" style={formRowFontStyles}>
                        Uploaded By
                      </Typography>
                      <TextField
                        fullWidth
                        name="uploaded-by"
                        inputProps={inputProps}
                        value={uploadedBy}
                        onChange={e => this.handleFormValueChange('uploadedBy', e.target.value)}
                      />
                    </FlexGrid>
                    <FlexGrid container flex type="row" style={formRowStyles} justify="space-between">
                      <CalendarBlank style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="uploaded-within" style={formRowFontStyles}>
                        Uploaded Date
                      </Typography>
                      <FlexGrid
                        container
                        flex
                        type="row"
                        style={{ flexBasis: '100%', flexWrap: 'wrap' }}
                        justify="space-between">
                        <FlexGrid container flex type="row" justify="space-between" style={{ width: '35%' }}>
                          <Typography variant="body2" htmlFor="uploadedDate1Search" style={formRowFontStyles2}>
                            From:
                          </Typography>
                          <DatePicker
                            id="date1"
                            name="uploadedDate1Search"
                            dateFormat="MM/DD/YYYY"
                            onChange={date => this.handleFormValueChange('uploadedDate1', date)}
                            clearable
                            value={uploadedDate1}
                            style={{ marginTop: 0, alignSelf: 'flex-start', paddingLeft: '0' }}
                            containerProps={{ fullWidth: true }}
                            fullWidth
                            inputProps={inputProps}
                            onOpen={this.handleOpenDatePicker1}
                            onClose={this.handleCloseDatePicker1}
                            InputAdornmentProps={{
                              disableTypography: true,
                              style: {
                                height: 19,
                                width: 19,
                                margin: 0,
                                marginRight: 15,
                                alignItems: 'flex-end',
                                marginBottom: -8
                              }
                            }}
                          />
                        
                        </FlexGrid>
                        <FlexGrid style={{ width: '1%' }} />
                        <FlexGrid container flex type="row" justify="space-between" style={{ width: '35%' }}>
                          <Typography variant="body2" htmlFor="uploadedDate2Search" style={formRowFontStyles2}>
                            To:
                          </Typography>
                          <DatePicker
                            id="date2"
                            name="uploadedDate2Search"
                            dateFormat="MM/DD/YYYY"
                            onChange={date => this.handleFormValueChange('uploadedDate2', date)}
                            clearable
                            value={uploadedDate2}
                            style={{ marginTop: 0, alignSelf: 'flex-end', paddingLeft: '30' }}
                            containerProps={{ fullWidth: true }}
                            inputProps={inputProps}
                            fullWidth={true}
                            onOpen={this.handleOpenDatePicker2}
                            onClose={this.handleCloseDatePicker2}
                            InputAdornmentProps={{
                              disableTypography: true,
                              style: {
                                height: 19,
                                width: 19,
                                margin: 0,
                                marginRight: 15,
                                alignItems: 'flex-end',
                                marginBottom: -8
                              }
                            }}
                          />
                        </FlexGrid>
                      </FlexGrid>
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <Clipboard style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="project" style={formRowFontStyles}>
                        Project
                      </Typography>
                      <Autosuggest
                        {...projectAutocompleteProps}
                        theme={{
                          ...projectAutocompleteProps.theme,
                          suggestionsContainerOpen: classes.suggestionsContainerOpenAbsolute,
                          container: classes.container
                        }}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <City style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="jurisdiction" style={formRowFontStyles}>
                        Jurisdiction
                      </Typography>
                      <Autosuggest
                        {...jurisdictionAutocompleteProps}
                        theme={{
                          ...jurisdictionAutocompleteProps.theme,
                          suggestionsContainerOpen: classes.suggestionsContainerOpenAbsolute,
                          container: classes.container
                        }}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" justify="flex-end">
                      <Button
                        raised={false}
                        color="secondary"
                        listButton
                        onClick={this.handleSearchFormSubmit}
                        style={{ letterSpacing: '.5px', textTransform: 'unset', borderRadius: 5 }}>
                        Search
                      </Button>
                    </FlexGrid>
                  </FlexGrid>
                </div>
              </ClickAwayListener>
            )
          }}
        </Popper>
      </Manager>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const searchState = state.scenes.docManage.search
  const currentUser = state.data.user.currentUser
  return {
    form: searchState.form.params,
    searchBarValue: searchState.form.searchValue,
    currentUser
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

const otherAutoProps = {
  inputProps: {
    style: {
      minHeight: 24,
      fontSize: 14,
      padding: 0
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withAutocompleteMethods('project', 'search', otherAutoProps)(
    withAutocompleteMethods('jurisdiction', 'search', otherAutoProps, false)(
      withStyles(styles)(SearchBox)
    )
  )
)
