import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { withTheme } from '@material-ui/core/styles'

/**
 * Search input field
 */
export const SearchBox = props => {
  const {
    searchValue, handleSearchValueChange, shrinkLabel, placeholder, theme, searchIcon = 'search', InputProps, ...otherProps
  } = props

  return (
    <TextField
      value={searchValue}
      onChange={handleSearchValueChange}
      placeholder={placeholder}
      InputProps={{
        style: { alignItems: 'center', display: 'flex' },
        startAdornment: (
          <InputAdornment style={{ marginTop: 0, height: 20 }} position="start">
            <Icon size={20} color={theme.palette.greyText}>{searchIcon}</Icon>
          </InputAdornment>
        ),
        inputProps: { 'aria-label': 'Search' },
        disableUnderline: true,
        ...InputProps
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

SearchBox.propTypes = {
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

SearchBox.defaultProps = {
  placeholder: 'Search'
}

export default withTheme()(SearchBox)