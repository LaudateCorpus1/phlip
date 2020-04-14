/**
 * This build the production webpack bundle
 */
const chalk = require('chalk')
const webpack = require('webpack')
const paths = require('../config/paths')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config({ path: paths.appDotEnv })
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'

const env = require('../config/env')(NODE_ENV)
const webpackProdConfig = require('../config/webpack.prod.config')(env)

console.log(chalk.cyan(
  `\nThis command will build the webpack bundle/s. \
If you want to serve these files on a web server, then run yarn serve after the build has finished.`))

console.log(chalk.cyan('Webpack is bundling files...'))

// Compile the webpack bundle
const compiler = webpack(webpackProdConfig)
compiler.run((err, stats) => {
  //spinner.stop()
  console.log('\n')
  if (err) {
    console.log(chalk.red('Webpack failed to compile. Check your configuration.\n'))
    console.log(chalk.red(err.stack || err))
    if (err.details) {
      console.error(chalk.red(err.details))
    }
    return
  }

  const output = stats.toJson('normal')
  fs.writeFileSync('stats.json', JSON.stringify(output, null, 2))

  if (stats.hasErrors()) {
    console.log(chalk.redBright('Webpack failed to compile. Try again.'))
    console.log(chalk.redBright(`Webpack found ${output.errors.length} errors.`))
    console.log(chalk.redBright('Errors:'))
    output.errors.forEach(error => {
      console.log(chalk.redBright(`${error}`))
    })
    console.log('\n')
    process.exit(1)
  }

  if (stats.hasWarnings()) {
    console.log(chalk.yellowBright(`Webpack found ${output.warnings.length} warnings.`))
    console.log(chalk.yellowBright('WARNINGS:'))
    output.warnings.forEach((warning, i) => {
      console.log(chalk.yellowBright(`${warning}`))
    })
    console.log('\n')
  }

  if (!stats.hasErrors()) {
    console.log(chalk.green('Webpack build completed successfully.'))
    console.log(chalk.green(`Output is in ${paths.appBuild}`))
  }
})
