const _ = require('lodash')

const fs = require('fs')
const fsExtra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')

const debug = require('debug')('makeStart')

/**
  * Create start.json component file
  *
  * @param {array} value
  * @param {array} directory
  * @param {array} componentResult
  * @return {nothing} a file named start.json was created inside result directory
  *
  */
function makeStart (value, repoPath, directory, componentResult) {

  let blockFile = fsExtra.readJsonSync('model/block.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file)
      file[key] = val.trim()

    if (key === 'body') {
      file.body = cleanText(val)
    }
  })

  file._parentId = setParentId(value._id)

  componentResult.push(file)

  fsExtra.writeJsonSync(path.join(repoPath, directory, value._component + '_' + value._id + '.json'), file, 'utf-8')
}

module.exports = makeStart
