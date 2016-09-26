"use strict";

// Node package
const fs = require('fs')
const _ = require('lodash')
const XLSX = require('xlsx')
const shell = require('shelljs')

// Makers
const makeBlock = require('./makers/block')
const makeComponent = require('./makers/component')
const makeMCQ = require('./makers/mcq')
const makeNarrative = require('./makers/narrative')
const makeMultiCam = require('./makers/multicam')

// Tools
const checkFileExistsSync = require('./tools/checkFileExistsSync')

// TODO : Gérer les arguments
const fileName = process.argv[2] || 'src/Liste_composant.xlsx'

// TODO : Install debug inside the project

if(checkFileExistsSync(fileName)) {
  const workbook = XLSX.readFile(fileName)
  const sheet_name_list = workbook.SheetNames

  // Pour changer de page il faut changer l'indice dans le sheet_name_list ex: 0 pour la page 1, 2 pour la page 3 etc
  // const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])

  var component_result = ''

  let blockList = []

  // TODO : Faire une fonction d'initialisation
  // Initialisation du projet
  let directories = sheet_name_list
  shell.mkdir('-p','result')
  _.forEach(sheet_name_list, function(value, key) {
    shell.mkdir('-p','result/' + value)
  })

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
else {
  // Exit script
  console.log('File \'' +fileName + ' \'doesn\'t exist...');
  process.exit();
}
