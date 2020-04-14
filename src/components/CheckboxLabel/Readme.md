#### CheckboxLabel example

```jsx
import CheckboxLabel from 'components/CheckboxLabel'
initialState = { checked: false }

;<CheckboxLabel
  input={{
    value: state.checked,
    onChange: () => setState({ checked: !state.checked })
  }}
  label="I am checkbox label, click the box next to me."
/>
```

#### Disabled CheckboxLabel example
```jsx
import CheckboxLabel from 'components/CheckboxLabel'
initialState = { checked: true }

;<CheckboxLabel
  input={{
    value: state.checked
  }}
  label="I am a disabled checkbox label. You can't uncheck me"
  disabled={true}
/>
```
