export const projects = {
  1: {
    id: 1,
    name: 'Project 1',
    dateLastEdited: new Date(2017, 0, 31),
    lastEditedBy: 'Test User 22',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [
      { name: 'Georgia (state)', jurisdictionId: 3 },
      { name: 'Ohio (state)', jurisdictionId: 42 }
    ],
    createdById: 1
  },
  2: {
    id: 2,
    name: 'Project 2',
    dateLastEdited: new Date(2017, 2, 31),
    lastEditedBy: 'Test User 10',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [{ name: 'Ohio (state)', jurisdictionId: 42 }],
    createdById: 2
  },
  3: {
    id: 3,
    name: 'Project 3',
    dateLastEdited: new Date(2017, 1, 28),
    lastEditedBy: 'Test User 44',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [],
    createdById: 4
  },
  4: {
    id: 4,
    name: 'Project 4',
    dateLastEdited: new Date(2017, 5, 30),
    lastEditedBy: 'Test User 33',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [{ name: 'Oregon (state)', jurisdictionId: 7 }],
    createdById: 4
  },
  5: {
    id: 5,
    name: 'Project 5',
    dateLastEdited: new Date(2017, 9, 31),
    lastEditedBy: 'Test User 99',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [],
    createdById: 2
  }
}

export const projectsPayload = [
  {
    id: 1,
    name: 'Project 1',
    dateLastEdited: new Date(2017, 0, 31),
    lastEditedBy: 'Test User 22',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [
      { name: 'Georgia (state)', jurisdictionId: 3 },
      { name: 'Ohio (state)', jurisdictionId: 42 }
    ],
    createdById: 1
  },
  {
    id: 2,
    name: 'Project 2',
    dateLastEdited: new Date(2017, 2, 31),
    lastEditedBy: 'Test User 10',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [{ name: 'Ohio (state)', jurisdictionId: 42 }],
    createdById: 2
  },
  {
    id: 3,
    name: 'Project 3',
    dateLastEdited: new Date(2017, 1, 28),
    lastEditedBy: 'Test User 44',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [],
    createdById: 4
  },
  {
    id: 4,
    name: 'Project 4',
    dateLastEdited: new Date(2017, 5, 30),
    lastEditedBy: 'Test User 33',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [{ name: 'Oregon (state)', jurisdictionId: 7 }],
    createdById: 4
  },
  {
    id: 5,
    name: 'Project 5',
    dateLastEdited: new Date(2017, 9, 31),
    lastEditedBy: 'Test User 99',
    lastUsersCheck: null,
    projectUsers: [],
    projectJurisdictions: [],
    createdById: 2
  }
]

export const defaultSorted = [5, 4, 2, 3, 1]
export const sortedByDateAndBookmarked = [4, 3, 1, 5, 2]

export default { projects, projectsPayload, defaultSorted, sortedByDateAndBookmarked }
