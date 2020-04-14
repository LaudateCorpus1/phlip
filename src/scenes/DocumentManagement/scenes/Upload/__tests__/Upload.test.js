import React from 'react'
import { shallow } from 'enzyme'
import { Upload } from '../index'
import LinearProgress from '@material-ui/core/LinearProgress'
import { CircularLoader } from 'components'
import { selectedDocs, arrOfDocsTransport } from 'utils/testData/upload'

const props = {
  selectedDocs: [],
  uploadError: null,
  uploading: false,
  user: { firstName: 'test', lastName: 'user' },
  isReduxForm: false,
  history: {
    push: jest.fn()
  },
  onSubmitError: jest.fn(),
  actions: {
    acknowledgeUploadFailures: jest.fn(),
    clearSelectedFiles: jest.fn(),
    closeAlert: jest.fn(),
    openAlert: jest.fn(),
    uploadDocumentsStart: jest.fn(),
    verifyFiles: jest.fn(),
    addSelectedDocs: jest.fn(),
    mergeInfoWithDocs: jest.fn(),
    setInfoRequestProgress: jest.fn(),
    extractInfoRequest: jest.fn()
  },
  projectAutoActions: {
    clearAll: jest.fn()
  },
  jurisdictionAutoActions: {
    clearAll: jest.fn()
  },
  jurisdictionAutocompleteProps: {
    selectedSuggestion: {}
  },
  projectAutocompleteProps: {
    selectedSuggestion: {}
  },
  alert: {
    open: false,
    text: '',
    type: 'basic',
    title: ''
  },
  uploadProgress: {
    index: 0,
    total: 0,
    failures: 0,
    percentage: 0
  },
  maxFileCount: 20,
  infoRequestInProgress: false,
  infoSheetSelected: false
}

describe('Document Management - Upload scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Upload {...props} />)).toMatchSnapshot()
  })
  
  test('should reset document name when component unmounts', () => {
    document.title = 'Document List'
    const wrapper = shallow(<Upload {...props} />)
    wrapper.unmount()
    expect(document.title).toEqual('Document List')
  })
  
  describe('Closing modal', () => {
    describe('When the user has added docs', () => {
      test('should show an unsaved changes modal if the user has selected docs', () => {
        const spy = jest.spyOn(props.actions, 'openAlert')
        const wrapper = shallow(<Upload {...props} selectedDocs={[{ name: 'doc1' }]} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalledWith(
          'Your unsaved changes will be lost. Do you want to continue?',
          'Warning',
          'basic'
        )
        
        wrapper.setProps({
          alert: {
            open: true,
            text: 'Your unsaved changes will be lost. Do you want to continue?',
            title: 'Warning',
            type: 'basic'
          }
        })
        
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text())
          .toEqual('Your unsaved changes will be lost. Do you want to continue?')
      })
      
      test('should close alert and not go back if user clicks cancel', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(
          <Upload
            {...props}
            selectedDocs={[{ name: 'doc1' }]}
            alert={{
              open: true,
              text: 'Your unsaved changes will be lost. Do you want to continue?',
              title: 'Warning',
              type: 'basic'
            }}
          />
        )
        
        wrapper.find('Alert').at(0).prop('onCloseAlert')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear and close everything if the user clicks continue', () => {
        const wrapper = shallow(<Upload {...props} selectedDocs={[{ name: 'doc1' }]} />)
        const spy = jest.spyOn(wrapper.instance(), 'goBack')
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        wrapper.setProps({
          alert: {
            open: true,
            text: 'Your unsaved changes will be lost. Do you want to continue?',
            title: 'Warning',
            type: 'basic'
          }
        })
        
        wrapper.update()
        wrapper.find('Alert').at(0).prop('actions')[0].onClick()
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('When the user hasn\'t added docs', () => {
      test('should go back to document list', () => {
        const spy = jest.spyOn(props.history, 'push')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all jurisdiction suggestions', () => {
        const spy = jest.spyOn(props.jurisdictionAutoActions, 'clearAll')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all project suggestions', () => {
        const spy = jest.spyOn(props.projectAutoActions, 'clearAll')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should close alert', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all docs', () => {
        const spy = jest.spyOn(props.actions, 'clearSelectedFiles')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
    })
  })
  
  describe('Selecting files for upload', () => {
    const file1 = new File(['file 1'], 'file1.txt', { type: 'text/plain' })
    const file2 = new File(['file 2'], 'file2.txt', { type: 'text/plain' })
    
    const files = [file1, file2]
    
    const fileList = {
      target: {
        files: {
          length: 2,
          item: index => files[index]
        }
      },
      preventDefault: jest.fn(),
      persist: jest.fn()
    }
    
    test('should open an alert if user selects more documents than allowed', () => {
      const spy = jest.spyOn(props.actions, 'openAlert')
      const wrapper = shallow(<Upload {...props} />)
      wrapper.instance().addFilesToList({ length: 21 })
      expect(spy).toHaveBeenCalled()
    })
    
    describe('if no excel is selected', () => {
      test('should just add selected files', () => {
        const wrapper = shallow(<Upload {...props} />)
        const spy = jest.spyOn(props.actions, 'addSelectedDocs')
        wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', fileList)
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('if an excel is selected', () => {
      const wrapper = shallow(<Upload {...props} infoSheetSelected infoSheet={{ name: 'blep.csv' }} />)
      const mergeSpy = jest.spyOn(props.actions, 'mergeInfoWithDocs')
      const infoSpy = jest.spyOn(props.actions, 'setInfoRequestProgress')
      wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', fileList)
      
      test('should merge excel info with selected files', () => {
        expect(mergeSpy).toHaveBeenCalled()
      })
      
      test('should set there\'s a request in progress', () => {
        expect(infoSpy).toHaveBeenCalled()
      })
    })
  })
  
  describe('Uploading documents', () => {
    const docs = selectedDocs.map((doc, i) => ({
      ...doc,
      jurisdictions: {
        ...doc.jurisdictions,
        value: {
          ...doc.jurisdictions.value,
          id: i + 1
        }
      }
    }))
    
    const wrapper = shallow(
      <Upload
        {...props}
        selectedDocs={docs}
        projectAutocompleteProps={{ selectedSuggestion: { id: 4 } }}
        jurisdictionAutocompleteProps={{ selectedSuggestion: {} }}
      />
    )
    
    test('should create an array of all documents correctly formed', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalledWith(arrOfDocsTransport, { id: 4 }, {})
    })
    
    test('should send a request to upload documents', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should use the global jurisdiction if the doc doesn\'t has one selected', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      const selectedDocs = docs.slice(0, docs.length - 1)
      const lastDoc = docs[docs.length - 1]
      wrapper.setProps({
        jurisdictionAutocompleteProps: {
          selectedSuggestion: { id: 20 }
        },
        selectedDocs: [
          ...selectedDocs,
          {
            ...lastDoc,
            jurisdictions: {
              ...lastDoc.jurisdictions,
              value: {
                id: undefined
              }
            }
          }
        ]
      })
      
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      const transport = arrOfDocsTransport.slice(0, arrOfDocsTransport.length - 1)
      expect(spy).toHaveBeenCalledWith(
        [...transport, { ...arrOfDocsTransport[arrOfDocsTransport.length - 1], jurisdictions: [20] }],
        { id: 4 },
        { id: 20 }
      )
    })
  })
  
  describe('Upload progress alert', () => {
    test('should show a progress alert with status when uploading', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 0, total: 10, failures: 0, percentage: 0 }}
        />
      )
      
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(0).childAt(0).text())
        .toEqual('Uploading document: 1')
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(3).matchesElement(<LinearProgress />))
        .toEqual(true)
    })
    
    test('should show total number of documents', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 0, total: 10, failures: 0, percentage: 0 }}
        />
      )
      
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(1).childAt(0).text())
        .toEqual('Total document count: 10')
    })
    
    test('should keep an error count of errored documents', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 2, total: 10, failures: 2, percentage: 20 }}
        />
      )
      
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(2).childAt(0).text()).toEqual('Errors: 2')
    })
    
    test('should inform user when all documents have uploaded successfully', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 3, total: 3, failures: 0, percentage: 100 }}
        />
      )
      
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(0).childAt(0).text())
        .toEqual('All documents successfully uploaded!')
    })
    
    test('should inform the user of any failures', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 3, total: 3, failures: 1, percentage: 100 }}
        />
      )
      
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(0).childAt(0).text())
        .toEqual('Some of the documents failed to upload. They are still present in the list if you wish to retry.')
    })
    
    test('should hide the alert close button if not done uploading', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 0, total: 3, failures: 1, percentage: 40 }}
        />
      )
      expect(wrapper.find('Alert').at(0).prop('hideClose')).toEqual(true)
    })
    
    test('should display the alert close button when finished uploading', () => {
      const wrapper = shallow(
        <Upload
          {...props}
          uploading
          uploadProgress={{ index: 3, total: 3, failures: 0, percentage: 100 }}
        />
      )
      expect(wrapper.find('Alert').at(0).prop('hideClose')).toEqual(false)
    })
    
    test('should close the upload modal when user acknowledges upload if there are no failures', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: false }} />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should only close progress alert if there are failures', () => {
      const spy = jest.spyOn(props.actions, 'acknowledgeUploadFailures')
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: true }} />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('Selecting Excel file', () => {
    test('should send a request to extract info from file', () => {
      const file1 = new File(['file 1'], 'file1.csv', { type: 'text/plain' })
      
      const files = [file1]
      
      const fileList = {
        target: {
          files: {
            length: 1,
            item: index => files[index]
          }
        },
        preventDefault: jest.fn(),
        persist: jest.fn()
      }
      
      const wrapper = shallow(<Upload {...props} />)
      const spy = jest.spyOn(props.actions, 'extractInfoRequest')
      wrapper.find('FileUpload').at(1).dive().find('input').simulate('change', fileList)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('Extracting Excel metadata', () => {
    test('should show an progress spinner alert', () => {
      const wrapper = shallow(<Upload {...props} infoRequestInProgress />)
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(0).childAt(0).text())
        .toEqual('Processing document... This could take a couple of minutes...')
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).childAt(1).matchesElement(<CircularLoader size={40} />))
        .toEqual(true)
    })
    
    test('handle if there\'s an error while submitting', () => {
      const spy = jest.spyOn(props, 'onSubmitError')
      const wrapper = shallow(<Upload {...props} infoRequestInProgress />)
      wrapper.setProps({
        infoRequestInProgress: false,
        requestError: 'Failed to extract'
      })
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
