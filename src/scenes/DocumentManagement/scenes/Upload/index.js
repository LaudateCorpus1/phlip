import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Divider from '@material-ui/core/Divider/Divider'
import Typography from '@material-ui/core/Typography'
import actions from './actions'
import { Alert, withFormAlert, CircularLoader, FlexGrid, FileUpload, Button, withAutocompleteMethods } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import { Download } from 'mdi-material-ui'
import FileList from './components/FileList'
import ProJurSearch from './components/ProJurSearch'
import LinearProgress from '@material-ui/core/LinearProgress'

/**
 * Upload documents modal component. In this modal the user can upload documents to the document management system
 */
export class Upload extends Component {
  static propTypes = {
    /**
     * Documents that the user has selected from the file selecter input modal
     */
    selectedDocs: PropTypes.array,
    /**
     * Any error that happened during a request, opens an alert with error
     */
    requestError: PropTypes.string,
    /**
     * If the uploading request is in progress
     */
    uploading: PropTypes.bool,
    /**
     * Alert information
     */
    alert: PropTypes.shape({
      open: PropTypes.bool,
      text: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.oneOf(['basic', 'files'])
    }),
    /**
     * Whoever is currently logged in
     */
    user: PropTypes.object,
    /**
     * Whether or not this form is using redux-form, needed for the withFormAlert HOC
     */
    isReduxForm: PropTypes.bool,
    /**
     * max number of files to be upload at one time
     */
    maxFileCount: PropTypes.number,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * From withFormAlert HOC
     */
    onSubmitError: PropTypes.func,
    /**
     * Whether or not to close the modal and go back
     */
    goBack: PropTypes.bool,
    /**
     * Whether or not extracting info in progress
     */
    infoRequestInProgress: PropTypes.bool,
    /**
     * Browser history
     */
    history: PropTypes.object,
    /**
     * Whether or not an excel sheet has been selected
     */
    infoSheetSelected: PropTypes.bool,
    /**
     * Props to pass to the autocomplete search for project
     */
    projectAutocompleteProps: PropTypes.object,
    /**
     * actions for the project autocomplete field
     */
    projectAutoActions: PropTypes.object,
    /**
     * Props to pass to the autocomplete search for jurisdiction
     */
    jurisdictionAutocompleteProps: PropTypes.object,
    /**
     * actions for the jurisdiction autocomplete field
     */
    jurisdictionAutoActions: PropTypes.object,
    /**
     * Null or true if the no project error should be shown
     */
    noProjectError: PropTypes.any,
    /**
     * Actual excel file data if any
     */
    infoSheet: PropTypes.object,
    /**
     * List of invalid files the user tried to upload
     */
    invalidFiles: PropTypes.array,
    /**
     * Progress for uploading
     */
    uploadProgress: PropTypes.object,
    /**
     * Whether the jurisdiction search at the top should be visible
     */
    showJurSearch: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      alertActions: [],
      closeButton: {}
    }
  }
  
  componentDidMount() {
    this.prevTitle = document.title
    document.title = 'PHLIP - Upload Documents'
  }
  
  componentDidUpdate(prevProps) {
    const { infoRequestInProgress, requestError, onSubmitError } = this.props
    
    if (prevProps.infoRequestInProgress && !infoRequestInProgress) {
      if (requestError !== null) {
        onSubmitError(requestError)
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
  }
  
  /**
   * Resets the alert actions and calls redux action to close alert
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
    this.setState({ alertActions: [], closeButton: {} })
  }
  
  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    const { selectedDocs, actions } = this.props
    
    if (selectedDocs.length > 0) {
      this.setState(
        {
          alertActions: [
            {
              value: 'Continue',
              type: 'button',
              otherProps: { 'aria-label': 'Continue', 'id': 'uploadCloseContBtn' },
              onClick: this.goBack
            }
          ],
          closeButton: { value: 'Cancel' }
        },
        () => actions.openAlert(
          'Your unsaved changes will be lost. Do you want to continue?',
          'Warning',
          'basic'
        )
      )
    } else {
      this.goBack()
    }
  }
  
  /**
   * Closes modal and goes back to main doc list
   */
  goBack = () => {
    const { history, actions, jurisdictionAutoActions, projectAutoActions } = this.props
    
    history.push('/docs')
    projectAutoActions.clearAll()
    jurisdictionAutoActions.clearAll()
    actions.clearSelectedFiles()
    actions.closeAlert()
  }
  
  /**
   * Handles when the user chooses an excel file
   * @param excel
   */
  addExcel = excel => {
    const { actions } = this.props
    
    if (excel) {
      const formData = new FormData()
      formData.append('file', excel, excel.name)
      actions.extractInfoRequest(formData, excel)
    }
  }
  
  /**
   * Adds selected files to redux, sends a request to verify the documents can be uploaded
   */
  addFilesToList = fileItems => {
    const { selectedDocs, maxFileCount, actions, infoSheetSelected } = this.props
    
    if (fileItems.length + selectedDocs.length > maxFileCount) {
      actions.openAlert(
        `The number of files selected for upload has exceeds the limit of ${maxFileCount} files per upload. Please consider uploading files in smaller batches.`,
        'Maximum Number of Files Exceeded',
        'basic'
      )
    } else {
      let files = []
      fileItems.map(i => {
        files.push({
          name: i.name,
          lastModifiedDate: i.lastModifiedDate,
          tags: [],
          file: i,
          effectiveDate: '',
          citation: '',
          jurisdictions: { searchValue: '', suggestions: [], name: '' }
        })
      })
      
      if (infoSheetSelected) {
        actions.setInfoRequestProgress()
        actions.mergeInfoWithDocs(files)
      } else {
        actions.addSelectedDocs(files)
      }
    }
  }
  
  /**
   * Creates an object with all of the files to send to redux
   */
  onUploadFiles = () => {
    const { selectedDocs, projectAutocompleteProps, jurisdictionAutocompleteProps, actions } = this.props
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    
    let md = {}, sd = []
    
    selectedDocs.map(doc => {
      md[doc.name.value] = Object.keys(doc).reduce((obj, prop) => {
        return {
          ...obj,
          [prop]: doc[prop].value
        }
      }, {})
      
      md[doc.name.value].jurisdictions = doc.jurisdictions.value.id
        ? [doc.jurisdictions.value.id]
        : [selectedJurisdiction.id]
      
      md[doc.name.value].projects = [selectedProject.id]
      sd = [...sd, md[doc.name.value]]
    })
    
    actions.uploadDocumentsStart(sd, selectedProject, selectedJurisdiction)
  }
  
  /**
   * Handles when a user has updated a document property in the file list
   * @param index
   * @param propName
   * @param value
   */
  handleDocPropertyChange = (index, propName, value) => {
    this.props.actions.updateDocumentProperty(index, propName, value)
  }
  
  /**
   * Gets jurisdiction suggestions for a specific row
   * @param searchString
   * @param index
   */
  handleGetRowSuggestions = ({ value: searchString }, index) => {
    const { jurisdictionAutoActions } = this.props
    jurisdictionAutoActions.searchForSuggestionsRequest(searchString, '_UPLOAD', index)
  }
  
  /**
   * Handles enabled or disabling edit mode on a row in the file list
   * @param index
   * @param property
   */
  handleToggleEditMode = (index, property) => {
    this.props.actions.toggleRowEditMode(index, property)
  }
  
  /**
   * Handles when a user wants to remove a document from the file list
   * @param index
   */
  removeDoc = index => {
    this.props.actions.removeDoc(index)
  }
  
  /**
   * Determines the text for the modal button at the bottom
   * @param text
   */
  getButtonText = text => {
    const { uploading } = this.props
    return (
      <>
        {text}
        {uploading && <CircularLoader size={15} thickness={5} style={{ marginLeft: 5 }} />}
      </>
    )
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
  
  /**
   * Handles closing the upload progress alert
   */
  closeUploadingAlert = () => {
    const { uploadProgress, actions } = this.props
    
    if (uploadProgress.failures > 0) {
      actions.acknowledgeUploadFailures()
    } else {
      this.goBack()
    }
  }
  
  render() {
    const {
      selectedDocs, uploading, actions, invalidFiles, alert, infoSheet, noProjectError, infoSheetSelected,
      uploadProgress, infoRequestInProgress, projectAutocompleteProps, jurisdictionAutocompleteProps, showJurSearch
    } = this.props
    
    const { alertActions, closeButton } = this.state
    
    const modalCloseButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal', 'id': 'uploadCloseBtn' },
      onClick: this.onCloseModal
    }
    
    const modalActions = selectedDocs.length > 0
      ? [
        modalCloseButton,
        {
          value: this.getButtonText('Upload'),
          type: 'button',
          otherProps: { 'aria-label': 'Upload', 'id': 'uploadFilesBtn' },
          onClick: this.onUploadFiles,
          disabled: uploading
        }
      ]
      : [modalCloseButton]
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="lg" hideOverflow>
        {alert.open &&
        <Alert
          actions={alertActions}
          onCloseAlert={this.closeAlert}
          closeButton={{ value: 'Dismiss', ...closeButton }}
          open={alert.open}
          title={alert.title}
          id="uploadAlert">
          <Typography variant="body1">{alert.text}</Typography>
        </Alert>}
        
        {(uploading || infoRequestInProgress) &&
        <Alert
          open={(uploading || infoRequestInProgress)}
          hideClose={uploadProgress.percentage < 100}
          onCloseAlert={this.closeUploadingAlert}
          title={infoRequestInProgress
            ? 'Processing...'
            : uploadProgress.percentage === 100 ? uploadProgress.failures > 0
              ? 'Error'
              : 'Success' : 'Uploading...'}
          closeButton={{ value: 'Dismiss' }}>
          <FlexGrid container style={{ width: 550 }}>
            {!uploading && <FlexGrid container align="center">
              <Typography variant="body1" style={{ paddingBottom: 30 }}>
                {'Processing document... This could take a couple of minutes...'}
              </Typography>
              <CircularLoader size={40} type="indeterminate" />
            </FlexGrid>}
            {uploading && <FlexGrid container style={{ paddingBottom: 30 }}>
              <Typography
                variant="body1"
                style={{
                  paddingBottom: uploadProgress.percentage === 100 && uploadProgress.failures > 0
                    ? 15
                    : 3
                }}>
                {uploadProgress.percentage === 100
                  ? uploadProgress.failures === 0
                    ? 'All documents successfully uploaded!'
                    : 'Some of the documents failed to upload. They are still present in the list if you wish to retry.'
                  : `Uploading document: ${uploadProgress.index + 1}`
                }
              </Typography>
              <Typography
                variant="body1"
                style={{ paddingBottom: 3 }}>{`Total document count: ${uploadProgress.total}`}</Typography>
              <Typography variant="body1" style={{ paddingBottom: 30 }}>
                {uploadProgress.failures > 0 && `Errors: ${uploadProgress.failures}`}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress.percentage}
                style={{ width: '100%', borderRadius: 6, height: 8 }}
              />
            </FlexGrid>}
          </FlexGrid>
        </Alert>}
        <FlexGrid container type="row" align="center">
          <FlexGrid flex>
            <ModalTitle
              title="Upload Documents"
              buttons={
                selectedDocs.length > 0 &&
                <ProJurSearch
                  jurisdictionAutocompleteProps={jurisdictionAutocompleteProps}
                  projectAutocompleteProps={projectAutocompleteProps}
                  showProjectError={noProjectError === true}
                  showJurSearch={showJurSearch}
                  onMouseDown={this.onMouseDown}
                />}
            />
          </FlexGrid>
          <FlexGrid padding="0 24px 0 0">
            <Button color="white" style={{ color: 'black' }} href="/PHLIP-Upload-Template.xlsx" download>
              <Download style={{ fontSize: 18, marginRight: 10 }} /> Excel Template
            </Button>
          </FlexGrid>
        </FlexGrid>
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10}>
            <FileUpload
              handleAddFiles={this.addFilesToList}
              allowedFileTypes=".doc,.docx,.pdf,.rtf,.odt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              allowMultiple
              numOfFiles={selectedDocs.length}
              overwriteAlert={{ enable: false }}
              allowedExtensions={['doc', 'docx', 'pdf', 'rtf', 'odt']}
            />
            <FlexGrid padding={10} />
            <FileUpload
              handleAddFiles={this.addExcel}
              infoSheetSelected={infoSheetSelected}
              buttonText="Select excel file"
              containerBgColor="#f4f9ef"
              containerBorderColor="#c2e3b6"
              allowedFileTypes="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              containerText={infoSheetSelected
                ? `Selected file: ${infoSheet.name}`
                : 'or drag and drop here'}
              allowFolderDrop={false}
              numOfFiles={infoSheetSelected ? 1 : 0}
              allowedExtensions={['xlsx']}
              overwriteAlert={{
                enable: true,
                text: 'Selecting a new Excel file will erase existing information. Do you want to continue?'
              }}
            />
          </FlexGrid>
          {selectedDocs.length > 0 &&
          <FileList
            selectedDocs={selectedDocs}
            handleDocPropertyChange={this.handleDocPropertyChange}
            handleRemoveDoc={this.removeDoc}
            onGetSuggestions={this.handleGetRowSuggestions}
            toggleRowEditMode={this.handleToggleEditMode}
            onClearSuggestions={actions.clearRowJurisdictionSuggestions}
            invalidFiles={invalidFiles}
            jurisdictionAutocompleteProps={jurisdictionAutocompleteProps}
          />}
        </ModalContent>
        <Divider />
        <FlexGrid container type="row" align="center" justify="space-between" padding="0 0 0 20px">
          <Typography style={{ fontSize: '0.875rem' }}>
            File Count: {selectedDocs.length}
          </Typography>
          <ModalActions actions={modalActions} />
        </FlexGrid>
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const uploadState = state.scenes.docManage.upload
  return {
    selectedDocs: uploadState.list.selectedDocs,
    requestError: uploadState.list.requestError,
    uploading: uploadState.list.uploading,
    verifying: uploadState.list.verifying,
    alert: uploadState.list.alert,
    invalidFiles: uploadState.list.invalidFiles,
    goBack: uploadState.list.goBack,
    noProjectError: uploadState.list.noProjectError,
    isReduxForm: false,
    user: state.data.user.currentUser,
    infoRequestInProgress: uploadState.list.infoRequestInProgress,
    infoSheet: uploadState.list.infoSheet,
    infoSheetSelected: uploadState.list.infoSheetSelected,
    maxFileCount: uploadState.maxFileCount || 20,
    uploadProgress: uploadState.list.uploadProgress,
    showJurSearch: uploadState.list.showJurSearch
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    resetFormError: bindActionCreators(actions.closeAlert, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withAutocompleteMethods('project', 'upload')(
    withAutocompleteMethods('jurisdiction', 'upload', {}, false)(
      withFormAlert(Upload)
    )
  )
)
