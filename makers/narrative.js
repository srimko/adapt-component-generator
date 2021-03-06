const _ = require('lodash')

// const fs = require('fs')
const fsExtra = require('fs-extra')
const chalk = require('chalk')
const path = require('path')

// const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makerNarrative')

function makeNarrative (value, repoPath, directory, componentResult) {
  // console.log(value.composant);

  let itemTitle, itemBody, itemImage
  itemTitle = value.item_title.split(';')
  // console.log(itemTitle)
  itemBody = value.item_body.split(';')
  // console.log(itemBody)
  itemImage = value.item_image.split(';')

  // TODO : Trouver/Créer une fonction pour vérfier cetre égalitée
  if ((itemTitle.length === itemBody.length) && (itemBody.length === itemImage.length) && (itemImage.length === itemTitle.length) && (value.items !== '1')) {
    let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

    _.map(value, function (val, key) {
      if (key in file) file[key] = val

      if (key === 'body') file.body = cleanText(val)
    })

    file._parentId = setParentId(value._id)

    let modelNarrativeItem = fsExtra.readFileSync('model/narrative-item-model.json', 'utf-8')

    const tempItems = []
    let i = 0

    _.each(itemTitle, function () {
      let modelItem

      // On reprend le model pour insérer de nouvelles données
      modelItem = JSON.parse(modelNarrativeItem)
      modelItem.title = itemTitle[i]
      modelItem.body = itemBody[i]
      modelItem._graphic.src = value.pathimage + '/' + itemImage[i]
      modelItem.strapline = itemTitle[i]

      // On insère dans l'objet temporaire
      tempItems.push(modelItem)
      i++
    })

    file._items = tempItems
    componentResult.push(file)

    fsExtra.writeJsonSync(path.join(repoPath, directory, value._component + '_' + value._id + '.json'), file, 'utf-8')
  } else {
    if(value.items === '1' ) {
      let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

      _.map(value, function (val, key) {
        if (key in file) file[key] = val.trim()

        if (key === 'body') file.body = cleanText(val)
      })

      file._parentId = setParentId(value._id)
      file._classes = 'one'

      let modelNarrativeItem = fsExtra.readFileSync('model/narrative-item-model.json', 'utf-8')
      const tempItems = []
      modelItem = JSON.parse(modelNarrativeItem)
      modelItem.title = value.item_title
      modelItem.body = value.item_body
      modelItem._graphic.src = value.pathimage + '/' + value.item_image
      modelItem.strapline = value.item_title

      // On insère dans l'objet temporaire
      tempItems.push(modelItem)

      file._items = tempItems
      componentResult.push(file)

      fsExtra.writeJsonSync(path.join(repoPath, directory, value._component + '_' + value._id + '.json'), file, 'utf-8')
    } else {
      console.log(chalk.red('Une erreur grave à été trouvé...!'))
    }
  }
}

module.exports = makeNarrative
