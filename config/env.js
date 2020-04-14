module.exports = getEnvVariables = nodeEnv => {
  let env = Object.keys(process.env)
    .filter(key => key.startsWith('APP_'))
    .reduce((e, key) => {
      e[key] = JSON.stringify(process.env[key])
      return e
    }, {})

  env = { ...env, 'process.env.NODE_ENV': JSON.stringify(`${nodeEnv}`) }

  if (nodeEnv === 'development') {
    env.APP_API_URL = JSON.stringify('/api')
    env.APP_DOC_MANAGE_API = JSON.stringify('/docsApi')
  } else {
    if (!env.APP_API_URL) {
      env.APP_API_URL = JSON.stringify('http://localhost:80/api')
    }

    if (!env.APP_DOC_MANAGE_API) {
      env.APP_DOC_MANAGE_API = JSON.stringify('http://localhost:3000/api')
    }
  }

  if (!env.APP_LOG_REQUESTS) {
    env.APP_LOG_REQUESTS = JSON.stringify(0)
  }

  if (!env.APP_IS_SAML_ENABLED) {
    env.APP_IS_SAML_ENABLED = JSON.stringify(0)
  }

  if (!env.APP_IS_PRODUCTION) {
    env.APP_IS_PRODUCTION = JSON.stringify(0)
  }

  return env
}
