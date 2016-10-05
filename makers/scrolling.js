const _ = require('lodash')

const fs = require('fs')
const fsExtra = require('fs-extra')
const chalk = require('chalk')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makerScrolling')

function makeScrolling (value, directory, componentResult) {
  // console.log(value.composant);

  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file)
      file[key] = val

    if (key === 'body') {
      file.body = cleanText(val)
    }
  })

  file._parentId = setParentId(value._id)

  // let modelNarrativeItem = fsExtra.readFileSync('model/narrative-item-model.json', 'utf-8')
  //
  // const tempItems = []
  // let i = 0
  //
  // _.each(itemTitle, function () {
  //   let modelItem
  //
  //   // On reprend le model pour insérer de nouvelles données
  //   modelItem = JSON.parse(modelNarrativeItem)
  //   modelItem.title = itemTitle[i]
  //   modelItem.body = itemBody[i]
  //   modelItem._graphic.src = value.pathimage + '/' + itemImage[i]
  //   modelItem.strapline = itemTitle[i]
  //
  //   // On insère dans l'objet temporaire
  //   tempItems.push(modelItem)
  //   i++
  // })

  // file._items = tempItems
  componentResult.push(file)

  fsExtra.writeJsonSync('result/' + directory + '/' + value._component  + '_' + value._id +  '.json', file, 'utf-8')

}

module.exports = makeScrolling
