import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TableCell from '@material-ui/core/TableCell'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import KeyboardArrowLeft from '@material-ui/core/internal/svg-icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/core/internal/svg-icons/KeyboardArrowRight'

/* istanbul ignore next */
export const styles = theme => ({
  root: {
    '&:last-child': {
      padding: 0
    }
  },
  toolbar: {
    height: 56,
    minHeight: 56,
    paddingRight: 2
  },
  spacer: {
    flex: '1 1 100%'
  },
  caption: {
    flexShrink: 0
  },
  input: {
    fontSize: 'inherit'
  },
  selectRoot: {
    marginRight: theme.spacing.unit * 4
  },
  select: {
    marginLeft: theme.spacing.unit,
    width: 34,
    textAlign: 'right',
    paddingRight: 22,
    color: theme.palette.text.secondary,
    height: 32,
    lineHeight: '32px'
  },
  actions: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  },
  icon: {
    position: 'absolute',
    right: 0,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

/**
 * Custom TablePagination component based on @material-ui/core's component, render back and forth icon buttons for changing
 * pages, and dropdown to select # of rows per page
 */
class TablePagination extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { count, onChangePage, rowsPerPage } = nextProps
    const newLastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    if (this.props.page > newLastPage) {
      onChangePage(null, newLastPage)
    }
  }

  /**
   * Handles when the 'back' button is clicked, goes back one page
   * @public
   * @param event
   */
  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  /**
   * Handles when the 'next' button is clicked, goes forward a page
   * @public
   * @param event
   */
  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  /**
   * Renders the value selected in the dropdown for number of rows per page
   * @public
   * @param selected
   * @returns {*}
   */
  renderSelectedNumber = selected => selected

  render() {
    const {
      classes,
      colSpan: colSpanProp,
      component: Component,
      count,
      labelDisplayedRows,
      labelRowsPerPage,
      onChangeRowsPerPage,
      page,
      rowsPerPage,
      rowsPerPageOptions,
      theme,
      onChangePage,
      ...other
    } = this.props

    let colSpan

    if (Component === TableCell || Component === 'td') {
      colSpan = colSpanProp || 1000 // col-span over everything
    }

    const themeDirection = theme && theme.direction
    const numberOptions = Object.keys(rowsPerPageOptions).length

    let selected = parseInt(rowsPerPage)
    if (rowsPerPage === 'All') {
      selected = count
    }

    return (
      <Component className={classes.root} colSpan={colSpan} {...other}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} />
          {numberOptions > 2 && (
            <Typography variant="caption" className={classes.caption}>
              {labelRowsPerPage}
            </Typography>
          )}
          {numberOptions > 2 && (
            <Select
              classes={{ root: classes.selectRoot, select: classes.select, icon: classes.icon }}
              input={
                <Input
                  classes={{ root: classes.input }}
                  disableUnderline
                  autoFocus={false}
                />
              }
              MenuProps={{
                disableAutoFocusItem: true,
                disableRestoreFocus: true
              }}
              value={rowsPerPage}
              renderValue={this.renderSelectedNumber}
              onChange={onChangeRowsPerPage}>
              {Object.keys(rowsPerPageOptions).map(rowsPerPageOption => (
                <MenuItem key={rowsPerPageOption} value={rowsPerPageOption}>
                  {rowsPerPageOptions[rowsPerPageOption].label}
                </MenuItem>
              ))}
              <MenuItem key="All" value="All">
                All
              </MenuItem>
            </Select>
          )}
          <Typography variant="caption" className={classes.caption}>
            {labelDisplayedRows({
              from: count === 0 ? 0 : page * selected + 1,
              to: Math.min(count, (page + 1) * selected),
              count,
              page
            })}
          </Typography>
          <div className={classes.actions}>
            <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Show previous page in table">
              {themeDirection === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / selected) - 1 || count === 0}
              aria-label="Show next page in table">
              {themeDirection === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
          </div>
        </Toolbar>
      </Component>
    )
  }
}

TablePagination.propTypes = {
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object.isRequired,
  /**
   * Sets colspan for component
   */
  colSpan: PropTypes.number,
  /**
   * Component to use to wrap the table pagination in
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Total row count
   */
  count: PropTypes.number.isRequired,
  /**
   * How should the rows be rendered
   */
  labelDisplayedRows: PropTypes.func,
  /**
   * Function or string to determine how to label the number of rows per page dropdown
   */
  labelRowsPerPage: PropTypes.node,
  /**
   * Function called when the used clicks the 'back' or 'next' arrows to change pages
   */
  onChangePage: PropTypes.func.isRequired,
  /**
   * Function called when the user selects a different option for rows per page to show
   */
  onChangeRowsPerPage: PropTypes.func.isRequired,
  /**
   * Current page to render
   */
  page: PropTypes.number.isRequired,
  /**
   * Options to show in the rows per page dropdown
   */
  rowsPerPageOptions: PropTypes.object,
  /**
   * Theme object from @material-ui/core
   */
  theme: PropTypes.object.isRequired
}

TablePagination.defaultProps = {
  component: TableCell,
  labelDisplayedRows: ({ from, to, count }) => `${from}-${to} of ${count}`,
  labelRowsPerPage: 'Rows per page:',
  rowsPerPageOptions: { 5: { label: '5' }, 10: { label: '10' }, 25: { label: '25' } },
  count: 0
}

export default withStyles(styles, { withTheme: true, name: 'MuiTablePagination' })(TablePagination)
