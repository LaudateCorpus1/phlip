let apiCalls = [
  {
    name: 'checkPivUser',
    method: 'post',
    path: () => '/users/authenticate',
    headers: ({ tokenObj }) => ({ Authorization: `Bearer ${tokenObj.token}` })
  },
  {
    name: 'getUserBookmarks',
    method: 'get',
    path: ({ userId }) => `/users/${userId}/bookmarkedprojects`
  },
  {
    name: 'addUserBookmark',
    method: 'post',
    path: ({ userId, projectId }) => `/users/${userId}/bookmarkedprojects/${projectId}`
  },
  {
    name: 'removeUserBookmark',
    method: 'delete',
    path: ({ userId, projectId }) => `/users/${userId}/bookmarkedprojects/${projectId}`
  },
  {
    name: 'getProjects',
    method: 'get',
    path: () => '/projects'
  },
  {
    name: 'getProject',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}`
  },
  {
    name: 'getProjectUsers',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}/users`
  },
  {
    name: 'searchProjectList',
    method: 'get',
    path: () => '/projects/search'
  },
  {
    name: 'searchProjectListByUser',
    method: 'get',
    path: () => '/projects/searchRecent'
  },
  {
    name: 'addProject',
    method: 'post',
    path: () => '/projects'
  },
  {
    name: 'updateProject',
    method: 'put',
    path: ({ projectId }) => `/projects/${projectId}`
  },
  {
    name: 'deleteProject',
    method: 'delete',
    path: ({ projectId }) => `/projects/${projectId}`
  },
  {
    name: 'getUsers',
    method: 'get',
    path: () => '/users'
  },
  {
    name: 'searchUserList',
    method: 'get',
    path: () => '/users'
  },
  {
    name: 'addUser',
    method: 'post',
    path: () => '/users'
  },
  {
    name: 'updateUser',
    method: 'put',
    path: ({ userId }) => `/users/${userId}`
  },
  {
    name: 'updateSelf',
    method: 'patch',
    path: ({ userId }) => `/users/${userId}/selfUpdate`
  },
  {
    name: 'getUserImage',
    method: 'get',
    path: ({ userId }) => `/users/${userId}/avatar`
  },
  {
    name: 'updateUserImage',
    method: 'patch',
    path: ({ userId }) => `/users/${userId}`
  },
  {
    name: 'deleteUserImage',
    method: 'patch',
    path: ({ userId }) => `/users/${userId}`
  },
  {
    name: 'getJurisdiction',
    method: 'get',
    path: ({ jurisdictionId }) => `/jurisdictions/${jurisdictionId}`
  },
  {
    name: 'searchJurisdictionList',
    method: 'get',
    path: () => '/jurisdictions'
  },
  {
    name: 'getProjectJurisdictions',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}/jurisdictions`
  },
  {
    name: 'addJurisdictionToProject',
    method: 'post',
    path: ({ projectId }) => `/projects/${projectId}/jurisdictions`
  },
  {
    name: 'updateJurisdictionInProject',
    method: 'put',
    path: ({ projectId, jurisdictionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}`
  },
  {
    name: 'addPresetJurisdictionList',
    method: 'post',
    path: ({ projectId }) => `/projects/${projectId}/jurisdictions/preset`
  },
  {
    name: 'deleteProjectJurisdiction',
    method: 'delete',
    path: ({ projectId, jurisdictionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}`
  },
  {
    name: 'getScheme',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}/scheme`
  },
  {
    name: 'getSchemeTree',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}/scheme/tree`
  },
  {
    name: 'addQuestion',
    method: 'post',
    path: ({ projectId }) => `/projects/${projectId}/scheme`
  },
  {
    name: 'updateQuestion',
    method: 'put',
    path: ({ projectId, questionId }) => `/projects/${projectId}/scheme/${questionId}`
  },
  {
    name: 'deleteQuestion',
    method: 'delete',
    path: ({ projectId, questionId }) => `/projects/${projectId}/scheme/${questionId}`
  },
  {
    name: 'reorderScheme',
    method: 'put',
    path: ({ projectId }) => `/projects/${projectId}/scheme`
  },
  {
    name: 'lockCodingScheme',
    method: 'post',
    path: ({ projectId, userId }) => `/locks/scheme/projects/${projectId}/users/${userId}`
  },
  {
    name: 'getCodingSchemeLockInfo',
    method: 'get',
    path: ({ projectId }) => `/locks/scheme/projects/${projectId}`
  },
  {
    name: 'unlockCodingScheme',
    method: 'delete',
    path: ({ projectId, userId }) => `/locks/scheme/projects/${projectId}/users/${userId}`
  },
  {
    name: 'getProtocol',
    method: 'get',
    path: ({ projectId }) => `/projects/${projectId}/protocol`
  },
  {
    name: 'saveProtocol',
    method: 'put',
    path: ({ projectId }) => `/projects/${projectId}/protocol`
  },
  {
    name: 'lockProtocol',
    method: 'post',
    path: ({ projectId, userId }) => `/locks/protocol/projects/${projectId}/users/${userId}`
  },
  {
    name: 'getProtocolLockInfo',
    method: 'get',
    path: ({ projectId }) => `/locks/protocol/projects/${projectId}`
  },
  {
    name: 'unlockProtocol',
    method: 'delete',
    path: ({ projectId, userId }) => `/locks/protocol/projects/${projectId}/users/${userId}`
  },
  {
    name: 'getSchemeQuestion',
    method: 'get',
    path: ({ questionId, projectId }) => `/projects/${projectId}/scheme/${questionId}`
  },
  {
    name: 'getUserCodedQuestions',
    method: 'get',
    path: ({ projectId, userId, jurisdictionId }) => `/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions`
  },
  {
    name: 'getCodedQuestion',
    method: 'get',
    path: ({ projectId, userId, jurisdictionId, questionId }) => `/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`
  },
  {
    name: 'answerCodedQuestion',
    method: 'post',
    path: ({ projectId, userId, jurisdictionId, questionId }) => `/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`
  },
  {
    name: 'updateCodedQuestion',
    method: 'put',
    path: ({ projectId, userId, jurisdictionId, questionId }) => `/users/${userId}/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`
  },
  {
    name: 'saveRedFlag',
    method: 'post',
    path: ({ questionId }) => `/flags/schemequestionflag/${questionId}`
  },
  {
    name: 'getUserValidatedQuestion',
    method: 'get',
    path: ({ projectId, jurisdictionId, questionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`
  },
  {
    name: 'getValidatedQuestions',
    method: 'get',
    path: ({ projectId, jurisdictionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions`
  },
  {
    name: 'answerValidatedQuestion',
    method: 'post',
    path: ({ projectId, jurisdictionId, questionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`
  },
  {
    name: 'updateValidatedQuestion',
    method: 'put',
    path: ({ projectId, jurisdictionId, questionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/validatedquestions/${questionId}`
  },
  {
    name: 'getAllCodedQuestionsForQuestion',
    method: 'get',
    path: ({ projectId, jurisdictionId, questionId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/codedquestions/${questionId}`
  },
  {
    name: 'bulkValidate',
    method: 'post',
    path: ({ projectId, jurisdictionId, userId }) => `/projects/${projectId}/jurisdictions/${jurisdictionId}/bulkValidatedQuestions/${userId}`
  },
  {
    name: 'clearFlag',
    method: 'delete',
    path: ({ flagId }) => `/flags/${flagId}`
  },
  {
    name: 'exportData',
    method: 'get',
    path: ({ projectId }) => `/exports/project/${projectId}/data`
  },
  {
    name: 'getHelpPdf',
    method: 'get',
    path: () => '/exports/helpfile'
  },
  {
    name: 'cleanAnnotations',
    method: 'delete',
    path: ({ docId }) => `/cleanup/${docId}/annotations`
  },
  {
    name: 'getBackendData',
    method: 'get',
    path: () => '/appInfo'
  }

]

// If development, then include the basic auth api call
if (APP_IS_SAML_ENABLED !== '1') {
  apiCalls = [
    ...apiCalls, {
      name: 'login',
      method: 'post',
      path: () => '/users/authenticate'
    }
  ]
}

export default apiCalls
