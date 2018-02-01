'use strict'

// Node package
// const fs = require('fs')
const fsExtra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')
const debug = require('debug')('index')
const path = require('path')

const shell = require('shelljs')

const chalk = require('chalk')

const notifier = require('node-notifier')

// Makers
const makeBlock = require('./makers/block')
const makeComponent = require('./makers/component')
const makeMCQ = require('./makers/mcq')
const makeNarrative = require('./makers/narrative')
const makeMultiCam = require('./makers/multicam')
const makeGraphic = require('./makers/graphic')
const makeHotGraphic = require('./makers/hotgraphic')
const makeMedia = require('./makers/media')
const makeIntroAnchor = require('./makers/intro-anchor')
const makeScrolling = require('./makers/scrolling')

// Tools
const checkFileExistsSync = require('./tools/checkFileExistsSync')
const initDirectories = require('./tools/initDirectories')
let repoPath

// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/component_list.xlsx'

// TODO : Install debug inside the project

// Check if the file passed in argument exists
if (!checkFileExistsSync(fileName)) {
  let fileInsideSrcDirectory = shell.ls('src')

  // Exit script
  process.exit()
} else {
  // Reading XLSX file
  const workbook = XLSX.readFile(fileName)

  // Getting sheets
  const sheetNameList = workbook.SheetNames

  var componentResult = []
  let blockList = []

  // Initialization of the project
  repoPath = initDirectories(fileName, sheetNameList)

  let componentIterate = 0
  for (let i = 0; i < sheetNameList.length; i++) {
    // On récupère les feuilles XLSX en entier au format JSON
    let JSONsheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[i]])

    // debug(chalk.red(sheetNameList[i]))

    // On itère sur chaque élément du fichier JSON
    JSONsheet.forEach(function (value, key) {
      //  Compatability with older file
      if ('composant' in value) value._component = _.toLower((_.trim(value.composant)))
      if (value._component === 'introjld') value._component = 'intro-anchor'
      if (value._component === 'adapt-yny-sequenceImgScrolling') value._component = 'scrolling'

      switch (value._component) {
        case 'narrative':
          makeNarrative(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'multicam':
          makeMultiCam(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'media':
          makeMedia(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'mcq':
          makeMCQ(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'intro-anchor':
          makeIntroAnchor(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'scrolling':
          makeScrolling(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'graphic':
          makeGraphic(value, repoPath, sheetNameList[i], componentResult)
          break
        case 'hotgraphic':
          makeHotGraphic(value, repoPath, sheetNameList[i], componentResult)
          break
        case undefined:

          // TODO: Gérer les lignes vides et les composant qui ne sont pas encore été créer
          console.log('Error : Component "' + value._component + '" ' + sheetNameList[i] + ' doesn\'t exist...')
          process.exit()
          break
        default:
          makeComponent(value, repoPath, sheetNameList[i], componentResult)
      }
      // console.log(componentResult[componentIterate])
      // console.log('-----')
      blockList.push(componentResult[componentIterate]._parentId)
      componentIterate++
    })
  }

  fsExtra.writeJsonSync(path.join(repoPath, 'componentResult.json'), componentResult, 'utf-8', function (err) {
    console.log('err', err)
  })

  notifier.notify({
    title: 'Component Generator',
    message: 'Great job guy !'
  })

  // Ecriture du fichier block.json
  makeBlock(repoPath,blockList)
}
