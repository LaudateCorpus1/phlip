import React from 'react'
import PropTypes from 'prop-types'
import { Icon, FlexGrid, ModalTitle, ModalContent, ModalActions, CircularLoader } from 'components'
import Autosuggest from 'react-autosuggest'
import Modal from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import { capitalizeFirstLetter } from 'utils/formHelpers'

/*
 * gets button modal text
 */
const getButtonText = (text, inProgress) => {
  return (
    <>
      {text}
      {inProgress && <CircularLoader size={15} thickness={5} style={{ marginRight: 5 }} />}
    </>
  )
}

/**
 * The contents of the project jurisdiction autocomplete search modal
 * @param props
 * @returns {*}
 * @constructor
 */
const ProJurSearch = props => {
  const {
    autocompleteProps,
    searchType,
    onMouseDown,
    open,
    onCloseModal,
    buttonInfo,
    onConfirmAction
  } = props

  const cancelButton = {
    value: 'Cancel',
    type: 'button',
    otherProps: { 'aria-label': 'Close modal' },
    preferred: true,
    onClick: onCloseModal
  }

  const actions = [
    cancelButton,
    {
      value: getButtonText('Update', buttonInfo.inProgress),
      type: 'button',
      otherProps: { 'aria-label': 'Update', 'id': 'updateConfirmBtn' },
      onClick: onConfirmAction,
      disabled: buttonInfo.disabled
    }
  ]

  return (
    <Modal onClose={onCloseModal} open={open} maxWidth="md" hideOverflow={false}>
      <ModalTitle title={`Assign ${searchType ? capitalizeFirstLetter(searchType) : ''}`} />
      <Divider />
      <ModalContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, width: 500, height: 275 }}>
        <FlexGrid container type="row" align="center" onMouseDown={onMouseDown}>
          <FlexGrid container type="row" padding="0 0 20px" flex>
            <Icon style={{ paddingRight: 8, marginTop: 5 }}>
              {searchType === 'jurisdiction' ? 'account_balance' : 'dvr'}
            </Icon>
            <Autosuggest {...autocompleteProps} />
          </FlexGrid>
        </FlexGrid>
      </ModalContent>
      <Divider />
      <ModalActions actions={actions} />
    </Modal>
  )
}

ProJurSearch.propTypes = {
  showProjectError: PropTypes.bool,
  onMouseDown: PropTypes.func,
  searchType: PropTypes.oneOf(['project', 'jurisdiction', '']),
  open: PropTypes.bool,
  onCloseModal: PropTypes.func,
  buttonInfo: PropTypes.object,
  onConfirmAction: PropTypes.func,
  autocompleteProps: PropTypes.object
}

export default ProJurSearch
