const path = require('path')
const paths = require('./config/paths')
const styles = require('./config/styleguide').stylguideStyles
const theme = require('./config/styleguide').styleguideTheme
const comps = require('./config/paths').styleguideComponents
const autoprefixer = require('autoprefixer')

module.exports = {
  assetsDir: paths.appPublic,
  compilerConfig: {
    objectAssign: 'Object.assign',
    transforms: {
      modules: true,
      dangerousTaggedTemplateString: true,
      asyncAwait: true,
      moduleImport: false
    },
    target: {
      chrome: 60
    }
  },
  components: 'src/components/!(withFormAlert|CodingValidation|withTracking|MultiSelectDropdown|Popover|withProjectLocked|withAutocompleteMethods)/*.js',
  ignore: [
    '**/__tests__/**',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.d.ts',
    '**/src/components/index.js'
  ],
  webpackConfig: {
    resolve: {
      modules: [
        paths.appSrc,
        paths.appNodeModules,
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: require.resolve('tinymce/tinymce'),
          loaders: [
            'imports-loader?this=>window',
            'exports-loader?window.tinymce'
          ]
        },
        {
          test: /tinymce\/(themes|plugins)\//,
          loaders: [
            'imports-loader?this=>window'
          ]
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/i,
              include: [/src/, path.join(paths.config, 'styleguide'), path.join(paths.appNodeModules, 'react-styleguidist/lib/client/rsg-components')],
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      ['@babel/env', { modules: false }],
                      '@babel/react'
                    ],
                    cacheDirectory: true,
                    plugins: [
                      '@babel/plugin-transform-runtime',
                      '@babel/plugin-transform-object-assign',
                      '@babel/plugin-proposal-object-rest-spread',
                      '@babel/plugin-transform-async-to-generator',
                      '@babel/plugin-proposal-class-properties'
                    ]
                  }
                }
              ],
              exclude: paths.appNodeModules
            },
            {
              test: /\.css$/,
              use: [
                { loader: 'style-loader' },
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          'last 2 Chrome versions'
                        ]
                      })
                    ]
                  }
                }
              ]
            },
            {
              test: /\.scss$/,
              use: [
                {
                  loader: 'style-loader'
                },
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    '-autoprefixer': true,
                    importLoaders: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          'last 2 Chrome versions'
                        ]
                      })
                    ]
                  }
                },
                {
                  loader: 'sass-loader'
                }
              ]
            },
            {
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  },
  // webpackConfig: webpack,
  styleguideDir: path.join(__dirname, 'styleguide'),
  logger: {
    warn: console.warn,
    info: console.info,
    debug: console.log
  },
  moduleAliases: {
    utils: path.resolve(__dirname, 'src/utils'),
    services: path.resolve(__dirname, 'src/services'),
    components: path.resolve(__dirname, 'src/components')
  },
  sections: [
    {
      name: 'scenes',
      content: 'src/scenes/Readme.md',
      sections: [
        {
          name: 'User Management',
          content: 'src/scenes/docs/UserManagement.md',
          sections: [
            {
              components: 'src/scenes/Admin/index.js'
            },
            {
              name: 'scenes',
              components: 'src/scenes/Admin/scenes/AddEditUser/index.js'
            },
            {
              name: 'components',
              components: 'src/scenes/Admin/components/*/index.js'
            }
          ]
        },
        {
          name: 'Coding Scheme',
          content: 'src/scenes/CodingScheme/Readme.md',
          sections: [
            {
              components: 'src/scenes/CodingScheme/index.js'
            },
            {
              name: 'scenes',
              components: 'src/scenes/CodingScheme/scenes/AddEditQuestion/index.js'
            },
            {
              name: 'components',
              components: 'src/scenes/CodingScheme/components/*/index.js'
            }
          ]
        },
        {
          name: 'Code / Validate',
          content: 'src/scenes/CodingValidation/Readme.md',
          sections: [
            {
              components: 'src/scenes/CodingValidation/index.js'
            },
            {
              name: 'components',
              components: 'src/scenes/CodingValidation/components/*/index.js'
            }
          ]
        },
        {
          name: 'Document Management',
          content: 'src/scenes/DocumentManagement/Readme.md',
          sections: [
            {
              components: 'src/scenes/DocumentManagement/index.js'
            },
            {
              name: 'scenes',
              components: 'src/scenes/DocumentManagement/scenes/Upload/index.js'
            },
            {
              name: 'components',
              components: 'src/scenes/DocumentManagement/components/*/index.js'
            }
          ]
        },
        {
          name: 'Document View / Details',
          content: 'src/scenes/DocumentView/Readme.md',
          sections: [
            { components: 'src/scenes/DocumentView/index.js' },
            {
              name: 'components',
              components: 'src/scenes/DocumentView/components/*/index.js'
            }
          ]
        },
        {
          name: 'Home / Project List Screen',
          content: 'src/scenes/Home/Readme.md',
          sections: [
            { components: 'src/scenes/Home/index.js' },
            {
              name: 'scenes',
              components: 'src/scenes/Home/scenes/*/index.js'
            },
            {
              name: 'components',
              components: 'src/scenes/Home/components/*/index.js'
            }
          ]
        },
        {
          name: 'Login',
          content: 'src/scenes/Login/Readme.md',
          sections: [
            { components: 'src/scenes/Login/index.js' },
            {
              name: 'components',
              components: 'src/scenes/Login/components/(Prod|Dev)LoginForm.js'
            }
          ]
        },
        {
          name: 'Protocol',
          content: 'src/scenes/Protocol/Readme.md',
          sections: [
            { components: 'src/scenes/Protocol/index.js' }
          ]
        }
      ]
    },
    {
      name: 'data',
      content: 'src/data/Readme.md',
      sections: [
        { name: 'users', content: 'src/data/users/Readme.md' },
        { name: 'autocomplete', content: 'src/data/autocomplete/Readme.md' },
        { name: 'projects', content: 'src/data/projects/Readme.md' },
        { name: 'jurisdictions', content: 'src/data/jurisdictions/Readme.md' }
      ]
    },
    {
      name: 'ui components',
      content: 'src/components/Readme.md',
      components: 'src/components/!(withFormAlert|CodingValidation|withTracking|MultiSelectDropdown|Popover|withProjectLocked|withAutocompleteMethods)/*.js',
      ignore: ['**/src/components/@(Layout|RoutePages)/index.js', '**/src/components/index.js']
    },
    {
      name: 'higher order components (hocs)',
      sections: [
        { name: 'withFormAlert', content: 'src/components/withFormAlert/Readme.md' },
        { name: 'withTracking', content: 'src/components/withTracking/Readme.md' },
        { name: 'withAutocompleteMethods', content: 'src/components/withAutocompleteMethods/Readme.md' },
        { name: 'withProjectLocked', content: 'src/components/withProjectLocked/Readme.md' }
      ]
    },
    {
      name: 'services',
      sections: [
        {
          name: 'api',
          content: 'docs/api.md'
        },
        {
          name: 'authToken',
          content: 'docs/authToken.md'
        },
        {
          name: 'store',
          content: 'src/services/store/Readme.md'
        },
        {
          name: 'theme',
          content: 'docs/theme.md'
        }
      ]
    },
    {
      name: 'utility',
      sections: [
        {
          name: 'codingHelpers',
          content: 'docs/codingHelpers.md',
          description: 'Functions that are primarily used in components/CodingValidation, scenes/Coding and scenes/Validation.'
        },
        {
          name: 'commonHelpers',
          content: 'docs/commonHelpers.md',
          description: 'Generic helpers used throughout the application'
        },
        {
          name: 'formHelpers',
          content: 'docs/formHelpers.md',
          description: 'Functions that are used in any of the forms in the application.'
        },
        {
          name: 'normalize',
          content: 'docs/normalize.md',
          description: 'Generic normalization functions'
        },
        {
          name: 'searchBar',
          content: 'docs/searchBar.md',
          description: 'Generic methods to make searching for values easier'
        },
        {
          name: 'treeHelpers',
          content: 'docs/treeHelpers.md',
          description: 'Methods used when dealing with nested arrays (tree, ex. Code Navigator)'
        },
        {
          name: 'updater',
          content: 'docs/updater.md',
          description: 'Generic functions for updating items in objects and arrays'
        }
      ]
    }
  ],
  exampleMode: 'collapse',
  usageMode: 'expand',
  styleguideComponents: {
    Wrapper: comps('ThemeWrapper.js'),
    SectionsRenderer: comps('SectionsRenderer.js'),
    StyleGuideRenderer: comps('StyleGuideRenderer.js'),
    ExamplePlaceholderRenderer: comps('ExamplePlaceholderRenderer.js'),
    HeadingRenderer: comps('HeadingRenderer.js'),
    SectionHeadingRenderer: comps('SectionHeadingRenderer.js')
  },
  theme,
  styles,
  getComponentPathLine: componentPath => {
    let name = path.basename(componentPath, '.js')
    const dir = path.dirname(componentPath).split('/').slice(1).join('/')
    const baseDir = dir.split('/')[dir.split('/').length - 1]
    
    if (name === 'index') {
      name = baseDir
    } else if (name !== dir) {
      name = `{ ${name} }`
    }
    
    return `import ${name} from '${dir}'`
  }
}