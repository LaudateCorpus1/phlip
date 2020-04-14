__withFormAlert__ is a higher order component (HOC) that will show an
alert for you for different errors or alerts that need to be displayed
related to form inside of modals (all of our forms are inside modals).
It is set up to be able to work with both forms that use the redux-form
library as well as self controlled forms.

The two error alerts it will show are: __if the user clicks outside the form
modal and there are unsaved changes__; __if there is an API error while
submitting the form__.

In order for withFormAlert to know when the alerts need to be shown, it
needs to know the __form__ prop on the form component, and by having the
form component call functions to handle when the modal closes and if there's
a submit error.

withFormAlert will inject two props into your form component:
__onCloseModal__, __onSubmitError__. onCloseModal should be passed to the
modal component to handle when the user clicks away, and onSubmitError should
be called when there's a submit error.

### Form prop required configuration
There are required keys that the __form__ prop on the form component needs
to have in order for the withFormAlert HOC to work properly. If the form
is controlled in redux-form then these properties are exist by default.
<br/><br/>
``` javascript static
form = {
  registeredFields: [],
  values: {},
  initial: {}
}
```
### Example usage
Assume that FormModalComponent is a component that renders a form inside
of a modal.
<br/><br/>
``` javascript static
withFormAlert(FormModalComponent)
```