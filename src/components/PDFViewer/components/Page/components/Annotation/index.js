import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Avatar } from 'components'
import { Util as dom_utils } from 'pdfjs-dist/lib/shared/util'
import { connect } from 'react-redux'

/**
 * Used for the annotations in a PDF document.
 * @component
 */
export class Annotation extends PureComponent {
  static defaultProps = {
    showAvatar: false
  }

  static propTypes = {
    annotation: PropTypes.object,
    index: PropTypes.number,
    pageNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pending: PropTypes.bool,
    isClicked: PropTypes.bool,
    handleConfirmAnnotation: PropTypes.func,
    handleCancelAnnotation: PropTypes.func,
    handleRemoveAnnotation: PropTypes.func,
    handleClickAnnotation: PropTypes.func,
    annotationModeEnabled: PropTypes.bool,
    transform: PropTypes.array,
    showAvatar: PropTypes.bool,
    user: PropTypes.object,
    closeToOthers: PropTypes.number
  }

  constructor(props, context) {
    super(props, context)
  }
  
  /**
   * Generates a unique color based on a string
   * @param userId
   * @param name
   * @returns {string}
   */
  getColor = (userId, name) => {
    const str = `${name}:${userId}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
    return `#${'00000'.substring(0, 6 - c.length) + c}`
  }
  
  /**
   * Checks if it's the last node in the annotation
   * @param rectIndex
   * @returns {boolean}
   */
  shouldShowActions = rectIndex => {
    const { annotation, pageNumber, pending, isClicked, annotationModeEnabled } = this.props
    return annotationModeEnabled
      ? ((rectIndex === annotation.rects.length - 1) && annotation.endPage === pageNumber)
        ? pending
          ? true
          : isClicked
        : false
      : false
  }

  /*
  * Transforms pdf points to work for the size and scale of the document
   */
  getBounds = points => {
    const highlight = points
    const startPoint = dom_utils.applyTransform([highlight.x, highlight.y], this.props.transform)
    const endPoint = dom_utils.applyTransform([highlight.endX, highlight.endY], this.props.transform)

    const bounds = [...startPoint, ...endPoint]

    const left = Math.min(bounds[0], bounds[2]),
      top = Math.min(bounds[1], bounds[3]),
      width = Math.abs(bounds[0] - bounds[2]),
      height = Math.abs(bounds[1] - bounds[3])

    return { left, top, width, height, bounds }
  }

  render() {
    const {
      annotation, index, pending, handleConfirmAnnotation, handleCancelAnnotation, handleRemoveAnnotation,
      handleClickAnnotation, showAvatar, user, annotationModeEnabled, closeToOthers
    } = this.props
    
    const key = `${pending ? 'pending' : 'saved'}-highlight-area-${index}`

    return annotation.rects.map((rect, j) => {
      const { left, top, height, width, bounds } = this.getBounds(rect.pdfPoints)
      const iconStyle = { height: 25, width: 25, borderRadius: 0 }
      const highlightStyle = {
        opacity: 0.2,
        position: 'absolute',
        zIndex: 3,
        cursor: annotationModeEnabled ? 'pointer' : 'default',
        width,
        left,
        top,
        height,
        backgroundColor: user ? this.getColor(user.id, user.username) : '#00e0ff'
      }

      const avatarLocation = {
        left: (left - 10) - (closeToOthers * 20),
        top: top - 18,
        position: 'absolute',
        width: 20,
        zIndex: 4
      }
      const iconLocation = {
        left: pending ? bounds[2] - 53 : bounds[2] - 24,
        top: bounds[3],
        marginTop: 1,
        width: pending ? 50 : 25,
        borderRadius: '0 0 5px 5px',
        border: '1px solid #d15d76'
      }
      
      return (
        <Fragment key={`${key}-${j}`}>
          {(j === 0 && showAvatar) &&
          <div style={avatarLocation} className="annotation-avatar">
            <Avatar
              alt={`${user.username} highlighted ${annotation.text}`}
              initials={user.initials}
              avatar={user.avatar}
              small
              style={{ backgroundColor: '#e9e9e9', color: 'black' }}
              userName={user.username}
            />
          </div>}
          <div
            {...{
              style: highlightStyle,
              ...(!pending && { id: `annotation-${annotation.sortPosition}-${j}` }),
              onClick: () => pending ? null : handleClickAnnotation(index)
            }}
          />
          {this.shouldShowActions(j) &&
          <div key={`${key}-${index}-${j}-actions`} className="iconActions" style={iconLocation}>
            <IconButton
              style={iconStyle}
              onClick={() => pending ? handleCancelAnnotation(index) : handleRemoveAnnotation(index)}>
              close
            </IconButton>
            {pending &&
            <IconButton
              style={{ borderLeft: '1px solid #d15d76', ...iconStyle }}
              onClick={() => handleConfirmAnnotation(index)}>
              done
            </IconButton>}
          </div>
          }
        </Fragment>
      )
    })
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.data.user.byId[ownProps.annotation.userId]
  }
}

export default connect(mapStateToProps)(Annotation)
