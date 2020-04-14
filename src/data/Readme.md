All common data used throughout the application is in the `src/data`
folder. Currently the only data that is used throughout the application
is the currentUser information.

There's one file that is the root reducer for the data folder. It
combines reducers from any subdirectory and persists them using
redux-persist. Data in this reducer can be accessed at `state.data`.

<br /><br />