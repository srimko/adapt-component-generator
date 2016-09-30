const _ = require('lodash')

const fs_extra = require('fs-extra')

// For colors
const chalk = require('chalk');

const debug = require('debug')('index')

// Tools
const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')
const checkFileExistsSync = require('./../tools/checkFileExistsSync')

function makeGraphic (value, directory, component_result) {
  var file = fs_extra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  // debug(file)
  // debug(value)

  _.map(value, function(val,key,object) {
    // debug(val)
    file[key] = val
    if(key === 'body'){
      debug(key)
      debug(val)
      file.body = cleanText(val)
    }
  })

  file._parentId = setParentId(value._id)
  // debug(value)
  // var compiled = _.template(file)
  //
  //
  //
  // checkIfKeyExit(value)
  //
  // component_result += compiled(value)
  component_result.push(value)
  //
  // // On insère les valeur s et on écrit le fichier
  // fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
  //
  //
  // if( checkFileExistsSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json') ) {
  //   console.log('File ' + chalk.blue(value.composant  + '_' + value._id +  '.json') + chalk.green(' was created') )
  // }
  // else {
  //   console.log(chalk.red('Error: File ' + chalk.yellow(value.composant  + '_' + value._id +  '.json') + ' wasn\'t created'));
  // }

  // fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json',jsonFormat(newValue)+',', {encoding: 'utf8'});
  fs_extra.writeJson('result/' + directory + '/' +value._component  + '_' + value._id +  '.json', file, function (err) {
    console.log(err)
  })

  debug(file)

}

module.exports = makeGraphic
