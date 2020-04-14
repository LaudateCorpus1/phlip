import React from 'react'
import { shallow, mount } from 'enzyme'
import { PDFViewer } from '../index'

const props = {
  document: {
    content: {}
  },
  allowSelection: false,
  annotations: [],
  saveAnnotation: jest.fn(),
  showAnnoModeAlert: true,
  onHideAnnoModeAlert: jest.fn()
}

describe('PDFViewer component', () => {
  test('should render correctly', () => {
    expect(shallow(<PDFViewer {...props} />)).toMatchSnapshot()
  })
  
  describe('handling annotation mode alert', () => {
    describe('when show anno mode alert is true', () => {
      test('should display an alert when handleAnnoModeAlert is called', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        wrapper.instance().handleAnnoModeAlert()
        wrapper.update()
        expect(wrapper.find('Alert').at(1).prop('open')).toEqual(true)
      })
      
      test('should call props.hideAnnoModeAlert if user checked don\'t show again box', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        const spy = jest.spyOn(props, 'onHideAnnoModeAlert')
        wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: true } })
        wrapper.instance().dismissAnnoAlert()
        wrapper.update()
        expect(spy).toHaveBeenCalled()
        spy.mockClear()
      })
      
      test('should not call props.hideAnnoModeAlert if user did not check don\'t show again box', async () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        const spy = jest.spyOn(props, 'onHideAnnoModeAlert')
        await wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: false } })
        wrapper.instance().dismissAnnoAlert()
        expect(spy).not.toHaveBeenCalled()
        spy.mockClear()
      })
      
      test('should toggle dont show again when the user clicks the check box in the alert', () => {
        const wrapper = shallow(<PDFViewer {...props} />)
        wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: false } })
        wrapper.find('Alert').find('WithStyles(CheckboxLabel)').prop('input').onChange()
        wrapper.update()
        expect(wrapper.state('annoModeAlert').dontShowAgain).toEqual(true)
      })
      
      test('should hide anno mode alert when user clicks dismiss button', () => {
        const wrapper = mount(<PDFViewer {...props} />)
        wrapper.setState({ annoModeAlert: { open: true, dontShowAgain: false } })
        wrapper.find('Alert').at(1).prop('onCloseAlert')()
        wrapper.update()
        expect(wrapper.find('Alert').at(1).prop('open')).toEqual(false)
      })
    })
    
    describe('when show anno mode alert is false', () => {
      test('should not display an alert when handleAnnoModeAlert is called', () => {
        const wrapper = shallow(<PDFViewer {...props} showAnnoModeAlert={false} />)
        wrapper.instance().handleAnnoModeAlert()
        wrapper.update()
        expect(wrapper.find('Alert').at(1).prop('open')).toEqual(false)
      })
    })
  })
})
