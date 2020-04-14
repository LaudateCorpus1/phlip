import React from 'react'
import raf from './tempPolyfills'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
const rrd = require('react-router-dom')

Enzyme.configure({ adapter: new Adapter() })

// Mocking react-router-dom browser router to just render children
// eslint-disable-next-line react/display-name
rrd.BrowserRouter = ({ children }) => <div>{children}</div>

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js')
  return class {
    static placements = PopperJS.placements
    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {}
      }
    }
  }
})

module.exports = rrd
