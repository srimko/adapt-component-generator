const _ = require('lodash')

// const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

// const jsonFormat = require('json-format')

const setParentId = require('./../tools/setParentId')
// const checkIfKeyExit = require('./../tools/checkIfKeyExit')
const cleanText = require('./../tools/cleanText')

const debug = require('debug')('makeMCQ')

function makeMCQ (value, repoPath, directory, componentResult) {
  // Le fichier est lu comme un objet JSON pour manipuler les données
  let file = fsExtra.readJsonSync('model/' + value._component + '.json', 'utf-8')

  _.map(value, function (val, key) {
    if (key in file) file[key] = val.trim()

    if (key === 'question') file.body = cleanText(val)
  })

  file._parentId = setParentId(value._id)
  let modelMcqItem = fsExtra.readFileSync('model/mcq-item-model.json', 'utf-8')

  let i = 0
  const tempItems = []
  let mcqMultiply = 0

  let answers = value.answer.split(';')

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
    file._selectable = mcqMultiply
  }

  file._items = tempItems
  componentResult.push(file)

  fs.writeJsonSync(path.join(repoPath, directory, value._component + '_' + value._id + '.json'), file, 'utf-8')
}

module.exports = makeMCQ
