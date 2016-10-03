const _ = require('lodash')

const fs_extra = require('fs-extra')

// For colors
const chalk = require('chalk');

const debug = require('debug')('MarkerGraphic')

// Tools
const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')
const checkFileExistsSync = require('./../tools/checkFileExistsSync')

function makeGraphic (value, directory, component_result) {
  let file = fs_extra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val,key) {
    if(key in file)
      file[key] = val

    if(key === 'body'){
      file.body = cleanText(val)
    }
  })

  file._parentId = setParentId(value._id)

  component_result.push(file)

  fs_extra.writeJsonSync('result/' + directory + '/' +value._component  + '_' + value._id +  '.json', file, 'utf-8')

}

module.exports = makeGraphic
