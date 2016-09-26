"use strict";

// Node package
const fs = require('fs')
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

// Tools
const checkFileExistsSync = require('./tools/checkFileExistsSync')
const initDirectories = require('./tools/initDirectories')

// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/component_list.xlsx'

// TODO : Install debug inside the project

if(!checkFileExistsSync(fileName)) {
  let fileInsideSrcDirectory = shell.ls('src')

  debug('File inside src folder :')
  _.each(fileInsideSrcDirectory, function(file) {
    debug(chalk.green(file))
  })

  console.log(chalk.red('File \'' +fileName + ' \'doesn\'t exist...'))
  console.log(chalk.white('Check inside your src folder if file exist or launch this command \'DEBUG=* node index.js\' to take a look indie src folder.'))

  // Exit script
  process.exit();
}
else {
  const workbook = XLSX.readFile(fileName)
  const sheet_name_list = workbook.SheetNames

  // Pour changer de page il faut changer l'indice dans le sheet_name_list ex: 0 pour la page 1, 2 pour la page 3 etc
  // const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])

  var component_result = ''

  let blockList = []

  // TODO : Faire une fonction d'initialisation
  // Initialisation du projet
  let directories = sheet_name_list

  initDirectories(sheet_name_list)


  for(let i = 0; i < sheet_name_list.length; i++) {

    // On récupère les feuilles XLSX en entier au format JSON
    let JSONsheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);

    // On itère sur chaque élément du fichier JSON
    JSONsheet.forEach(function(value, key) {

      switch (value.composant) {
        case 'narrative':
          makeNarrative(value, sheet_name_list[i], component_result)
          break;
        case 'multicam':
          makeMultiCam(value, sheet_name_list[i], component_result)
          break;
        case 'mcq':
          makeMCQ(value, sheet_name_list[i], component_result)
          break;
        case undefined:
            // TODO: Gérer les lignes vides et les composant qui ne sont pas encore été créer
            console.log('Error : Composant ' + value.composant + ' doesn\'t exist...')
            // process.exit()
          break;
        default:
          makeComponent(value, sheet_name_list[i], component_result)
      }

      blockList.push(value._parentId)
    })
  }

  // TODO : Remove last comma in component_result string

  // Ecriture du fichier component_result
  fs.writeFileSync('result/component_result.json',component_result , {encoding: 'utf8'})

  // Ecriture du fichier block.json
  makeBlock(blockList)

}
