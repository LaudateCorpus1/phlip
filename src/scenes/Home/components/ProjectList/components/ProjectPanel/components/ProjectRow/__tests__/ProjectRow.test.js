import React from 'react'
import { ProjectRow } from '../index'
import { shallow } from 'enzyme'

const props = {
  project: {
    createdBy: 'Admin',
    createdByEmail: 'test@test.test',
    createdById: 1,
    dateCreated: '2019-04-08T11:43:46.3034169',
    dateLastEdited: '2019-04-18T13:27:51.454041',
    id: 2,
    lastEditedBy: 'Aleksandra Zaryanova',
    lastUsersCheck: 1555606985567,
    name: 'PROJECT',
    projectUsers: [],
    projectJurisdictions: [],
    type: 1
  },
  isCoder: false,
  bookmarked: false,
  toggleBookmark: jest.fn()
}

const setup = (other = {}) => {
  return shallow(
    <ProjectRow {...props} {...other} />
  )
}

describe('Home - ProjectList - ProjectPanel - ProjectRow component', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectRow {...props} />)).toMatchSnapshot()
  })
  
  describe('bookmark icon', () => {
    test('should be `bookmark` if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('IconButton').at(0).childAt(0)
      expect(wrapper.text()).toContain('bookmark')
    })
    
    test('should be `bookmark_border` if the project is not bookmarked', () => {
      const wrapper = setup().find('IconButton').at(0).childAt(0)
      expect(wrapper.text()).toContain('bookmark_border')
    })
    
    test('should be grey if the project is not bookmarked', () => {
      const wrapper = setup().find('IconButton').at(0)
      expect(wrapper.prop('color')).toEqual('#757575')
    })
    
    test('should be orange if the project is bookmarked', () => {
      const wrapper = setup({ bookmarked: true }).find('IconButton').at('0')
      expect(wrapper.prop('color')).toEqual('#fdc43b')
    })
  
    test('should call props.toggleBookmark when the bookmark icon is clicked', () => {
      const spy = jest.spyOn(props, 'toggleBookmark')
      let wrapper = setup()
      wrapper.find('IconButton').at(0).simulate('click', { stopPropagation: () => undefined })
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
