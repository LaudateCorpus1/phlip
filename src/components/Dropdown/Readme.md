#### Basic Dropdown example:
```jsx
initialState = { value: 1 }
dropdownOptions = [{ value: 1, label: 'Winter' }, { value: 2, label: 'Spring' }, {value: 3, label: 'Summer' }, {value: 4, label: 'Autumn' }]

;<Dropdown
  label="What is your favorite season?"
  input={{ value: state.value, onChange: (value) => setState({ value }) }}
  options={dropdownOptions}
  style={{ width: 300 }}
  classes={{}}
/>
```