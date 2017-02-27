/*
  Le test doit à l'aide d'un fichier xlsx de base tester tous les cas possible d'erreur.
  - Si le fichier envoyer en parametre existe
  - Si le fichier est un fichier xlsx valide
  - Vérifier si le fichier n'est pas vide

  - Si le composant n'existe pas vérifier le comportement

*/

const testName = 'Tester maker'

const _ = require('lodash')

const fs = require('fs')
const fsExtra = require('fs-extra')

const jsonFormat = require('json-format')
const debug = require('debug')

debug('testing', testName)
