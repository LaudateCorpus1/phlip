import React from 'react'
import { shallow } from 'enzyme'
import { ExportDialog } from '../index'

const props = {
  onClose: jest.fn(),
  onChooseExport: jest.fn(),
  open: true,
  projectToExport: {
    id: 1,
    text: '',
    user: { id: null, firstName: '', lastName: '' },
    exportType: null
  },
  inProgress: false
}

describe('Home - Export Dialog', () => {
  test('should render correctly', () => {
    expect(shallow(<ExportDialog {...props} />)).toMatchSnapshot()
  })
  
  describe('expanding a list section', () => {
    test('should expand the selected section when the user clicks the arrow of a different section', () => {
      const wrapper = shallow(<ExportDialog {...props} />)
      wrapper.instance().expand('numeric')()
      expect(wrapper.state('expanded')).toEqual('numeric')
    })
    
    test('should collapse if user clicks on arrow of already expanded section', () => {
      const wrapper = shallow(<ExportDialog {...props} />)
      wrapper.setState({ expanded: 'text' })
      wrapper.instance().expand('text')()
      expect(wrapper.state('expanded')).toEqual(0)
    })
  })
  
  test('if the user closes the dialog, any expanded section should be closed', () => {
    const wrapper = shallow(<ExportDialog {...props} />)
    wrapper.setState({ expanded: 'text' })
    wrapper.setProps({ open: false })
    wrapper.update()
    expect(wrapper.state('expanded')).toEqual(0)
  })
  
  test('should close the modal and clear expanded sections', () => {
    const spy = jest.spyOn(props, 'onClose')
    const wrapper = shallow(<ExportDialog {...props} />)
    wrapper.setState({ expanded: 'numeric' })
    wrapper.find('WithStyles(Modal)').simulate('close')
    expect(spy).toHaveBeenCalled()
    expect(wrapper.state('expanded')).toEqual(0)
  })
  
  test('should export data when the user selects an export type', () => {
    const spy = jest.spyOn(props, 'onChooseExport')
    const wrapper = shallow(<ExportDialog {...props} />)
    wrapper.instance().onChooseExport('numeric')()
    expect(spy).toHaveBeenCalled()
  })
  
  describe('Progress Info', () => {
    describe('if there\'s an export in progress', () => {
      const wrapper = shallow(
        <ExportDialog
          {...props}
          inProgress
          projectToExport={{
            id: 1,
            text: '',
            user: { id: 4, firstName: '', lastName: '' },
            exportType: 'text'
          }}
        />
      )
      
      test('should pass in the type of export in progress', () => {
        expect(wrapper.find('ListSection').at(0).prop('inProgress').user).toEqual(4)
      })
      
      test('should pass in the user who is being exported', () => {
        expect(wrapper.find('ListSection').at(0).prop('inProgress').type).toEqual('text')
      })
    })
    
    describe('if there\'s not an export in progress', () => {
      test('all progress info should be null', () => {
        const wrapper = shallow(<ExportDialog {...props} />)
        expect(wrapper.find('ListSection').at(0).prop('inProgress')).toEqual({
          user: null,
          type: null
        })
      })
    })
  })
})
