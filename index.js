'use strict'

// Node package
const fs = require('fs')
const fsExtra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')
const debug = require('debug')('index')

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
const makeMedia = require('./makers/media')
const makeIntroAnchor = require('./makers/intro-anchor')
const makeScrolling = require('./makers/scrolling')

// Tools
const checkFileExistsSync = require('./tools/checkFileExistsSync')
const initDirectories = require('./tools/initDirectories')

// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/component_list.xlsx'

// TODO : Install debug inside the project

if (!checkFileExistsSync(fileName)) {
  let fileInsideSrcDirectory = shell.ls('src')

  debug('File inside src folder :')
  _.each(fileInsideSrcDirectory, function (file) {
    debug(chalk.green(file))
  })

  console.log(chalk.red('File \'' + fileName + ' \'doesn\'t exist...'))
  console.log(chalk.white('Check inside your src folder if file exist or launch this command \'DEBUG=* node index.js\' to take a look indie src folder.'))

  // Exit script
  process.exit()
} else {
  const workbook = XLSX.readFile(fileName)
  const sheetNameList = workbook.SheetNames

  // var componentResult = ''
  var componentResult = []

  let blockList = []

  // TODO : Faire une fonction d'initialisation
  // Initialisation du projet
  let directories = sheetNameList

  initDirectories(sheetNameList)

  let componentIterate = 0
  for (let i = 0; i < sheetNameList.length; i++) {

    // On récupère les feuilles XLSX en entier au format JSON
    let JSONsheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[i]])

    // debug(chalk.red(sheetNameList[i]))

    // On itère sur chaque élément du fichier JSON
    JSONsheet.forEach(function (value, key) {

      //  Compatability with older file
      if ('composant' in value)
        value._component = value.composant
      if (value._component === 'introjld')
        value._component = 'intro-anchor'
      if (value._component === 'adapt-yny-sequenceImgScrolling')
        value._component = 'scrolling'

      switch (value._component) {
        case 'narrative':
          makeNarrative(value, sheetNameList[i], componentResult)
          break
        case 'multicam':
          makeMultiCam(value, sheetNameList[i], componentResult)
          break
        case 'media':
          makeMedia(value, sheetNameList[i], componentResult)
          break
        case 'mcq':
          makeMCQ(value, sheetNameList[i], componentResult)
          break
        case 'intro-anchor':
          makeIntroAnchor(value, sheetNameList[i], componentResult)
          break
        case 'scrolling':
          makeScrolling(value, sheetNameList[i], componentResult)
          break
        case 'graphic':
          makeGraphic(value, sheetNameList[i], componentResult)
          break
        case undefined:

          // TODO: Gérer les lignes vides et les composant qui ne sont pas encore été créer
          console.log('Error : Component ' + value._component + ' doesn\'t exist...')
          process.exit()
          break
        default:
          makeComponent(value, sheetNameList[i], componentResult)
      }

      blockList.push(componentResult[componentIterate]._parentId)
      componentIterate++
    })
  }

  fsExtra.writeJsonSync('result/componentResult.json', componentResult, 'utf-8', function (err) {
    console.log('err', err)
  })

  notifier.notify({
    title: 'Component Generator',
    message: 'Great job guy !',
  })

  // Ecriture du fichier block.json
  makeBlock(blockList)
}
