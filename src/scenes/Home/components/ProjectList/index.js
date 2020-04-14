import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import { FlexGrid, Table, TablePagination } from 'components'
import ProjectPanel from './components/ProjectPanel'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

const modalPaths = [
  '/project/edit/:id',
  '/project/add',
  '/user/:id/avatar',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

const isRouteOk = history => {
  return history.action !== 'PUSH'
    ? true
    : modalPaths.every(path => matchPath(history.location.pathname, { path }) === null)
}

export class ProjectList extends Component {
  static propTypes = {
    projectIds: PropTypes.array,
    user: PropTypes.object,
    page: PropTypes.number,
    rowsPerPage: PropTypes.string,
    projectCount: PropTypes.number,
    handlePageChange: PropTypes.func,
    handleRowsChange: PropTypes.func,
    handleToggleProject: PropTypes.func,
    handleExport: PropTypes.func,
    getProjectUsers: PropTypes.func,
    location: PropTypes.object,
    history: PropTypes.object,
    openProject: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    allowExpandCollapse: PropTypes.bool
  }
  
  state = {
    mouse: {
      x: 0,
      y: 0
    }
  }
  
  /**
   * Checks the target node for a click away event
   * @param path
   * @returns {boolean}
   */
  checkTargetPath = path => {
    let valid = true
    path.forEach(node => {
      if ([
        'projectSort-container',
        'menu-projectSort',
        'avatar-user-menu',
        'tab-project-list',
        'tab-doc-manage'
      ].includes(node.id)) {
        valid = false
      }
    })
    return valid
  }
  
  /**
   * Checks whether or not the project should expand based on what was clicked
   * @param target
   * @returns {boolean}
   */
  checkExpand = target => {
    const stopOpenEls = ['A', 'BUTTON', 'button', 'a']
    const regex = /([Bb]utton)|(icons?)|([sS]elect)|([iI]nput)|([dD]ialog)|([mM]odal)/g
    return !stopOpenEls.includes(target.tagName)
      && (target.tagName !== 'svg' ? target.className.search(regex) === -1 : true)
      && target.id !== 'avatar-menu-button'
      && target.tagName !== 'INPUT'
  }
  
  /**
   * Sets a project to expanded or closed based on criteria
   * @param id
   * @param event
   */
  handleExpandProject = (id, event) => {
    const { location, history, handleToggleProject, allowExpandCollapse } = this.props
    
    if (allowExpandCollapse) {
      if (location.pathname === '/home' && isRouteOk(history)) {
        const expand = this.checkExpand(event.target) &&
          this.checkExpand(event.target.offsetParent ? event.target.offsetParent : event.target.parentNode)
    
        if (expand) {
          handleToggleProject(id)
        }
    
        this.setState({
          mouse: {
            x: 0,
            y: 0
          }
        })
      }
    }
  }
  
  /**
   * Handles closing a project is the user clicks away
   * @param event
   */
  handleClickAway = event => {
    const { openProject, location, history, handleToggleProject, allowExpandCollapse } = this.props
    const { mouse } = this.state
    
    let check = true
    
    if (allowExpandCollapse) {
      if (mouse.x !== 0 || mouse.y !== 0) {
        if (event.clientX !== mouse.x && event.clientY !== mouse.y) {
          check = false
        }
      }
  
      if (check) {
        if (event.offsetX <= event.target.clientWidth && event.offsetY <= event.target.clientHeight) {
          if (location.pathname === '/home' && isRouteOk(history)) {
            const parent = event.target.offsetParent ? event.target.offsetParent : event.target.parentNode
            const expand = (this.checkExpand(event.target) && this.checkExpand(parent))
              && this.checkTargetPath(event.path)
        
            if (expand) {
              handleToggleProject(openProject)
            }
          }
        }
      }
  
      this.setState({
        mouse: {
          x: 0,
          y: 0
        }
      })
    }
  }
  
  /**
   * Sets the coordinates of the mouse when clicking down to check the position when mouse up for whether the project
   * needs to be closed or hided
   * @param e
   */
  onMouseDown = e => {
    this.setState({
      mouse: {
        x: e.clientX,
        y: e.clientY
      }
    })
  }
  
  /**
   * Changes route to edit modal for project
   * @param project
   */
  handleEditProject = project => () => {
    this.props.history.push({
      pathname: `/project/edit/${project.id}`,
      state: { projectDefined: { ...project }, modal: true }
    })
  }
  
  /**
   * Handles a change in the current page
   */
  handlePageChange = (event, page) => {
    const { handlePageChange } = this.props
    handlePageChange(page)
  }
  
  /**
   * Handles change in rows per page
   */
  handleRowsPerPageChange = event => {
    const { handleRowsChange } = this.props
    handleRowsChange(event.target.value)
  }
  
  render() {
    const { projectIds, user, page, rowsPerPage, projectCount, handleExport, getProjectUsers, openProject } = this.props
    
    return (
      <FlexGrid style={{ overflow: 'auto' }} onMouseDown={this.onMouseDown}>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div style={{ padding: 3 }}>
            {projectIds.map((id, i) => (
              <ProjectPanel
                key={id}
                index={i}
                length={projectIds.length}
                id={id}
                onExport={handleExport}
                role={user.role}
                handleEditProject={this.handleEditProject}
                getProjectUsers={getProjectUsers}
                handleExpandProject={this.handleExpandProject}
                expanded={openProject === id}
              />
            ))}
          </div>
        </ClickAwayListener>
        {projectCount > 0 && <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={projectCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleRowsPerPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>}
      </FlexGrid>
    )
  }
}

export default withRouter(ProjectList)
