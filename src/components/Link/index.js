import React from 'react'
import { Link as RrdLink } from 'react-router-dom'

/**
 * Simple wrapper around react-router-dom's Link component. Passes through all props
 */
export const Link = props => (
  <RrdLink {...props} />
)

export default Link