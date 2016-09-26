const _ = require('lodash')

const fs = require('fs')
const fs_extra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('index')

function makeNarrative (value, directory, component_result) {
  // console.log(value.composant);
  // TODO : Etendre le systeme pour le model media

  let nbrItems, itemTitle, itemBody, itemImage, compiled

  const tempItems = []
  debug(tempItems)
  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fs_extra.readJsonSync('model/' + value.composant + '.json', 'utf-8')
  file._items = []

  value._parentId = setParentId(value._id)
  value.body = cleanText(value.body)

  // TODO: Vérifier les trois valeurs pour initialiser nbrItems
  // On récupère les options pour créer les slides du narrative
  nbrItems = value.items
  itemTitle = value.item_title.split(';')
  itemBody = value.item_body.split(';')
  itemImage = value.item_image.split(';')

  let modelNarrativeItem = fs_extra.readFileSync('model/narrative-item-model.json', 'utf-8')
  let i = 0
  _.each(itemTitle, function(){
      let modelItem
      // On reprend le model pour insérer de nouvelles données
      modelItem = JSON.parse(modelNarrativeItem);
      modelItem.title = itemTitle[i]
      modelItem.body = itemBody[i]
      modelItem._graphic.src = value.pathimage + '/' + itemImage[i]
      modelItem.strapline = itemTitle[i]

      // On insère dans l'objet temporaire
      tempItems.push(modelItem)
      // debug(itemBody[i], i)
      i++
  })

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

module.exports = makeNarrative
