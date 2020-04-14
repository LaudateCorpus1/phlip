#### Standard DatePicker example:
```jsx
initialState = { value: new Date() };

<DatePicker
  required
  name="birthdate"
  label="Select your birthdate"
  dateFormat="MM/DD/YYYY"
  onChange={(e) => setState({ value: e })}
  value={state.value}
  autoOk={true}
  onInputChange={(e) => setState({ value: e })}
/>
```