const _ = require('lodash')

const fs = require('fs')
const fsExtra = require('fs-extra')

const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makeMCQ')

function makeMCQ (value, directory, componentResult) {
  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file)
      file[key] = val

    if (key === 'body') {
      file.body = cleanText(val)
    }
  })

  file._parentId = setParentId(value._id)
  let modelMcqItem = fsExtra.readFileSync('model/mcq-item-model.json', 'utf-8')

  let i = 0
  const tempItems = []
  let mcqMultiply = 0

  answers = value.answer.split(';')

  _.map(answers, function () {
    let modelItem

    // On reprend le model pour insérer de nouvelles données
    modelItem = JSON.parse(modelMcqItem)

    modelItem.text = answers[i]
    if (/(\(v\))/gi.test(answers[i])) {
      modelItem.text = modelItem.text.replace(/\(v\)/gi, '')
      modelItem._shouldBeSelected = true
      mcqMultiply++
    } else {
      modelItem._shouldBeSelected = false
    }

    // On insère dans l'objet temporaire
    tempItems.push(modelItem)

    i++
  })

  debug(mcqMultiply)
  if (mcqMultiply > 1) {
    file._selectable = 2
  }

  file._items = tempItems
  componentResult.push(file)

  fsExtra.writeJsonSync('result/' + directory + '/' + value._component  + '_' + value._id +  '.json', file, 'utf-8')

}

module.exports = makeMCQ
