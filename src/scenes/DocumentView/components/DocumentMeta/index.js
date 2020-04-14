import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FileDocument, CalendarRange, Account, FormatSection, FileUpload } from 'mdi-material-ui'
import actions from 'scenes/DocumentView/actions'
import ProJurSearch from './components/ProJurSearch'
import { convertToLocalDate } from 'utils/normalize'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import {
  Button,
  FlexGrid,
  Dropdown,
  DatePicker,
  IconButton,
  Alert,
  CircularLoader,
  ApiErrorAlert,
  withAutocompleteMethods
} from 'components'

export class DocumentMeta extends Component {
  static propTypes = {
    actions: PropTypes.object,
    document: PropTypes.object,
    projectList: PropTypes.array,
    jurisdictionList: PropTypes.array,
    inEditMode: PropTypes.bool,
    documentUpdateInProgress: PropTypes.bool,
    documentDeleteInProgress: PropTypes.bool,
    documentDeleteError: PropTypes.any,
    goBack: PropTypes.func,
    apiErrorOpen: PropTypes.bool,
    apiErrorInfo: PropTypes.shape({ title: PropTypes.string, text: PropTypes.string }),
    id: PropTypes.string,
    /**
     * Current user role
     */
    userRole: PropTypes.oneOf(['Admin', 'Coordinator', 'Coder']),
    /**
     * Whether or not the app is searching projects
     */
    searchingProjects: PropTypes.bool,
    /**
     * Whether or not the app is searching jurisdictions
     */
    searchingJurisdictions: PropTypes.bool,
    /**
     * current user
     */
    currentUser: PropTypes.object,
    projectAutocompleteProps: PropTypes.object,
    projectAutoActions: PropTypes.object,
    jurisdictionAutocompleteProps: PropTypes.object,
    jurisdictionAutoActions: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      showModal: false,
      typeToDelete: '',
      projectToDelete: {},
      jurisdictionToDelete: {},
      hoveringOn: '',
      hoverIndex: null,
      alertOpen: false,
      alertInfo: {
        title: '',
        text: ''
      },
      alertType: '',
      searchType: ''
    }
  }
  
  componentDidUpdate(prevProps) {
    const { documentDeleteInProgress, documentDeleteError, apiErrorOpen, documentUpdateInProgress, goBack } = this.props
    
    if (prevProps.documentDeleteInProgress && !documentDeleteInProgress) {
      if (!documentDeleteError) {
        goBack()
      }
    }
    
    if (prevProps.documentUpdateInProgress && !documentUpdateInProgress) {
      if (!apiErrorOpen) {
        this.handleCloseProJurModal()
      }
    }
  }
  
  /**
   * Shows the modal for adding a project or jurisdiction
   */
  showProJurSearch = searchType => {
    this.setState({ searchType, showModal: true })
  }
  
  /**
   * Handles change to the document status drop down
   * @param selectedOption
   */
  onChangeStatusField = selectedOption => {
    this.props.actions.updateDocumentProperty('status', selectedOption)
  }
  
  /**
   * Enables editing for the document metadata
   */
  handleEdit = () => {
    this.props.actions.editDocument()
  }
  
  /**
   * Handles when an update has been made to the document metadata
   */
  handleUpdate = () => {
    this.props.actions.updateDocRequest(null, null)
  }
  
  /**
   * Closes an alert on the page
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Handles when a user has updated a document property
   * @param propName
   * @param value
   */
  handleDocPropertyChange = (propName, value) => {
    this.props.actions.updateDocumentProperty(propName, value)
  }
  
  /**
   * Opens a confirmation alert asking the user to confirm deletion of a project or jurisdiction
   * @param type
   * @param index
   */
  handleShowDeleteConfirm = (type, index) => {
    const list = this.props[`${type}List`]
    
    this.setState({
      typeToDelete: type,
      [`${type}ToDelete`]: list[index],
      alertOpen: true,
      alertInfo: {
        title: `Delete ${capitalizeFirstLetter(type)}`,
        text: `Do you want to delete ${type}: ${list[index].name} from this document?`
      },
      alertType: 'delete'
    })
  }
  
  /**
   * Opens a confirmation alert asking the user to confirm deletion of document
   * @param type
   * @param id
   */
  handleShowDocDeleteConfirm = (type, id) => {
    this.setState({
      typeToDelete: type,
      [`${type}ToDelete`]: id,
      alertOpen: true,
      alertInfo: {
        title: 'Warning',
        text: `Do you want to delete ${this.props.document.name}? Deleting a document will remove all associated annotations for every project and jurisdiction.`
      },
      alertType: 'delete'
    })
  }
  
  /**
   * Closes the modal for autocomplete for adding project or jurisdiction
   */
  handleCloseProJurModal = () => {
    const {
      projectAutocompleteProps, projectAutoActions, jurisdictionAutoActions, jurisdictionAutocompleteProps
    } = this.props
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    
    if (selectedJurisdiction !== null) {
      jurisdictionAutoActions.clearSuggestions()
      jurisdictionAutoActions.clearAll()
    }
    
    if (selectedProject !== null) {
      projectAutoActions.clearSuggestions()
      projectAutoActions.clearAll()
    }
    
    this.setState({
      showModal: false,
      searchType: ''
    })
  }
  
  /**
   * When the user chooses a project or jurisdiction to add to a document
   */
  addProJur = () => {
    const { projectAutocompleteProps, jurisdictionAutocompleteProps, actions } = this.props
    const { searchType } = this.state
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    
    const selected = searchType === 'project' ? selectedProject : selectedJurisdiction
    const error = !selected
    
    if (error) {
      this.setState({
        alertOpen: true,
        alertInfo: {
          title: `Invalid ${capitalizeFirstLetter(searchType)}`,
          text: `You must select a ${searchType} from the drop-down list`
        },
        alertType: 'projur'
      })
    } else {
      actions.addProJur(`${searchType}s`, selected, 'add')
      actions.updateDocRequest(`${searchType}s`, selected, 'add')
    }
  }
  
  /**
   * Handles when the user cancels out of deleting a jurisdiction or project
   */
  onCancelDelete = () => {
    const { typeToDelete } = this.state
    
    this.setState({
      alertOpen: false,
      alertInfo: {},
      typeToDelete: '',
      [`${typeToDelete}ToDelete`]: {},
      alertType: ''
    })
  }
  
  /**
   * Handles when the user cancels out of deleting a jurisdiction or project
   */
  onCancelUpdateProJur = () => {
    this.setState({
      alertOpen: false,
      alertInfo: {},
      alertType: ''
    })
  }
  
  /**
   * User continues with deletion in the confirmation modal
   */
  onContinueDelete = () => {
    const { typeToDelete } = this.state
    const { actions, document } = this.props
    
    if (typeToDelete === 'document') {
      actions.deleteDocRequest(document._id)
    } else {
      actions.deleteProJur(`${typeToDelete}s`, this.state[`${typeToDelete}ToDelete`])
      actions.updateDocRequest(
        `${typeToDelete}s`,
        this.state[`${typeToDelete}ToDelete`],
        'delete'
      )
    }
    this.onCancelDelete()
  }
  
  /**
   * Handles when a user hovers over a row in the jurisdiction or project card info
   * @param card
   * @param index
   */
  onToggleHover = (card, index) => () => {
    this.setState({
      hoveringOn: card,
      hoverIndex: index
    })
  }
  
  /**
   * Determines the text for the modal button at the bottom
   * @param text
   */
  getButtonText = text => {
    return (
      <>
        <span style={{ marginRight: 5 }}>{text}</span>
        {this.props.documentUpdateInProgress && <CircularLoader size={15} thickness={5} />}
      </>
    )
  }
  
  /**
   * Check if the mouse click event valid for this component
   * @param e
   */
  onMouseDown = e => {
    if (e.target.id === 'react-autowhatever-1') {
      e.preventDefault()
    }
  }
  
  /**
   * Gets button info for add project / jurisdiction
   * @returns {{inProgress: DocumentMeta.props.documentUpdateInProgress, disabled: boolean}}
   */
  getButtonInfo = () => {
    const { searchType } = this.state
    const { projectAutocompleteProps, jurisdictionAutocompleteProps, documentUpdateInProgress } = this.props
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    const selected = searchType === 'project' ? selectedProject : selectedJurisdiction
    
    let info = {
      disabled: Object.keys(selected).length === 0 || documentUpdateInProgress,
      inProgress: documentUpdateInProgress
    }
    
    return info
  }
  
  render() {
    const {
      apiErrorInfo, apiErrorOpen, inEditMode, document, projectList, jurisdictionList, userRole,
      projectAutocompleteProps, jurisdictionAutocompleteProps
    } = this.props
    
    const { alertOpen, alertInfo, hoveringOn, hoverIndex, showModal, alertType, searchType } = this.state
  
    const autocompleteProps = searchType.includes('project')
      ? projectAutocompleteProps
      : jurisdictionAutocompleteProps
    
    const options = [
      { value: 'Draft', label: 'Draft' },
      { value: 'Approved', label: 'Approved' }
    ]
    
    const alertActions = [
      {
        value: 'Delete',
        type: 'button',
        onClick: this.onContinueDelete
      }
    ]
    
    const projurActions = [
      {
        value: 'Dismiss',
        type: 'button',
        onClick: this.onCancelUpdateProJur
      }
    ]
    
    const metaStyling = { fontSize: '.8125rem', padding: '0 5px' }
    const iconStyle = { color: '#757575', fontSize: 18 }
    const colStyle = { fontSize: 14, border: 'none', borderBottom: '1px solid green' }
    
    return (
      <>
        <ApiErrorAlert open={apiErrorOpen} content={apiErrorInfo.text} onCloseAlert={this.closeAlert} />
        <Alert
          open={alertOpen && alertType === 'delete'}
          actions={alertActions}
          title={alertInfo.title}
          onCloseAlert={this.onCancelDelete}>
          <Typography variant="body1">
            {alertInfo.text}
          </Typography>
        </Alert>
        <Alert
          open={alertOpen && alertType === 'projur'}
          hideClose
          actions={projurActions}
          title={alertInfo.title}
          onCloseAlert={this.onCancelUpdateProJur}>
          <Typography variant="body1">
            {alertInfo.text}
          </Typography>
        </Alert>
        <FlexGrid raised container style={{ overflow: 'hidden', minWidth: '30%', marginBottom: 25, height: '40%' }}>
          <Typography variant="body2" style={{ padding: 10, color: 'black' }}>
            Document Information
          </Typography>
          <Divider />
          <FlexGrid container flex padding={10} style={{ overflow: 'auto' }}>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FileDocument style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>Status:</Typography>
              <Dropdown
                disabled={!inEditMode}
                name="selecteDocStatus"
                id="selectedDocStatus"
                options={options}
                input={{
                  value: document.status || 'Draft',
                  onChange: this.onChangeStatusField
                }}
                fullWidth
                SelectDisplayProps={{ style: { paddingBottom: 3 } }}
                style={{ fontSize: 13 }}
                formControlStyle={{ minWidth: 180 }}
              />
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FormatSection style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Citation:
              </Typography>
              {inEditMode
                ? (<input
                  style={colStyle}
                  defaultValue={document.citation}
                  onChange={e => this.handleDocPropertyChange('citation', e.target.value)}
                />)
                : <Typography style={metaStyling}>{document.citation}</Typography>}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <CalendarRange style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Effective Date:
              </Typography>
              {inEditMode
                ? (<DatePicker
                  name="effectiveDate"
                  dateFormat="MM/DD/YYYY"
                  onChange={date => this.handleDocPropertyChange('effectiveDate', date.toISOString())}
                  value={document.effectiveDate}
                  autoOk={true}
                  InputAdornmentProps={{
                    disableTypography: true,
                    style: {
                      height: 19,
                      width: 19,
                      margin: 0,
                      marginRight: 15,
                      fontSize: 18,
                      alignItems: 'flex-end',
                      marginBottom: -8
                    }
                  }}
                  style={{ marginTop: 0 }}
                  inputProps={{ style: { fontSize: 13, padding: 0 } }}
                />)
                : (
                  <Typography>
                    {!document.effectiveDate
                      ? ''
                      : convertToLocalDate(document.effectiveDate.split('T')[0])}
                  </Typography>
                )}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <Account style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                {document.uploadedByName}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FileUpload style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Upload Date: {convertToLocalDate(document.uploadedDate)}
              </Typography>
            </FlexGrid>
            <FlexGrid
              container
              type="row"
              flex
              align="flex-end"
              justify={userRole === 'Admin' ? 'space-between' : 'flex-end'}
              style={{ minHeight: 30 }}>
              {userRole === 'Admin' && <Button
                value="Delete Document"
                raised={false}
                color="accent"
                style={{ paddingLeft: 0, textTransform: 'none', backgroundColor: 'transparent' }}
                aria-label="Delete the current document"
                onClick={() => this.handleShowDocDeleteConfirm('document', document._id)}
              />}
              <Button
                value={inEditMode
                  ? 'Update'
                  : 'Edit'}
                size="small"
                color="accent"
                style={{ padding: '0 15px' }}
                onClick={inEditMode ? this.handleUpdate : this.handleEdit}
              />
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
        <FlexGrid
          raised
          container
          flex
          style={{ overflow: 'hidden', minWidth: '30%', height: '30%', marginBottom: 20 }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10} style={{ minHeight: 32 }}>
            <Typography variant="body2" style={{ color: 'black' }}>
              Projects
            </Typography>
            <Button
              onClick={() => this.showProJurSearch('project')}
              value="Add"
              size="small"
              style={{ backgroundColor: 'white', color: 'black' }}
              aria-label="Add jurisdiction to document"
            />
          </FlexGrid>
          <Divider />
          <FlexGrid type="row" padding={5} style={{ overflow: 'auto' }}>
            {projectList.map((item, index) => {
              return (
                <FlexGrid
                  onMouseEnter={this.onToggleHover('project', index)}
                  onMouseLeave={this.onToggleHover('', null)}
                  container
                  type="row"
                  justify="space-between"
                  align="center"
                  key={`project-${index}`}
                  style={{
                    padding: 8,
                    backgroundColor: index % 2 === 0
                      ? '#f9f9f9'
                      : 'white',
                    minHeight: 24
                  }}>
                  <Typography style={{ fontSize: '.8125rem' }}>{item.name}</Typography>
                  {(hoveringOn === 'project' && hoverIndex === index) &&
                  <IconButton color="#757575" onClick={() => this.handleShowDeleteConfirm('project', index)}>
                    delete
                  </IconButton>}
                </FlexGrid>
              )
            })}
          </FlexGrid>
        </FlexGrid>
        <FlexGrid raised container flex style={{ overflow: 'hidden', minWidth: '30%', height: '30%' }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10} style={{ minHeight: 32 }}>
            <Typography variant="body2" style={{ color: 'black' }}>
            Jurisdictions
            </Typography>
            <Button
              onClick={() => this.showProJurSearch('jurisdiction')}
              value="Add"
              size="small"
              style={{ backgroundColor: 'white', color: 'black' }}
              aria-label="Add jurisdiction to document"
            />
          </FlexGrid>
          <Divider />
          <FlexGrid flex padding={5} style={{ overflow: 'auto' }}>
            {jurisdictionList.map((item, index) => (
              <FlexGrid
                onMouseEnter={this.onToggleHover('jurisdiction', index)}
                onMouseLeave={this.onToggleHover('', null)}
                container
                type="row"
                justify="space-between"
                align="center"
                key={`jurisdiction-${index}`}
                style={{
                  padding: 8,
                  backgroundColor: index % 2 === 0
                    ? '#f9f9f9'
                    : 'white',
                  minHeight: 24
                }}>
                <Typography style={{ fontSize: '.8125rem' }}>{item.name}</Typography>
                {(hoveringOn === 'jurisdiction' && hoverIndex === index) &&
                <IconButton color="#757575" onClick={() => this.handleShowDeleteConfirm('jurisdiction', index)}>
                  delete
                </IconButton>}
              </FlexGrid>))}
          </FlexGrid>
          <ProJurSearch
            autocompleteProps={autocompleteProps}
            onMouseDown={this.onMouseDown}
            searchType={searchType}
            open={showModal}
            onCloseModal={this.handleCloseProJurModal}
            onConfirmAction={this.addProJur}
            buttonInfo={this.getButtonInfo()}
          />
        </FlexGrid>
      </>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docState = state.scenes.docView
  
  const document = docState.meta.inEditMode
    ? docState.meta.documentForm
    : docState.meta.document || { jurisdictions: [], projects: [], status: 1, effectiveDate: '' }
  
  return {
    document,
    projectList: document.projects.map(proj => {
      return state.data.projects.byId[proj] === undefined
        ? ''
        : { name: state.data.projects.byId[proj].name, id: proj }
    }),
    jurisdictionList: document.jurisdictions.map(jur => {
      return state.data.jurisdictions.byId[jur] === undefined
        ? ''
        : { name: state.data.jurisdictions.byId[jur].name, id: jur }
    }),
    inEditMode: docState.meta.inEditMode,
    apiErrorInfo: docState.meta.apiErrorInfo,
    apiErrorOpen: docState.meta.apiErrorOpen || false,
    documentUpdateInProgress: docState.meta.documentUpdateInProgress || false,
    userRole: state.data.user.currentUser.role,
    currentUser: state.data.user.currentUser
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withAutocompleteMethods('project', 'meta')(
    withAutocompleteMethods('jurisdiction', 'meta', {}, false)(
      DocumentMeta
    )
  )
)
