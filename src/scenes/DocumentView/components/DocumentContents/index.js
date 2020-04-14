import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FlexGrid from 'components/FlexGrid'
import PDFViewer from 'components/PDFViewer'
import Typography from '@material-ui/core/Typography'
import { ApiErrorView } from 'components'

/**
 * Just handles showing the document contents in a PDFViewer
 */
export class DocumentContents extends Component {
  static propTypes = {
    /**
     * Actual document
     */
    document: PropTypes.object,
    /**
     * _id of document
     */
    id: PropTypes.string,
    /**
     * Error if any while retrieving contents
     */
    error: PropTypes.string
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  render() {
    const { document, error, id } = this.props
    
    return (
      <FlexGrid
        raised
        container
        flex
        style={{ overflow: 'hidden', flexBasis: '70%', padding: 20, minWidth: '65%' }}
        id={id}>
        <FlexGrid container style={{ display: 'inline-flex', position: 'relative', marginBottom: 10 }}>
          <Typography variant="caption" style={{ fontSize: '.65rem', color: '#9e9e9e', marginBottom: 2 }}>
            Document Name
          </Typography>
          <Typography variant="subheading" id="docName">{document.name}</Typography>
        </FlexGrid>
        {error !== '' && <ApiErrorView error={error} />}
        {document.content.data && <PDFViewer document={document} showAnnoModeAlert={false} isView />}
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  document: state.scenes.docView.meta.document || {},
  error: state.scenes.docView.meta.error || ''
})

export default connect(mapStateToProps)(DocumentContents)
