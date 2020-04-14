/**
 * Create and start the webpack-dev-server for development
 */
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const paths = require('../config/paths')
const dotenv = require('dotenv').config()
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const env = require('../config/env')(NODE_ENV)

// Webpack-dev-server configuration options
const config = {
  compress: true,
  contentBase: paths.appBuild,
  watchContentBase: true,
  hot: true,
  host: '0.0.0.0',
  publicPath: paths.publicPath,
  overlay: false,
  historyApiFallback: true,
  proxy: {
    '/api': process.env.APP_API_URL,
    '/docsApi': {
      target: process.env.APP_DOC_MANAGE_API,
      pathRewrite: { '^/docsApi': '/api' }
    }
  }
}

// Webpack configuration
const webpackDevConfig = require('../config/webpack.dev.config')(env)
const APP_HOST = process.env.APP_HOST || '0.0.0.0'
const APP_PORT = process.env.APP_PORT || 5200

WebpackDevServer.addDevServerEntrypoints(webpackDevConfig, config)
const compiler = webpack(webpackDevConfig)

// Since we're using the Node API, we have to set devServer options here
const devServer = new WebpackDevServer(compiler, config)

// Launch WebpackDevServer
devServer.listen(APP_PORT, APP_HOST, err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan(`Starting the development server on ${APP_HOST}:${APP_PORT}...`))
})
