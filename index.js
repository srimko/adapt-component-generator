"use strict";

const fs = require('fs')
const fs_extra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')
const jsonFormat = require('json-format')
const shell = require('shelljs')


// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/Liste_composant.xlsx'
const workbook = XLSX.readFile(fileName)
const sheet_name_list = workbook.SheetNames

// TODO : Faire la fonction qui génère le block.json en même temps que component

// Pour changer de page il faut changer l'indice dans le sheet_name_list ex: 0 pour la page 1, 2 pour la page 3 etc
const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])

var component_result = ''

let blockList = []

// TODO : Faire une fonction d'initialisation
// Initialisation du projet
let directories = sheet_name_list
shell.mkdir('-p','result')
_.forEach(sheet_name_list, function(value, key) {
  shell.mkdir('-p','result/' + value)
})

for(let i = 0; i < sheet_name_list.length; i++) {

  // On récupère les feuilles XLSX en entier au format JSON
  let JSONsheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);

  // On itère sur chaque élément du fichier JSON
  JSONsheet.forEach(function(value, key) {

    switch (value.composant) {
      case 'narrative':
        makeNarrative(value, sheet_name_list[i])
        break;
      default:
        makeComponent(value, sheet_name_list[i])
    }

    blockList.push(value._parentId)


  })
}

fs.writeFileSync('result/component_result.json',component_result , {encoding: 'utf8'})
makeBlock(blockList)






// TODO : Faire un nouveau fichier pour la clareté du projet

function makeBlock (blockList) {

  let blockFile = fs_extra.readJsonSync('model/block.json', 'utf-8')
  let tempBlock = []

  _.forEach(blockList, function(value, key) {

    let _tempBlock = {}
    _tempBlock._id = blockList[key];
    _tempBlock._parentId = setParentId(_tempBlock._id, 'a');
    _tempBlock.title = blockList[key];
    _tempBlock.type = 'block';
    // _tempBlock.displayTitle = blockList[key];
    _tempBlock.displayTitle = ''
    _tempBlock._trackingId = key

    tempBlock.push(_tempBlock)

  })

  fs.writeFileSync('result/block.json',jsonFormat(tempBlock), {encoding: 'utf8'});
}

function makeComponent (value,directory) {
  var file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')
  var compiled = _.template(file)

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
  checkIfKeyExit (value)

  component_result += compiled(value)

  // On insère les valeur s et on écrit le fichier
  fs.writeFileSync('result/' + directory + '/' +value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
}

function makeNarrative (value, directory) {

  // TODO : Etendre le systeme pour le model media

  let nbrItems, itemTitle, itemBody, itemImage, compiled
  let tempItems = []

  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fs_extra.readJsonSync('model/' + value.composant + '.json', 'utf-8')
  file._items = []

  value._parentId = setParentId(value._id)
  value.body = cleanText(value.body)

  // On récupère les options pour créer les slides du narrative
  nbrItems = value.items
  itemTitle = value.item_title.split(';')
  itemBody = value.item_body.split(';')
  itemImage = value.item_image.split(';')

  let modelNarrativeItem = fs_extra.readJsonSync('model/narrative-item-model.json', 'utf-8')
  let modelItem

  for(var i = 0; i < nbrItems; i++ ) {

    // On reprend le model pour insérer de nouvelles données
    modelItem = modelNarrativeItem;
    modelItem.title = itemTitle[i]
    modelItem.body = itemBody[i]
    modelItem._graphic.src = value.pathimage + '/' + itemImage[i]
    modelItem.strapline = itemTitle[i]

    // On insère dans l'objet temporaire
    tempItems.push(modelItem)

  }

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

function checkIfKeyExit (value) {

  let objectKeys = [
    'pathvideo',
    'pathvideo',
    'media1_title',
    'image_root',
    'media1_source',
    'media1_type',
    'media2_title',
    'media2_source',
    'media2_type',
    'media3_title',
    'media3_source',
    'media3_type',
    'media4_title',
    'media4_source',
    'media4_type']
  for(let i = 0; i < objectKeys.length; i++) {
    if(value[objectKeys[i]] === undefined ) {
      value[objectKeys[i]] !== undefined  ? (value[objectKeys[i]]=value[objectKeys[i]]) : (value[objectKeys[i]] = '')
    }
    else {
    }
  }
}

function setParentId (_id, type) {

  let _parentId = ''

  _parentId = _id.split('-')

  if(type === undefined) {
    _parentId[0] = 'b'
  }
  else {
    _parentId[0] = type
    _parentId.pop()
  }

  _parentId = _parentId.join('-')

  return _parentId
}

function cleanText (text) {

  if(text !== undefined) {
    let clearQuote = /"/g;
    text = text.replace(clearQuote,'\\"');
    let clearRetourLigneLOL = /\n/g;
    text = text.replace(clearRetourLigneLOL, '');
  }
  else {
    text = ''
  }

  return text
}
