"use strict";

const fs = require('fs')
const fs_extra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')
const jsonFormat = require('json-format')

const fileName = process.argv[2] || 'src/Liste_composant.xlsx'

const workbook = XLSX.readFile(fileName)

const sheet_name_list = workbook.SheetNames

// TODO : Faire la fonction qui génère le block.json en même temps que component
// TODO : Faire une fonction qui permet de générer les composants et le component_result dans un dossier pour chaque page.

// Pour changer de page il faut changer l'indice dans le sheet_name_list ex: 0 pour la page 1, 2 pour la page 3 etc
const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])


var component_result = ''

firstJson.forEach(function(value, key) {

  if(value.composant !== 'narrative' && value.composant !== undefined) {

      var file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')
      var compiled = _.template(file)

      value._parentId = setParentId(value._id)
      value.body = cleanText(value.body)

      // On n'a pas besoin de récupérer le tableau après la fonction car envoi par référence
      checkIfKeyExit (value)

      component_result += compiled(value)

      // On insère les valeurs et on écrit le fichier
      fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
  }
  else {
    makeNarrative(value)
  }

});

fs.writeFileSync('composant/component_result.json',component_result , {encoding: 'utf8'})




// TODO : Faire un nouveau fichier pour la clareté du projet

function makeNarrative (value) {
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
    modelItem._graphic.src = value._parentId + '/' + itemImage[i]
    modelItem.strapline = itemTitle[i]

    // On insère dans l'objet temporaire
    tempItems.push(modelItem)

  }

  // Les slides sont maintenant ajouter dans l'objet final
  file._items = tempItems

  // On passe d'un JSON à un string pour pouvoir insérer les données dans le template lodash
  file = JSON.stringify(file)
  compiled = _.template(file)


  let newValue
  newValue = JSON.parse(compiled(value))

  component_result += jsonFormat(newValue)+',\n'

  fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json',jsonFormat(newValue)+',', {encoding: 'utf8'});
}

function checkIfKeyExit (value) {
  let objectKeys = ['pathvideo','pathvideo','media1_title','media1_source','media1_type','media2_title','media2_source','media2_type','media3_title','media3_source','media3_type','media4_title','media4_source','media4_type']
  for(let i = 0; i < objectKeys.length; i++) {
    if(value[objectKeys[i]] === undefined ) {
      value[objectKeys[i]] !== undefined  ? (value[objectKeys[i]]=value[objectKeys[i]]) : (value[objectKeys[i]] = '')
      console.log('Erreur');
    }
    else{
      console.log('ok');
    }
  }
}

function setParentId (_id) {

  let _parentId = ''
  _parentId = _id.split('-')
  _parentId[0] = 'b'
  _parentId = _parentId.join('-')

  return _parentId
}

function cleanText (text) {

  if(text !== undefined) {
    let clearQuote = /"/g;
    text = text.replace(clearQuote, '\\"');
    let clearRetourLigneLOL = /\n/g;
    text = text.replace(clearRetourLigneLOL, '');
  }
  else {
    text = ''
  }

  return text
}
