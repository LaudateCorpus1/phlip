import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Icon from 'components/Icon'
import Typography from '@material-ui/core/Typography'
import Modal, { ModalActions, ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import { CircularLoader } from 'components'
import Autosuggest from 'react-autosuggest'

const typeToTitle = {
  'delete': 'Delete Documents',
  'approve': 'Approve Documents',
  'project': 'Assign Project',
  'jurisdiction': 'Assign Jurisdiction',
  'removeproject' : 'Unassign Project'
}

/*
 * gets button modal text
 */
const getButtonText = (text, inProgress) => {
  return (
    <>
      {text}
      {inProgress && <CircularLoader thickness={5} size={15} style={{ marginRight: 5 }} />}
    </>
  )
}

/**
 * This is the modal that shows when the user selects a bulk action for documents
 * @param props
 */
export const BulkModal = props => {
  const {
    bulkType,
    docCount,
    onCloseModal,
    open,
    buttonInfo,
    onConfirmAction,
    ownerList,
    autocompleteProps
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
      value: getButtonText('Confirm', buttonInfo.inProgress),
      type: 'button',
      otherProps: { 'aria-label': 'Confirm', 'id': 'bulkConfirmBtn' },
      onClick: onConfirmAction,
      disabled: buttonInfo.disabled
    }
  ]

  const genMessage = (bulkType) => {
    if (['project', 'jurisdiction'].includes(bulkType)) {
      return `Do you want to assign this ${bulkType} to other users' documents?`
    } else if (bulkType === 'removeproject') {
      return `Do you want to remove this ${typeToTitle[bulkType]} from other users' documents?`
    } else {
      return `Do you want to ${bulkType} other users' documents?`
    }
  }

  const onMouseDown = e => {
    if (['react-autowhatever-1','jurisdiction-form','bulkConfirmBox'].includes(e.target.id)){
      e.preventDefault()
    }
  }

  return (
    <Modal onClose={onCloseModal} open={open} maxWidth="md" hideOverflow={false} id="bulkConfirmBox" onMouseDown={onMouseDown}>
      <ModalTitle title={typeToTitle[bulkType]} />
      <Divider />
      <ModalContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 24,
          width: 500,
          height: 250
        }}>
        <FlexGrid container flex justify="space-between">
          {['project', 'jurisdiction', 'removeproject'].includes(bulkType) &&
          <FlexGrid container type="row" padding="0 0 20px" flex>
            <Icon style={{ paddingRight: 8, marginTop: 5 }}>
              {bulkType === 'jurisdiction' ? 'account_balance' : 'dvr'}
            </Icon>
            <Autosuggest {...autocompleteProps} />
          </FlexGrid>}
          <FlexGrid>
            {ownerList.length > 0 &&
            <>
              <Typography variant="body1">{genMessage(bulkType)}</Typography>
              <Typography style={{ padding: 10 }} />
              <Typography variant="body1">Number of documents selected: {docCount}</Typography>
              <Typography variant="body2" style={{ paddingTop: 20 }}>Users: {ownerList.join(', ')}</Typography>
            </>}
            {ownerList.length === 0 && bulkType !== 'delete' &&
            <Typography variant="body1">Number of documents selected: {docCount}</Typography>
            }
            {bulkType === 'delete' &&
            <>
              {ownerList.length === 0 &&
              <Typography variant="body1">
                Do you want to delete {docCount} document{docCount > 1 ? 's' : ''}?
              </Typography>}
              <Typography style={{ paddingTop: 20 }}>
                <span style={{ fontSize: 18, fontWeight: 500 }}>Warning:</span> Deleting a document will remove all associated annotations for every project and jurisdiction.
              </Typography>
            </>}
          </FlexGrid>
        </FlexGrid>
      </ModalContent>
      <Divider />
      <ModalActions actions={actions} />
    </Modal>
  )
}

BulkModal.propTypes = {
  open: PropTypes.bool,
  bulkType: PropTypes.oneOf(['', 'project', 'jurisdiction', 'delete', 'approve', 'removeproject']),
  docCount: PropTypes.number,
  onCloseModal: PropTypes.func,
  onConfirmAction: PropTypes.func,
  buttonInfo: PropTypes.object,
  ownerList: PropTypes.array,
  autocompleteProps: PropTypes.object
}

export default BulkModal
