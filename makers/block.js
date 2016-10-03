const _ = require('lodash')

const fs = require('fs')
const fs_extra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')

const debug = require('debug')('block')


 /**
  * Create block.json file
  *
  * @param {array} array of string, each string representing a block id
  * @return {nothing}
  *
  */
function makeBlock (blockList) {

  let blockFile = fs_extra.readJsonSync('model/block.json', 'utf-8')
  let tempBlock = []
  debug(blockFile)

  _.forEach(blockList, function(value, key) {


    let _tempBlock = {}
    _tempBlock._id = blockList[key];
    _tempBlock._parentId = setParentId(_tempBlock._id, 'a')
    _tempBlock.title = blockList[key]
    _tempBlock.type = 'block'
    // _tempBlock.displayTitle = blockList[key];
    _tempBlock.displayTitle = ''
    _tempBlock._trackingId = key

    tempBlock.push(_tempBlock)

  })

  fs.writeFileSync('result/block.json',jsonFormat(tempBlock), {encoding: 'utf8'})
}


module.exports = makeBlock
