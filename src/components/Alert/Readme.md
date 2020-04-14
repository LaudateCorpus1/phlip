#### Alert example.
Click the button to see what the alert would look like.

```jsx
import Button from '../Button'
import Typography from '@material-ui/core/Typography'
initialState = { open: false }

actions = [
  { value: 'Continue', type: 'button', onClick: () => setState({ open: false }) }
]

;<div>
  <Button onClick={() => setState({ open: true })}>Open Alert</Button>
  <Alert open={state.open} actions={actions} onCloseAlert={() => setState({ open: false })}>
    I am an alert. Something happened! Oh no.
  </Alert>
</div>
```
