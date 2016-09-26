const _ = require('lodash')

const fs = require('fs')
const fs_extra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('index')


function makeMCQ (value, directory, component_result) {
  let question, answers, compiled

  const tempItems = []
  debug(tempItems)
  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fs_extra.readJsonSync('model/' + value.composant + '.json', 'utf-8')
  file._items = []

  value._parentId = setParentId(value._id)

  value.body = value.question
  file.body = cleanText(value.body)

  // TODO: Vérifier les trois valeurs pour initialiser nbrItems
  // On récupère les options pour créer les slides du narrative
  answers = value.answer.split(';')

  // process.exit()

  let modelMCQItem = fs_extra.readFileSync('model/mcq-item-model.json', 'utf-8')
  let i = 0
  let mcq_multiply = 0;
  _.each(answers, function(){
      let modelItem
      // On reprend le model pour insérer de nouvelles données
      modelItem = JSON.parse(modelMCQItem);

      // console.log(answers[i]);

      modelItem.text = answers[i]
      if( /(\(v\))/gi.test(answers[i]) ) {
        modelItem.text = modelItem.text.replace(/\(v\)/gi,'')
        modelItem._shouldBeSelected = true
        mcq_multiply++;
      }
      else{
        modelItem._shouldBeSelected = false
      }

      // On insère dans l'objet temporaire
      tempItems.push(modelItem)
      // debug(itemBody[i], i)
      i++
  })

  if(mcq_multiply > 1) {
    file._selectable = 2;
  }
  debug(tempItems);

  // Les slides sont maintenant ajouter dans l'objet final
  file._items = tempItems

  // On passe d'un JSON à un string pour pouvoir insérer les données dans le template lodash
  file = JSON.stringify(file)
  compiled = _.template(file)


  // On le transforme on jolie JSON formater
  let newValue
  newValue = JSON.parse(compiled(value))

  component_result += jsonFormat(newValue)+',\n'

  fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json',jsonFormat(newValue)+',', {encoding: 'utf8'});
}

module.exports = makeMCQ
