const _ = require('lodash')

const fs = require('fs')

const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')

function makeComponent (value, directory, component_result) {
  var file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')
  var compiled = _.template(file)

  // console.log(value.composant);

  value._parentId = setParentId(value._id)
  value.body = cleanText(value.body)

  // console.log( value.composant);
  if(value.composant === 'multicam') {
    // console.log(value._medias[0]);
    value.media1_title = cleanText(value.media1_title)
    value.media2_title = cleanText(value.media2_title)
    value.media3_title = cleanText(value.media3_title)
    value.media4_title = cleanText(value.media4_title)
  }

  // On n'a pas besoin de récupérer le tableau après la fonction car envoi par référence
  checkIfKeyExit(value)

  component_result += compiled(value)

  // On insère les valeur s et on écrit le fichier
  fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
}

module.exports = makeComponent
