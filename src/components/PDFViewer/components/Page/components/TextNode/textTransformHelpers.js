import * as pdfjs from 'pdfjs-dist/lib/shared/util'

/**
 * These helpers were taken from pdfjs with a few tweaks for what was needed
 */
const NonWhitespaceRegexp = /\S/
const isAllWhitespace = str => !NonWhitespaceRegexp.test(str)

export const transformText = (canvasViewport, textLine, styles) => {
  // Initialize all used properties to keep the caches monomorphic.
  let textDivProperties = {
    fontSize: 0,
    fontFamily: 'sans-serif',
    angle: 0,
    canvasWidth: 0,
    isWhitespace: false,
    originalTransform: textLine.transform,
    scale: 1,
    margin: 0,
    textContent: textLine.str
  }

  if (isAllWhitespace(textLine.str)) {
    textDivProperties.isWhitespace = true
  }

  const tx = pdfjs.Util.transform(canvasViewport.transform, textLine.transform)
  let angle = Math.atan2(tx[1], tx[0])
  const style = styles[textLine.fontName]

  if (style.vertical) {
    angle += Math.PI / 2
  }

  const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
  let fontAscent = fontHeight
  if (style.ascent) {
    fontAscent = style.ascent * fontAscent
  } else if (style.descent) {
    fontAscent = (1 + style.descent) * fontAscent
  }

  let left
  let top

  if (angle === 0) {
    left = tx[4]
    top = tx[5] - fontAscent
  } else {
    left = tx[4] + fontAscent * Math.sin(angle)
    top = tx[5] - fontAscent * Math.cos(angle)
  }

  if (angle !== 0) {
    textDivProperties.angle = angle * (180 / Math.PI)
  }

  if (textLine.str.length > 1) {
    if (style.vertical) {
      textDivProperties.canvasWidth = textLine.height * canvasViewport.scale
    } else {
      textDivProperties.canvasWidth = textLine.width * canvasViewport.scale
    }
  }

  let angleCos = 1, angleSin = 0
  if (angle !== 0) {
    angleCos = Math.cos(angle)
    angleSin = Math.sin(angle)
  }

  const divWidth = (style.vertical ? textLine.height : textLine.width) * canvasViewport.scale
  const divHeight = fontHeight

  let m, b
  if (angle !== 0) {
    m = [angleCos, angleSin, -angleSin, angleCos, left, top]
    b = pdfjs.Util.getAxialAlignedBoundingBox([0, 0, divWidth, divHeight], m)
  } else {
    b = [left, top, left + divWidth, top + divHeight]
  }

  textDivProperties = {
    ...textLine,
    ...textDivProperties,
    style: {
      left: b[0],
      top: b[1] - 2,
      fontSize: fontHeight,
      fontFamily: style.fontFamily,
      margin: 0,
      height: Math.abs(b[1] - b[3]) + 2
    },
    size: [divWidth, divHeight],
    m
  }

  return textDivProperties
}