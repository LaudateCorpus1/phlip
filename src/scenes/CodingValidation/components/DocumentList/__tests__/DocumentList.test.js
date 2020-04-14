import React from 'react'
import { shallow } from 'enzyme'
import { DocumentList } from '../index'

const props = {
  actions: {
    getApprovedDocumentsRequest: jest.fn(),
    saveAnnotation: jest.fn(),
    getDocumentContentsRequest: jest.fn(),
    clearDocSelected: jest.fn(),
    removeAnnotation: jest.fn(),
    toggleCoderAnnotations: jest.fn(),
    toggleAnnotationMode: jest.fn(),
    downloadDocumentsRequest: jest.fn(),
    clearDownload: jest.fn(),
    clearApiError: jest.fn(),
    changeAnnotationIndex: jest.fn(),
    resetScrollTop: jest.fn(),
    hideAnnoModeAlert: jest.fn()
  },
  jurisdiction: { jurisdictionId: 1, name: 'Ohio' },
  project: { id: 1, name: 'TestProject' },
  page: 'coding',
  documents: [
    { name: 'doc1', _id: 12344, effectiveDate : new Date('12/10/2010') },
    { name: 'doc2', _id: 44321, effectiveDate : new Date('08/14/2019') }
  ],
  answerSelected: null,
  questionId: 3,
  annotatedDocs: [],
  docSelected: false,
  openedDoc: {},
  scrollTop: false,
  saveUserAnswer: jest.fn(),
  annotationModeEnabled: false,
  annotations: [],
  annotationUsers: [],
  isValidation: false,
  downloading: {
    id: '',
    content: '',
    name: ''
  }
}

const setup = (other = {}) => {
  return shallow(<DocumentList {...props} {...other} />)
}

describe('DocumentList', () => {
  test('should render DocumentList component correctly', () => {
    expect(setup()).toMatchSnapshot()
  })

  test('should show PDFViewer when docSelected is true', () => {
    const wrapper = setup({ docSelected: true })
    expect(wrapper.find('PDFViewer')).toHaveLength(1)
  })

  test('should have quote icons when document is in annotated list', () => {
    const wrapper = setup({ annotatedDocs: [12344] })
    expect(wrapper.find('Icon')).toHaveLength(1)
  })

  test('should clear selected doc when component unmounts', () => {
    const spy = jest.spyOn(props.actions, 'clearDocSelected')
    const wrapper = setup()
    wrapper.unmount()
    expect(spy).toHaveBeenCalled()
  })

  describe('this.handleSaveAnnotation', () => {
    const wrapper = setup({ enabledAnswerId: 4 })

    test('should call this.props.actions.saveAnnotation', () => {
      const spy = jest.spyOn(props.actions, 'saveAnnotation')
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalledWith({ text: 'test annotation' }, 4, 3)
    })

    test('should call this.props.saveUserAnswer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalled()
    })

    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalledWith(3, 4, false)
      spy.mockReset()
    })
  })

  describe('removing an annotation', () => {
    const wrapper = setup({ enabledAnswerId: 4 })
    test('should remove the annotation', () => {
      const spy = jest.spyOn(props.actions, 'removeAnnotation')
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalledWith(5, 4, 3)
    })

    test('should save the user\'s answer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalled()
    })

    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalledWith(3, 4, false)
      spy.mockReset()
    })
  })

  describe('clicking a document', () => {
    test('should call props.getContents', () => {
      const spy = jest.spyOn(props.actions, 'getDocumentContentsRequest')
      const wrapper = setup()
      const doc = wrapper.find('span').filterWhere(node => node.text().includes('doc1'))
      doc.simulate('click')
      expect(spy).toHaveBeenCalledWith(12344)
    })
  })

  describe('when there are no docs', () => {
    test(
      'should show a view with text "There are no approved and/or assigned documents for this project and jurisdiction."',
      () => {
        const wrapper = setup({ showEmptyDocs: true, documents: [] })
        const view = wrapper.find('WithStyles(Typography)')
          .filterWhere(node => node.childAt(0).text() ===
            'There are no approved or assigned documents for this project and jurisdiction.')
        expect(view.length).toEqual(1)
      }
    )
  })

  describe('this.handleRemoveAnnotation', () => {
    test('should call this.props.actions.removeAnnotation', () => {
      const spy = jest.spyOn(props.actions, 'removeAnnotation')
      const wrapper = setup({ enabledAnswerId: 4 })
      wrapper.instance().handleRemoveAnnotation(1)
      expect(spy).toHaveBeenCalledWith(1, 4, 3)
    })

    test('should call this.props.saveUserAnswer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      const wrapper = setup({ enabledAnswerId: 4 })
      wrapper.instance().handleRemoveAnnotation(1)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('this.clearDocSelected', () => {
    test('should call props.actions.clearDocSelected', () => {
      const spy = jest.spyOn(props.actions, 'clearDocSelected')
      const wrapper = setup()
      wrapper.instance().clearDocSelected()
      expect(spy).toHaveBeenCalled()
    })

    test('should set state.textContent to 2', () => {
      const wrapper = setup()
      wrapper.instance().clearDocSelected()
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(2)
    })
  })

  describe('this.checkTextContent', () => {
    test('should set state.noTextContent to 0 if all items in noTextArr are true', () => {
      const wrapper = setup()
      wrapper.instance().handleCheckTextContent([true, true, true])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(0)
    })

    test('should set state.noTextContent to 2 if all items in noTextArr are false', () => {
      const wrapper = setup()
      wrapper.instance().handleCheckTextContent([false, false, false])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(2)
    })

    test('should set state.noTextContent to 1 if there is a mix of true and false items in noTextArr', () => {
      const wrapper = setup()
      wrapper.instance().handleCheckTextContent([true, true, false])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(1)
    })
  })

  describe('showing errors', () => {
    test('should show ApiErrorView component if there is an error', () => {
      const wrapper = setup({ apiError: { text: '', open: true, alertOrView: 'view' } })
      expect(wrapper.find('ApiErrorView').length).toEqual(1)
    })

    test('should contain props.apiError.text content in ApiErrorView', () => {
      const wrapper = setup({
        apiError: { text: 'Failed to get documents.', open: true, alertOrView: 'view' },
        documents: []
      })
      expect(wrapper.find('ApiErrorView').prop('error')).toEqual('Failed to get documents.')
    })

    test('should show an alert if the error is an alert error', () => {
      const wrapper = setup({ apiError: { text: 'alert', open: true, alertOrView: 'alert' } })
      expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
    })

    test('should close the alert when the user clicks the dismiss button', () => {
      const spy = jest.spyOn(props.actions, 'clearApiError')
      const wrapper = setup({ apiError: { text: 'alert', open: true, alertOrView: 'alert' } })
      wrapper.find('ApiErrorAlert').prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('handling whether or not to scroll document', () => {
    const container = { scrollTo: jest.fn() }
    const element = {
      offsetParent: {
        offsetParent: {
          offsetTop: 10
        }
      },
      offsetTop: 50
    }
    const elements = { 'annotation-0-0': element, 'viewContainer': container }
    let wrapper, scrollSpy

    beforeEach(() => {
      global.document.getElementById = id => elements[id]
      wrapper = setup({ docSelected: true })
      scrollSpy = jest.spyOn(container, 'scrollTo')
    })

    afterEach(() => {
      scrollSpy.mockReset()
    })

    test('should determine scrolling once the document finishes rendering and annotation mode is not enabled', () => {
      const wrapper = setup({ docSelected: true })
      const spy = jest.spyOn(wrapper.instance(), 'scrollTop')
      wrapper.find('PDFViewer').simulate('finishRendering')
      expect(spy).toHaveBeenCalled()
    })

    test('should not scroll once the document finishes rendering if annotation mode is enabled', () => {
      const wrapper = setup({ docSelected: true, annotationModeEnabled: true })
      const spy = jest.spyOn(wrapper.instance(), 'scrollTop')
      wrapper.find('PDFViewer').simulate('finishRendering')
      expect(spy).not.toHaveBeenCalled()
    })

    test('should scroll to the first annotation if there are annotations', () => {
      wrapper.setProps({ scrollTop: true, annotations: [12345] })
      expect(scrollSpy).toHaveBeenCalledWith({ top: 30, behavior: 'smooth' })
    })

    test('should not scroll if the user is in annotation mode', () => {
      wrapper.setProps({ scrollTop: true, annotationModeEnabled: true })
      expect(scrollSpy).not.toHaveBeenCalled()
    })

    test('should scroll to the top if there are no annotations and the user is not in annotation mode', () => {
      wrapper.setProps({ scrollTop: true, annotations: [] })
      expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    test('should reset scroll top', () => {
      const spy = jest.spyOn(props.actions, 'resetScrollTop')
      wrapper.setProps({ scrollTop: true, annotations: [] })
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('annotation mode alert', () => {
    test('should not show the annotation mode alert anymore if the user clicks the Dont Show Again checkbox', () => {
      const spy = jest.spyOn(props.actions, 'hideAnnoModeAlert')
      const wrapper = setup({ docSelected: true })
      wrapper.find('PDFViewer').simulate('hideAnnoModeAlert')
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('when a document has been selected but content is not available', () => {
    const wrapper = setup({ openedDoc: { _id: 12344, name: 'doc1' } })

    test('should change document name text color to #757575 for matching document', () => {
      expect(wrapper.find('FlexGrid').at(6).childAt(1).prop('style').color).toEqual('#757575')
    })

    test('should not change document name text color for not matching documents', () => {
      expect(wrapper.find('FlexGrid').at(8).childAt(1).prop('style').color).toEqual('#048484')
    })

    test('should add a spinner next to the selected document name', () => {
      expect(wrapper.find('FlexGrid').at(6).find('CircularLoader').length).toEqual(1)
    })
  })

  describe('downloading documents', () => {
    test('should send a request to download all documents when the user clicks the download icon in the header', () => {
      const wrapper = setup()
      const spy = jest.spyOn(props.actions, 'downloadDocumentsRequest')
      wrapper.find('IconButton').at(0).simulate('click')
      expect(spy).toHaveBeenCalledWith('all')
    })

    test(
      'should send a request to download a specific document when the user clicks the download icon next to a doc',
      () => {
        const wrapper = setup()
        const spy = jest.spyOn(props.actions, 'downloadDocumentsRequest')
        wrapper.find('IconButton').at(2).simulate('click')
        expect(spy).toHaveBeenCalledWith(44321)
      }
    )

    test('should show a spinner next to a document to indicate that it is being downloaded', () => {
      const wrapper = setup({ downloading: { id: 'all' } })
      expect(wrapper.find('FlexGrid').at(3).find('CircularLoader').length).toEqual(1)
    })

    test('should show a spinner to indicate that all are being downloaded', () => {
      const wrapper = setup({ downloading: { id: 44321 } })
      expect(wrapper.find('FlexGrid').at(7).find('CircularLoader').length).toEqual(1)
    })

    describe('preparing document for downloading', () => {
      test('should prepare the document to download', () => {
        window.URL.createObjectURL = jest.fn()
        const spy = jest.spyOn(window.URL, 'createObjectURL')
        const wrapper = setup({ downloading: { content: '' } })
        const downloadRef = {
          current: {
            click: jest.fn(),
            download: '',
            href: ''
          }
        }
        wrapper.instance().downloadRef = downloadRef
        wrapper.setProps({ downloading: { content: 'thisiscontent', name: 'document', id: 12 } })
        expect(spy).toHaveBeenCalled()
      })
    })

    test('should prepare to download a zip file if user is downloading more than 1 file', () => {
      window.URL.createObjectURL = jest.fn()
      const wrapper = setup({ downloading: { content: '' } })
      const downloadRef = {
        current: {
          click: jest.fn(),
          download: '',
          href: ''
        }
      }
      wrapper.instance().downloadRef = downloadRef
      wrapper.setProps({ downloading: { content: 'thisiscontent', name: 'document', id: 'all' } })
      expect(wrapper.instance().downloadRef.current.download).toEqual('TestProject-Ohio-documents.zip')
    })
  })

  describe('loading documents', () => {
    const wrapper = setup({ gettingDocs: true })

    test('should show \'Loading...\' text', () => {
      expect(wrapper.find('FlexGrid').at(5).childAt(0).childAt(0).text()).toEqual('Loading...')
    })

    test('should show a spinner to indicate that documents are being loaded', () => {
      expect(wrapper.find('FlexGrid').at(5).find('CircularLoader').length).toEqual(1)
    })
  })

  describe('annotation finder', () => {
    test(
      'should show the annotation finder if the user has opened a document and there are annotations for that doc',
      () => {
        const wrapper = setup({ docSelected: true, annotations: [12344] })
        expect(wrapper.find('Connect(AnnotationFinder)').length).toEqual(1)
      }
    )

    describe('scrolling to annotations', () => {
      const container = { scrollTo: jest.fn() }
      const element = {
        offsetParent: {
          offsetParent: {
            offsetTop: 10
          }
        },
        offsetTop: 50
      }
      const elements = { 'annotation-1-0': element, 'viewContainer': container }

      beforeEach(() => {
        global.document.count = 0
        global.document.afterCount = 0
        global.document.getElementById = id => {
          if (global.document.afterCount !== 0) {
            if (global.document.count >= global.document.afterCount) {
              return elements[id]
            } else {
              global.document.count = global.document.count + 1
              return null
            }
          } else {
            return elements[id]
          }
        }
      })

      afterEach(() => {
        global.document.count = 0
        global.document.afterCount = 0
      })

      test('should scroll to the next annotation if the user clicks the down arrow', () => {
        const spy = jest.spyOn(container, 'scrollTo')
        const wrapper = setup({ docSelected: true, annotations: [12344] })
        wrapper.find('Connect(AnnotationFinder)').simulate('scrollAnnotation', 1)
        expect(spy).toHaveBeenCalled()
      })

      test('should change the current annotation in the finder', () => {
        const spy = jest.spyOn(props.actions, 'changeAnnotationIndex')
        const wrapper = setup({ docSelected: true, annotations: [12344] })
        wrapper.find('Connect(AnnotationFinder)').simulate('scrollAnnotation', 1)
        expect(spy).toHaveBeenCalledWith(1)
      })

      test('should wait until the annotation is rendered before scrolling', () => {
        global.document.afterCount = 3
        const spy = jest.spyOn(container, 'scrollTo')
        const wrapper = setup({ docSelected: true, annotations: [12344] })
        wrapper.find('Connect(AnnotationFinder)').simulate('scrollAnnotation', 1)
        expect(spy).toHaveBeenCalled()
      })
    })

    describe('when the user clicks on an avatar filer', () => {
      test('should enabled the \'All\' filter when the user clicks the \'All\' button', () => {
        const wrapper = setup({ docSelected: true, annotations: [12344], enabledUserId: 'All' })
        expect(wrapper.find('Connect(AnnotationFinder)').prop('allEnabled')).toEqual(true)
      })

      test('should not do anything if the user is in the code screen', () => {
        const spy = jest.spyOn(props.actions, 'toggleCoderAnnotations')
        const wrapper = setup({ docSelected: true, annotations: [12344], isValidation: false })
        wrapper.find('Connect(AnnotationFinder)').simulate('clickAvatar')
        expect(spy).not.toHaveBeenCalled()
      })

      test('should not do anything is the user is in annotation mode', () => {
        const spy = jest.spyOn(props.actions, 'toggleCoderAnnotations')
        const wrapper = setup({
          docSelected: true,
          annotations: [12344],
          isValidation: true,
          annotationModeEnabled: true
        })
        wrapper.find('Connect(AnnotationFinder)').simulate('clickAvatar')
        expect(spy).not.toHaveBeenCalled()
      })

      test('should filter for that user\'s annotations if the user is in validation and not in annotation mode', () => {
        const spy = jest.spyOn(props.actions, 'toggleCoderAnnotations')
        const wrapper = setup({
          docSelected: true,
          annotations: [12344],
          isValidation: true,
          annotationModeEnabled: false
        })
        wrapper.find('Connect(AnnotationFinder)').prop('onClickAvatar')(12, false)()
        expect(spy).toHaveBeenCalledWith(12, false)
      })
    })
  })

  describe('Annotation banner', () => {
    test('text should be "Annotation Mode: Select a document to annotate." when no document is open', () => {
      const wrapper = setup({ enabledAnswerId: 4, annotationModeEnabled: true })
      const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
      expect(text).toEqual('Annotation Mode: Select a document to annotate.')
    })

    test(
      'text should be "Annotation Mode: Highlight the desired text and confirm." when a document with text selected is open',
      () => {
        const wrapper = setup({ enabledAnswerId: 4, annotationModeEnabled: true, docSelected: true })
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
      }
    )

    test(
      'text should be "NOTE: You are unable to annotate this document. Text selection is not allowed." when a document with no text selection is open',
      () => {
        const wrapper = setup({ enabledAnswerId: 4, annotationModeEnabled: true, docSelected: true })
        wrapper.setState({ noTextContent: 0 })
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('NOTE: You are unable to annotate this document. Text selection is not allowed.')
      }
    )

    describe('document open with some text selection', () => {
      const wrapper = setup({ enabledAnswerId: 4, annotationModeEnabled: true, docSelected: true })
      wrapper.setState({ noTextContent: 1 })

      test('there should be two text children', () => {
        expect(wrapper.childAt(2).childAt(0).children()).toHaveLength(2)
      })

      test('first text child should be "Annotation Mode: Highlight the desired text and confirm."', () => {
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
      })

      test(
        'second text child should be "Some pages of this document do not have text selection. You will not be able to annotate those pages."',
        () => {
          const text = wrapper.childAt(2).childAt(0).childAt(1).childAt(0).text()
          expect(text)
            .toEqual(
              'NOTE: Some pages of this document do not have text selection. You will not be able to annotate those pages.'
            )
        }
      )
    })
  })
})
