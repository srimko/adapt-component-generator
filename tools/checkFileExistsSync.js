const fs = require('fs')

function checkFileExistsSync (filepath) {
  let isExists = false
  try {
    fs.accessSync(filepath, fs.F_OK)
    isExists = true
  } catch (e) {
    if(e) console.log(e)
  }
  return isExists
}

module.exports = checkFileExistsSync
