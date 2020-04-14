import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { withTheme } from '@material-ui/core/styles'

/**
 * Search input field
 */
export const SearchBar = ({ searchValue, handleSearchValueChange, shrinkLabel, placeholder, theme, ...otherProps }) => {
  return (
    <TextField
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder={placeholder}
      InputProps={{
        style: { 'alignItems': 'center' },
        endAdornment: (
          <InputAdornment
            style={{ marginTop: 0, height: 24 }}
            position="end"
            disableTypography><Icon color={theme.palette.greyText}>search</Icon>
          </InputAdornment>
        ),
        inputProps: { 'aria-label': 'Search' }
      }}
      type="search"
      id="search-bar"
      InputLabelProps={{
        shrink: shrinkLabel || false
      }}
      {...otherProps}
    />
  )
}

SearchBar.propTypes = {
  /**
   * Value of the text input field
   */
  searchValue: PropTypes.string,
  /**
   * Function to call when the user changes their input
   */
  handleSearchValueChange: PropTypes.func,
  /**
   * Placeholder for the search text field
   */
  placeholder: PropTypes.string,
  /**
   * Theme provided by @material-ui/core
   */
  theme: PropTypes.object
}

SearchBar.defaultProps = {
  placeholder: 'Search'
}

export default withTheme()(SearchBar)