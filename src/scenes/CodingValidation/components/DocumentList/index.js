import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import theme from 'services/theme'
import { FlexGrid, Icon, PDFViewer, ApiErrorView, CircularLoader, ApiErrorAlert, IconButton } from 'components'
import { FormatQuoteClose } from 'mdi-material-ui'
import AnnotationFinder from './components/AnnotationFinder'
import moment from 'moment'

export class DocumentList extends Component {
  static propTypes = {
    actions: PropTypes.object,
    jurisdiction: PropTypes.object,
    project: PropTypes.object,
    page: PropTypes.oneOf(['coding', 'validation']),
    documents: PropTypes.array,
    annotatedDocs: PropTypes.array,
    docSelected: PropTypes.bool,
    openedDoc: PropTypes.object,
    enabledAnswerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    annotations: PropTypes.array,
    annotationModeEnabled: PropTypes.bool,
    isValidation: PropTypes.bool,
    questionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    saveUserAnswer: PropTypes.func,
    apiError: PropTypes.shape({
      text: PropTypes.string,
      title: PropTypes.string,
      open: PropTypes.bool,
      alertOrView: PropTypes.oneOf(['alert', 'view'])
    }),
    shouldShowAnnoModeAlert: PropTypes.bool,
    currentAnnotationIndex: PropTypes.number,
    showEmptyDocs: PropTypes.bool,
    scrollTop: PropTypes.bool,
    gettingDocs: PropTypes.bool,
    annotationUsers: PropTypes.array,
    enabledUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    downloading: PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.any,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }

  static defaultProps = {
    actions: {},
    documents: [],
    annotations: [],
    showEmptyDocs: false,
    apiError: {
      text: '',
      title: '',
      open: false,
      alertOrView: 'view'
    },
    currentAnnotationIndex: 0,
    scrollTop: false,
    gettingDocs: false,
    downloading: {
      name: '',
      id: '',
      content: ''
    }
  }

  constructor(props, context) {
    super(props, context)
    this.downloadRef = React.createRef()
  }

  state = {
    noTextContent: 2
  }

  componentDidMount() {
    const { actions, project, jurisdiction, page } = this.props
    actions.getApprovedDocumentsRequest(project.id, jurisdiction.jurisdictionId, page)
  }

  componentDidUpdate(prevProps) {
    const { scrollTop, docSelected, annotationModeEnabled, downloading } = this.props

    if (!prevProps.scrollTop && scrollTop && docSelected) {
      if (!annotationModeEnabled) {
        this.scrollTop()
      }
    }

    if (prevProps.downloading.content === '' && downloading.content !== '') {
      this.prepareDocumentDownload()
    }
  }

  componentWillUnmount() {
    this.clearDocSelected()
  }

  /*
   * Called when user chooses to save an annotation
   */
  handleSaveAnnotation = annotation => {
    const { actions, saveUserAnswer, enabledAnswerId, questionId } = this.props

    actions.saveAnnotation(annotation, enabledAnswerId, questionId)
    saveUserAnswer()
    actions.toggleAnnotationMode(questionId, enabledAnswerId, false)
  }

  /**
   * Remove annotation
   * @param index
   */
  handleRemoveAnnotation = index => {
    const { actions, saveUserAnswer, enabledAnswerId, questionId } = this.props

    actions.removeAnnotation(index, enabledAnswerId, questionId)
    saveUserAnswer()
    actions.toggleAnnotationMode(questionId, enabledAnswerId, false)
  }

  /**
   * Scrolls to top of document
   */
  handleFinishedRendering = () => {
    const { annotationModeEnabled } = this.props
    if (!annotationModeEnabled) {
      this.scrollTop()
    }
  }

  /**
   * Gets the actual document contents when a document is clicked
   */
  getContents = id => () => {
    const { actions } = this.props
    actions.getDocumentContentsRequest(id)
  }

  /**
   * Clears what document is selected
   */
  clearDocSelected = () => {
    const { actions } = this.props
    actions.clearDocSelected()
    this.setState({ noTextContent: 2 })
  }

  /**
   * Handles when a user has selected a document that is not text-selectable
   */
  handleCheckTextContent = noTextArr => {
    this.setState({
      noTextContent: noTextArr.every(noText => noText)
        ? 0
        : noTextArr.every(noText => !noText)
          ? 2
          : 1
    })
  }

  /**
   * Toggles whether or not to show the annotation mode not enabeld alert
   */
  hideAnnoModeAlert = () => {
    const { actions } = this.props
    actions.hideAnnoModeAlert()
  }

  /**
   * Handles changing current annotation index in annotation finder
   */
  changeAnnotationIndex = index => {
    const { actions } = this.props
    actions.changeAnnotationIndex(index)
  }

  /**
   * Sets scroll top to false after changing it to true
   */
  resetScrollTop = () => {
    const { actions } = this.props
    actions.resetScrollTop()
  }

  /*
   * checks to see if annotation layer has rendered
   */
  checkIfRendered = position => {
    return document.getElementById(`annotation-${position}-0`)
  }

  /**
   * Scrolls to a specific annotations
   * @param position
   */
  handleScrollAnnotation = position => {
    let el = this.checkIfRendered(position)

    while (!el) {
      el = this.checkIfRendered(position)
      setTimeout(() => {
      }, 1000)
    }

    clearTimeout()
    const container = document.getElementById('viewContainer')
    const pageEl = el.offsetParent.offsetParent
    this.changeAnnotationIndex(position)
    container.scrollTo({
      top: pageEl.offsetTop + el.offsetTop - 30,
      behavior: 'smooth'
    })
  }

  /**
   * Scrolls the document to the top of the page. Used when the user toggles a different coder for annotations
   */
  scrollTop = () => {
    const { annotations } = this.props

    if (annotations.length === 0) {
      const container = document.getElementById('viewContainer')
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      this.handleScrollAnnotation(0)
    }
    this.resetScrollTop()
  }

  /*
   * Toggles a coder's annotations for view
   */
  handleToggleCoderAnnotations = (userId, isValidator) => () => {
    const { actions } = this.props
    actions.toggleCoderAnnotations(userId, isValidator)
  }

  /**
   * Closes the API error alert
   * @returns {*}
   */
  handleCloseApiAlert = () => {
    const { actions } = this.props
    actions.clearApiError()
  }

  /**
   * Handles when the user has requested to download documents
   * @param docs
   */
  handleDownloadDocs = docs => () => {
    const { actions } = this.props
    actions.downloadDocumentsRequest(docs)
  }

  /**
   * Prepares the actual file download
   */
  prepareDocumentDownload = () => {
    const { downloading, project, jurisdiction, actions } = this.props

    const pdfBlob = new Blob(
      [downloading.content],
      {
        type: downloading.id === 'all'
          ? 'application/zip'
          : 'application/pdf'
      }
    )
    this.url = URL.createObjectURL(pdfBlob)
    this.downloadRef.current.href = this.url
    this.downloadRef.current.download = downloading.id === 'all'
      ? `${project.name}-${jurisdiction.name}-documents.zip`
      : downloading.name
    this.downloadRef.current.click()
    actions.clearDownload()
  }

  render() {
    const docNameStyle = {
      color: theme.palette.secondary.main,
      cursor: 'pointer',
      paddingLeft: 5,
      paddingRight: 5
    }

    const bannerBold = {
      fontWeight: 500,
      color: theme.palette.secondary.pageHeader
    }
    const bannerText = { color: '#434343' }

    const {
      annotationModeEnabled, annotations, docSelected, openedDoc, currentAnnotationIndex,
      showEmptyDocs, apiError, documents, annotatedDocs, gettingDocs, annotationUsers, isValidation,
      shouldShowAnnoModeAlert, enabledUserId, downloading
    } = this.props

    const { noTextContent } = this.state

    return (
      <FlexGrid container flex style={{ overflow: 'hidden' }} raised>
        <FlexGrid
          container
          type="row"
          align="center"
          padding="0 15px"
          justify="space-between"
          style={{
            height: 55,
            minHeight: 55,
            maxHeight: 55
          }}>
          <FlexGrid
            container
            type="row"
            align="center"
            flex
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              marginRight: 20
            }}>
            {docSelected &&
            <Icon
              color="black"
              style={{
                cursor: 'pointer',
                paddingRight: 5
              }}
              onClick={this.clearDocSelected}>
              arrow_back
            </Icon>}
            <Typography
              variant="subheading"
              style={{
                fontSize: '1.125rem',
                letterSpacing: 0,
                fontWeight: 500,
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
              {docSelected
                ? openedDoc.name
                : 'Assigned Documents'}
            </Typography>
          </FlexGrid>
          {!docSelected &&
          <FlexGrid>
            {(downloading.id !== 'all' && documents.length > 0) && <IconButton
              color="#757575"
              tooltipText="Download All Documents"
              placement="left-start"
              onClick={this.handleDownloadDocs('all')}>
              file_download
            </IconButton>}
            {downloading.id === 'all' && <CircularLoader color="primary" size={20} />}
          </FlexGrid>}
          {(docSelected && annotations.length > 0) && <AnnotationFinder
            users={annotationUsers}
            count={annotations.length}
            current={currentAnnotationIndex}
            allEnabled={enabledUserId === 'All'}
            onScrollAnnotation={this.handleScrollAnnotation}
            onClickAvatar={(isValidation && !annotationModeEnabled)
              ? this.handleToggleCoderAnnotations
              : null}
          />}
        </FlexGrid>
        <Divider />
        <FlexGrid
          container
          flex
          style={{
            height: '100%',
            overflow: 'auto',
            position: 'relative'
          }}>
          {(apiError.open && apiError.alertOrView === 'view') && <ApiErrorView error={apiError.text} />}
          {(apiError.open && apiError.alertOrView === 'alert') &&
          <ApiErrorAlert onCloseAlert={this.handleCloseApiAlert} content={apiError.text} open={apiError.open} />}
          {(showEmptyDocs || gettingDocs) &&
          <FlexGrid container type="row" align="center" justify="center" padding={10} flex>
            <Typography variant="display1" style={{ textAlign: 'center' }}>
              {showEmptyDocs
                ? 'There are no approved or assigned documents for this project and jurisdiction.'
                : 'Loading...'}
            </Typography>
            {gettingDocs &&
            <span style={{ marginLeft: 10 }}><CircularLoader color="primary" thickness={5} size={28} /></span>}
          </FlexGrid>}
          {(!showEmptyDocs && annotationModeEnabled) &&
          <FlexGrid
            padding={20}
            container
            align="center"
            style={{
              backgroundColor: noTextContent === 0
                ? '#ffcbd3'
                : '#e6f8ff'
            }}>
            <Typography style={{ textAlign: 'center' }}>
              <i>
                {noTextContent > 0
                  ? (<>
                    <span style={bannerBold}>Annotation Mode: </span>
                    <span style={bannerText}>
                      {docSelected
                        ? 'Highlight the desired text and confirm.'
                        : 'Select a document to annotate.'}
                    </span>
                  </>)
                  : (<>
                    <span style={bannerBold}>NOTE: </span>
                    <span style={bannerText}>You are unable to annotate this document. Text selection is not allowed.</span>
                  </>)
                }
              </i>
            </Typography>
            {noTextContent === 1 &&
            <Typography
              style={{
                textAlign: 'center',
                marginTop: 8
              }}>
              <i>
                {noTextContent === 1 &&
                <>
                  <span style={bannerBold}>NOTE: </span>
                  <span style={bannerText}>
                    Some pages of this document do not have text selection. You will not be able to annotate those pages.
                  </span>
                </>}
              </i>
            </Typography>}
          </FlexGrid>}
          {(docSelected && !apiError.open) &&
          <PDFViewer
            allowSelection={annotationModeEnabled}
            document={openedDoc}
            annotations={annotations}
            saveAnnotation={this.handleSaveAnnotation}
            removeAnnotation={this.handleRemoveAnnotation}
            onCheckTextContent={this.handleCheckTextContent}
            onHideAnnoModeAlert={this.hideAnnoModeAlert}
            annotationModeEnabled={annotationModeEnabled}
            onFinishRendering={this.handleFinishedRendering}
            showAnnoModeAlert={shouldShowAnnoModeAlert}
            showAvatars
            isView={false}
          />}
          {!docSelected && documents.map((doc, i) => {
            const isRetrieving = (openedDoc._id === doc._id) && !docSelected
            return (
              <Fragment key={`${doc._id}`}>
                <FlexGrid container type="row" align="center" padding="10px 15px">
                  <FlexGrid flex container type="row" align="center">
                    <Typography>{i + 1}.</Typography>
                    <Typography
                      style={{
                        ...docNameStyle,
                        color: isRetrieving
                          ? '#757575'
                          : theme.palette.secondary.main
                      }}>
                      <span style={{ paddingRight: 10 }} onClick={this.getContents(doc._id)}>
                        {doc.name}&nbsp;&nbsp;
                        <span
                          style={{
                            fontSize: `0.8rem`,
                            color: '#7b7b7b'
                          }}>
                          {doc.effectiveDate && `(${moment.utc(doc.effectiveDate).local().format('M/D/YYYY')})`}
                        </span>
                      </span>
                    </Typography>
                    {isRetrieving && <CircularLoader color="primary" thickness={5} size={16} />}
                  </FlexGrid>
                  {annotatedDocs.includes(doc._id) &&
                  <Icon color="error" size={20} style={{ paddingRight: 10 }}>
                    <FormatQuoteClose style={{ fontSize: 20 }} />
                  </Icon>}
                  {downloading.id !== doc._id &&
                  <IconButton
                    color="#757575"
                    tooltipText="Download"
                    onClick={this.handleDownloadDocs(doc._id)}
                    iconSize={20}>
                    file_download
                  </IconButton>}
                  {downloading.id === doc._id && <CircularLoader color="primary" size={16} />}
                </FlexGrid>
                <Divider />
              </Fragment>
            )
          })}
        </FlexGrid>
        <a style={{ display: 'none' }} ref={this.downloadRef} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const pageState = state.scenes.codingValidation.documentList
  const annotations = pageState.annotations.filtered
  const users = pageState.annotationUsers.filtered
  const isValidation = state.scenes.codingValidation.coding.page === 'validation'

  /** Get docs ids and sort by annotated first */
  const annotatedDocIdsForAnswer = annotations.map(annotation => annotation.docId)
  const notAnnotatedDocIds = pageState.documents.ordered.filter(docId => !annotatedDocIdsForAnswer.includes(docId))
  const annotatedDocIds = pageState.documents.ordered.filter(docId => annotatedDocIdsForAnswer.includes(docId))
  const annos = annotations.slice()

  /**
   * The annotations need to be sorted in the order they are on the pdf page for jump to
   */
  const sortedByPageAndPosition = annos.sort((a, b) => {
    const diff = a.startPage - b.startPage
    return diff === 0
      ? b.rects[0].pdfPoints.y - a.rects[0].pdfPoints.y
      : diff
  }).map((anno, i) => ({
    ...anno,
    sortPosition: i
  }))

  const allDocIds = new Set([...annotatedDocIds, ...notAnnotatedDocIds])
  const docArray = Array.from(allDocIds)

  return {
    documents: docArray.length === 0
      ? []
      : pageState.documents.allIds.length === 0
        ? []
        : docArray.map(id => pageState.documents.byId[id]),
    annotatedDocs: annotatedDocIds,
    annotations: sortedByPageAndPosition,
    openedDoc: pageState.openedDoc || {},
    docSelected: pageState.docSelected || false,
    showEmptyDocs: pageState.showEmptyDocs,
    apiError: pageState.apiError,
    annotationModeEnabled: pageState.annotationModeEnabled,
    enabledAnswerId: pageState.enabledAnswerId,
    shouldShowAnnoModeAlert: pageState.shouldShowAnnoModeAlert,
    currentAnnotationIndex: pageState.currentAnnotationIndex,
    scrollTop: pageState.scrollTop,
    isValidation,
    gettingDocs: pageState.gettingDocs,
    annotationUsers: users,
    enabledUserId: pageState.enabledUserId,
    downloading: pageState.downloading
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: { ...bindActionCreators(actions, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentList)
