const fs = require('fs')
const chalk = require('chalk')

function checkFileExistsSync (filepath) {
  let isExists = false
  try {
    fs.accessSync(filepath, fs.F_OK)
    isExists = true
  } catch (e) {
    // if(e) console.log(e)
    console.log(chalk.red('File \'' + filepath + ' \'doesn\'t exist...'))
  }
  return isExists
}

module.exports = checkFileExistsSync
