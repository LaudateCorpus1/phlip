'use strict'

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
  appBuild: resolveApp('dist'),
  config: resolveApp('config'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appDevHtml: resolveApp('public/index.dev.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  appDotEnv: resolveApp('.env'),
  publicPath: '/',
  eslint: resolveApp('.eslintrc.json'),
  styleguideComponents: fileName => resolveApp(`config/styleguide/${fileName}`)
}
