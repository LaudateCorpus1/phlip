import React from 'react'
import { shallow } from 'enzyme'
import { ProjectPanel } from '../index'
import theme from 'services/theme'

const props = {
  actions: {
    getProjectUsers: jest.fn(),
    toggleBookmark: jest.fn()
  },
  onExport: jest.fn(),
  length: 4,
  id: 1,
  index: 0,
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
  handleExpandProject: jest.fn(),
  handleEditProject: jest.fn(),
  bookmarked: false,
  expanded: false,
  allUsers: {},
  role: 'Admin',
  users: [],
  theme
}

describe('Home - ProjectList - ProjectPanel scene', () => {
  test('should render correctly', () => {
    expect(shallow(<ProjectPanel {...props} />)).toMatchSnapshot()
  })
  
  test('should render correctly when expanded', () => {
    expect(shallow(<ProjectPanel {...props} expanded />)).toMatchSnapshot()
  })
  
  describe('when a coder is logged in', () => {
    const wrapper = shallow(<ProjectPanel {...props} expanded role="Coder" />)
    describe('when the card is open', () => {
      test('validate button should not be visible', () => {
        expect(wrapper.find('WithTheme(Button)').findWhere(n => n.prop('value') === 'Validate').length).toEqual(0)
      })
      
      test('code button should be visible', () => {
        expect(wrapper.find('WithTheme(Button)').findWhere(n => n.prop('value') === 'Code').length).toEqual(1)
      })
      
      test('coding scheme button should not be visible', () => {
        expect(wrapper.find('WithTheme(Button)').everyWhere(n => n.childAt(0) !== 'Coding Scheme')).toEqual(true)
      })
      
      test('jurisdictions button should not be visible', () => {
        expect(wrapper.find('WithTheme(Button)').everyWhere(n => n.childAt(0) !== 'Jurisdiction')).toEqual(true)
      })
    })
  })
  
  describe('when a coordinator is logged in', () => {
    const wrapper = shallow(<ProjectPanel {...props} expanded role="Coordinator" />)
    describe('when the card is open', () => {
      test('validate button should be visible', () => {
        expect(wrapper.find('WithTheme(Button)').findWhere(n => n.prop('value') === 'Validate').length).toEqual(1)
      })
      
      test('code button should be visible', () => {
        expect(wrapper.find('WithTheme(Button)').findWhere(n => n.prop('value') === 'Code').length).toEqual(1)
      })
      
      test('coding scheme button should be visible', () => {
        expect(wrapper.find('WithTheme(Button)').someWhere(n => n.childAt(0).text() === 'Coding Scheme')).toEqual(true)
      })
      
      test('jurisdictions button should be visible', () => {
        expect(wrapper.find('WithTheme(Button)').someWhere(n => n.childAt(0).text() === 'Jurisdictions')).toEqual(true)
      })
    })
  })
})
