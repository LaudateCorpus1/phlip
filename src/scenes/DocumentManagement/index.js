import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import { FlexGrid, ApiErrorAlert, PageLoader, ApiErrorView, PageHeader, withAutocompleteMethods } from 'components'
import actions from './actions'
import { projectAutocomplete as searchProjectAutocomplete } from './components/SearchBox/actions'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
import { checkIfMultiWord } from 'utils/commonHelpers'
import Upload from './scenes/Upload'
import BulkModal from './components/BulkModal'

/**
 * DocumentManagement main scene component. This is the first view the user sees when they switch over to the
 * document management global menu item
 */
export class DocumentManagement extends Component {
  static propTypes = {
    /**
     * An array of document Ids
     */
    documents: PropTypes.array,
    /**
     * Total number of documents
     */
    docCount: PropTypes.number,
    /**
     * Currently selected number of rows to show per page
     */
    rowsPerPage: PropTypes.string,
    /**
     * Current page in table
     */
    page: PropTypes.number,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * Whether or not the checkbox table header has been clicked, selecting all files
     */
    allSelected: PropTypes.bool,
    /**
     * List of selected documents
     */
    checkedDocs: PropTypes.array,
    /**
     * Number of selected documents
     */
    checkedCount: PropTypes.number,
    /**
     * Whether or not a bulk api action is in progress
     */
    bulkOperationInProgress: PropTypes.bool,
    /**
     * Whether or not api error is open
     */
    apiErrorOpen: PropTypes.bool,
    /**
     * Content to show in the api error alert
     */
    apiErrorInfo: PropTypes.object,
    /**
     * Current field by which to sort the table
     */
    sortBy: PropTypes.string,
    /**
     * Direction asc or desc the list is currently sorted
     */
    sortDirection: PropTypes.string,
    /**
     * Whether retrieving the documents request is in progress
     */
    getDocumentsInProgress: PropTypes.bool,
    /**
     * Browser location object
     */
    location: PropTypes.object,
    /**
     * Whether there is an error we need to show as a page error
     */
    pageError: PropTypes.string,
    /**
     * Current user role
     */
    userRole: PropTypes.oneOf(['Admin', 'Coordinator', 'Coder']),
    /**
     * current user
     */
    currentUser: PropTypes.object,
    projectAutocompleteProps: PropTypes.object,
    projectAutoActions: PropTypes.object,
    jurisdictionAutocompleteProps: PropTypes.object,
    jurisdictionAutoActions: PropTypes.object,
    showAll: PropTypes.bool,
    checkedDocsOwner: PropTypes.array
  }
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      showModal: false,
      bulkActionType: ''
    }
  }
  
  componentDidMount() {
    document.title = 'PHLIP - Document List'
    this.props.actions.getDocumentsRequest()
  }
  
  componentDidUpdate(prevProps) {
    const { getDocumentsInProgress, location, actions, bulkOperationInProgress, apiErrorOpen } = this.props
    
    if (prevProps.getDocumentsInProgress && !getDocumentsInProgress) {
      if (location.state !== undefined) {
        if (location.state.projectDefined) {
          let name = location.state.project.name
          if (checkIfMultiWord(name)) {
            name = `(${name})`
          }
          actions.handleSearchValueChange(`project:${name}`, {
            project: location.state.project,
            jurisdiction: {}
          })
          actions.handleFormValueChange('project', location.state.project)
          actions.searchProjectAutocomplete.onSuggestionSelected(location.state.project)
        }
      }
    }
    
    if (prevProps.bulkOperationInProgress && !bulkOperationInProgress) {
      if (!apiErrorOpen) {
        this.onCloseModal()
      }
    }
  }
  
  /*
   * opens bulk action modal
   */
  handleBulkAction = actionType => {
    const { projectAutoActions, jurisdictionAutoActions } = this.props
    jurisdictionAutoActions.clearAll()
    projectAutoActions.clearAll()
    
    if (actionType !== 'bulk') {
      this.setState({ showModal: true, bulkActionType: actionType })
    }
  }
  
  /**
   * Alert to confirm bulk update / delete / approve of documents
   */
  handleBulkConfirm = () => {
    const { bulkActionType } = this.state
    const { actions, checkedDocs, projectAutocompleteProps, jurisdictionAutocompleteProps } = this.props
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    
    switch (bulkActionType) {
      case 'delete':
        actions.handleBulkDelete(checkedDocs)
        break
      case 'removeproject':
        let projectMeta = {
          id: selectedProject.id
        }
        actions.handleBulkProjectRemove(projectMeta, checkedDocs)
        break
      default:
        let updateData = {}
        if (bulkActionType === 'approve') {
          updateData = {
            updateType: 'status'
          }
        } else {
          updateData = {
            updateType: `${bulkActionType}s`,
            updateProJur: bulkActionType === 'project' ? selectedProject : selectedJurisdiction
          }
        }
        actions.handleBulkUpdate(updateData, checkedDocs)
    }
  }
  
  /**
   * Closes alerts
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Closes the autocomplete search modal
   */
  onCloseModal = () => {
    const { projectAutoActions, jurisdictionAutoActions } = this.props
    const { bulkActionType } = this.state
    
    if (bulkActionType === 'jurisdiction') {
      jurisdictionAutoActions.clearSuggestions()
      jurisdictionAutoActions.clearAll()
    }
    
    if (bulkActionType === 'project') {
      projectAutoActions.clearSuggestions()
      projectAutoActions.clearAll()
    }
    
    this.setState({
      showModal: false,
      bulkActionType: ''
    })
  }
  
  /**
   * Gets bulk action modal button props
   * @returns {{inProgress: DocumentManagement.props.bulkOperationInProgress, disabled: boolean}}
   */
  getButtonInfo = () => {
    const { bulkActionType } = this.state
    const {
      projectAutocompleteProps, jurisdictionAutocompleteProps, checkedCount, bulkOperationInProgress
    } = this.props
  
    const selectedProject = projectAutocompleteProps.selectedSuggestion
    const selectedJurisdiction = jurisdictionAutocompleteProps.selectedSuggestion
    
    let info = {
      disabled: false,
      inProgress: bulkOperationInProgress
    }
    
    switch (bulkActionType) {
      case 'delete':
      case 'approve':
        info.disabled = checkedCount === 0
        break
      case 'project':
      case 'removeproject' :
        info.disabled = Object.keys(selectedProject).length === 0 || checkedCount === 0
        break
      case 'jurisdiction':
        info.disabled = Object.keys(selectedJurisdiction).length === 0 || checkedCount === 0
        break
      default:
        info.disabled = false
        break
    }
    
    return info
  }
  
  render() {
    const {
      apiErrorOpen, apiErrorInfo, getDocumentsInProgress, pageError, documents, docCount, showAll,
      actions, allSelected, page, rowsPerPage, checkedCount, sortBy, sortDirection, userRole, checkedDocsOwner,
      jurisdictionAutocompleteProps, projectAutocompleteProps
    } = this.props
    
    const { bulkActionType, showModal } = this.state
    
    const autocompleteProps = bulkActionType.includes('project')
      ? projectAutocompleteProps
      : jurisdictionAutocompleteProps
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <ApiErrorAlert open={apiErrorOpen} content={apiErrorInfo.text} onCloseAlert={this.closeAlert} />
        <PageHeader
          pageTitle="Document Management"
          protocolButton={false}
          projectName=""
          entryScene
          icon="description"
          otherButton={{
            isLink: true,
            text: 'Upload New',
            path: '/docs/upload',
            state: { modal: true },
            props: { 'aria-label': 'Upload New Documents', 'id': 'uploadNewBtn' },
            show: true
          }}>
          <SearchBox />
        </PageHeader>
        {getDocumentsInProgress ?
          <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
          : <FlexGrid container flex raised>
            {pageError === '' && <DocList
              documents={documents}
              docCount={docCount}
              onChangePage={actions.handlePageChange}
              onChangeRows={actions.handleRowsChange}
              onSelectAllDocs={actions.handleSelectAllDocs}
              onSelectOneDoc={actions.handleSelectOneDoc}
              allSelected={allSelected}
              page={page}
              rowsPerPage={rowsPerPage}
              userRole={userRole}
              showAll={showAll}
              onBulkAction={this.handleBulkAction}
              allowDropdown={checkedCount > 0}
              toggleAllDocs={actions.toggleAllDocs}
              sortBy={sortBy}
              sortDirection={sortDirection}
              handleSortRequest={actions.handleSortRequest}
            />}
            {pageError !== '' && <ApiErrorView error={pageError} />}
          </FlexGrid>
        }
        <BulkModal
          open={showModal}
          onCloseModal={this.onCloseModal}
          bulkType={bulkActionType}
          docCount={checkedCount}
          ownerList={checkedDocsOwner}
          onConfirmAction={this.handleBulkConfirm}
          buttonInfo={this.getButtonInfo()}
          autocompleteProps={autocompleteProps}
        />
        <Route path="/docs/upload" component={Upload} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docManage = state.scenes.docManage.main
  const currentUser = state.data.user.currentUser
  let checkedDocsOwners = []
  const curuserName = (currentUser.firstName.trim() + ' ' + currentUser.lastName.trim()).trim()
  docManage.list.documents.checked.map(docId => {
    let uploadedBy = (docManage.list.documents.byId[docId].uploadedBy.firstName.trim() + ' ' +
      docManage.list.documents.byId[docId].uploadedBy.lastName.trim()).trim()
    if (checkedDocsOwners.indexOf(uploadedBy) === -1 && (uploadedBy !== curuserName))
      checkedDocsOwners.push(uploadedBy)
  })
  
  return {
    checkedDocsOwner: checkedDocsOwners,
    documents: docManage.list.documents.visible,
    checkedDocs: docManage.list.documents.checked,
    checkedCount: docManage.list.documents.checked.length,
    docCount: docManage.list.count,
    page: docManage.list.page,
    rowsPerPage: docManage.list.rowsPerPage,
    allSelected: docManage.list.allSelected,
    apiErrorInfo: docManage.list.apiErrorInfo,
    apiErrorOpen: docManage.list.apiErrorOpen || false,
    bulkOperationInProgress: docManage.list.bulkOperationInProgress || false,
    sortBy: docManage.list.sortBy,
    sortDirection: docManage.list.sortDirection,
    getDocumentsInProgress: docManage.list.getDocumentsInProgress || false,
    pageError: docManage.list.pageError,
    userRole: state.data.user.currentUser.role,
    showAll: docManage.list.showAll,
    currentUser: currentUser
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    searchProjectAutocomplete: bindActionCreators(searchProjectAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withAutocompleteMethods('project', 'bulk')(
    withAutocompleteMethods('jurisdiction', 'bulk', {}, false)(
      DocumentManagement
    )
  )
)
