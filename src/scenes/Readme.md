Scenes represent that major pages (views) in the project. For the most
part, this is where the redux and state management is done. Each scene
has these files for redux:

| Filename | Description |
| -------- | ----------- |
| logic.js | Redux logic, mostly handling API calls, for the scene |
| reducer.js | Redux reducer for the scene |
| actions.js | Redux action creators as well as action types for the scene |

The index.js file in each scene directory is where the redux state is connected
to the component. We use react-redux's connect HOC and redux's bindActionCreators
to bind dispatch to the action creator functions.

The **mapStateToProps** and **mapDispatchToProps** at the bottom of each
index.js file is where the binding and connection happens. The state for each
component is accessed as state.scenes.sceneName, for example state.scenes.home.

<br /><br />