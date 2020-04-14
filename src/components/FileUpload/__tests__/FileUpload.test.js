import React from 'react'
import { shallow } from 'enzyme'
import FileUpload from '../index'
import { DataTransferItem, FileEntry, FileReader } from 'utils/testData/fileEntryMock'

const props = {
  containerBorderColor: '#99D0E9',
  containerBgColor: '#f5fafa',
  containerText: 'or drag and drop here',
  buttonText: 'Select Files',
  allowMultiple: false,
  numOfFiles: 0,
  overwriteAlert: {
    enable: false,
    text: ''
  },
  handleAddFiles: jest.fn(),
  allowFolderDrop: true,
  allowedExtensions: ['pdf', 'docx', 'doc']
}

const dataTransfer = {
  items: [
    new DataTransferItem('file1.pdf', 'file', [], 12000, [37, 80, 68, 70]),
    new DataTransferItem('file2.pdf', 'file', [], 12000, [37, 80, 68, 70])
  ]
}

describe('File Upload component', () => {
  test('should render correctly', () => {
    expect(shallow(<FileUpload {...props} />)).toMatchSnapshot()
  })
  
  test('should clear out selection if the user clears the files', () => {
    const wrapper = shallow(<FileUpload {...props} numOfFiles={2} />)
    wrapper.instance().inputRef = { current: { value: '' } }
    wrapper.setProps({ numOfFiles: 0 })
    expect(wrapper.instance().inputRef.current.value).toEqual(null)
  })
  
  test('should prevent browser from opening file', () => {
    const wrapper = shallow(<FileUpload {...props} />)
    const event = {
      preventDefault: jest.fn()
    }
    const spy = jest.spyOn(event, 'preventDefault')
    wrapper.find('form').simulate('dragover', event)
    expect(spy).toHaveBeenCalled()
  })
  
  describe('overwrite alert', () => {
    describe('if not enabled', () => {
      test('should not show the alert if not enabled', () => {
        const wrapper = shallow(<FileUpload {...props} numOfFiles={2} />)
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        wrapper.update()
        expect(wrapper.find('Alert').prop('open')).toEqual(false)
      })
      
      test('should open the file selector', () => {
        const wrapper = shallow(<FileUpload {...props} numOfFiles={2} />)
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        const spy = jest.spyOn(ref.current, 'click')
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('when the alert is enabled', () => {
      test('should not show the alert if no file has been selected', () => {
        const wrapper = shallow(
          <FileUpload
            {...props}
            numOfFiles={0}
            overwriteAlert={{ enable: true, text: 'overwrite' }}
          />
        )
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        wrapper.update()
        expect(wrapper.find('Alert').prop('open')).toEqual(false)
      })
      
      test('should open the file selector if no file has been selected', () => {
        const wrapper = shallow(
          <FileUpload
            {...props}
            numOfFiles={0}
            overwriteAlert={{ enable: true, text: 'overwrite' }}
          />
        )
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        const spy = jest.spyOn(ref.current, 'click')
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        expect(spy).toHaveBeenCalled()
      })
      
      test('should show the alert if enabled and there\'s already a selected file', () => {
        const wrapper = shallow(
          <FileUpload
            {...props}
            numOfFiles={1}
            overwriteAlert={{ enable: true, text: 'overwrite' }}
          />
        )
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        expect(wrapper.find('Alert').prop('open')).toEqual(true)
      })
      
      test('should not open the file selector if a file has already been selected', () => {
        const wrapper = shallow(
          <FileUpload
            {...props}
            numOfFiles={1}
            overwriteAlert={{ enable: true, text: 'overwrite' }}
          />
        )
        const ref = {
          current: {
            click: jest.fn()
          }
        }
        const spy = jest.spyOn(ref.current, 'click')
        wrapper.instance().inputRef = ref
        wrapper.find('WithTheme(Button)').simulate('click')
        expect(spy).not.toHaveBeenCalled()
      })
      
      describe('when the user continues with overwriting', () => {
        test('should open the file selector', () => {
          const wrapper = shallow(
            <FileUpload
              {...props}
              numOfFiles={1}
              overwriteAlert={{ enable: true, text: 'overwrite' }}
            />
          )
          const ref = {
            current: {
              click: jest.fn()
            }
          }
          const spy = jest.spyOn(ref.current, 'click')
          wrapper.instance().inputRef = ref
          wrapper.find('WithTheme(Button)').simulate('click')
          wrapper.find('Alert').prop('actions')[0].onClick()
          expect(spy).toHaveBeenCalled()
        })
      })
      
      describe('when the user cancels out of overwriting', () => {
        test('should not open the file selector', () => {
          const wrapper = shallow(
            <FileUpload
              {...props}
              numOfFiles={1}
              overwriteAlert={{ enable: true, text: 'overwrite' }}
            />
          )
          const ref = {
            current: {
              click: jest.fn()
            }
          }
          const spy = jest.spyOn(ref.current, 'click')
          wrapper.instance().inputRef = ref
          wrapper.find('WithTheme(Button)').simulate('click')
          wrapper.find('Alert').prop('onCloseAlert')()
          expect(spy).not.toHaveBeenCalled()
        })
      })
    })
  })
  
  describe('dropping files', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })
    
    test('should prevent default from going to input component', () => {
      const wrapper = shallow(<FileUpload {...props} />)
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          items: []
        }
      }
      
      const spy = jest.spyOn(event, 'preventDefault')
      wrapper.find('form').simulate('drop', event)
      expect(spy).toHaveBeenCalled()
    })
    
    test('should loop through all files found', done => {
      const wrapper = shallow(<FileUpload {...props} allowMultiple />)
      const event = {
        preventDefault: jest.fn(),
        dataTransfer
      }
      
      window.FileReader = FileReader
      window.FileReader.DONE = 2
      
      const spy = jest.spyOn(props, 'handleAddFiles')
      wrapper.find('form').simulate('drop', event)
      setTimeout(() => {
        expect(spy)
          .toHaveBeenCalledWith([
            { name: 'file1.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] },
            { name: 'file2.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] }
          ])
        done()
      }, 2000)
    })
    
    test('should only send back first file allow multiple is false', done => {
      const wrapper = shallow(<FileUpload {...props} />)
      const event = {
        preventDefault: jest.fn(),
        dataTransfer
      }
      
      window.FileReader = FileReader
      window.FileReader.DONE = 2
      
      const spy = jest.spyOn(props, 'handleAddFiles')
      wrapper.find('form').simulate('drop', event)
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith({ name: 'file1.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] })
        done()
      }, 2000)
    })
    
    describe('handling invalid files', () => {
      beforeEach(() => {
        jest.resetAllMocks()
      })
      
      test('should not pass show any files that are invalid', done => {
        const wrapper = shallow(<FileUpload {...props} allowMultiple />)
        const event = {
          preventDefault: jest.fn(),
          dataTransfer: {
            items: [
              new DataTransferItem('file1.pdf', 'file', [], 20000000, [37, 80, 68, 70]),
              new DataTransferItem('file2.pdf', 'file', [], 12000, [37, 80, 68, 70])
            ]
          }
        }
        
        window.FileReader = FileReader
        window.FileReader.DONE = 2
        
        const spy = jest.spyOn(props, 'handleAddFiles')
        wrapper.find('form').simulate('drop', event)
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith([{ name: 'file2.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] }])
          done()
        }, 2000)
      })
      
      test('should show an alert if the user tries to upload documents that are too large', done => {
        const wrapper = shallow(<FileUpload {...props} allowMultiple />)
        const event = {
          preventDefault: jest.fn(),
          dataTransfer: {
            items: [
              new DataTransferItem('file1.pdf', 'file', [], 20000000, [37, 80, 68, 70]),
              new DataTransferItem('file2.pdf', 'file', [], 12000, [37, 80, 68, 70])
            ]
          }
        }
        
        window.FileReader = FileReader
        window.FileReader.DONE = 2
        
        wrapper.find('form').simulate('drop', event)
        setTimeout(() => {
          expect(wrapper.state().alert).toEqual({
            open: true,
            title: 'Maximum File Size Exceeded',
            text: 'The files listed below exceed the maximum allowed size of 16 MB. These files will be removed from the list.',
            type: 'files'
          })
          clearTimeout()
          done()
        }, 1000)
      })
      
      test('should show an alert if the user tries to upload documents that have an invalid type', done => {
        const wrapper = shallow(<FileUpload {...props} allowMultiple />)
        const event = {
          preventDefault: jest.fn(),
          dataTransfer: {
            items: [
              new DataTransferItem('file1.pdf', 'file', [], 12000, [37, 80, 68, 70]),
              new DataTransferItem('file2.txt', 'file', [], 12000, [23, 423, 545, 234])
            ]
          }
        }
        
        window.FileReader = FileReader
        window.FileReader.DONE = 2
        
        wrapper.find('form').simulate('drop', event)
        setTimeout(() => {
          expect(wrapper.state().alert).toEqual({
            open: true,
            title: 'Invalid File Types',
            text: 'The files listed below do not have a valid file type. These files will be removed from the list. Valid file types are .pdf, .docx, .doc.',
            type: 'files'
          })
          clearTimeout()
          done()
        }, 1000)
      })
    })
    
    test(
      'should show an alert if the user tries to upload documents that have an invalid type and invalid size',
      done => {
        const wrapper = shallow(<FileUpload {...props} allowMultiple allowedExtensions={['.xlsx']} />)
        const event = {
          preventDefault: jest.fn(),
          dataTransfer: {
            items: [
              new DataTransferItem('file1.pdf', 'file', [], 20000000, [37, 80, 68, 70]),
              new DataTransferItem('file2.txt', 'file', [], 12000, [23, 423, 545, 234])
            ]
          }
        }
        
        window.FileReader = FileReader
        window.FileReader.DONE = 2
        
        wrapper.find('form').simulate('drop', event)
        setTimeout(() => {
          expect(wrapper.state().alert).toEqual({
            open: true,
            title: 'Invalid Files Found',
            text: 'The files listed below do not have a valid file type and / or exceed the maximum file size. These files will be removed from the list. Valid files types are .xlsx. Maximum file size is 16 MB.',
            type: 'files'
          })
          clearTimeout()
          done()
        }, 1000)
      }
    )
  })
  
  describe('if the user has dropped a folder', () => {
    test('should show an alert if foldering dropping is not allowed', async done => {
      const wrapper = shallow(<FileUpload {...props} allowFolderDrop={false} />)
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: { items: [new DataTransferItem('demo', 'dir', [])] }
      }
      
      await wrapper.find('form').simulate('drop', event)
      expect(wrapper.state().alert).toEqual({
        open: true,
        title: 'Folder drop is not allowed',
        type: 'folder',
        text: 'Dragging and dropping a folder is not allowed for this input.'
      })
      expect(wrapper.find('Alert').prop('open')).toEqual(true)
      done()
    })
    
    test('should loop through the folder to get files', done => {
      const wrapper = shallow(<FileUpload {...props} allowMultiple allowFolderDrop />)
      const event = {
        preventDefault: jest.fn(),
        dataTransfer: {
          items: [
            new DataTransferItem('demo', 'dir', [
              new FileEntry('file1.pdf', 'file', [], 12000, [37, 80, 68, 70]),
              new FileEntry('file2.pdf', 'file', [], 12000, [37, 80, 68, 70])
            ], 1, true)
          ]
        }
      }
      
      window.FileReader = FileReader
      window.FileReader.DONE = 2
      
      const spy = jest.spyOn(props, 'handleAddFiles')
      wrapper.find('form').simulate('drop', event)
      setTimeout(() => {
        expect(spy)
          .toHaveBeenCalledWith([
            { name: 'file1.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] },
            { name: 'file2.pdf', size: 12000, arrBufferOutput: [37, 80, 68, 70] }
          ])
        done()
      }, 2000)
    })
  })
})
