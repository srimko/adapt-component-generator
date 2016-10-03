"use strict";

// Node package
const fs = require('fs')
const fs_extra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')
const debug = require('debug')('index')

const shell = require('shelljs')

const chalk = require('chalk');

// Makers
const makeBlock = require('./makers/block')
const makeComponent = require('./makers/component')
const makeMCQ = require('./makers/mcq')
const makeNarrative = require('./makers/narrative')
const makeMultiCam = require('./makers/multicam')
const makeGraphic = require('./makers/graphic')

// Tools
const checkFileExistsSync = require('./tools/checkFileExistsSync')
const initDirectories = require('./tools/initDirectories')

// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/component_list.xlsx'

// TODO : Install debug inside the project

if (!checkFileExistsSync(fileName)) {
  let fileInsideSrcDirectory = shell.ls('src')

  debug('File inside src folder :')
  _.each(fileInsideSrcDirectory, function(file) {
    debug(chalk.green(file))
  })

  console.log(chalk.red('File \'' +fileName + ' \'doesn\'t exist...'))
  console.log(chalk.white('Check inside your src folder if file exist or launch this command \'DEBUG=* node index.js\' to take a look indie src folder.'))

  // Exit script
  process.exit();
} else {
  const workbook = XLSX.readFile(fileName)
  const sheet_name_list = workbook.SheetNames

  // var component_result = ''
  var component_result = []

  let blockList = []

  // TODO : Faire une fonction d'initialisation
  // Initialisation du projet
  let directories = sheet_name_list

  initDirectories(sheet_name_list)

  for (let i = 0; i < sheet_name_list.length; i++) {

    // On récupère les feuilles XLSX en entier au format JSON
    let JSONsheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);

    // On itère sur chaque élément du fichier JSON
    let componentIterate = 0
    JSONsheet.forEach(function(value, key) {

      debug(value)

      switch (value._component) {
        case 'narrative':
          makeNarrative(value, sheet_name_list[i], component_result)
          break;
        case 'multicam':
          makeMultiCam(value, sheet_name_list[i], component_result)
          break;
        case 'mcq':
          makeMCQ(value, sheet_name_list[i], component_result)
          break;
        case 'graphic':
          makeGraphic(value, sheet_name_list[i], component_result)
          break;
        case undefined:
            // TODO: Gérer les lignes vides et les composant qui ne sont pas encore été créer
            console.log('Error : Composant ' + value.composant + ' doesn\'t exist...')
            process.exit()
          break;
        default:
          makeComponent(value, sheet_name_list[i], component_result)
      }

      blockList.push(component_result[componentIterate]._parentId)
      componentIterate++
    })
  }

  debug(component_result)
  fs_extra.writeJsonSync('result/component_result.json', component_result, 'utf-8', function (err) {
    console.log('err',err)
  })

  // Ecriture du fichier block.json
  debug(blockList)
  makeBlock(blockList)
}
