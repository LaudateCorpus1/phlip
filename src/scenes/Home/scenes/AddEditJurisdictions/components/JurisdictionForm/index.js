import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import MenuItem from '@material-ui/core/MenuItem'
import { withRouter } from 'react-router'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Container, { Row, Column } from 'components/Layout'
import actions from '../../actions'
import DatePicker from 'components/DatePicker'
import Autocomplete from 'components/Autocomplete'
import withFormAlert from 'components/withFormAlert'
import moment from 'moment'
import { normalize } from 'utils'
import Dropdown from 'components/Dropdown'
import CircularLoader from 'components/CircularLoader'

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)
  
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight
            ? (
              <span key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            )
            : (
              <strong key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            )
        })}
      </div>
    </MenuItem>
  )
}

export class JurisdictionForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    formName: PropTypes.string,
    jurisdiction: PropTypes.object,
    jurisdictions: PropTypes.array,
    suggestions: PropTypes.array,
    suggestionValue: PropTypes.string,
    actions: PropTypes.object,
    formActions: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    onCloseModal: PropTypes.func,
    formError: PropTypes.string,
    goBack: PropTypes.bool,
    onSubmitError: PropTypes.func,
    project: PropTypes.object,
    title: PropTypes.string,
    searching: PropTypes.bool,
    jurisdictionsById: PropTypes.object,
    visibleJurisdictions: PropTypes.array
  }
  
  constructor(props, context) {
    super(props, context)
    this.jurisdictionDefined = this.props.location.state.jurisdictionDefined !== undefined
      ? props.location.state.jurisdictionDefined
      : null
    
    this.state = {
      edit: this.jurisdictionDefined !== null,
      submitting: false,
      errors: {
        name: '',
        endDate: '',
        startDate: ''
      }
    }
  }
  
  componentDidMount() {
    this.props.actions.initializeFormValues({
      endDate: this.jurisdictionDefined
        ? this.jurisdictionDefined.endDate
        : new Date(),
      startDate: this.jurisdictionDefined
        ? this.jurisdictionDefined.startDate
        : new Date(),
      name: this.jurisdictionDefined
        ? this.jurisdictionDefined.name
        : this.props.location.state.preset
          ? 'US States'
          : ''
    })
    
    const baseTitle = `PHLIP - ${this.props.project.name} -`
    if (this.jurisdictionDefined) {
      document.title = `${baseTitle} Edit ${this.jurisdictionDefined.name}`
    } else {
      document.title = `${baseTitle} Add Jurisdiction`
    }
  }
  
  componentDidUpdate() {
    if (this.state.submitting === true) {
      if (this.props.formError !== null) {
        this.setState({
          submitting: false
        })
        this.props.onSubmitError(this.props.formError)
      } else if (this.props.goBack === true) {
        this.props.history.push({
          pathname: `/project/${this.props.project.id}/jurisdictions`,
          state: { modal: true }
        })
      }
    }
  }
  
  componentWillUnmount() {
    this.props.actions.onClearSuggestions()
    document.title = `PHLIP - ${this.props.project.name} - Jurisdictions`
  }
  
  getButtonText = text => {
    if (this.state.submitting) {
      return (
        <Fragment>
          {text}
          <CircularLoader size={18} style={{ paddingLeft: 10 }} />
        </Fragment>
      )
    } else {
      return <Fragment>{text}</Fragment>
    }
  }
  
  onSubmitPreset = () => {
    const jurisdiction = {
      startDate: moment(this.props.form.values.startDate).toISOString(),
      endDate: moment(this.props.form.values.endDate).toISOString(),
      tag: this.props.form.values.name
    }
    
    this.setState({
      submitting: true
    })
    
    this.props.actions.addPresetJurisdictionRequest(jurisdiction, this.props.project.id)
  }
  
  onSubmitForm = () => {
    const hasErrors = Object.values(this.state.errors).filter(error => error.length > 0).length > 0
    if (!hasErrors && !this.checkDupJurisSegment(this.props.jurisdiction)) {
      const jurisdiction = {
        name: this.props.form.values.name,
        startDate: moment(this.props.form.values.startDate).toISOString(),
        endDate: moment(this.props.form.values.endDate).toISOString(),
        jurisdictionId: this.props.jurisdiction.id
      }
      
      this.setState({
        submitting: true
      })
      
      if (this.state.edit) {
        this.props.actions.updateJurisdiction(jurisdiction, this.props.project.id, this.jurisdictionDefined.id)
      } else {
        this.props.actions.addJurisdiction(jurisdiction, this.props.project.id)
      }
    }
  }
  
  validateJurisdiction = () => {
    const jurisdictionName = this.props.form.values.name
    if (!this.state.edit) {
      if (jurisdictionName.length > 0) {
        if (Object.keys(this.props.jurisdiction).length === 0) {
          this.setState({
            errors: {
              ...this.state.errors,
              name: 'You must choose a pre-defined jurisdiction name.'
            }
          })
        } else {
          this.setState({
            errors: {
              ...this.state.errors,
              name: ''
            }
          })
        }
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            name: 'Required'
          }
        })
      }
    }
  }
  
  onJurisdictionsFetchRequest = ({ value }) => {
    this.props.actions.searchJurisdictionList(value)
  }
  
  onCloseForm = () => {
    this.props.actions.onClearSuggestions()
    this.props.actions.onSuggestionValueChanged('')
    this.props.history.goBack()
  }
  
  onJurisdictionSelected = (event, { suggestionValue }) => {
    this.props.actions.onJurisdictionSelected(suggestionValue)
    this.checkDupJurisSegment(suggestionValue)
  }
  
  onSuggestionChange = event => {
    this.props.actions.onSuggestionValueChanged(event.target.value)
    this.setState({
      errors: {
        ...this.state.errors,
        name: event.target.value !== undefined
          ? event.target.value.length > 0
            ? ''
            : 'Required'
          : ''
      }
    })
  }
  
  onClearSuggestions = () => {
    this.props.actions.onClearSuggestions()
  }
  
  onChangeNameField = value => {
    this.props.actions.setFormValues('name', value)
  }
  
  validateMinDate = (value, endDate) => {
    let dateErrors = ''
    
    if (value === undefined || value === '' || value === null) {
      dateErrors = 'Required'
    } else if (new Date(value).getFullYear() < '1850') {
      dateErrors = 'Minimum year for start date is 1850'
    } else if (new Date(value).getFullYear() > '2050') {
      dateErrors = 'Maximum year for start date is 2050'
    } else if (new Date(value) > new Date(endDate)) {
      dateErrors = 'Start date must but earlier than end date'
    }
    
    return dateErrors
  }
  
  validateMaxDate = (value, startDate) => {
    let dateErrors = ''
    
    if (value === undefined || value === '' || value === null) {
      dateErrors = 'Required'
    } else if (new Date(value).getFullYear() > '2050') {
      dateErrors = 'Maximum year for end date is 2050'
    } else if (new Date(value).getFullYear() < '1850') {
      dateErrors = 'Minimum year for end date is 1850'
    } else if (new Date(startDate) > new Date(value)) {
      dateErrors = 'End date must be later than start date'
    }
    
    return dateErrors
  }
  
  onInputChange = (dateField, event) => {
    this.props.actions.setFormValues(dateField, event.target.value)
    if (moment(event.target.value).format() === 'Invalid date' && event.target.value !== '') {
      this.setState({
        errors: {
          ...this.state.errors,
          [dateField]: 'Invalid date'
        }
      })
    } else {
      this.onChangeDate(dateField, event.target.value)
    }
  }
  
  onChangeDate = (dateField, event) => {
    let endDateErrors, startDateErrors
    //console.log(this.props.jurisdiction)
    if (moment(event).format() === 'Invalid date') {
      this.props.actions.setFormValues(dateField, event)
      if (dateField === 'startDate') {
        startDateErrors = this.validateMinDate('', this.props.form.values.endDate)
        endDateErrors = this.validateMaxDate(this.props.form.values.endDate, '')
      } else {
        endDateErrors = this.validateMaxDate('', this.props.form.values.startDate)
        startDateErrors = this.validateMinDate(this.props.form.values.startDate, '')
      }
    } else {
      this.props.actions.setFormValues(dateField, event)
      if (dateField === 'startDate') {
        startDateErrors = this.validateMinDate(event, this.props.form.values.endDate)
        endDateErrors = this.validateMaxDate(this.props.form.values.endDate, event)
      } else {
        endDateErrors = this.validateMaxDate(event, this.props.form.values.startDate)
        startDateErrors = this.validateMinDate(this.props.form.values.startDate, event)
      }
    }
    this.setState({
      errors: {
        name: this.state.errors.name,
        startDate: startDateErrors,
        endDate: endDateErrors
      }
    }, () => {
      this.checkDupJurisSegment(this.props.jurisdiction) // recheck after date change
    })
    
  }
  /**
   * Check if the mouse click event valid for this component.  if not valid, ignore event
   * @param e
   */
  onMouseDown = e => {
    if (['react-autowhatever-1', 'jurisdiction-form'].includes(e.target.id)) {
      e.preventDefault()
    }
  }
  
  checkDupJurisSegment = (selectedJurisdiction) => {
    let dupJurisdiction
    const jurisdictionSegments = normalize.createArrOfObj(this.props.jurisdictionsById, this.props.visibleJurisdictions)
      .filter(j => j.jurisdictionId === selectedJurisdiction.id)
    
    dupJurisdiction = jurisdictionSegments.some(jurisdiction => {
      return (jurisdiction.jurisdictionId ===
        selectedJurisdiction.id &&
        new Date(jurisdiction.startDate).toLocaleDateString() ===
        new Date(this.props.form.values.startDate).toLocaleDateString() &&
        new Date(jurisdiction.endDate).toLocaleDateString() ===
        new Date(this.props.form.values.endDate).toLocaleDateString())
    })

    if (dupJurisdiction) {
      this.setState({
        errors: {
          ...this.state.errors,
          name: `A jurisdiction for "${selectedJurisdiction.name}" with these start and end dates already exists`
        }
      }, () => {
        // console.log(this.state.errors)
      })
    } else { //reset error
      this.setState({
        errors: {
          ...this.state.errors,
          name: ''
        }
      }, () => {
        //console.log(this.state.errors)
      })
    }
    return dupJurisdiction
  }
  
  render() {
    const formActions = [
      {
        value: 'Cancel',
        onClick: this.onCloseForm,
        type: 'button',
        otherProps: { 'aria-label': 'Close form' },
        preferred: true
      },
      {
        value: this.state.edit
          ? this.getButtonText('Save')
          : this.getButtonText('Add'),
        onClick: this.props.location.state.preset === true
          ? this.onSubmitPreset
          : this.onSubmitForm,
        disabled: this.state.submitting === true || this.props.form.values.name === '',
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    const options = [
      {
        value: 'US States',
        label: 'US States'
      }
    ]
    
    const nameInputField = this.props.location.state.preset === true
      ? <Dropdown
        name="name"
        id="preset-type"
        defaultValue="US States"
        label="Preset Type"
        options={options}
        required
        input={{
          value: this.props.form.values.name,
          onChange: this.onChangeNameField
        }}
        meta={{}}
      />
      : <Autocomplete
        name="name"
        suggestions={this.props.suggestions}
        handleGetSuggestions={this.onJurisdictionsFetchRequest}
        handleClearSuggestions={this.onClearSuggestions}
        InputProps={{
          disabled: this.state.edit,
          label: 'Name',
          placeholder: 'Enter jurisdiction name',
          required: true,
          error: this.state.errors.name.length > 0,
          helperText: this.state.errors.name,
          onBlur: this.validateJurisdiction
        }}
        isSearching={this.props.searching}
        inputProps={{
          value: this.props.form.values.name,
          onChange: this.onSuggestionChange,
          id: 'jurisdiction-name',
          onBlur: this.validateJurisdiction
        }}
        handleSuggestionSelected={this.onJurisdictionSelected}
        renderSuggestion={renderSuggestion}
        getSuggestionValue={getSuggestionValue}
      />
    
    return (
      <Modal
        open={true}
        onClose={this.props.onCloseModal}
        onMouseDown={this.onMouseDown}>
        <ModalTitle
          title={this.state.edit
            ? 'Edit Jurisdiction'
            : this.props.location.state.preset === true
              ? 'Load Preset Jurisdiction List'
              : 'Add Jurisdiction'}
          onCloseForm={this.onCloseForm}
        />
        <Divider />
        <ModalContent id="jurisdiction-form">
          <form>
            <Container
              column
              style={{
                minWidth: 550,
                minHeight: 230,
                padding: '30px 15px'
              }}>
              <Row style={{ paddingBottom: 20 }}>
                {nameInputField}
              </Row>
              <Container style={{ marginTop: 30 }}>
                <Column flex>
                  <DatePicker
                    required
                    name="startDate"
                    label="Segment Start Date"
                    dateFormat="MM/DD/YYYY"
                    minDate="01/01/1850"
                    maxDate="12/31/2050"
                    onChange={(e) => this.onChangeDate('startDate', e)}
                    value={this.props.form.values.startDate}
                    autoOk={true}
                    error={this.state.errors.startDate}
                    onInputChange={(e) => this.onInputChange('startDate', e)}
                  />
                </Column>
                <Column>
                  <DatePicker
                    required
                    name="endDate"
                    label="Segment End Date"
                    dateFormat="MM/DD/YYYY"
                    minDate="01/01/1850"
                    maxDate="12/31/2050"
                    value={this.props.form.values.endDate}
                    onChange={(e) => this.onChangeDate('endDate', e)}
                    autoOk={true}
                    error={this.state.errors.endDate}
                    onInputChange={(e) => this.onInputChange('endDate', e)}
                  />
                </Column>
              </Container>
            </Container>
          </form>
        </ModalContent>
        <button style={{ display: 'none' }} type="submit" onClick={event => event.preventDefault()} />
        <ModalActions actions={formActions} />
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  project: state.data.projects.byId[ownProps.match.params.id],
  suggestions: state.scenes.home.addEditJurisdictions.suggestions || [],
  suggestionValue: state.scenes.home.addEditJurisdictions.suggestionValue || '',
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdiction || {},
  jurisdictions: normalize.mapArray(Object.values(state.scenes.home.addEditJurisdictions.jurisdictions.byId), 'name') ||
    [],
  formError: state.scenes.home.addEditJurisdictions.formError || null,
  goBack: state.scenes.home.addEditJurisdictions.goBack || false,
  form: state.scenes.home.addEditJurisdictions.form || {},
  isReduxForm: false,
  searching: state.scenes.home.addEditJurisdictions.searching,
  jurisdictionsById: state.scenes.home.addEditJurisdictions.jurisdictions.byId || [],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || []
})

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(JurisdictionForm)))
