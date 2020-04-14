/**
 * Configuration for e2e tests Jest
 */
module.exports = {
  rootDir: '../',
  testRegex: 'all.e2e.test.js',
  modulePaths: [
    '<rootDir>/src/'
  ],
  preset: 'jest-puppeteer'
}