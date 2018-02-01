const _ = require('lodash')
const shell = require('shelljs')
const path = require('path')
let repoPath

function initDirectories (fileName, sheetNameList) {
  repoPath = path.join('result', path.basename(fileName.split('src/')[1], '.xlsx'))
  // repoPath = 'result/' + path.basename(fileName.split('src/')[1], '.xlsx') + '/'
  shell.mkdir('-p', 'result')
  shell.mkdir('-p', repoPath)
  _.forEach(sheetNameList, function (value, key) {
    shell.mkdir('-p', path.join(repoPath, value))
  })
  return repoPath
}

module.exports = initDirectories
