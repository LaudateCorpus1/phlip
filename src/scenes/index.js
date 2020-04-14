import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PersistGate } from 'redux-persist/es/integration/react'
import Login from './Login'
import AuthenticatedRoute from 'components/AuthenticatedRoute'
import Main from './main'
import { persistor } from 'services/store'

/**
 * Main scenes component, where all of the page views are set. It sets the /login route and any other path be sent to
 * the AuthenticatedRoutes with the component AuthenticatedScenes. redux-persist `<PersistGate>` component is set up here.
 */
const Scenes = () => {
  return (
    <PersistGate persistor={persistor}>
      <Switch>
        <Route path="/login" component={Login} />
        <AuthenticatedRoute component={Main} />
      </Switch>
    </PersistGate>
  )
}

export default Scenes
