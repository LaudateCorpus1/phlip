import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { CircularLoader, Icon, SimpleInput } from 'components'

/**
 * Classes passed to Autosuggest
 * @param theme
 * @returns
 */
/* istanbul ignore next */
const classes = theme => ({
  suggestionsContainerOpen: {
    width: '100%',
    position: 'absolute',
    maxHeight: 500,
    overflow: 'auto',
    '& div:last-child': {
      borderBottom: 'none'
    },
    display: 'block'
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    maxHeight: 250
  },
  sectionContainer: {
    margin: '0 10px',
    borderBottom: `1px dashed ${theme.palette.primary['600']}`
  },
  container: {
    width: '100%',
    position: 'relative'
  }
})

/**
 * Renders the actual input field
 * @param value
 * @param onBlur
 * @param ref
 * @param TextFieldProps
 * @param InputProps
 * @param other
 */
const renderInput = ({ value, ref, TextFieldProps, InputProps, ...other }) => {
  return (
    <SimpleInput
      shrinkLabel
      inputRef={ref}
      value={value}
      {...TextFieldProps}
      multiline={false}
      InputProps={{
        inputProps: other,
        ...InputProps
      }}
    />)
}

/**
 * Renders the list container for all of the suggestions
 *
 * @param containerProps
 * @param children
 * @returns {*}
 */
const renderSuggestionsContainer = ({ containerProps, children }) => {
  return (
    <Paper {...containerProps} style={{ zIndex: 20000000 }} square>
      {children}
    </Paper>
  )
}

/**
 * Default function for getting suggestion value
 * @param suggestion
 * @returns {*}
 */
const getSuggestionValue = suggestion => suggestion

/**
 * Default function for rendering suggestions
 * @param suggestion
 * @param query
 * @param isHighlighted
 * @returns {*}
 */
const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)
  
  return (
    <MenuItem selected={isHighlighted} component="div" style={{ height: 'auto', whiteSpace: 'unset' }}>
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

/**
 * Autosuggest / Autocomplete input field, renders a list of suggestions based on the input
 * @component
 */
export const Autocomplete = props => {
  const {
    suggestions,
    classes,
    InputProps,
    inputProps,
    handleGetSuggestions,
    handleClearSuggestions,
    handleSuggestionSelected,
    renderSuggestion,
    getSuggestionValue,
    showSearchIcon,
    theme,
    suggestionType,
    isSearching
  } = props
  
  /**
   * Determines if the suggestions should be rendered. Only renders if the input length >= 3
   * @param value
   * @returns {boolean}
   */
  const shouldRenderSuggestions = (value) => {
    if (suggestionType !== 'project') {
      return value !== undefined ? value.trim().length >= 3 : true
    } else {
      return true
    }
  }
  
  const spinnerSize = inputProps.style
    ? inputProps.style.fontSize
      ? inputProps.style.fontSize
      : 20
    : 20
  
  return (
    <Autosuggest
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        sectionContainer: classes.sectionContainer
      }}
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleGetSuggestions}
      onSuggestionsClearRequested={handleClearSuggestions}
      renderSuggestionsContainer={renderSuggestionsContainer}
      renderInputComponent={renderInput}
      inputProps={{
        TextFieldProps: InputProps,
        InputProps: (isSearching || showSearchIcon) ? {
          style: { 'alignItems': 'center' },
          endAdornment: (
            <InputAdornment style={{ marginTop: 0, height: 24 }} position="end" disableTypography>
              {isSearching &&
              <CircularLoader size={spinnerSize} thickness={4} color="primary" type="indeterminate" />}
              {!isSearching && showSearchIcon && <Icon color={theme.palette.greyText}>search</Icon>}
            </InputAdornment>
          )
        } : {},
        ...inputProps
      }}
      shouldRenderSuggestions={shouldRenderSuggestions}
      onSuggestionSelected={handleSuggestionSelected}
      renderSuggestion={renderSuggestion}
      getSuggestionValue={getSuggestionValue}
    />
  )
}

Autocomplete.propTypes = {
  /**
   * List of suggestions to render
   */
  suggestions: PropTypes.array,
  /**
   * Suggestion value (what the user has typed in)
   */
  suggestionValue: PropTypes.string,
  /**
   * List of classes from @material-ui/core theme provider
   */
  classes: PropTypes.object,
  /**
   * Any props you to want to pass to the TextField component
   */
  InputProps: PropTypes.object,
  /**
   * Props to send to the actual input or InputProps component
   */
  inputProps: PropTypes.object,
  /**
   * Handles retrieving suggestions
   */
  handleGetSuggestions: PropTypes.func,
  /**
   * Handles clearing the suggestions array
   */
  handleClearSuggestions: PropTypes.func,
  /**
   * Handles when the user changes their input (suggestion value)
   */
  handleSuggestionValueChange: PropTypes.func,
  /**
   * Handles when a user clicks on a suggestion
   */
  handleSuggestionSelected: PropTypes.func,
  /**
   * Render each suggestion in the list
   */
  renderSuggestion: PropTypes.func,
  /**
   * Returns the suggestion value
   */
  getSuggestionValue: PropTypes.func,
  /**
   * Show search icon
   */
  showSearchIcon: PropTypes.bool,
  /**
   * App theme
   */
  theme: PropTypes.object,
  /**
   *  suggestion type
   */
  suggestionType: PropTypes.string,
  /**
   * Is searching
   */
  isSearching: PropTypes.bool
}

Autocomplete.defaultProps = {
  renderSuggestion: renderSuggestion,
  getSuggestionValue: getSuggestionValue,
  showSearchIcon: false,
  isSearching: false,
  inputProps: {
    style: {}
  }
}

export default withStyles(classes, { withTheme: true })(Autocomplete)
