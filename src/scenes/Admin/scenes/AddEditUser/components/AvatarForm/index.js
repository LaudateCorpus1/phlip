import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import { Avatar } from 'components'
import Divider from '@material-ui/core/Divider'
import { withRouter } from 'react-router'
import actions from '../../actions'

export class AvatarForm extends Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    currentUser: PropTypes.object,
    actions: PropTypes.object,
    selectedUser: PropTypes.object,
    selfUpdate: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  onCloseModal = () => {
    this.props.history.goBack()
  }
  
  handleSubmit = () => {
    const { location, actions, history, selectedUser, currentUser, selfUpdate } = this.props
    
    const base64Image = location.state.avatar
    const patchOperation = [{ 'op': 'replace', 'path': '/avatar', 'value': base64Image }]
    
    actions.addUserPictureRequest(location.state.userId, patchOperation, selectedUser, selfUpdate)
    if (location.state.userId === currentUser.id) {
      actions.updateCurrentUser({ ...currentUser, avatar: base64Image })
    }
    
    history.goBack()
  }
  
  handleDeleteAvatar = () => {
    const { location, actions, history, selectedUser, currentUser, selfUpdate } = this.props
    
    const patchRemoveOperation = [{ 'op': 'remove', 'path': '/avatar' }]
    actions.deleteUserPictureRequest(location.state.userId, patchRemoveOperation, selectedUser, selfUpdate)
    if (location.state.userId === currentUser.id) {
      actions.updateCurrentUser({ ...currentUser, avatar: '' })
    }
    
    history.goBack()
  }
  
  render() {
    const formActions = [
      {
        value: 'Cancel',
        onClick: this.onCloseModal,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: 'Save',
        type: 'submit',
        onClick: this.handleSubmit,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    const formEditActions = [
      { value: 'Cancel', onClick: this.onCloseModal, type: 'button' },
      { value: 'Remove', onClick: this.handleDeleteAvatar, type: 'button' }
    ]
    
    const { location, selectedUser } = this.props
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="xs" height="450px" width="315px">
        <ModalTitle title={location.state.isEdit ? 'View image' : 'Preview image'} />
        <Divider />
        <ModalContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 280,
            paddingTop: 24,
            alignItems: 'center'
          }}>
          {location.state.isEdit
            ? (
              <Avatar
                cardAvatar
                style={{ width: '200px', height: '200px' }}
                avatar={location.state.avatar}
                userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
              />
            )
            : (
              <Avatar
                cardAvatar
                style={{ width: '200px', height: '200px' }}
                avatar={location.state.avatar}
              />
            )}
        </ModalContent>
        <ModalActions actions={location.state.isEdit ? formEditActions : formActions} />
      </Modal>
    )
  }
}

export const mapStateToProps = (state, ownProps) => {
  const selfUpdate = ownProps.match.url === '/user/profile/avatar'
  return {
    currentUser: state.data.user.currentUser || {},
    selectedUser: selfUpdate
      ? state.data.user.currentUser
      : state.scenes.admin.main.users.find(user => user.id === ownProps.location.state.userId),
    selfUpdate
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvatarForm))
