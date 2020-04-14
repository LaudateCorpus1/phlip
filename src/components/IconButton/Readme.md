#### Basic IconButton example
Click the ship wheel
```jsx
import ShipWheel from 'mdi-material-ui/ShipWheel'
import Typography from '@material-ui/core/Typography'
initialState = { clicked: 0 }

;<div>
  <IconButton color="primary" onClick={() => setState({ clicked: state.clicked + 1 })}>
    <ShipWheel />
  </IconButton>
  <Typography>I've been clicked {state.clicked} times.</Typography>
</div>
```