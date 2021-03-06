var fileWidget = require('file-browser-widget')

module.exports = function createBrowser (root, children, el, cbDisplayFile) {
  noError = null
  el.innerHTML = ''
  var browser = createTree(root, children, el)

  browser.on('entry', function (entry) {
    display(entry)

    function display (entry) {
      if (entry.type === 'directory') {
        browser = createBrowser(entry.path, children, el, cbDisplayFile)
        browser.on('entry', function (entry) { display(entry) })
      } else { // entry.type === 'file'
        cbDisplayFile(noError, entry)
      }
    }
  })

  return browser
}

function createTree (rootDir, children, htmlEl) {
  var widget = fileWidget()
  var rootDirs = makeFileArray(rootDir)
  // find top-level nodes
  var nodesToPrint = []
  children.forEach(function (entry) {
    var nodeDirs = makeFileArray(entry.path)
    if (nodeDirs.length === (rootDirs.length + 1)) {
      var isChild = true
      for (var i = 0; i < rootDirs.length && isChild === true; i++) {
        isChild = (nodeDirs[i] === rootDirs[i])
      }
      if (isChild === true) nodesToPrint.push(entry)
    }
  })

  widget.directory(rootDir, nodesToPrint)
  widget.appendTo(htmlEl)
  return widget
}

function makeFileArray (pathName) {
  var fileArray = pathName.split('/')
  while (fileArray[0] === '' || fileArray[0] === '.') {
    fileArray.shift() // remove empty items from the beginning
  }
  while (fileArray[fileArray.length - 1] === '') {
    fileArray.pop() // remove empty items from the end
  }
  return fileArray
}
