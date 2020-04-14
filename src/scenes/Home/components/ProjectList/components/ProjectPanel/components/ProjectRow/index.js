import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, IconButton, Icon } from 'components'
import moment from 'moment'
import theme from 'services/theme'

export const ProjectRow = props => {
  const { project, bookmarked, toggleBookmark, handleExpandProject } = props
  const date = moment.utc(project.dateLastEdited).local().format('M/D/YYYY')
  const greyIcon = theme.palette.greyText
  const isLocked = project.status === 2
  
  return (
    <FlexGrid type="row" container flex style={{ minHeight: 60 }} onClick={handleExpandProject}>
      <FlexGrid container type="row" align="center" padding="0 0 0 24px">
        <IconButton
          color={bookmarked ? '#fdc43b' : greyIcon}
          onClick={event => {
            event.stopPropagation()
            toggleBookmark(project)
          }}
          disabled={isLocked}
          tooltipText="Bookmark project"
          aria-label="Bookmark this project"
          id={`bookmark-project-${project.id}`}>
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </IconButton>
      </FlexGrid>
      <FlexGrid padding="0 12px" container type="row" align="center" flex style={{ flexBasis: '32%' }}>
        <span>{project.name}</span>
        {isLocked && <Icon size={18} color="#757575" style={{ marginLeft: 5 }}>lock</Icon>}
      </FlexGrid>
      <FlexGrid
        container
        type="row"
        align="center"
        justify="flex-end"
        padding="0 24px 0 0"
        flex
        style={{ flexBasis: '10%' }}>
        <FlexGrid style={{ width: '45%' }}>
          <span style={{ color: 'black' }}>Date Last Edited:{' '}</span>
          <span>{date}</span>
        </FlexGrid>
        <span style={{ width: '8%' }} />
        <FlexGrid style={{ width: '45%' }}>
          <span style={{ color: 'black' }}>Last Edited By:{' '}</span>
          {project.lastEditedBy}
        </FlexGrid>
      </FlexGrid>
    </FlexGrid>
  )
}

ProjectRow.propTypes = {
  project: PropTypes.object,
  bookmarked: PropTypes.bool,
  isCoder: PropTypes.bool,
  toggleBookmark: PropTypes.func,
  handleExpandProject: PropTypes.func
}

export default ProjectRow
