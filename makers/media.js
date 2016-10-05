const _ = require('lodash')
const fsExtra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makerMedia')

function makeMedia (value, directory, componentResult) {

  debug('mediaMaker')

  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file)
      file[key] = val

    if (key === 'body') {
      file.body = cleanText(val)
    }
  })

  file._media.mp4 = value.pathvideo + '/' + value.mp4
  file._media.poster = value.pathvideo + '/' + value.poster

  file._parentId = setParentId(value._id)

  componentResult.push(file)

  fsExtra.writeJsonSync('result/' + directory + '/' + value._component  + '_' + value._id +  '.json', file, 'utf-8')

}

module.exports = makeMedia
