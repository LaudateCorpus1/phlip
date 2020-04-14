import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import { CircularLoader, Icon, SimpleInput } from 'components'
import { createAutocompleteReducer } from 'data/autocomplete/reducer'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'
import hoistNonReactStatic from 'hoist-non-react-statics'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import theme from 'services/theme'

const defaultAutocomplete = {
  showSearchIcon: false, inputProps: {}
}

/**
 * Autocomplete HOC
 * @param type
 * @param suffix
 * @param initialRequest
 * @param otherAutoProps
 * @returns {function(*=)}
 */
export const withAutocompleteMethods = (
  type,
  suffix,
  otherAutoProps = defaultAutocomplete,
  initialRequest = true
) =>
  WrappedComponent => {
    const reduxType = type.toUpperCase()
    const reduxSuffix = `_${suffix.toUpperCase()}`
    const actions = makeAutocompleteActionCreators(reduxType, reduxSuffix)
    const reducer = createAutocompleteReducer(reduxType, reduxSuffix)
    const key = `autocomplete.${type}.${suffix}`
    
    /**
     * Classes passed to Autosuggest
     * @param theme
     * @returns
     * istanbul ignore next
     */
    const classes = theme => ({
      suggestionsContainerOpen: {
        width: '100%',
        maxHeight: 500,
        overflow: 'auto',
        '& div:last-child': {
          borderBottom: 'none'
        },
        display: 'flex',
        flexDirection: 'column',
        flex: '0 1 auto'
      },
      suggestion: {
        display: 'block'
      },
      suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        maxHeight: 220
      },
      sectionContainer: {
        margin: '0 10px',
        borderBottom: `1px dashed ${theme.palette.primary['600']}`
      },
      container: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }
    })
    
    class Autocomplete extends Component {
      static contextTypes = {
        store: PropTypes.object
      }
      
      constructor(props, context) {
        super(props, context)
        context.store.injectReducer(key, reducer)
      }
      
      componentWillUnmount() {
        this.handleClearAll()
      }
      
      /**
       * Clears suggestions, searching value, spinner
       */
      handleClearAll = () => {
        const actions = this.props[`${type}AutoActions`]
        actions.clearAll()
      }
      
      /**
       * Get suggestions for some type of autocomplete search
       * @param suggestionType
       * @param searchString
       */
      handleGetSuggestions = ({ value: searchString }) => {
        const actions = this.props[`${type}AutoActions`]
        const { user, currentUser } = this.props
        
        const userId = user === undefined
          ? currentUser === undefined
            ? null
            : currentUser.id
          : user.id
        
        if (searchString === '') {
          if (initialRequest) {
            actions.getInitialSuggestionsRequest(userId, 30, reduxSuffix)
          }
        } else {
          actions.searchForSuggestionsRequest(searchString, reduxSuffix)
        }
      }
      
      /**
       * When a user has chosen a suggestion from the autocomplete project or jurisdiction list
       */
      handleSuggestionSelected = (event, { suggestionValue }) => {
        const actions = this.props[`${type}AutoActions`]
        actions.onSuggestionSelected(suggestionValue)
      }
      
      /**
       * When the search field value changes
       * @param value
       */
      handleSearchValueChange = value => {
        const actions = this.props[`${type}AutoActions`]
        actions.updateSearchValue(value)
      }
      
      /**
       * Clears autocomplete lists
       */
      handleClearSuggestions = () => {
        const actions = this.props[`${type}AutoActions`]
        actions.clearSuggestions()
      }
      
      /**
       * Checks if suggestions should be rendered
       * @param value
       * @returns {boolean}
       */
      shouldRenderSuggestions = value => {
        if (!initialRequest) {
          return value !== undefined ? value.trim().length >= 3 : true
        } else {
          return true
        }
      }
      
      /**
       * Renders the actual input field
       * @param value
       * @param onBlur
       * @param ref
       * @param TextFieldProps
       * @param InputProps
       * @param other
       */
      renderInput = ({ value, ref, TextFieldProps, InputProps, ...other }) => {
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
          />
        )
      }
      
      /**
       * Renders the list container for all of the suggestions
       *
       * @param containerProps
       * @param children
       * @returns {*}
       */
      renderSuggestionsContainer = ({ containerProps, children }) => {
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
      getSuggestionValue = suggestion => suggestion
      
      /**
       * Default function for rendering suggestions
       * @param suggestion
       * @param query
       * @param isHighlighted
       * @returns {*}
       */
      renderSuggestion = (suggestion, { query, isHighlighted }) => {
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
      
      render() {
        const { suggestions, searching, searchValue, selectedSuggestion, classes, ...otherProps } = this.props
        let otherAutocompleteProps = otherAutoProps
        
        if (Object.keys(otherAutocompleteProps).length === 0) {
          otherAutocompleteProps = defaultAutocomplete
        }
        
        const spinnerSize = otherAutocompleteProps.inputProps.style
          ? otherAutocompleteProps.inputProps.style.fontSize
            ? otherAutocompleteProps.inputProps.style.fontSize
            : 20
          : 20
        
        const showSearchIcon = otherAutocompleteProps.showSearchIcon
        
        const autocompleteProps = {
          theme: {
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
            sectionContainer: classes.sectionContainer
          },
          suggestions,
          onSuggestionsFetchRequested: this.handleGetSuggestions,
          onSuggestionsClearRequested: this.handleClearSuggestions,
          getSuggestionValue: this.getSuggestionValue,
          shouldRenderSuggestions: this.shouldRenderSuggestions,
          onSuggestionSelected: this.handleSuggestionSelected,
          renderSuggestion: this.renderSuggestion,
          renderSuggestionsContainer: this.renderSuggestionsContainer,
          renderInputComponent: this.renderInput,
          inputProps: {
            TextFieldProps: {
              placeholder: `Search ${type}s`,
              fullWidth: true
            },
            InputProps: (searching || showSearchIcon) ? {
              style: { 'alignItems': 'center' },
              endAdornment: (
                <InputAdornment style={{ marginTop: 0, height: 24 }} position="end" disableTypography>
                  {searching &&
                  <CircularLoader
                    size={spinnerSize}
                    style={{ height: spinnerSize, width: spinnerSize }}
                    thickness={4}
                    color="primary"
                    type="indeterminate"
                  />}
                  {!searching && showSearchIcon && <Icon color={theme.palette.greyText}>search</Icon>}
                </InputAdornment>
              )
            } : {},
            value: searchValue,
            onChange: (e, { newValue }) => {
              e.target.value === undefined
                ? this.handleSearchValueChange(newValue.name)
                : this.handleSearchValueChange(e.target.value)
            },
            id: `${suffix}-${type}-name-search`,
            ...otherAutocompleteProps.inputProps
          },
          selectedSuggestion,
          searchValue
        }
        
        return (
          <WrappedComponent
            {...{
              [`${type}AutocompleteProps`]: autocompleteProps,
              ...otherProps
            }}
          />
        )
      }
    }
    
    hoistNonReactStatic(Autocomplete, WrappedComponent)
    
    /* istanbul ignore next */
    const mapStateToProps = state => {
      if (state[key]) {
        const autoState = state[key]
        return {
          suggestions: autoState.suggestions,
          selectedSuggestion: autoState.selectedSuggestion,
          searchValue: autoState.searchValue,
          searching: autoState.searching
        }
      } else {
        return {
          suggestions: [],
          selectedSuggestion: {},
          searchValue: '',
          searching: false
        }
      }
    }
    
    /* istanbul ignore next */
    const mapDispatchToProps = dispatch => ({
      [`${type}AutoActions`]: bindActionCreators(actions, dispatch)
    })
    
    return connect(mapStateToProps, mapDispatchToProps)(withStyles(classes)(Autocomplete))
  }

export default withAutocompleteMethods
