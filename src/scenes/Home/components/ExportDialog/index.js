import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import ListSection from './components/ListSection'
import ListItem from './components/ListItem'

export class ExportDialog extends Component {
  static propTypes = {
    /**
     * Function to call when the modal is closed
     */
    onClose: PropTypes.func,
    /**
     * Function to call when the user chooses an export type
     */
    onChooseExport: PropTypes.func,
    /**
     * Whether or not the modal is open
     */
    open: PropTypes.bool,
    /**
     * The project for which the dialog is open
     */
    projectToExport: PropTypes.object,
    /**
     * Whether a request is in progress
     */
    inProgress: PropTypes.bool
  }
  
  state = {
    expanded: 0
  }
  
  componentDidUpdate(prevProps) {
    const { open } = this.props
    if (prevProps.open && !open) {
      this.setState({ expanded: 0 })
    }
  }
  
  /**
   * When the user closes the modal
   */
  onCloseModal = () => {
    const { onClose } = this.props
    this.setState({ expanded: 0 })
    onClose()
  }
  
  /**
   * Expands a dropdown section
   * @param section
   */
  expand = section => () => {
    const { expanded } = this.state
    this.setState({ expanded: expanded === section ? 0 : section })
  }
  
  /**
   * User is exporting validation or codebook
   */
  onChooseExport = (type, user = null) => () => {
    const { onChooseExport } = this.props
    onChooseExport(type, user)
  }
  
  render() {
    const { open, projectToExport, inProgress } = this.props
    const { expanded } = this.state
    
    const actions = [
      { value: 'Close', onClick: this.onCloseModal, type: 'button', otherProps: { 'aria-label': 'Close modal' } }
    ]
    
    const progressInfo = {
      user: inProgress ? projectToExport.user.id : null,
      type: inProgress ? projectToExport.exportType: null
    }
    
    return (
      <Modal open={open} onClose={this.onCloseModal} id="export-modal">
        <ModalTitle title="Choose export type" />
        <Divider />
        <ModalContent style={{ minWidth: 400, padding: 0 }}>
          <List>
            <ListItem
              item={{ displayText: 'Codebook' }}
              onExport={this.onChooseExport('codebook', null)}
              showAvatar={false}
              isSubItem={false}
              disabled={progressInfo.type !== 'codebook' && progressInfo.type !== null}
              inProgress={progressInfo.type === 'codebook'}
            />
            <ListSection
              onExpand={this.expand}
              sectionText="Coded Data - Numeric"
              expanded={expanded === 'numeric'}
              users={projectToExport.projectUsers}
              section="numeric"
              inProgress={progressInfo}
              onExport={this.onChooseExport}
            />
            <ListSection
              onExpand={this.expand}
              sectionText="Coded Data - Text"
              expanded={expanded === 'text'}
              users={projectToExport.projectUsers}
              section="text"
              inProgress={progressInfo}
              onExport={this.onChooseExport}
            />
          </List>
        </ModalContent>
        <ModalActions actions={actions} />
      </Modal>
    )
  }
}

export default ExportDialog
