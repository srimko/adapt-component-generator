const _ = require('lodash')

const fs = require('fs')
const fsExtra = require('fs-extra')

const jsonFormat = require('json-format')
const path = require('path')

const setParentId = require('./../tools/setParentId')

const debug = require('debug')('block')

/**
  * Create block.json file
  *
  * @param {array} array of string, each string representing a block id
  * @return {nothing}
  *
  */
function makeBlock (repoPath, blockList) {
  let blockFile = fsExtra.readJsonSync('model/block.json', 'utf-8')
  let tempBlock = []
  debug(blockFile)

  _.forEach(blockList, function (value, key) {
    let _tempBlock = {}
    _tempBlock._id = blockList[key]
    _tempBlock._parentId = setParentId(_tempBlock._id, 'a')
    _tempBlock.title = blockList[key]
    _tempBlock.type = 'block'
    _tempBlock.displayTitle = ''
    _tempBlock._trackingId = key
    _tempBlock._classes = ''

    tempBlock.push(_tempBlock)
  })

  fsExtra.writeJsonSync(path.join(repoPath, 'block.json'), jsonFormat(tempBlock), { encoding: 'utf8' })
}

module.exports = makeBlock
