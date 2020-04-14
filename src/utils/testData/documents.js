export const mockDocuments = {
  byId: {
    1: {
      name: 'the elder scrolls: skyrim',
      _id: '1',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 10 },
      uploadedByName: 'test user',
      jurisdictions: [1],
      projects: [12],
      uploadedDate: '2018-12-20T05:00:00.000Z',
      citation: '123-123'
    },
    2: {
      name: 'gardenscapes',
      _id: '2',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 4 },
      uploadedByName: 'test user',
      jurisdictions: [1, 33],
      projects: [12, 11],
      uploadedDate: '2005-10-10T04:00:00.000Z',
      citation: undefined
    },
    3: {
      name: 'words with friends',
      _id: '3',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 4 },
      uploadedByName: 'test user',
      jurisdictions: [2, 33],
      projects: [12, 44],
      uploadedDate: '1993-02-10T05:00:00.000Z',
      citation: '44-231'
    },
    4: {
      name: 'legal text document',
      _id: '4',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 2 },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [5],
      uploadedDate: '2019-01-07T05:00:00.000Z',
      citation: ''
    },
    5: {
      name: 'document about brooklyn nine nine',
      _id: '5',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 5 },
      uploadedByName: 'test user',
      jurisdictions: [33, 200, 1],
      projects: [12, 5],
      uploadedDate: '1994-06-07T04:00:00.000Z',
      citation: 'bnn-124'
    },
    6: {
      name: 'document about overwatch',
      _id: '6',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 4 },
      uploadedByName: 'test user',
      jurisdictions: [1],
      projects: [],
      uploadedDate: '2015-02-14T05:00:00.000Z',
      citation: '123-ow'
    },
    7: {
      name: 'document about bugs',
      _id: '7',
      uploadedBy: { firstName: 'test', lastName: 'user', id: 3 },
      uploadedByName: 'test user',
      jurisdictions: [2],
      projects: [],
      uploadedDate: '2010-10-10T04:00:00.000Z',
      citation: 'bugs-1234'
    }
  },
  allIds: ['1', '2', '3', '4', '5', '6', '7'],
  visible: ['4', '1'],
  userDocs: ['2', '3', '6']
}

export const orderedByDate = ['4', '1', '6', '7', '2', '5', '3']
export const orderedByNameAsc = ['5', '7', '6', '2', '4', '1', '3']
export const orderedByNameDesc = ['3', '1', '4', '2', '6', '7', '5']

export default { mockDocuments, orderedByDate, orderedByNameAsc, orderedByNameDesc }
