import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { convertToLocalDate } from 'utils/normalize'
import { IconButton, Icon, DatePicker, SimpleInput, Tooltip, CircularLoader } from 'components'
import Autosuggest from 'react-autosuggest'
import Grid from 'components/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import { withStyles } from '@material-ui/core/styles'

/* istanbul ignore next */
const styles = () => ({
  suggestionsContainerOpenAbsolute: {
    width: '100%',
    maxHeight: 500,
    overflow: 'auto',
    position: 'absolute',
    '& div:last-child': {
      borderBottom: 'none'
    }
  },
  container: {
    width: '100%',
    position: 'relative'
  }
})

const fileTypeIcons = {
  'pdf': 'picture_as_pdf',
  'doc.*|rtf': 'library_books',
  'png|jpe?g|tiff': 'insert_photo'
}

/**
 * Determines the file icon to show next to name based on file type (extension)
 * @param extension
 * @returns {string}
 */
const getIconType = extension => {
  let icon = 'library_books'
  
  for (const type in fileTypeIcons) {
    const regex = new RegExp(type, 'g')
    if (extension.match(regex) !== null) {
      icon = fileTypeIcons[type]
    }
  }
  return icon
}

/**
 * @component
 */
export class FileList extends Component {
  static propTypes = {
    /**
     * Array of documents the user has selected for upload
     */
    selectedDocs: PropTypes.array,
    /**
     * Removes document from selectedDocs array
     */
    handleRemoveDoc: PropTypes.func,
    /**
     * Enables editing on a column and row
     */
    toggleRowEditMode: PropTypes.func,
    /**
     * Gets the list of jurisdiction suggestions for a row
     */
    onGetSuggestions: PropTypes.func,
    /**
     * Clears the list of jurisdiction suggestions for a row
     */
    onClearSuggestions: PropTypes.func,
    /**
     * Handles when one of the properties changes
     */
    handleDocPropertyChange: PropTypes.func,
    /**
     * invalid files because of size or type
     */
    invalidFiles: PropTypes.array,
    /**
     * All props to pass to jurisdiction autocomplete
     */
    jurisdictionAutocompleteProps: PropTypes.object,
    /**
     * Classes from material-ui withStyles HOC
     */
    classes: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  /**
   * For when a column property has changed in the file list
   * @param index
   * @param propName
   * @param value
   */
  onDocPropertyChange = (index, propName, value) => {
    const { handleDocPropertyChange } = this.props
    handleDocPropertyChange(index, propName, value)
  }
  
  /**
   * For getting jurisdiction suggestions
   * @param index
   * @returns {Function}
   */
  getSuggestions = index => searchValue => {
    const { onGetSuggestions } = this.props
    onGetSuggestions(searchValue, index)
  }
  
  /**
   * For clearing jurisdiction suggestions
   * @param index
   * @returns {Function}
   */
  clearSuggestions = index => () => {
    const { onClearSuggestions } = this.props
    onClearSuggestions(index)
  }
  
  /**
   * Toggle edit mode for a row
   * @returns {*}
   */
  toggleEditMode = (index, property) => () => {
    const { toggleRowEditMode } = this.props
    toggleRowEditMode(index, property)
  }
  
  /**
   * When the search field for autocomplete changes
   * @param index
   * @param type
   * @param currentPropValue
   * @returns {Function}
   */
  onAutocompleteChange = (index, type, currentPropValue) => (e, { newValue }) => {
    this.onDocPropertyChange(index, type, {
      ...currentPropValue,
      searchValue: e.target.value
    })
  }
  
  /**
   * Remove doc
   * @returns {*}
   */
  handleRemoveDoc = index => () => {
    const { handleRemoveDoc } = this.props
    handleRemoveDoc(index)
  }
  
  render() {
    const columns = [
      'File Name',
      'Jurisdiction',
      'Effective Date',
      'Citation'
    ]
    
    const columnSizing = `20px minmax(${300}px, 1fr) 210px 222px 215px 45px`
    const wrapperRowSizing = '1fr'
    const headerStyle = { fontSize: '18px', borderBottom: '1px solid black', padding: '10px 10px' }
    const colStyle = { fontSize: 13, alignSelf: 'center', margin: '0 10px' }
    
    const { selectedDocs, invalidFiles, jurisdictionAutocompleteProps, classes } = this.props
    
    return (
      <Grid rowSizing="55px 1fr" columnSizing="1fr" style={{ overflow: 'auto', flex: 1 }}>
        <Grid columnSizing={columnSizing} rowSizing={wrapperRowSizing} style={{ padding: '10px 0 0 0' }}>
          <div style={{ borderBottom: '1px solid black' }} />
          {columns.map((column, i) => (
            <div style={headerStyle} key={`file-list-col-${i}`}>
              {column}
            </div>
          ))}
          <div style={{ borderBottom: '1px solid black' }} />
        </Grid>
        <Grid columnSizing="1fr" autoRowSizing="60px" style={{ flex: 1 }} id="uploadFileList">
          {selectedDocs.map((doc, i) => {
            const isDuplicate = doc.isDuplicate || doc.hasError
            const isInvalid = invalidFiles.find(file => file.name === doc.name.value) !== undefined
            const pieces = doc.name.value.split('.')
            const extension = pieces[pieces.length - 1]
            const iconName = getIconType(extension)
            const bgColor = i % 2 === 0
              ? '#f9f9f9'
              : '#fff'
            
            const inputProps = {
              InputProps: {
                style: { 'alignItems': 'center' },
                endAdornment: doc.jurisdictions.searching && (
                  <InputAdornment style={{ marginTop: 0, height: 24 }} position="end" disableTypography>
                    <CircularLoader
                      size={20}
                      thickness={4}
                      color="primary"
                      type="indeterminate"
                    />
                  </InputAdornment>
                ),
                error: !!doc.jurisdictions.error
              }
            }
            
            return (
              <Grid
                key={`file-list-row-${i}`}
                columnSizing={columnSizing}
                rowSizing="44px"
                style={{ backgroundColor: bgColor, padding: '8px 0' }}>
                <div />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {(isDuplicate || isInvalid) &&
                  <Tooltip
                    text={doc.isDuplicate
                      ? 'Duplicate document'
                      : doc.hasError
                        ? 'File upload failed'
                        : 'Invalid File'}>
                    <Icon size={25} style={{ alignSelf: 'center', marginRight: 5 }} color="#fc515a">error</Icon>
                  </Tooltip>}
                  {!isDuplicate && <Icon size={20} style={{ alignSelf: 'center', marginRight: 5 }}>{iconName}</Icon>}
                  <div style={colStyle}>{doc.name.value}</div>
                </div>
                {doc.jurisdictions.editable
                  ? doc.jurisdictions.inEditMode
                    ? (
                      <div style={{ ...colStyle, position: 'relative' }}>
                        <Autosuggest
                          {...jurisdictionAutocompleteProps}
                          suggestions={doc.jurisdictions.value.suggestions}
                          onSuggestionsFetchRequested={this.getSuggestions(i)}
                          onSuggestionsClearRequested={this.clearSuggestions(i)}
                          onSuggestionSelected={(event, { suggestionValue }) => {
                            this.onDocPropertyChange(i, 'jurisdictions', {
                              ...suggestionValue,
                              searchValue: suggestionValue.name
                            })
                          }}
                          inputProps={{
                            ...jurisdictionAutocompleteProps.inputProps,
                            value: doc.jurisdictions.value.searchValue,
                            onChange: this.onAutocompleteChange(i, 'jurisdictions', doc.jurisdictions.value),
                            id: `jurisdiction-name-row-${i}`,
                            ...inputProps
                          }}
                          theme={{
                            ...jurisdictionAutocompleteProps.theme,
                            suggestionsContainerOpen: classes.suggestionsContainerOpenAbsolute,
                            container: classes.container
                          }}
                        />
                      </div>)
                    : (
                      <IconButton onClick={this.toggleEditMode(i, 'jurisdictions')} color="primary" style={colStyle}>
                        create
                      </IconButton>
                    )
                  : <div style={colStyle}>{doc.jurisdictions.value.name}</div>
                }
                {doc.effectiveDate.editable
                  ? doc.effectiveDate.inEditMode
                    ? (
                      <div style={colStyle}>
                        <DatePicker
                          name="effectiveDate"
                          dateFormat="MM/DD/YYYY"
                          onChange={date => this.onDocPropertyChange(i, 'effectiveDate', date)}
                          onInputChange={e => this.onDocPropertyChange(i, 'effectiveDate', e.target.value)}
                          value={doc.effectiveDate.value}
                          autoOk={true}
                          InputAdornmentProps={{ style: { marginLeft: 0 } }}
                          style={{ marginTop: 0 }}
                        />
                      </div>
                    )
                    : (
                      <IconButton onClick={this.toggleEditMode(i, 'effectiveDate')} color="primary" style={colStyle}>
                        create
                      </IconButton>
                    )
                  : <div style={colStyle}>{convertToLocalDate(doc.effectiveDate.value.split('T')[0])}</div>
                }
                {doc.citation.editable
                  ? doc.citation.inEditMode
                    ? <SimpleInput
                      fullWidth={false}
                      multiline={false}
                      style={colStyle}
                      value={doc.citation.value}
                      onChange={e => this.onDocPropertyChange(i, 'citation', e.target.value)}
                    />
                    : (
                      <IconButton onClick={this.toggleEditMode(i, 'citation')} color="primary" style={colStyle}>
                        create
                      </IconButton>
                    )
                  : <div style={colStyle}>{doc.citation.value}</div>
                }
                <IconButton
                  style={{ justifySelf: 'flex-end', ...colStyle }}
                  onClick={this.handleRemoveDoc(i)}
                  iconSize={24}
                  color="primary">
                  cancel
                </IconButton>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(FileList)
