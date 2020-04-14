import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import DocumentContents from './components/DocumentContents'
import DocumentMeta from './components/DocumentMeta'

export class DocumentView extends Component {
  static propTypes = {
    document: PropTypes.object,
    documentRequestInProgress: PropTypes.bool,
    documentUpdateInProgress: PropTypes.bool,
    actions: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    documentDeleteInProgress: PropTypes.bool,
    documentDeleteError: PropTypes.bool,
    goBack: PropTypes.object,
    title: PropTypes.string
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const { actions, location } = this.props
    
    document.title = `PHLIP - ${location.state.document.name} - View`
    actions.initState(location.state.document)
    actions.getDocumentContentsRequest(location.state.document._id)
  }

  componentWillUnmount() {
    this.props.actions.clearDocument()
  }
  
  /**
   * Goes back to document management list
   */
  onGoBack = () => {
    this.props.history.push('/docs')
  }

  render() {
    const {
      document, documentRequestInProgress, documentUpdateInProgress, documentDeleteError, documentDeleteInProgress
    } = this.props
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <PageHeader
          onBackButtonClick={this.onGoBack}
          pageTitle="View Document"
          protocolButton={false}
          projectName=""
        />
        <FlexGrid container type="row" flex style={{ height: '100%' }}>
          <DocumentContents loading={documentRequestInProgress} id='docContainer' />
          <FlexGrid style={{ flexBasis: '2%' }} />
          <FlexGrid container type="column" style={{ flexBasis: '25%', flex: '1 1 25%' }} id = 'docMeta'>
            <DocumentMeta
              document={document}
              loading={documentRequestInProgress}
              updating={documentUpdateInProgress}
              documentDeleteError={documentDeleteError}
              documentDeleteInProgress={documentDeleteInProgress}
              goBack={this.onGoBack}
            />
          </FlexGrid>
        </FlexGrid>
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docState = state.scenes.docView.meta
  
  return {
    document: docState.document,
    documentRequestInProgress: docState.documentRequestInProgress,
    documentUpdatingInProgress: docState.documentUpdateInProgress,
    documentDeleteInProgress: docState.documentDeleteInProgress,
    documentDeleteError: docState.documentDeleteError
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)
