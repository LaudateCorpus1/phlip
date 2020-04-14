import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactFileReader from 'react-file-reader'
import { Alert } from 'components'
import Typography from '@material-ui/core/Typography'
import compressImage from 'browser-compress-image'

export class ImageFileReader extends Component {
  state = {
    open: false
  }
  
  handleFiles = files => {
    const { maxSize, handleFiles } = this.props
    
    if (files.fileList[0].size > maxSize) {
      this.setState({ open: true })
    } else {
      compressImage(files.fileList[0], 0.2).then(({ shrunkBase64, compressedFile }) => {
        files.file = compressedFile
        files.base64 = shrunkBase64
        handleFiles(files)
      })
    }
  }
  
  /**
   * Closes alert that displays when the user tries to upload an image that is too large
   * @public
   */
  onAlertClose = () => {
    this.setState({ open: false })
  }
  
  render() {
    const { base64, fileTypes, children } = this.props
    const { open } = this.state
    
    return (
      <>
        <Alert onCloseAlert={this.onAlertClose} open={open} closeButton={{ value: 'Dismiss' }} title="Image Too Large">
          <Typography variant="body1">
            Maximum image file size is 500KB. Please try another image.
          </Typography>
        </Alert>
        <ReactFileReader base64={base64} fileTypes={fileTypes} handleFiles={this.handleFiles}>
          {children}
        </ReactFileReader>
      </>
    )
  }
}

ImageFileReader.propTypes = {
  children: PropTypes.any,
  fileTypes: PropTypes.array,
  base64: PropTypes.bool,
  handleFiles: PropTypes.func,
  maxSize: PropTypes.number
}

ImageFileReader.defaultProps = {
  maxSize: 500000,
  fileTypes: ['jpg', 'png'],
  base64: true
}

export default ImageFileReader
