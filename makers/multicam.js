const fs = require('fs')
const fs_extra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('index')


function makeMultiCam (value, directory) {
  console.log(value.composant);
  console.log(value);
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

  value.media1_title = cleanText(value.media1_title)
  value.media2_title = cleanText(value.media2_title)
  value.media3_title = cleanText(value.media3_title)
  value.media4_title = cleanText(value.media4_title)

  let modelNarrativeItem = fs_extra.readFileSync('model/multicam-item-model.json', 'utf-8')

  if(value.media1_title !== '' ) {
    // nbrItems = 1;

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem);
    modelItem.title = value.media1_title
    modelItem.source = value.pathvideo + '/' +value.media1_source
    modelItem.type = value.media1_type


    tempItems.push(modelItem)
  }
  if(value.media2_title !== '' ) {
    // nbrItems = 2;

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem);
    modelItem.title = value.media2_title
    modelItem.source = value.pathvideo + '/' +value.media2_source
    modelItem.type = value.media2_type


    tempItems.push(modelItem)
  }
  if(value.media3_title !== '' ) {
    // nbrItems = 3;

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem);
    modelItem.title = value.media3_title
    modelItem.source = value.pathvideo + '/' +value.media3_source
    modelItem.type = value.media3_type


    tempItems.push(modelItem)
  }
  if(value.media4_title !== '' ) {
    // nbrItems = 4;

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem);
    modelItem.title = value.media4_title
    modelItem.source = value.pathvideo + '/' +value.media4_source
    modelItem.type = value.media4_type


    tempItems.push(modelItem)
  }

  debug(tempItems);

  // Les slides sont maintenant ajouter dans l'objet final
  file._medias = tempItems

  // On passe d'un JSON à un string pour pouvoir insérer les données dans le template lodash
  file = JSON.stringify(file)
  compiled = _.template(file)


  // On le transforme on jolie JSON formater
  let newValue
  newValue = JSON.parse(compiled(value))

  component_result += jsonFormat(newValue)+',\n'

  fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json',jsonFormat(newValue)+',', {encoding: 'utf8'});
}


module.exports = makeMultiCam
