// const _ = require('lodash')

// const fs = require('fs')
const fsExtra = require('fs-extra')

// For colors
const chalk = require('chalk')
const path = require('path')

// Tools
const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')
const checkFileExistsSync = require('./../tools/checkFileExistsSync')

function makeComponent (value, repoPath, directory, componentResult) {
  var file = fsExtra.readFileSync('model/' + value._component + '.json', 'utf-8')

  file._parentId = setParentId(value._id)
  file.body = cleanText(value.body)

  checkIfKeyExit(value)

  componentResult.push(file)

  fsExtra.writeJsonSync(path.join(repoPath, directory, value._component + '_' + value._id + '.json'), file, 'utf-8')

  if (checkFileExistsSync(repoPath + directory + '/' + value._component + '_' + value._id + '.json')) {
    console.log('File ' + chalk.blue(value._component + '_' + value._id + '.json') + chalk.green(' was created'))
  } else {
    console.log(chalk.red('Error: File ' + chalk.yellow(value._component + '_' + value._id + '.json') + ' wasn\'t created'))
  }
}

module.exports = makeComponent
