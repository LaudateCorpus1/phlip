import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UserList from './components/UserList/index'
import { FlexGrid, PageHeader, CardError } from 'components'
import actions from './actions'
import { bindActionCreators } from 'redux'

/**
 * Represents the parent User Management component, that displays a list of users in the system. This component is
 * mounted and rendered when the user navigates to the 'User Management' option in the avatar menu. This component has
 * one scene: AddEditUser under ./scenes/AddEditUser
 */
export class Admin extends Component {
  static propTypes = {
    /**
     * List of users to displayed, supplied from redux
     */
    users: PropTypes.array,
    /**
     * Which property of users by which to sort the list
     */
    sortBy: PropTypes.string,
    /**
     * Direction by which to sort list of users
     */
    direction: PropTypes.string,
    /**
     * Redux actions for this component
     */
    actions: PropTypes.object,
    /**
     * error content
     */
    errorContent: PropTypes.string,
    /**
     * Whether or not there's a page error
     */
    error: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.getUsersRequest()
    document.title = 'PHLIP - User Management'
  }

  render() {
    const { error, errorContent, actions, sortBy, users, direction } = this.props
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <PageHeader
          pageTitle="User Management"
          protocolButton={false}
          projectName=""
          otherButton={{
            isLink: true,
            text: 'Add New User',
            path: '/admin/new/user',
            state: { modal: true },
            props: { 'aria-label': 'Add new user' },
            show: true
          }}
        />
        {error && <CardError>
          {`Uh-oh! Something went wrong. ${errorContent}`}
        </CardError>}
        {!error && <UserList
          users={users}
          sortBy={sortBy}
          direction={direction}
          handleRequestSort={property => () => actions.sortUsers(property)}
        />}
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state) => ({
  users: state.scenes.admin.main.users,
  sortBy: state.scenes.admin.main.sortBy,
  direction: state.scenes.admin.main.direction,
  error: state.scenes.admin.main.error,
  errorContent: state.scenes.admin.main.errorContent
})

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Admin, 'User Management')
