import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { Alert, FlexGrid, Button } from 'components'
import { getFileType } from 'utils/commonHelpers'

class FileUpload extends Component {
  static propTypes = {
    /**
     * Color of the dashed border for the container
     */
    containerBorderColor: PropTypes.string,
    /**
     * Color of the background of the container
     */
    containerBgColor: PropTypes.string,
    /**
     * Any additional style to be applied to the container
     */
    containerStyle: PropTypes.object,
    /**
     * 'Select files...' button content or text
     */
    buttonText: PropTypes.any,
    /**
     * Whether or not to allow multiple
     */
    allowMultiple: PropTypes.bool,
    /**
     * Container text
     */
    containerText: PropTypes.any,
    /**
     * Allowed file types
     */
    allowedFileTypes: PropTypes.string,
    /**
     * Callback for when files are added
     */
    handleAddFiles: PropTypes.func.isRequired,
    /**
     * Total # of files selected to know when to clear files input
     */
    numOfFiles: PropTypes.number,
    /**
     * info and whether or not to show overwrite alert
     */
    overwriteAlert: PropTypes.shape({
      enable: PropTypes.bool,
      text: PropTypes.any
    }),
    /**
     * A list of allowed extensions
     */
    allowedExtensions: PropTypes.arrayOf(PropTypes.string),
    /**
     * Whether folder dropping is allowed
     */
    allowFolderDrop: PropTypes.bool,
    /**
     * Maximum size allowed per file
     */
    maxSize: PropTypes.number
  }
  
  static defaultProps = {
    containerBorderColor: '#99D0E9',
    containerBgColor: '#f5fafa',
    containerText: 'or drag and drop here',
    buttonText: 'Select Files',
    allowMultiple: false,
    numOfFiles: 0,
    overwriteAlert: {
      enable: false,
      text: '',
      title: ''
    },
    allowedExtensions: [],
    allowFolderDrop: true,
    maxSize: 16000000
  }
  
  constructor(props, context) {
    super(props, context)
    this.inputRef = React.createRef()
    this.state = {
      alert: {
        open: false,
        type: '',
        title: '',
        text: ''
      },
      files: []
    }
  }
  
  componentDidUpdate(prevProps) {
    const { numOfFiles } = this.props
    if (prevProps.numOfFiles !== 0 && numOfFiles === 0) {
      this.inputRef.current.value = null
    }
  }
  
  /**
   * Check to see if we should show the overwrite alert
   */
  handleInitiateFileSelector = () => {
    const { overwriteAlert, numOfFiles } = this.props
    
    if (overwriteAlert.enable && numOfFiles > 0) {
      this.setState({
        alert: {
          open: true,
          type: 'overwrite',
          title: 'Warning'
        }
      })
    } else {
      this.inputRef.current.click()
    }
  }
  
  /**
   * User tried to upload invalid files. This determines the content of the alert to show to the user about the
   * invalid files found
   * @param invalidFiles
   * @param invalidType
   * @param invalidSize
   */
  showInvalidFileAlert = (invalidFiles, invalidType, invalidSize) => {
    const { allowedExtensions, maxSize } = this.props
    let extensions = allowedExtensions.map(extension => extension.startsWith('.') ? extension : `.${extension}`)
    extensions = allowedExtensions.length > 1 ? extensions.join(', ') : extensions[0]
    const size = maxSize / 1000000
    
    this.setState({
      alert: {
        text: invalidSize
          ? invalidType
            ? `The files listed below do not have a valid file type and / or exceed the maximum file size. These files will be removed from the list. Valid files types are ${extensions}. Maximum file size is ${size} MB.`
            : `The files listed below exceed the maximum allowed size of ${size} MB. These files will be removed from the list.`
          : `The files listed below do not have a valid file type. These files will be removed from the list. Valid file types are ${extensions}.`,
        type: 'files',
        title: invalidSize
          ? invalidType
            ? 'Invalid Files Found'
            : 'Maximum File Size Exceeded'
          : 'Invalid File Types',
        open: true
      },
      files: invalidFiles
    })
  }
  
  /**
   * User clicked 'cancel' in overwrite alert
   */
  onCloseAlert = () => {
    const { alert } = this.state
    this.setState({
      alert: {
        ...alert,
        open: false
      },
      files: []
    })
  }
  
  /**
   * User clicked 'continue' in overwrite alert
   */
  onContinueSelect = () => {
    this.onCloseAlert()
    this.inputRef.current.click()
  }
  
  /**
   * Handles getting all individual file entries
   * @param dataTransferItemList
   */
  getAllFileEntries = async dataTransferItemList => {
    const { allowMultiple, allowFolderDrop } = this.props
    let fileEntries = [], queue = []
    
    if (dataTransferItemList.length === 0) {
      return []
    }
    
    if (dataTransferItemList[0].webkitGetAsEntry().isDirectory && !allowFolderDrop) {
      this.setState({
        alert: {
          open: true,
          type: 'folder',
          title: 'Folder drop is not allowed',
          text: 'Dragging and dropping a folder is not allowed for this input.'
        }
      })
      return []
    } else {
      for (let i = 0; i < dataTransferItemList.length; i++) {
        queue.push(dataTransferItemList[i].webkitGetAsEntry())
      }
      
      while (queue.length > 0) {
        let entry = queue.shift()
        if (entry.isFile) {
          fileEntries.push(entry)
        } else if (entry.isDirectory) {
          queue.push(...await this.readAllDirectoryEntries(entry.createReader()))
        }
        
        if (queue.length === 0) {
          return allowMultiple ? fileEntries : fileEntries.slice(0, 1)
        }
      }
    }
  }
  
  /**
   * Get all the entries (files or sub-directories) in a directory
   * by calling readEntries until it returns empty array
   */
  readAllDirectoryEntries = async directoryReader => {
    let entries = []
    let readEntries = await this.readEntriesPromise(directoryReader)
    while (readEntries.length > 0) {
      entries.push(...readEntries)
      readEntries = await this.readEntriesPromise(directoryReader)
    }
    return entries
  }
  
  /**
   * Wrap readEntries in a promise to make working with readEntries easier
   * readEntries will return only some of the entries in a directory,  e.g. Chrome returns at most 100 entries at a time
   */
  readEntriesPromise = async directoryReader => {
    try {
      return await new Promise((resolve, reject) => directoryReader.readEntries(resolve, reject))
    } catch (err) {
      /* istanbul ignore next */
      console.log(err)
    }
  }
  
  /**
   * Verifies the file is of an allowed type and does not exceed the maximum size
   * @param file
   */
  verifyFile = async file => {
    let invalidType = false
    const { allowedExtensions, maxSize } = this.props
    const { fileType } = await getFileType(file)
    if (fileType !== undefined) {
      if (!allowedExtensions.includes(fileType)) {
        invalidType = true
      }
    } else {
      invalidType = true
    }
    
    return { file, invalidSize: file.size > maxSize, invalidType }
  }
  
  /**
   * Handle if the drag is a file or folder
   * @param e
   */
  onDrop = async e => {
    const { handleAddFiles, allowMultiple } = this.props
    e.preventDefault()
    
    const fileEntries = await this.getAllFileEntries(e.dataTransfer.items)
    let files = [], invalid = [], invalidTypes = false, invalidSizes = false
    if (fileEntries.length > 0) {
      for (let i = 0; i < fileEntries.length; i++) {
        fileEntries[i].file(async file => {
          const { file: doc, invalidSize, invalidType } = await this.verifyFile(file)
          if (invalidSize || invalidType) {
            invalidSizes = invalidSize ? true : invalidSizes
            invalidTypes = invalidType ? true : invalidTypes
            invalid.push({ file: doc, invalidSize, invalidType })
          } else {
            files.push(file)
          }
          
          if (i === fileEntries.length - 1) {
            if (invalid.length > 0) {
              this.showInvalidFileAlert(invalid, invalidTypes, invalidSizes)
            }
            handleAddFiles(allowMultiple ? files : files[0])
          }
        })
      }
    }
  }
  
  /**
   * Handles when the user selects files via input field
   * @param e
   */
  onSelectFiles = e => {
    const { handleAddFiles, allowMultiple } = this.props
    e.preventDefault()
    
    let files = []
    Array.from(Array(e.target.files.length).keys()).map(x => files.push(e.target.files.item(x)))
    handleAddFiles(allowMultiple ? files : files[0])
  }
  
  /**
   * Stop the browser from opening the document
   * @param e
   */
  onDragOver = e => {
    e.preventDefault()
  }
  
  render() {
    const {
      buttonText,
      containerBgColor,
      containerBorderColor,
      containerStyle,
      containerText,
      allowMultiple,
      allowedFileTypes,
      overwriteAlert
    } = this.props
    
    const { alert, files } = this.state
    
    const alertActions = alert.open && alert.type === 'overwrite'
      ? [
        {
          value: 'Continue',
          type: 'button',
          onClick: this.onContinueSelect
        }
      ] : []
    
    return (
      <>
        <form
          style={{ margin: '20px 0', flex: 1 }}
          id="drop_zone"
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
          encType="multipart/form-data"
          effectallowed="move">
          <FlexGrid
            container
            type="row"
            align="center"
            justify="flex-start"
            style={{
              borderRadius: 4,
              height: 64,
              paddingLeft: 10,
              backgroundColor: containerBgColor,
              border: `3px dashed ${containerBorderColor}`,
              ...containerStyle
            }}>
            <Button
              raised
              color="white"
              textColor="black"
              onClick={this.handleInitiateFileSelector}
              value={buttonText}
            />
            <FlexGrid flex container type="row" style={{ position: 'relative', height: '100%' }}>
              <input
                ref={this.inputRef}
                multiple={allowMultiple}
                type="file"
                onChange={this.onSelectFiles}
                style={{ opacity: 0, height: '100%', width: '100%', position: 'absolute' }}
                accept={allowedFileTypes}
              />
              <Typography
                variant="body2"
                style={{ color: '#646465', marginLeft: 10, alignSelf: 'center' }}>
                {containerText}
              </Typography>
            </FlexGrid>
          </FlexGrid>
        </form>
        <Alert
          open={alert.open}
          actions={alertActions}
          closeButton={{ value: alert.type === 'overwrite' ? 'Cancel' : 'Dismiss' }}
          onCloseAlert={this.onCloseAlert}
          title={alert.title}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {alert.type === 'overwrite' && overwriteAlert.text}
            {['folder', 'files'].includes(alert.type) && alert.text}
          </Typography>
          {alert.type === 'files' && <FlexGrid type="row" style={{ overflow: 'auto', paddingTop: 20 }}>
            {files.map((doc, index) => {
              return (
                <FlexGrid
                  container
                  type="row"
                  justify="space-between"
                  align="center"
                  key={`doc-${index}`}
                  style={{
                    padding: 8,
                    backgroundColor: index % 2 === 0
                      ? '#f9f9f9'
                      : 'white',
                    minHeight: 24
                  }}>
                  <Typography style={{ fontSize: '.9125rem' }}>
                    {doc.file.name}
                  </Typography>
                  {doc.invalidSize && <Typography style={{ fontSize: '.9125rem' }}>
                    {(doc.file.size / (1000 * 1000)).toFixed(1)} MB
                  </Typography>}
                </FlexGrid>
              )
            })}
          </FlexGrid>}
        </Alert>
      </>
    )
  }
}

export default FileUpload
