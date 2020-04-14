For handling all API calls we use the 'axios' library. To make things
simpler for error handling, all API calls are defined as object in the
apiCalls array in the `calls.js` file.

Each api call is a new value in the array. Each api call object has at
least three properties -- `name`, `method`, and `path` -- and possibly a
fourth `header` property, if needed. An example definition is below:
``` javascript static
{
  name: 'checkPivUser',
  method: 'post',
  path: () => '/users/authenticate',
  headers: ({ tokenObj }) => ({ Authorization: `Bearer ${tokenObj.token}` })
}
```

The `index.js` file in this directory will take each value in the apiCalls
array and create an axios instance function for each where: `name` is
the name of the function that is created, `method` is the HTTP method to
use, `path` is the API path, and `headers` are any extra headers for the
HTTP call.

The final object that is created from `index.js` contains a function for each
value that is the apiCalls array. This object is passed through to
redux-logic to make accessing the API easier.
