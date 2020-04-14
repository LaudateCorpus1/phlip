import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import SearchBar from 'components/SearchBar'
import FlexGrid from 'components/FlexGrid'

/**
 * Wrapper for @material-ui/core's DialogTitle component. Will render at the top of the modal
 */
export const ModalTitle = ({ title, search, buttons, SearchBarProps, style }) => {
  return (
    <FlexGrid padding="24px 24px 20px">
      <FlexGrid type="row" container align="center">
        <DialogTitle style={{ ...style, padding: 0, flex: 1 }}>
          <FlexGrid container type="row" flex align="center">{title}</FlexGrid>
        </DialogTitle>
        <FlexGrid container type="row" align="center" justify="flex-end">
          {search && <SearchBar {...SearchBarProps} />}
          {buttons &&
          <FlexGrid container type="row" align="center">
            {buttons}
          </FlexGrid>}
        </FlexGrid>
      </FlexGrid>
    </FlexGrid>
  )
}

ModalTitle.propTypes = {
  /**
   * What the actual title should be
   */
  title: PropTypes.any,
  /**
   * Whether or not to include a search bar in the title
   */
  search: PropTypes.bool,
  /**
   * Props to be applied to the SearchBar component, if applicable
   */
  SearchBarProps: PropTypes.object,
  /**
   * Buttons to put in the title
   */
  buttons: PropTypes.any,
  /**
   * Override any default style of modal title
   */
  style: PropTypes.object
}

ModalTitle.defaultProps = {}

export default ModalTitle
