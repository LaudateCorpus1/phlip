#### Basic Menu example
```jsx
import Button from '../Button';
initialState = { open: false, anchorEl: null };

<div>
  <Button
    onClick={(event) => setState({ open: true, anchorEl: event.currentTarget })}
    value="open menu"
  />
  <Menu
    anchorEl={state.anchorEl}
    open={state.open}
    onClose={() => setState({ open: false, anchorEl: null })}
    items={[
      { label: 'Item 1', key: 'item-1' },
      { label: 'Item 2', key: 'item-2' },
      { label: 'Item 3', key: 'item-3' }
    ]}
  />
</div>
```
