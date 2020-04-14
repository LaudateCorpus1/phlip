import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  CheckboxLabel,
  Dropdown,
  FlexGrid,
  Table as MuiTable,
  TextLink,
  TablePagination
} from 'components'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import { Column, AutoSizer } from 'react-virtualized'
import { connect } from 'react-redux'
import theme from 'services/theme'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableCell from '@material-ui/core/TableCell'
import moment from 'moment'
import { Check } from 'mdi-material-ui'
import Table from './Table'

export class DocList extends Component {
  static propTypes = {
    /**
     * List of document ids
     */
    documents: PropTypes.array,
    /**
     * Current page in table
     */
    page: PropTypes.number,
    /**
     * Currently selected # of rows per page to show
     */
    rowsPerPage: PropTypes.string,
    /**
     * Handles when the user clicks the checkbox table header to select all files
     */
    onSelectAllDocs: PropTypes.func,
    /**
     * Handles when a user clicks the checkbox table cell in a row
     */
    onSelectOneDoc: PropTypes.func,
    /**
     * Total number of documents
     */
    docCount: PropTypes.number,
    /**
     * Handles when the user requests to change pages in table
     */
    onChangePage: PropTypes.func,
    /**
     * Handles when the user requests to change number of rows per page
     */
    onChangeRows: PropTypes.func,
    /**
     * Whether or not all files are selected (by clicking the talbe header checkbox)
     */
    allSelected: PropTypes.bool,
    /**
     * Handles when the user requests to change pages in table
     */
    onBulkAction: PropTypes.func,
    /**
     * Handles when the user requests sorting
     */
    handleSortRequest: PropTypes.func,
    /**
     * Current value that the table is being sorted by
     */
    sortBy: PropTypes.string,
    /**
     * Current direction the table is being sorted
     */
    sortDirection: PropTypes.string,
    /**
     * Current user role
     */
    userRole: PropTypes.oneOf(['Admin', 'Coordinator', 'Coder']),
    /**
     * Whether or not to show all docs as opposed to just the ones uploaded by the user
     */
    showAll: PropTypes.bool,
    /**
     * Function called when the user toggles the switch
     */
    toggleAllDocs: PropTypes.func,
    /**
     * Docs to render
     */
    docs: PropTypes.array
  }
  
  columns = [
    {
      key: 'isChecked',
      hasSort: false,
      width: 72,
      flexShrink: 0,
      flexGrow: 0,
      minWidth: 72
    },
    {
      key: 'name',
      label: 'Document Name',
      hasSort: true,
      minWidth: 300,
      maxWidth: 500,
      flexGrow: 1,
      flexShrink: 1,
      width: 400
    },
    {
      key: 'uploadedByName',
      label: 'Uploaded By',
      hasSort: true,
      flexGrow: 1,
      maxWidth: 200,
      minWidth: 100,
      width: 150
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded Date',
      hasSort: true,
      flexGrow: 1,
      maxWidth: 200,
      minWidth: 100,
      width: 150
    },
    {
      key: 'projectList',
      label: 'Projects',
      minWidth: 100,
      flexShrink: 0,
      maxWidth: 500,
      flexGrow: 1,
      width: 300
    },
    {
      key: 'jurisdictionList',
      label: 'Jurisdictions',
      minWidth: 100,
      maxWidth: 500,
      flexShrink: 0,
      flexGrow: 1,
      width: 300
    },
    { key: 'status', label: 'Approved', width: 100, minWidth: 50, flexGrow: 0, flexShrink: 0 }
  ]
  
  /**
   * Renders the table header
   */
  headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
    const { allSelected, onSelectAllDocs, handleSortRequest } = this.props
    const inner =
      columnIndex === 0
        ? <CheckboxLabel
          input={{ value: allSelected, onChange: onSelectAllDocs }}
          labelStyle={{ margin: 0 }}
          style={{ width: 24, height: 24 }}
        />
        : this.columns[columnIndex].hasSort && sortBy !== null
          ? (
            <TableSortLabel
              active={dataKey === sortBy}
              style={{ color: 'inherit' }}
              onClick={() => handleSortRequest(dataKey)}
              direction={sortDirection.toLowerCase()}>
              {label}
            </TableSortLabel>
          ) : label
    
    return (
      <TableCell
        component="div"
        variant="head"
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          boxSizing: 'border-box'
        }}>
        {inner}
      </TableCell>
    )
  }
  
  /**
   * Renders a table row
   * @param cellData
   * @param columnIndex
   * @param rowIndex
   * @returns {*}
   */
  cellRenderer = ({ cellData, columnIndex = null, rowIndex, style }) => {
    const { docs, onSelectOneDoc } = this.props
    const doc = docs[rowIndex]
    
    return (
      <TableCell
        component="div"
        variant="body"
        style={{
          ...style,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: columnIndex === 6 ? 'center' : 'stretch',
          boxSizing: 'border-box'
        }}>
        {columnIndex === 0 && <CheckboxLabel
          input={{ value: cellData, onChange: () => onSelectOneDoc(doc._id) }}
          labelStyle={{ margin: 0 }}
          style={{ width: 24, height: 24 }}
        />}
        {columnIndex === 1 && <TextLink to={{ pathname: `/docs/${doc._id}/view`, state: { document: { ...doc } } }}>
          {cellData}
        </TextLink>}
        {columnIndex === 2 && cellData}
        {columnIndex === 3 && moment.utc(cellData).local().format('M/D/YYYY')}
        {columnIndex === 6 &&
        (cellData === 'Approved' && <Check color="secondary" style={{ width: 24, height: 24 }} />)}
        {[4, 5].includes(columnIndex) && cellData.join(', ')}
      </TableCell>
    )
  }
  
  render() {
    const {
      rowsPerPage, page, sortBy, sortDirection, userRole, showAll, toggleAllDocs, onChangePage, onChangeRows, docCount,
      onBulkAction, docs
    } = this.props
    
    let options = [
      { value: 'bulk', label: 'Actions', disabled: true },
      { value: 'project', label: 'Assign Project' },
      { value: 'jurisdiction', label: 'Assign Jurisdiction' },
      { value: 'approve', label: 'Approve' },
      { value: 'removeproject', label: 'Unassign Project' }
    ]
    
    options = userRole === 'Admin' ? [...options, { value: 'delete', label: 'Delete' }] : options
    options.sort((a, b) => (a.label > b.label) ? 1 : -1)
    return (
      <FlexGrid container flex style={{ overflow: 'hidden' }}>
        <FlexGrid container type="row" justify="space-between" align="center" padding="6px 24px" style={{ height: 56 }}>
          <Dropdown
            options={options}
            input={{
              value: 'bulk',
              onChange: (actionType) => onBulkAction(actionType)
            }}
            SelectDisplayProps={{ style: { paddingBottom: 3, minWidth: 140 } }}
            style={{ fontSize: 13, color: '#757575', fontWeight: 400 }}
          />
          <FlexGrid container type="row" align="center">
            <Switch checked={showAll} onChange={() => toggleAllDocs()} />
            <Typography variant="caption" style={{ fontWeight: 500 }}>Show All Documents</Typography>
          </FlexGrid>
        </FlexGrid>
        <FlexGrid flex>
          <AutoSizer>
            {({ height, width }) => {
              return (
                <Table
                  height={height}
                  width={width}
                  headerHeight={56}
                  rowHeight={48}
                  sortBy={sortBy}
                  rowStyle={{ display: 'flex', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}
                  style={{ fontFamily: theme.typography.fontFamily, width: '100%' }}
                  sortDirection={sortDirection.toUpperCase()}
                  containerStyle={{ widht: '100%', overflow: 'unset' }}
                  rowCount={docs.length}
                  gridStyle={{ outline: 'none', overflow: 'auto !important' }}
                  rowGetter={({ index }) => docs[index]}
                  summary="List of documents">
                  {this.columns.map((column, index) => {
                    return (
                      <Column
                        headerRenderer={headerProps => this.headerRenderer({
                          columnIndex: index,
                          ...headerProps
                        })}
                        cellRenderer={cellProps => this.cellRenderer({
                          columnIndex: index,
                          ...cellProps
                        })}
                        key={`table-${column.key}`}
                        label={column.label}
                        disableSort={!column.hasSort}
                        dataKey={column.key}
                        {...column}
                      />
                    )
                  })}
                </Table>
              )
            }}
          </AutoSizer>
        </FlexGrid>
        <MuiTable>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={docCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, page) => {
                  if (event !== null) onChangePage(page)
                }}
                onChangeRowsPerPage={event => onChangeRows(event.target.value)}
              />
            </TableRow>
          </TableFooter>
        </MuiTable>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next*/
const mapStateToProps = (state, ownProps) => {
  const docs = state.scenes.docManage.main.list.documents.byId
  return {
    docs: ownProps.documents.map(doc => ({
      ...docs[doc],
      projectList: docs[doc].projects.map(proj => {
        return state.data.projects.byId[proj] === undefined ? '' : state.data.projects.byId[proj].name
      }),
      jurisdictionList: docs[doc].jurisdictions.map(jur => {
        return state.data.jurisdictions.byId[jur] === undefined ? '' : state.data.jurisdictions.byId[jur].name
      }),
      isChecked: state.scenes.docManage.main.list.documents.checked.includes(doc)
    }))
  }
}

export default connect(mapStateToProps)(DocList)
