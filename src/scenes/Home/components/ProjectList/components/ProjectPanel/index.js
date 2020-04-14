import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'scenes/Home/actions'
import moment from 'moment'
import GridList from '@material-ui/core/GridList'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { FlexGrid, IconButton, Link, Button, GridListTile, Icon } from 'components'
import { FileDocument, City, FormatListBulleted, ClipboardCheckOutline, FileExport } from 'mdi-material-ui'
import ProjectRow from './components/ProjectRow'
import silhouette from './silhouette.png'
import theme from 'services/theme'

export class ProjectPanel extends Component {
  static propTypes = {
    project: PropTypes.object,
    actions: PropTypes.object,
    role: PropTypes.string,
    expanded: PropTypes.bool,
    users: PropTypes.array,
    allUsers: PropTypes.object,
    bookmarked: PropTypes.bool,
    onExport: PropTypes.func,
    length: PropTypes.number,
    index: PropTypes.number,
    handleExpandProject: PropTypes.func,
    handleEditProject: PropTypes.func
  }
  
  /**
   * Handles when a project is clicked to open
   * @param event
   */
  handleChange = event => {
    this.props.handleExpandProject(this.props.project.id, event)
    this.props.actions.getProjectUsers(this.props.project.id, {
      id: this.props.project.createdById,
      email: this.props.project.createdByEmail
    })
  }
  
  /**
   * Determines the grid size for avatars
   * @returns {{square: number, size: number}}
   */
  determineGridSize = () => {
    let size = 0, square = 0, i = 0
    const { users } = this.props
    
    while (size === 0) {
      const sq = i ** 2
      if (users.length <= sq) {
        square = sq
        size = i
      }
      i++
    }
    
    return { square, size }
  }
  
  /**
   * Gets users for a project and fills in empty slots in the grid
   * @param square
   * @returns {...ProjectPanel.props.users[]}
   */
  populateUsers = square => {
    const { users, project } = this.props
    if (square === users.length) {
      return [...users]
    }
    
    const userTiles = [...users]
    const blanks = Array.from({ length: square - users.length }, (v, i) => ({
      id: `${project.id}-blank-${i}`,
      blank: true
    }))
    return userTiles.concat(blanks)
  }
  
  /**
   * Handles when a user clicks the export button
   */
  onClickExport = () => {
    this.props.onExport(this.props.project)
  }
  
  render() {
    const { project, role, bookmarked, actions, index, length, users, allUsers, expanded, handleEditProject } = this.props
    
    const isCoder = role === 'Coder'
    const greyIcon = theme.palette.greyText
    const iconStyle = { fontSize: 18, paddingLeft: 5 }
    const listingStyle = { fontSize: 14, fontWeight: 500, color: '#7b7b7b' }
    const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
    const createdDate = moment.utc(project.dateCreated).local().format('M/D/YYYY')
    
    const { square, size } = this.determineGridSize()
    const userData = expanded ? this.populateUsers(square) : []
    const avatarCols = size, avatarRows = size, cellHeight = 300 / size
    
    const rowStyles = {
      boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
      position: 'relative',
      backgroundColor: 'white',
      fontSize: '0.8125rem',
      borderRadius: expanded ? 2 : 0,
      overflow: 'hidden'
    }
    
    const collapseStyles = {
      transitionDuration: '150ms',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%'
    }
    
    const containerStyles = {
      paddingBottom: ((index === 0 && length > 1) || index < length - 1)
        ? expanded
          ? 30
          : 0
        : 0,
      paddingTop: expanded
        ? index > 0
          ? 30
          : 0
        : 0
    }
    
    const panelButtonProps = {
      style: { marginLeft: 10 },
      color: 'white',
      textColor: 'black',
      disableRipple: true
    }
    
    const isLocked = project.status === 2
    
    return (
      <>
        {containerStyles.paddingTop === 30 && <div style={{ height: 30 }} onClick={this.handleChange} />}
        <FlexGrid style={{ backgroundColor: isLocked ? `rgb(249, 249, 249)` : 'white' }}>
          <FlexGrid container justify="center" style={rowStyles} flex>
            {!expanded && <ProjectRow
              isCoder={isCoder}
              project={project}
              bookmarked={bookmarked}
              toggleBookmark={actions.toggleBookmark}
              handleExpandProject={this.handleChange}
            />}
            <Collapse in={expanded} style={collapseStyles}>
              <FlexGrid container type="row" style={{ width: '100%', overflow: 'auto' }}>
                <FlexGrid container type="column" style={{ width: 300, backgroundColor: 'white' }}>
                  <GridList
                    style={{ width: 300, margin: 0 }}
                    cellHeight={cellHeight}
                    spacing={2}
                    cols={avatarCols}
                    rows={avatarRows}>
                    {userData.map(oneCoder => {
                      const coder = oneCoder.blank
                        ? oneCoder
                        : allUsers[oneCoder.userId] !== undefined
                          ? allUsers[oneCoder.userId]
                          : oneCoder
  
                      return (
                        <GridListTile key={coder.id || coder.userId}>
                          {!coder.blank ? (
                            (coder.avatar === '' || coder.avatar === undefined)
                              ? (
                                <FlexGrid
                                  container
                                  type="row"
                                  justify="center"
                                  align="flex-end"
                                  title={coder.username}
                                  style={{ backgroundColor: '#f9f9f9' }}>
                                  <img
                                    src={silhouette}
                                    alt={`${coder.username}'s avatar`}
                                    style={{ width: '100%', height: cellHeight }}
                                  />
                                  <Typography
                                    style={{
                                      fontWeight: 300,
                                      fontSize: '1.1rem',
                                      color: 'white',
                                      backgroundColor: `rgb(${144},${141},${141})`,
                                      width: '100%',
                                      textAlign: 'center',
                                      height: 25,
                                      paddingLeft: 3,
                                      position: 'absolute'
                                    }}>
                                    {coder.initials}
                                  </Typography>
                                </FlexGrid>
                              ) : (
                                <img
                                  alt={`avatar-${coder.lastName}`}
                                  src={coder.avatar}
                                  title={coder.username}
                                />
                              )
                          ) : <div style={{ backgroundColor: '#f9f9f9', width: '100%', height: cellHeight }} />}
                        </GridListTile>
                      )
                    })}
                  </GridList>
                </FlexGrid>
                <FlexGrid container type="column" flex>
                  <FlexGrid
                    container
                    type="row"
                    align="center"
                    padding={30}
                    onClick={this.handleChange}
                    style={{ backgroundColor: '#f9f9f9' }}>
                    <FlexGrid
                      container
                      type="row"
                      flex
                      align="center"
                      justify="flex-start"
                      style={{ minWidth: 150, marginRight: 15 }}>
                      <IconButton
                        color={bookmarked ? '#fdc43b' : greyIcon}
                        onClick={() => actions.toggleBookmark(project)}
                        tooltipText="Bookmark project"
                        aria-label="Bookmark this project"
                        id={`bookmark-project-${project.id}`}>
                        {bookmarked ? 'bookmark' : 'bookmark_border'}
                      </IconButton>
                      <Typography variant="title" style={{ margin: '0 8px', whiteSpace: 'nowrap' }}>
                        {project.name}
                      </Typography>
                      {isLocked && isCoder && <Icon>lock</Icon>}
                      {isLocked && !isCoder && <IconButton
                        color="secondary"
                        iconSize={24}
                        id={`unlock-project-${project.id}`}
                        tooltipText="Unlock Project"
                        aria-label={`Unlock Project ${project.name}`}
                        onClick={handleEditProject(project)}>
                        lock
                      </IconButton>}
                      {!isCoder && !isLocked && <IconButton
                        color="secondary"
                        iconSize={24}
                        id={`edit-project-${project.id}`}
                        tooltipText="Edit Project Details"
                        aria-label={`Edit Project ${project.name}`}
                        onClick={handleEditProject(project)}>
                        edit
                      </IconButton>}
                    </FlexGrid>
                    <FlexGrid container type="row" flex justify="flex-end" align="stretch" style={{ height: 40 }}>
                      {!isCoder && (<Button
                        id={`${project.id}-edit-jurisdictions`}
                        to={{ pathname: `/project/${project.id}/jurisdictions`, state: { modal: true } }}
                        aria-label="Add and edit project jurisdictions"
                        component={Link}
                        {...panelButtonProps}>
                        Jurisdictions
                        <City style={iconStyle} />
                      </Button>)}
                      <Button
                        component={Link}
                        aria-label="Documents in this project"
                        to={{ pathname: `/docs`, state: { projectDefined: true, project } }}
                        {...panelButtonProps}>
                        Documents
                        <FileDocument style={iconStyle} />
                      </Button>
                      {!isCoder && (<Button
                        component={Link}
                        aria-label="Add and edit project coding scheme"
                        to={`/project/${project.id}/coding-scheme`}
                        {...panelButtonProps}>
                        Coding Scheme
                        <FormatListBulleted style={iconStyle} />
                      </Button>)}
                      <Button
                        component={Link}
                        aria-label="Add and edit project protocol"
                        to={`/project/${project.id}/protocol`}
                        {...panelButtonProps}>
                        Protocol
                        <ClipboardCheckOutline style={iconStyle} />
                      </Button>
                      {!isCoder && <Button
                        aria-label="Export validated questions"
                        onClick={this.onClickExport}
                        id={`export-validated-${project.id}`}
                        {...panelButtonProps}>
                        Export
                        <FileExport style={iconStyle} />
                      </Button>}
                    </FlexGrid>
                  </FlexGrid>
                  <FlexGrid container type="row">
                    <FlexGrid container flex padding={30}>
                      <Typography variant="body1" style={{ paddingBottom: 10 }}>
                        <span style={listingStyle}>Created by:{' '}</span>
                        {project.createdBy} -{' '}
                        <span style={{ fontSize: `0.8rem`, color: '#7b7b7b' }}>{createdDate}</span>
                      </Typography>
                      <Typography variant="body1" style={{ paddingBottom: 10 }}>
                        <span style={listingStyle}>Last edited by:{' '}</span>
                        {project.lastEditedBy} -{' '}
                        <span style={{ fontSize: `0.8rem`, color: '#7b7b7b' }}>{date}</span>
                      </Typography>
                      <Typography variant="body1" style={{ paddingBottom: 10 }}>
                        <span style={listingStyle}>Coordinator(s):{' '}</span>
                        <span>
                          {users.filter((oneCoder) => {
                            return oneCoder.role !== 'Coder'
                          }).map((oneCoder) => {
                            return oneCoder.firstName + ' ' + oneCoder.lastName
                          }).join(', ')}
                        </span>
                      </Typography>
                      <Typography variant="body1" style={{ paddingBottom: 10 }}>
                        <span style={listingStyle}>Coder(s):{' '}</span>
                        <span>
                          {users.filter((oneCoder) => {
                            return oneCoder.role === 'Coder'
                          }).map((oneCoder) => {
                            return oneCoder.firstName + ' ' + oneCoder.lastName
                          }).join(', ')}
                        </span>
                      </Typography>
                      <Typography variant="body1">
                        <span style={listingStyle}>Type:{' '}</span>
                        <span>{(project.type === 1) ? 'Legal Scan' : 'Policy Surveillance'}</span>
                      </Typography>
                      <FlexGrid />
                    </FlexGrid>
                    <FlexGrid container type="row" align="flex-end" flex padding={30} justify="flex-end">
                      <Button
                        raised={false}
                        value="Code"
                        listButton
                        aria-label="Code project"
                        component={Link}
                        to={{ pathname: `/project/${project.id}/code` }}
                        style={{ width: 150, height: 50, borderRadius: 3 }}
                      />
                      {!isCoder &&
                      <Button
                        raised={false}
                        value="Validate"
                        listButton
                        aria-label="Validate project"
                        component={Link}
                        to={{ pathname: `/project/${project.id}/validate` }}
                        style={{ width: 150, height: 50, marginLeft: 20, borderRadius: 3 }}
                      />}
                    </FlexGrid>
                  </FlexGrid>
                </FlexGrid>
              </FlexGrid>
            </Collapse>
          </FlexGrid>
        </FlexGrid>
        {containerStyles.paddingBottom === 30 && <div style={{ height: 30 }} onClick={this.handleChange} />}
      </>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const homeState = state.scenes.home.main
  const p = state.data.projects.byId[ownProps.id]
  return {
    project: p,
    role: state.data.user.currentUser.role,
    bookmarked: homeState.bookmarkList.includes(ownProps.id),
    users: p.projectUsers,
    allUsers: state.data.user.byId
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPanel)
