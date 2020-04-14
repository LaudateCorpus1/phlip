const docManageCalls = [
  {
    name: 'verifyUpload',
    method: 'post',
    path: () => '/docs/verifyUpload'
  },
  {
    name: 'upload',
    method: 'post',
    path: () => '/docs/upload',
    headers: () => ({ 'Content-Type': 'multipart/form-data' })
  },
  {
    name: 'downloadZip',
    method: 'get',
    path: ({ docList }) => `/docs/download?${docList.map((doc, i) => `docs[]=${doc}${i !== docList.length - 1
      ? '&'
      : ''}`).join('')}`
  },
  {
    name: 'downloadZipWithAnnotations',
    method: 'post',
    path: () => '/docs/download'
  },
  {
    name: 'download',
    method: 'get',
    path: ({ docId }) => `/docs/${docId}/download`
  },
  {
    name: 'downloadWithAnnotations',
    method: 'post',
    path: ({ docId }) => `/docs/${docId}/download`
  },
  {
    name: 'getDocs',
    method: 'get',
    path: (projectList = '') => projectList !== '' ? `/docs?${projectList}` : '/docs'
  },
  {
    name: 'extractInfo',
    method: 'post',
    path: () => '/docs/upload/extractInfo',
    headers: () => ({ 'Content-Type': 'multipart/form-data' })
  },
  {
    name: 'getDocumentContents',
    method: 'get',
    path: ({ docId }) => `/docs/${docId}/contents`
  },
  {
    name: 'addToDocArray',
    method: 'post',
    path: ({ docId, updateType, newId }) => `/docs/${docId}/${updateType}/${newId}`
  },
  {
    name: 'removeFromDocArray',
    method: 'delete',
    path: ({ docId, updateType, removeId }) => `/docs/${docId}/${updateType}/${removeId}`
  },
  {
    name: 'updateDoc',
    method: 'put',
    path: ({ docId }) => `/docs/${docId}`
  },
  {
    name: 'deleteDoc',
    method: 'delete',
    path: ({ docId }) => `/docs/${docId}`
  },
  {
    name: 'getDocumentsByProjectJurisdiction',
    method: 'get',
    path: ({ projectId, jurisdictionId }) => `/docs/projects/${projectId}/jurisdictions/${jurisdictionId}`
  },
  {
    name: 'bulkDeleteDoc',
    method: 'post',
    path: () => `/docs/bulkDelete`
  },
  {
    name: 'bulkUpdateDoc',
    method: 'post',
    path: () => `/docs/bulkUpdate`
  },
  {
    name: 'cleanProject',
    method: 'put',
    path: ({ projectId }) => `/docs/cleanProjectList/${projectId}`
  }
]

export default docManageCalls
