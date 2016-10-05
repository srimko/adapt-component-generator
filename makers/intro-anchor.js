const _ = require('lodash')

const fsExtra = require('fs-extra')

// For colors
const chalk = require('chalk')

const debug = require('debug')('makeIntroAnchor')

// Tools
const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')
const checkFileExistsSync = require('./../tools/checkFileExistsSync')

function makeIntroAnchor (value, directory, componentResult) {
  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file) {
      file[key] = val
      debug(key)
    }

    if (key === 'body') {
      file.body = cleanText(val)
    }
  })

  file._graphic.alt = value.title
  file._graphic.large = value.pathimage + '/' + value.poster
  file._graphic.small = value.pathimage + '/' + value.poster

  file._graphic.attribution = ''

  file._parentId = setParentId(value._id)

  componentResult.push(file)

  fsExtra.writeJsonSync('result/' + directory + '/' + value._component  + '_' + value._id +  '.json', file, 'utf-8')

}

module.exports = makeIntroAnchor
