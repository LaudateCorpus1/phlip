export const schemeFromApi = [
  {
    text: 'fa la la la',
    hint: '',
    questionType: 1,
    id: 1,
    parentId: 0,
    positionInParent: 0,
    isCategoryQuestion: false,
    flags: [],
    possibleAnswers: [{ id: 123, text: 'answer 1', order: 1 }, { id: 234, text: 'answer 2', order: 2 }]
  },
  {
    text: 'la la la',
    hint: '',
    questionType: 3,
    id: 2,
    parentId: 0,
    isCategoryQuestion: false,
    positionInParent: 1,
    flags: [],
    possibleAnswers: [
      { id: 9, text: 'check 1', order: 1 }, { id: 8, text: 'check 2', order: 2 }, { id: 7, text: 'check 3', order: 3 }
    ]
  },
  {
    text: 'cat question',
    questionType: 2,
    id: 3,
    parentId: 0,
    hint: '',
    positionInParent: 2,
    isCategoryQuestion: false,
    flags: [],
    possibleAnswers: [
      { id: 5, text: 'category 1', order: 1 },
      { id: 10, text: 'category 2', order: 2 },
      { id: 20, text: 'category 3', order: 3 }
    ]
  },
  {
    text: 'cat question child',
    questionType: 3,
    id: 4,
    parentId: 3,
    hint: '',
    positionInParent: 0,
    isCategoryQuestion: true,
    flags: [],
    possibleAnswers: [
      { id: 432, text: 'answer 1', order: 1 },
      { id: 2124, text: 'answer 2', order: 2 }
    ]
  },
  {
    text: 'next sibling',
    questionType: 3,
    id: 5,
    parentId: 0,
    hint: '',
    isCategoryQuestion: false,
    flags: [],
    positionInParent: 3,
    possibleAnswers: [{ id: 4, text: 'cat 2', order: 1 }, { id: 5, text: 'cat 1', order: 2 }]
  }
]

export const schemeById = {
  1: {
    ...schemeFromApi[0],
    indent: 0,
    number: '1'
  },
  2: {
    ...schemeFromApi[1],
    indent: 0,
    number: '2'
  },
  3: {
    ...schemeFromApi[2],
    indent: 0,
    number: '3'
  },
  4: {
    ...schemeFromApi[3],
    indent: 1,
    number: '3.1'
  },
  5: {
    ...schemeFromApi[4],
    indent: 0,
    number: '4'
  }
}

export const schemeOrder = [1, 2, 3, 4, 5]

export const schemeTree = [
  { ...schemeById[1] },
  { ...schemeById[2] },
  {
    ...schemeById[3],
    expanded: true,
    children: [{ ...schemeById[4] }]
  },
  { ...schemeById[5] }
]

export const schemeTreeAfterInitialization = [
  { ...schemeById[1] },
  { ...schemeById[2] },
  {
    ...schemeById[3],
    expanded: true,
    children: [
      {
        ...schemeById[4],
        completedProgress: 50,
        children: [
          {
            indent: 2,
            isAnswered: true,
            isCategory: true,
            order: 2,
            positionInParent: 1,
            schemeAnswerId: 10,
            schemeQuestionId: 4,
            text: 'category 2'
          },
          {
            indent: 2,
            isAnswered: false,
            isCategory: true,
            order: 3,
            positionInParent: 2,
            schemeAnswerId: 20,
            schemeQuestionId: 4,
            text: 'category 3'
          }
        ]
      }
    ]
  },
  { ...schemeById[5] }
]

export const schemeOutline = {
  1: { parentId: 0, positionInParent: 0 },
  2: { parentId: 0, positionInParent: 1 },
  3: { parentId: 0, positionInParent: 2 },
  4: { parentId: 3, positionInParent: 0 },
  5: { parentId: 0, positionInParent: 3 }
}

export const schemeUserAnswersEmpty = {
  1: {
    answers: {},
    schemeQuestionId: 1,
    comment: ''
  },
  2: {
    answers: {},
    schemeQuestionId: 2,
    comment: ''
  },
  3: {
    schemeQuestionId: 3,
    answers: {}
  },
  4: {
    10: { answers: {}, comment: '', flag: {} },
    20: { answers: {}, comment: '', flag: {} },
    5: { answers: {}, comment: '', flag: {} }
  },
  5: {
    schemeQuestionId: 5,
    answers: {}
  }
}

export const userCodedQuestions = [
  {
    id: 10019,
    schemeQuestionId: 1,
    flag: null,
    comment: '',
    codedAnswers: [
      {
        id: 10010,
        schemeAnswerId: 123,
        pincite: 'dsfdfdsf',
        textAnswer: null,
        annotations: []
      }
    ]
  },
  {
    id: 4443,
    schemeQuestionId: 3,
    flag: null,
    comment: '',
    codedAnswers: [
      {
        schemeAnswerId: 10,
        pincite: '',
        textAnswer: null,
        annotations: [{ text: '323123', id: 4, docId: '12344' }, { text: 'hi hi', id: 1, docId: '12344' }]
      },
      {
        schemeAnswerId: 20,
        pincite: '',
        textAnswer: null,
        annotations: []
      }
    ]
  },
  {
    id: 42,
    schemeQuestionId: 4,
    flag: null,
    comment: '',
    categoryId: 10,
    codedAnswers: [
      {
        schemeAnswerId: 432,
        pincite: '',
        textAnswer: null,
        annotations: []
      }
    ]
  },
  {
    id: 43,
    schemeQuestionId: 4,
    flag: null,
    comment: '',
    categoryId: 20,
    codedAnswers: []
  }
]

export const userAnswersCoded = {
  1: {
    answers: {
      123: {
        id: 10010,
        schemeAnswerId: 123,
        pincite: 'dsfdfdsf',
        annotations: [],
        textAnswer: null
      }
    },
    schemeQuestionId: 1,
    comment: '',
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 10019,
    isNewCodedQuestion: false
  },
  3: {
    schemeQuestionId: 3,
    comment: '',
    answers: {
      10: {
        schemeAnswerId: 10,
        pincite: '',
        annotations: [{ text: '323123', id: 4, docId: '12344' }, { text: 'hi hi', id: 1, docId: '12344' }],
        textAnswer: null
      },
      20: { schemeAnswerId: 20, pincite: '', annotations: [], textAnswer: null }
    },
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 4443,
    isNewCodedQuestion: false
  },
  4: {
    10: {
      answers: { 432: { schemeAnswerId: 432, pincite: '', annotations: [], textAnswer: null } },
      comment: '',
      schemeQuestionId: 4,
      flag: {
        notes: '',
        raisedBy: {},
        type: 0
      },
      isNewCodedQuestion: false,
      categoryId: 10,
      hasMadePost: false,
      id: 42
    },
    20: {
      answers: {},
      categoryId: 20,
      isNewCodedQuestion: false,
      id: 43,
      hasMadePost: false,
      comment: '',
      schemeQuestionId: 4,
      flag: {
        notes: '',
        raisedBy: {},
        type: 0
      }
    }
  }
}

export const userValidatedQuestions = [
  {
    ...userCodedQuestions[0],
    validatedBy: { userId: 2, firstName: 'test', lastName: 'user' },
    id: 101
  },
  {
    ...userCodedQuestions[1],
    id: 201,
    validatedBy: { userId: 1, firstName: 'test', lastName: 'user2' }
  },
  {
    ...userCodedQuestions[2],
    id: 301,
    validatedBy: { userId: 1, firstName: 'test', lastName: 'user2' }
  }
]

export const userAnswersValidation = {
  1: {
    answers: {
      123: {
        id: 10010,
        schemeAnswerId: 123,
        pincite: 'dsfdfdsf',
        annotations: [],
        textAnswer: null
      }
    },
    schemeQuestionId: 1,
    comment: '',
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 101,
    validatedBy: userValidatedQuestions[0].validatedBy,
    isNewCodedQuestion: false
  },
  3: {
    schemeQuestionId: 3,
    comment: '',
    answers: {
      10: {
        schemeAnswerId: 10,
        pincite: '',
        annotations: [{ text: '323123', id: 4, docId: '12344' }, { text: 'hi hi', id: 1, docId: '12344' }],
        textAnswer: null
      },
      20: { schemeAnswerId: 20, pincite: '', annotations: [], textAnswer: null }
    },
    flag: {
      notes: '',
      raisedBy: {},
      type: 0
    },
    hasMadePost: false,
    id: 201,
    validatedBy: userValidatedQuestions[1].validatedBy,
    isNewCodedQuestion: false
  },
  4: {
    10: {
      answers: { 432: { schemeAnswerId: 432, pincite: '', annotations: [], textAnswer: null } },
      comment: '',
      schemeQuestionId: 4,
      flag: {
        notes: '',
        raisedBy: {},
        type: 0
      },
      isNewCodedQuestion: false,
      categoryId: 10,
      hasMadePost: false,
      id: 301,
      validatedBy: userValidatedQuestions[2].validatedBy
    }
  }
}

export const bulkValidationQuestions = [
  {
    id: 1001,
    validatedBy: { userId: 1 },
    comment: '',
    codedAnswers: [{ id: 789, schemeAnswerId: 234, pincite: 'my pincite!!!', textAnswer: null, annotations: [] }],
    schemeQuestionId: 1,
    projectJurisdictionId: 1
  },
  {
    id: 1002,
    validatedBy: { userId: 1 },
    comment: '',
    codedAnswers: [
      { id: 888, schemeAnswerId: 5, pincite: 'my pincite', annotations: [], textAnswer: null },
      { id: 898, schemeAnswerId: 20, pincite: 'my 20 pincite', annotations: [], textAnswer: null }
    ],
    schemeQuestionId: 3,
    projectJurisdictionId: 1
  },
  {
    id: 1003,
    validatedBy: { userId: 1 },
    codedAnswers: [
      {
        id: 998,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 9,
        pincite: 'blooooop'
      }, {
        id: 999,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 8,
        pincite: 'blep',
        schemeQuestionId: 2
      }
    ],
    schemeQuestionId: 2,
    projectJurisdictionId: 1
  },
  {
    id: 1005,
    codedAnswers: [
      {
        textAnswer: null,
        schemeAnswerId: 8,
        pincite: 'blepppp',
        annotations: []
      }
    ],
    schemeQuestionId: 2,
    validatedBy: { userId: 1 },
    projectJurisdictionId: 10
  },
  {
    categoryId: 5,
    id: 1006,
    codedAnswers: [
      {
        textAnswer: null,
        schemeAnswerId: 5,
        pincite: 'category 5 pincite',
        annotations: [],
        id: 997
      }
    ],
    schemeQuestionId: 4,
    validatedBy: { userId: 1 },
    projectJurisdictionId: 1
  },
  {
    categoryId: 20,
    id: 1007,
    codedAnswers: [
      {
        textAnswer: null,
        schemeAnswerId: 20,
        pincite: 'category 20 pincite',
        annotations: [],
        id: 996
      }
    ],
    schemeQuestionId: 4,
    validatedBy: { userId: 1 },
    projectJurisdictionId: 1
  }
]

export const mergedUserQuestions = {
  1: {
    answers: [
      {
        id: 98,
        userId: 4,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 123,
        pincite: 'my pincite la'
      },
      {
        id: 97,
        userId: 5,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 123,
        pincite: 'my pincite lala'
      },
      {
        id: 100,
        userId: 22,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 234,
        pincite: 'my pincite!!!'
      }
    ],
    flagsComments: [{ id: 4, type: 2, notes: 'flag notes here', raisedBy: { userId: 3 } }]
  },
  2: {
    answers: [
      {
        id: 101,
        userId: 22,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 9,
        pincite: 'blooooop'
      },
      {
        id: 102,
        userId: 22,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 8,
        pincite: 'blep'
      }
    ],
    flagsComments: []
  },
  3: {
    answers: [
      {
        id: 99,
        userId: 4,
        annotations: [],
        textAnswer: null,
        schemeAnswerId: 10,
        pincite: 'my pincite'
      }
    ],
    flagsComments: [{ id: 5, type: 2, notes: 'flag notes', comment: 'this is my comment', raisedBy: { userId: 3 } }]
  },
  4: {
    10: {
      answers: [],
      flagsComments: [
        { id: 1, type: 3, notes: 'flag notes', comment: '', raisedBy: { userId: 2 } },
        { id: 2, type: 2, notes: 'flag notes', comment: '', raisedBy: { userId: 3 } }
      ]
    }
  }
}

export const docListPayload = [
  {
    name: 'document 1',
    _id: '1234',
    uploadedDate: new Date('12/10/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate : new Date('12/10/2010')
  },
  {
    name: 'document 2',
    _id: '5678',
    uploadedDate: new Date('12/09/2010'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate: new Date('12/09/2010')
  },
  {
    name: 'document 3',
    _id: '9101',
    uploadedDate: new Date('02/10/2018'),
    uploadedBy: { firstName: 'test', lastName: 'user' },
    effectiveDate: new Date('02/10/2018')
  }
]
