/**
 * Configuration for Unit tests Jest
 */
module.exports = {
  rootDir: '../',
  setupFiles: [
    'raf/polyfill',
    '<rootDir>/config/tests/setupFiles.js',
    '<rootDir>/config/tests/sessionStorageMock.js',
    'jest-canvas-mock'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!/node_modules/',
    '!src/**/*.test.js',
    '!src/utils/testData/*.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'cobertura',
    'html',
    'lcov'
  ],
  testRegex: '\/__tests__\/\\w+(?!.+e2e)(.+)\\.test\\.js$',
  modulePaths: [
    '<rootDir>/src/'
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': '<rootDir>/config/tests/styleMock.js',
    '\\.worker.js': '<rootDir>/config/tests/workerMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/config/tests/fileMock.js'
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  globals: {
    'APP_API_URL': '/api',
    'APP_IS_SAML_ENABLED': '0',
    'APP_DOC_MANAGE_API': '/docsApi',
    'APP_LOG_REQUESTS': '0',
    'APP_IS_PRODUCTION': '0'
  }
}
