const _ = require('lodash')

const fs = require('fs')

// For colors
const chalk = require('chalk');

// Tools
const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')
const checkFileExistsSync = require('./../tools/checkFileExistsSync')

function makeComponent (value, directory, component_result) {
  var file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')
  var compiled = _.template(file)

  // console.log(value.composant);

  value._parentId = setParentId(value._id)
  value.body = cleanText(value.body)

  // On n'a pas besoin de récupérer le tableau après la fonction car envoi par référence
  checkIfKeyExit(value)

  component_result += compiled(value)

  // On insère les valeur s et on écrit le fichier
  fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})


  if( checkFileExistsSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json') ) {
    console.log('File ' + chalk.blue(value.composant  + '_' + value._id +  '.json') + chalk.green(' was created') )
  } else {
    console.log(chalk.red('Error: File ' + chalk.yellow(value.composant  + '_' + value._id +  '.json') + ' wasn\'t created'));
  }


}

module.exports = makeComponent
