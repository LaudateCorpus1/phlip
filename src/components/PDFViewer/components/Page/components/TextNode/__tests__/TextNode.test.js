import React from 'react'
import { mount } from 'enzyme'
import { TextNode } from '../index'
import { viewport, textContent, canvasContext } from 'utils/testData/pdfTest'

const props = {
  textItem: textContent.items[0],
  allStyles: textContent.styles,
  viewport,
  canvasContext
}

describe('PDFViewer - Page - TextNode component', () => {
  test('should render correctly', () => {
    const wrapper = mount(<TextNode {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})