Functions for logging the user in and out and handling the authToken.
When a user logs in the backend creates a jsonwebtoken (JWT) and sends it
back. That token is stored in the browser's sessionStorage. When a user
logs out the token is removed from session storage.