import React from 'react'
import { shallow } from 'enzyme'
import { AnnotationControls } from '../index'

const props = {
  onToggleViewAnnotations: jest.fn(),
  onToggleAnnotationMode: jest.fn(),
  answerId: '3',
  viewEnabled: true,
  annoModeEnabled: true,
  viewButtonDisabled: true,
  annoModeButtonDisabled: true
}

describe('CodingValidation - AnnotationControls', () => {
  test('should render correctly', () => {
    expect(shallow(<AnnotationControls {...props} />)).toMatchSnapshot()
  })
})
