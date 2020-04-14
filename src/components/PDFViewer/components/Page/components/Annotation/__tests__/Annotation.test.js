import React from 'react'
import { mount, shallow } from 'enzyme'
import { Annotation } from '../index'
import { viewport, annotations } from 'utils/testData/pdfTest'
import { createMockStore } from 'utils/testData/createMockStore'
import { Provider } from 'react-redux'

const store = createMockStore()

const props = {
  annotation: annotations[0],
  index: 0,
  pageNumber: 0,
  pending: false,
  isClicked: false,
  handleConfirmAnnotation: jest.fn(),
  handleCancelAnnotation: jest.fn(),
  handleRemoveAnnotation: jest.fn(),
  handleClickAnnotation: jest.fn(),
  transform: viewport.transform,
  user: {
    initials: 'TU',
    username: 'Test User',
    avatar: 'data:image/jpeg;base64,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'
  },
  showAvatar: false,
  annotationModeEnabled: true,
  closeToOthers: 1
}

const setup = (otherProps = {}) => {
  return mount(
    <Provider store={store}>
      <Annotation {...props} {...otherProps} />
    </Provider>
  )
}

describe('PDFViewer - Page - Annotation component', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<Annotation {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
  
  test('should render all annotation rects', () => {
    const wrapper = shallow(<Annotation {...props} />)
    expect(wrapper.children()).toHaveLength(3)
  })
  
  test('should highlight background color should be #00e0ff when user is undefined', () => {
    const wrapper = shallow(<Annotation {...props} user={undefined} />)
    expect(wrapper.find('div').at(0).prop('style').backgroundColor).toEqual('#00e0ff')
  })
  
  describe('removing annotations', () => {
    test('should not show x icon if annotationModeEnabled is false', () => {
      const wrapper = shallow(<Annotation {...props} isClicked annotationModeEnabled={false} />)
      expect(wrapper.find('.iconActions')).toHaveLength(0)
    })
    
    test('should call handleClickAnnotation if the first rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked />)
      wrapper.children(0).at(0).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should call handleClickAnnotation if the last rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked />)
      wrapper.children().at(2).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should call handleClickAnnotation if any rect of an annotation is clicked', () => {
      const spy = jest.spyOn(props, 'handleClickAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked />)
      wrapper.children().at(1).simulate('click')
      expect(spy).toHaveBeenCalled()
    })
    
    test('should show x icon button if isClicked is true', () => {
      const wrapper = mount(<Annotation {...props} isClicked />)
      expect(wrapper.find('.iconActions')).toHaveLength(1)
    })
    
    test('should not show x icon button if isClicked is false', () => {
      const wrapper = mount(<Annotation {...props} />)
      expect(wrapper.find('.iconActions')).toHaveLength(0)
    })
    
    test('should only show the x icon button and not the checkmark icon button', () => {
      const wrapper = mount(<Annotation {...props} isClicked />)
      expect(wrapper.find('.iconActions').children()).toHaveLength(1)
    })
    
    test('should call handleRemoveAnnotation if icon x button is clicked', () => {
      const spy = jest.spyOn(props, 'handleRemoveAnnotation')
      const wrapper = mount(<Annotation {...props} isClicked />)
      wrapper.find('.iconActions').find('button').simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('user annotation avatar', () => {
    test('should not show avatar if props.showAvatar is false', () => {
      const wrapper = mount(<Annotation {...props} />)
      expect(wrapper.find('Avatar').length).toEqual(0)
    })
    
    test('should display avatar if props.showAvatar is true', () => {
      const wrapper = setup({ showAvatar: true })
      expect(wrapper.find('img').length).toEqual(1)
    })
    
    test('should have alt text with full annotation text', () => {
      const wrapper = setup({ showAvatar: true })
      expect(wrapper.find('img').prop('alt')).toEqual(`Test User highlighted ${annotations[0].text}`)
    })
  })
  
  describe('pending annotations', () => {
    test('should show checkmark icon button', () => {
      const wrapper = mount(<Annotation {...props} pending />)
      expect(wrapper.find('.iconActions').children()).toHaveLength(2)
    })
  
    test('should do nothing when a pending annotation is clicked', () => {
      const wrapper = mount(<Annotation {...props} pending />)
      const out = wrapper.children().at(0).prop('onClick')()
      expect(out).toEqual(null)
    })
    
    test('should call handleCancelAnnotation when the x icon button is clicked', () => {
      const spy = jest.spyOn(props, 'handleCancelAnnotation')
      const wrapper = mount(<Annotation {...props} pending />)
      wrapper.find('.iconActions').find('button').at(0).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should call handleConfirmAnnotation when the checkmark icon button is clicked', () => {
      const spy = jest.spyOn(props, 'handleConfirmAnnotation')
      const wrapper = mount(<Annotation {...props} pending />)
      wrapper.find('.iconActions').find('button').at(1).simulate('click')
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
