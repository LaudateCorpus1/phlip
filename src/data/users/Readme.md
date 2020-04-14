The code that relates to the current user logged in is in `src/data/user`.
This includes the reducer to handle actions, logic for those actions and
redux action creators themselves.

Most of the actions that these redux files handle are related to actions
that come from choosing an option in the avatar menu as well as toggling
bookmarks for a project, updating avatars for the current user, and
handling when a user successfully logs in and out.

The current user information is persisted using redux-persist, so that
upon refresh the user is still logged in.

Current user information is accessible at `state.data.user`.