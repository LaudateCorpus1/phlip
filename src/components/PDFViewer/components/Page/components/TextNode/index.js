import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { transformText } from './textTransformHelpers'

/**
 * Component class for the text nodes in a PDF. This is used for text selection. They text itself is actually invisible.
 * @component
 */
export class TextNode extends PureComponent {
  static propTypes = {
    textItem: PropTypes.object,
    allStyles: PropTypes.object,
    viewport: PropTypes.object,
    canvasContext: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  transform = item => {
    const { canvasContext, viewport, allStyles } = this.props
    const textItem = transformText(viewport, item, allStyles)
    canvasContext.font = `${textItem.style.fontSize}px ${textItem.style.fontFamily}`
    const fontWidth = canvasContext.measureText(textItem.str).width
    const scale = ((textItem.width + 1) * viewport.scale) / fontWidth
    return { ...textItem, style: { ...textItem.style, transform: `scaleX(${scale})` } }
  }

  render() {
    const text = this.transform(this.props.textItem)

    return (
      <div style={text.style}>
        {text.str}
      </div>
    )
  }
}

export default TextNode
