import isEmail from 'sane-email-validation'

export default function (values) {
  const errors = {}
  const requiredFields = [
    'firstName',
    'lastName',
    'email'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  })
  if (values.email && !isEmail(values.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}
