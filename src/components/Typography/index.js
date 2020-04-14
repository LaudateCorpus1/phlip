import React from 'react'
import { default as MuiTypography } from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

const fontSizeLookup = {
  'display1': {
    size: 96,
    weight: 300,
    letterSpacing: -1.5
  },
  'display2': {
    size: 60,
    weight: 300,
    letterSpacing: -0.5
  },
  'display3': {
    size: 48,
    weight: 400,
    letterSpacing: 0
  },
  'display4': {
    size: 34,
    weight: 400,
    letterSpacing: .25
  },
  'headline': {
    size: 24,
    weight: 400,
    letterSpacing: 0
  },
  'title': {
    size: 20,
    weight: 500,
    letterSpacing: .15
  },
  'subheading': {
    size: 16,
    weight: 400,
    letterSpacing: .1
  },
  'subheading2': {
    size: 16,
    weight: 500,
    letterSpacing: .15
  },
  'body1': {
    size: 16,
    weight: 400,
    letterSpacing: .5
  },
  'body2': {
    size: 14,
    weight: 400,
    letterSpacing: 0
  },
  'caption': {
    size: 12,
    weight: 400,
    letterSpacing: .4
  },
  'button': {
    size: 14,
    weight: 500,
    letterSpacing: 1.5
  }
}

export const Typography = props => {
  const { variant, style, ...otherProps } = props

  const fontVariant = variant === 'title2' ? 'title' : variant === 'subheading2' ? 'subheading' : variant
  const fontLookup = fontSizeLookup[variant]

  const typeStyle = {
    fontSize: `${(fontLookup.size * .0625)}rem`,
    fontWeight: fontLookup.weight,
    letterSpacing: fontLookup.letterSpacing,
    ...style
  }

  return <MuiTypography variant={fontVariant} style={typeStyle} {...otherProps} />
}

Typography.defaultProps = {
  variant: 'body1'
}

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'display1', 'display2', 'display3', 'display4',
    'headline', 'title', 'subheading', 'subheading2', 'body1', 'body2', 'caption', 'button'
  ])
}

export default Typography