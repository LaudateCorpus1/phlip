export class Reader {
  hasRead = false
  
  constructor(entries, hasRead = false) {
    this.entries = entries
    this.hasRead = hasRead
  }
  
  readEntries = (scb, fcb) => {
    scb(!this.hasRead ? this.entries : [])
    this.hasRead = true
  }
}

export class FileReader {
  constructor() {}
  readAsArrayBuffer = blob => {
    this.onload({ target: { result: blob, readyState: 2 } })
  }
  onload = () => {}
}

export class File {
  constructor(name, size, arrBufferOutput) {
    this.name = name
    this.size = size
    this.arrBufferOutput = arrBufferOutput
  }
  
  slice() {
    return this.arrBufferOutput
  }
}

export class FileEntry {
  constructor(name, type, children, size, arrBufferOutput) {
    this.type = type
    this.children = children
    this.size = size
    this.name = name
    this.arrBufferOutput = arrBufferOutput
  }
  
  get isFile() {
    return this.type === 'file'
  }
  
  get isDirectory() {
    return this.type === 'dir'
  }
  
  file = cb => {
    cb(new File(this.name, this.size, this.arrBufferOutput))
  }
  
  createReader = () => new Reader(this.children)
}

export class DataTransferItem {
  name = ''
  type = ''
  items = []
  
  constructor(name, itemType, items, size, arrBufferOutput) {
    this.name = name
    this.type = itemType
    this.items = items
    this.size = size
    this.arrBufferOutput = arrBufferOutput
  }
  
  webkitGetAsEntry() {
    return new FileEntry(this.name, this.type, this.items, this.size, this.arrBufferOutput)
  }
}
