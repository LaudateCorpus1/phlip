import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CardError from 'components/CardError'
import PageHeader from 'components/PageHeader'
import ProjectList from './components/ProjectList'
import actions from './actions'
import ExportDialog from './components/ExportDialog'
import SearchBar from 'components/SearchBar'
import { FlexGrid, Dropdown, ApiErrorAlert, Icon } from 'components'

/**
 * Project List ("Home") screen main component. The first component that is rendered when the user logs in. This is
 * parent component for all things related to the project list -- adding / editing a project, viewing all projects in
 * the system. This component also has two scenes: AddEditJurisdiction and AddEditProject under scenes directory.
 */
export class Home extends Component {
  static propTypes = {
    /**
     * Current user logged in
     */
    user: PropTypes.object,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Array of project IDS that are currently visible on the screen (changes when the user changes the page or uses the
     * search bar to search, etc)
     */
    visibleProjects: PropTypes.arrayOf(PropTypes.number),
    /**
     * Current page in the table
     */
    page: PropTypes.number,
    /**
     * Currently selected number of rows per page
     */
    rowsPerPage: PropTypes.string,
    /**
     * Current field by which to sort the table
     */
    sortBy: PropTypes.string,
    /**
     * Current direction by which to sort the table
     */
    direction: PropTypes.string,
    /**
     * Search input value (the user typed in the search input)
     */
    searchValue: PropTypes.string,
    /**
     * Whether or not the projects should be sorted by bookmarks
     */
    sortBookmarked: PropTypes.bool,
    /**
     * Whether or not an error has occurred for some reason
     */
    error: PropTypes.bool,
    /**
     * Contents of the error message that has occurred
     */
    errorContent: PropTypes.string,
    /**
     * Total number of projects
     */
    projectCount: PropTypes.number,
    /**
     * Project that is currently being exported
     */
    projectToExport: PropTypes.object,
    /**
     * Any api error that has occurred
     */
    apiErrorAlert: PropTypes.object,
    /**
     * Current open project
     */
    openProject: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Whether an export request is in progress
     */
    exporting: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    this.exportRef = React.createRef()
  }
  
  componentDidMount() {
    document.title = 'PHLIP - Home'
    this.props.actions.getProjectsRequest()
  }
  
  componentDidUpdate(prevProps) {
    const { exporting, apiErrorAlert } = this.props
    if (prevProps.exporting && !exporting) {
      if (!apiErrorAlert.open) {
        this.prepareExport()
      }
    }
  }
  
  url = null
  
  /**
   * Opens the export dialog after the user clicks the 'Export' download button.
   * @public
   * @param {object} project
   */
  onToggleExportDialog = project => {
    const { actions } = this.props
    actions.setProjectToExport(project)
  }
  
  /**
   * Closes the export dialog
   * @public
   */
  onCloseExportDialog = () => {
    const { actions } = this.props
    if (this.url !== null) {
      window.URL.revokeObjectURL(this.url)
    }
    actions.clearProjectToExport()
  }
  
  /**
   * Prepares the export CSV file by creating a Blob and ObjectURL from the text parameter. Downloads the file
   * @public
   */
  prepareExport = () => {
    const { projectToExport } = this.props
    
    const csvBlob = new Blob([projectToExport.text], { type: 'text/csv' })
    this.url = URL.createObjectURL(csvBlob)
    this.exportRef.current.href = this.url
    this.exportRef.current.download = projectToExport.user.id === null || projectToExport.user.id === 'val'
      ? `${projectToExport.name}-${projectToExport.exportType}-export.csv`
      : `${projectToExport.name}-${projectToExport.user.firstName}-${projectToExport.user.lastName}-${projectToExport.exportType}-export.csv`
    this.exportRef.current.click()
  }
  
  /**
   * Invoked after the user chooses an export type from the export dialog. Sends a request for that export data
   * @public
   * @param {string} type - Type of export
   * @param {object} user - user to export
   */
  onChooseExport = (type, user) => {
    const { actions } = this.props
    if (this.url !== null) {
      window.URL.revokeObjectURL(this.url)
      this.url = null
    }
    actions.exportDataRequest(type, user)
  }
  
  /**
   * Renders a card error based on this.props.errorContent
   * @public
   * @returns {*}
   */
  renderErrorMessage = () => (
    <CardError>
      {`Uh-oh! Something went wrong. ${this.props.errorContent}`}
    </CardError>
  )
  
  /**
   * Calls a redux action to close any alert error
   * @public
   */
  onCloseApiError = () => {
    this.props.actions.dismissApiError()
  }
  
  /**
   * Handles which sort type to use
   * @param selectedOption
   */
  handleSortParamChange = selectedOption => {
    const { actions, sortBookmarked } = this.props
    
    if (selectedOption !== 'sortBookmarked') {
      actions.sortProjects(selectedOption)
    } else {
      actions.sortBookmarked(!sortBookmarked)
    }
  }
  
  /**
   * Returns the sort label depending on current selected sort and direction
   * @param label
   * @param direction
   * @returns {*}
   */
  sortLabel = (label, direction) => {
    return (
      <>
        <span style={{ paddingRight: 5 }}>{label}</span>
        <Icon size={20} color="black">{direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}</Icon>
      </>
    )
  }
  
  /**
   * Handles search value change
   */
  handleSearchValueChange = event => {
    const { actions } = this.props
    actions.updateSearchValue(event.target.value)
  }
  
  render() {
    const {
      user, sortBy, actions, page, visibleProjects, projectCount, rowsPerPage, direction, sortBookmarked,
      searchValue, error, openProject, apiErrorAlert, projectToExport, exporting
    } = this.props
    
    const options = Array.from([
      { value: 'dateLastEdited', label: 'Date Last Edited' },
      { value: 'name', label: 'Name' },
      { value: 'lastEditedBy', label: 'Last Edited By' },
      { value: 'sortBookmarked', label: 'Bookmarked' }
    ], option => ({
      ...option,
      label: sortBookmarked && option.value === 'sortBookmarked'
        ? this.sortLabel('Bookmarked', 'desc')
        : !sortBookmarked && sortBy === option.value
          ? this.sortLabel(option.label, direction)
          : option.label
    }))
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <ApiErrorAlert content={apiErrorAlert.text} open={apiErrorAlert.open} onCloseAlert={this.onCloseApiError} />
        <PageHeader
          showButton={user.role !== 'Coder'}
          pageTitle="Project List"
          entryScene
          icon="dvr"
          protocolButton={false}
          projectName=""
          otherButton={{
            isLink: true,
            text: 'Create New Project',
            path: '/project/add',
            state: { projectDefined: null, modal: true },
            props: { 'aria-label': 'Create New Project' },
            show: user.role !== 'Coder'
          }}>
          <Dropdown
            name="projectSort"
            id="projectSort"
            options={options}
            input={{
              value: sortBookmarked ? 'sortBookmarked' : sortBy,
              onChange: this.handleSortParamChange
            }}
            renderValue={value => {
              const option = options.find(option => option.value === value)
              return (
                <FlexGrid container type="row" align="center">
                  <span>Sort by:&nbsp;</span>
                  {option.label}
                </FlexGrid>
              )
            }}
            style={{ fontSize: 14 }}
            formControlStyle={{ minWidth: 180, paddingRight: 20 }}
          />
          <SearchBar
            searchValue={searchValue}
            id="project-search"
            handleSearchValueChange={this.handleSearchValueChange}
            placeholder="Search"
          />
        </PageHeader>
        
        {error && this.renderErrorMessage()}
        {!error &&
        <ProjectList
          user={user}
          projectIds={visibleProjects}
          projectCount={projectCount}
          page={page}
          rowsPerPage={rowsPerPage}
          handleExport={this.onToggleExportDialog}
          handlePageChange={actions.updatePage}
          handleRowsChange={actions.updateRows}
          handleToggleProject={actions.toggleProject}
          getProjectUsers={actions.getProjectUsers}
          openProject={openProject}
          allowExpandCollapse={projectToExport.id === null}
        />}
        <ExportDialog
          open={projectToExport.id !== null}
          onChooseExport={this.onChooseExport}
          onClose={this.onCloseExportDialog}
          projectToExport={projectToExport}
          inProgress={exporting}
        />
        <a style={{ display: 'none' }} ref={this.exportRef} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  user: state.data.user.currentUser,
  visibleProjects: state.scenes.home.main.projects.visible,
  page: state.scenes.home.main.page,
  rowsPerPage: state.scenes.home.main.rowsPerPage,
  sortBy: state.scenes.home.main.sortBy,
  direction: state.scenes.home.main.direction,
  searchValue: state.scenes.home.main.searchValue,
  sortBookmarked: state.scenes.home.main.sortBookmarked,
  error: state.scenes.home.main.error,
  errorContent: state.scenes.home.main.errorContent,
  projectCount: state.scenes.home.main.projectCount,
  projectToExport: state.scenes.home.main.projectToExport,
  openProject: state.scenes.home.main.openProject,
  apiErrorAlert: state.scenes.home.main.apiErrorAlert,
  exporting: state.scenes.home.main.exporting
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Home)
