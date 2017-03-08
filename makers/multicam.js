const _ = require('lodash')

// const fs = require('fs')
const fsExtra = require('fs-extra')

const setParentId = require('./../tools/setParentId')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makeMultiCam')

function makeMultiCam (value, directory, componentResult) {
  const tempItems = []

  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file) file[key] = val

    if (key === 'body') file.body = cleanText(val)
  })

  file._items = []

  file._parentId = setParentId(value._id)
  file._component = "mediaMultiCam"
  file.body = cleanText(value.body)
  file.poster = value.pathvideo + "/" + value.poster 

  value.media1_title = cleanText(value.media1_title)
  value.media2_title = cleanText(value.media2_title)
  value.media3_title = cleanText(value.media3_title)
  value.media4_title = cleanText(value.media4_title)

  let modelNarrativeItem = fsExtra.readFileSync('model/multicam-item-model.json', 'utf-8')

  if (value.media1_title !== '') {
    let modelItem
    modelItem = JSON.parse(modelNarrativeItem)
    modelItem.title = value.media1_title
    modelItem.source = value.pathvideo + '/' + value.media1_source
    modelItem.type = value.media1_type

    tempItems.push(modelItem)
  }

  if (value.media2_title !== '') {
    // nbrItems = 2

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem)
    modelItem.title = value.media2_title
    modelItem.source = value.pathvideo + '/' + value.media2_source
    modelItem.type = value.media2_type

    tempItems.push(modelItem)
  }

  if (value.media3_title !== '') {
    // nbrItems = 3

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem)
    modelItem.title = value.media3_title
    modelItem.source = value.pathvideo + '/' + value.media3_source
    modelItem.type = value.media3_type

    tempItems.push(modelItem)
  }

  if (value.media4_title !== '') {
    // nbrItems = 4

    let modelItem
    modelItem = JSON.parse(modelNarrativeItem)
    modelItem.title = value.media4_title
    modelItem.source = value.pathvideo + '/' + value.media4_source
    modelItem.type = value.media4_type

    tempItems.push(modelItem)
  }

  debug(tempItems)

  file._medias = tempItems
  componentResult.push(file)

  // fs.writeFileSync('result/' + directory + '/' + value.composant  + '_' + value._id +  '.json', jsonFormat(newValue) + ',', { encoding: 'utf8' })
  fsExtra.writeJsonSync('result/' + directory + '/' + value._component + '_' + value._id + '.json', file, 'utf-8')
}

module.exports = makeMultiCam
