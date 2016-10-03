const _ = require('lodash')

const fs = require('fs')
const fs_extra = require('fs-extra')
const chalk = require('chalk');

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makerNarrative')

function makeNarrative (value, directory, component_result) {
  // console.log(value.composant);
  let itemTitle, itemBody, itemImage
  itemTitle = value.item_title.split(';')
  itemBody = value.item_body.split(';')
  itemImage = value.item_image.split(';')


  // TODO : Trouver/Créer une fonction pour vérfier cetre égalitée
  if( itemTitle.length ===  itemBody.length &&
      itemBody.length ===  itemImage.length &&
      itemImage.length ===  itemTitle.length) {

      let file = fs_extra.readJsonSync('model/' + value._component + '.json', 'utf-8')

      _.map(value, function (val,key) {
        if(key in file)
          file[key] = val

        if(key === 'body'){
          file.body = cleanText(val)
        }
      })

      file._parentId = setParentId(value._id)

      let modelNarrativeItem = fs_extra.readFileSync('model/narrative-item-model.json', 'utf-8')

      const tempItems = []
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
      i++
    })

    file._items = tempItems
    component_result.push(file)

    fs_extra.writeJsonSync('result/' + directory + '/' +value._component  + '_' + value._id +  '.json', file, 'utf-8')
  } else {
    debug(chalk.red('Une erreur grave à été trouvé... lol !'))
  }

}

module.exports = makeNarrative
