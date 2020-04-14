import React from 'react'
import PropTypes from 'prop-types'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from 'components/IconButton'
import { connect } from 'react-redux'
import TextLink from 'components/TextLink'

/**
 * Table row for a jurisdiction
 * @param jurisdiction
 * @param id
 * @param onDelete
 * @param projectId
 * @param disableAll
 * @returns {*}
 * @constructor
 */
export const JurisdictionRow = ({ jurisdiction, id, onDelete, projectId, disableAll }) => {
  return (
    <TableRow key={`jurisdiction-${id}`}>
      <TableCell key={`${id}-segment-name`} id={`${id}-segment-name`}>
        {jurisdiction.name}
      </TableCell>
      <TableCell key={`${id}-segment-start-date`} id={`${id}-segment-start-date`}>
        {new Date(jurisdiction.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell key={`${id}-segment-end-date`} id={`${id}-segment-end-date`}>
        {new Date(jurisdiction.endDate).toLocaleDateString()}
      </TableCell>
      {!disableAll && <TableCell key={`${id}-edit`} id={`${id}-edit`}>
        <TextLink
          to={{
            pathname: `/project/${projectId}/jurisdictions/${jurisdiction.id}/edit`,
            state: { jurisdictionDefined: { ...jurisdiction }, modal: true }
          }}>
          <IconButton color="accent">mode_edit</IconButton>
        </TextLink>
      </TableCell>}
      {!disableAll && <TableCell key={`${id}-delete`} id={`${id}-delete`}>
        <IconButton onClick={() => onDelete(id, jurisdiction.name)} color="accent">delete</IconButton>
      </TableCell>}
    </TableRow>
  )
}

JurisdictionRow.propTypes = {
  jurisdiction: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onDelete: PropTypes.func,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disableAll: PropTypes.bool
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdictions.byId[ownProps.id]
})

export default connect(mapStateToProps)(JurisdictionRow)
