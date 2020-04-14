import React from 'react'
import PropTypes from 'prop-types'
import Table from 'components/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import JurisdictionRow from './components/JurisdictionRow'

/**
 * Table of project jurisdictions
 * @param jurisdictions
 * @param projectId
 * @param project
 * @param onDelete
 * @param disableAll
 * @returns {*}
 * @constructor
 */
export const JurisdictionList = ({ jurisdictions, projectId, project, onDelete, disableAll }) => (
  <Table summary={`jurisdictions in ${project.name}`}>
    <TableHead>
      <TableRow key="jurisdiction-header">
        <TableCell key="segment-name" id="segment-name" scope="col">Jurisdiction</TableCell>
        <TableCell key="segment-start" id="segment-start-date" scope="col">Segment Start Date</TableCell>
        <TableCell key="segment-end" id="segment-end-date" scope="col">Segment End Date</TableCell>
        {!disableAll && <TableCell key="segment-edit" id="edit-segment" scope="col">Edit</TableCell>}
        {!disableAll && <TableCell key="segment-delete" id="delete-segment" scope="col">Delete</TableCell>}
      </TableRow>
    </TableHead>
    <TableBody>
      {jurisdictions.map(id => (
        <JurisdictionRow
          projectId={projectId}
          id={id}
          onDelete={onDelete}
          key={`jurisdictions-${id}`}
          disableAll={disableAll}
        />
      ))}
    </TableBody>
  </Table>
)

JurisdictionList.propTypes = {
  jurisdictions: PropTypes.array,
  onOpenForm: PropTypes.func,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  project: PropTypes.object,
  onDelete: PropTypes.func,
  disableAll: PropTypes.bool
}

export default JurisdictionList
