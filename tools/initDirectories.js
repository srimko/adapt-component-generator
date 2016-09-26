const _ = require('lodash')
const shell = require('shelljs')

initDirectories = function (sheet_name_list) {
  shell.mkdir('-p','result')
  _.forEach(sheet_name_list, function(value, key) {
    shell.mkdir('-p','result/' + value)
  })
}

module.exports = initDirectories
