import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import Typography from '@material-ui/core/Typography'
import { Alert } from 'components'
import { connect } from 'react-redux'

/**
 * HOC for forms to handle checking if the project is locked and showing an alert
 * @param WrappedComponent
 * @returns {ProjectLockedAlert}
 */
export const withProjectLocked = WrappedComponent => {
  class ProjectLockedAlert extends Component {
    constructor(props, context) {
      super(props, context)
      
      let open = false, project = { name: 'Project' }
      
      if (props.match.params.id !== undefined) {
        project = props.projects[props.match.params.id]
        if (project.status === 2) {
          // project is locked
          open = true
        }
      }
      
      this.state = {
        open,
        isLocked: open,
        project
      }
    }
    
    /**
     * Closes 'Unsaved Changes' alert
     */
    onCloseAlert = () => {
      this.setState({
        open: false
      })
    }
    
    render() {
      const { open, isLocked, project } = this.state
      const title = `${project.name} is Locked`
      
      return (
        <>
          <WrappedComponent projectLocked={isLocked} {...this.props} />
          <Alert open={open} title={title} onCloseAlert={this.onCloseAlert} closeButton={{ value: 'Dismiss' }}>
            <Typography variant="body1">
              This project has been locked by a coordinator. You are able to view the content but are not allowed
              to make any edits.
            </Typography>
          </Alert>
        </>
      )
    }
  }
  
  hoistNonReactStatic(ProjectLockedAlert, WrappedComponent)
  
  /* istanbul ignore next */
  const mapStateToProps = state => ({
    projects: state.data.projects.byId
  })
  
  return connect(mapStateToProps)(ProjectLockedAlert)
}

export default withProjectLocked
