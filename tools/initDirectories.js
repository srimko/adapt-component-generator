const _ = require('lodash')
const shell = require('shelljs')

function initDirectories (sheetNameList) {
  shell.mkdir('-p', 'result')
  _.forEach(sheetNameList, function (value, key) {
    shell.mkdir('-p', 'result/' + value)
  })
}

module.exports = initDirectories
