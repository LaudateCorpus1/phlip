The project uses the material-ui library for React. Material-UI is based
on Google's Material Design. There's a global application theme of colors
and overrides that is given to the `<MuiThemeProvider>` component in
`src/App.js`.

To create the theme, the `createMuiTheme` function from the library is
used. We pass in the primary, secondary and error colors to the palette
property that can be referenced throughout the app on Material UI components.

Material UI allows you to override any default configuration. This project
has four overrides, defined in the `overrides` property:

- Form labels are set to the secondary color (teal) when focused
- Form labels are set to a gray color when disabled
- The underline of a text field when focus is the secondary color (teal)
- Avatar images are set to 100% width and 100% height, otherwise images
are made to fit the circle and may not fill the entire circle
