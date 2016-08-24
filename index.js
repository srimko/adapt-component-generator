const fs = require('fs')
const fs_extra = require('fs-extra')
const _ = require('lodash')
const XLSX = require('xlsx')

const fileName = process.argv[2] || 'src/Liste_composant.xlsx'

const workbook = XLSX.readFile('src/Liste_composant.xlsx')

const sheet_name_list = workbook.SheetNames

// TODO : Faire la fonction qui génère le block.json en même temps que component
// TODO : Faire une fonction qui permet de générer les composants et le component_result dans un dossier pour chaque page.

// Pour changer de page il faut changer l'indice dans le sheet_name_list ex: 0 pour la page 1, 2 pour la page 3
const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]])


var component_result = ''

firstJson.forEach(function(value, key) {

  if(value.composant !== 'narrative') {

    if( value.composant !== undefined) {

      var file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')
      var compiled = _.template(file)

      // Ajout du parentId il est calculer grace à l'id du composant
      _parentId = value._id.split('-')
      // 'b' est pour block
      _parentId[0] = 'b'
      _parentId = _parentId.join('-')
      value._parentId = _parentId

      if(value.body !== undefined) {
        var re = /"/g;
        var str = value.body;
        value.body = str.replace(re, '\\"');
      }
      else {
        value.body = ''
      }

      // TODO : remplacer les " par \" dans les titres dans vidéo ou dans  n'importe quel texte

      // TODO : Vérifier les saut de ligne et les enlever


      // TODO : Trouver une meilleur façon de gérer les erreurs
      value.pathvideo !== undefined  ? (value.pathvideo=value.pathvideo) : (value.pathvideo = '')

      value.pathvideo !== undefined  ? (value.pathvideo=value.pathvideo) : (value.pathvideo = '')
      value.media1_title  !== undefined ? (value.media1_title=value.media1_title) : (value.media1_title = '')
      value.media1_source  !== undefined ? (value.media1_source=value.media1_source) : (value.media1_source = '')
      value.media1_type  !== undefined ? (value.media1_type=value.media1_type) : (value.media1_type = '')

      value.media2_title  !== undefined ? (value.media2_title=value.media2_title) : (value.media2_title = '')
      value.media2_source  !== undefined ? (value.media2_source=value.media2_source) : (value.media2_source = '')
      value.media2_type  !== undefined ? (value.media2_type=value.media2_type) : (value.media2_type = '')

      value.media3_title  !== undefined ? (value.media3_title=value.media3_title) : (value.media3_title = '')
      value.media3_source  !== undefined ? (value.media3_source=value.media3_source) : (value.media3_source = '')
      value.media3_type  !== undefined ? (value.media3_type=value.media3_type) : (value.media3_type = '')

      value.media4_title  !== undefined ? (value.media4_title=value.media4_title) : (value.media4_title = '')
      value.media4_source  !== undefined ? (value.media4_source=value.media4_source) : (value.media4_source = '')
      value.media4_type  !== undefined ? (value.media4_type=value.media4_type) : (value.media4_type = '')

      component_result += compiled(value)

      // On insère les valeurs et on écrit le fichier
      fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
    }
  }
  else {
    // TODO : Etendre le systeme pour le model media
    var file = fs_extra.readJsonSync('model/' + value.composant + '.json', 'utf-8')

    // On reset les variable
    tempItems = []
    file._items = []


    // Le modèle des information du narrative
    // {
    //    "title": "Narrative stage 1 title",
    //    "body": "This is display text 1. If viewing on desktop or tablet, this text will appear to the right of the image. On mobile, you’ll need to select the plus icon to reveal this text.",
    //    "_graphic": {
    //        "src": "course/en/images/single_width.jpg",
    //        "alt": "First graphic"
    //    },
    //    "strapline": "Here is the first..."
    // }


    // On récupère les options pour créer les slide du narrative
    nbrItems = value.items
    itemTitle = value.item_title.split(';')
    itemBody = value.item_body.split(';')
    itemImage = value.item_image.split(';')

    for(var i = 0; i < nbrItems; i++ ) {

      // On réinitalise le modèle à une valeur par défaut
      // TODO : Clean la valeur par défaut
      modelItem = {"title":"Narrative stage 1 title","body":"This is display text 1. If viewing on desktop or tablet, this text will appear to the right of the image. On mobile, you’ll need to select the plus icon to reveal this text.","_graphic":{"src":"course/en/images/single_width.jpg","alt":"First graphic"},"strapline":"Here is the first..."};
      modelItem.title = itemTitle[i]
      modelItem.body = itemBody[i]
      modelItem._graphic.src = value._parentId + '/' + itemImage[i]
      modelItem.strapline = itemTitle[i]

      // On insère dans l'objet temporaire
      tempItems.push(modelItem)

    }

    // Les slides sont maintenant ajouter dans l'objet final
    file._items = tempItems

    // On passe d'un JSON à un string pour pouvoir insérer les données dans le template grace à lodash
    file = JSON.stringify(file)
    compiled = _.template(file)

    if(value.body !== undefined) {
      var re = /"/g;
      var str = value.body;
      value.body = str.replace(re, '\\"');
    }
    else {
      value.body = ''
    }

    // TODO : remplacer les " par \" dans les titres dans vidéo ou dans  n'importe quel texte

    // TODO : Vérifier les saut de ligne et les enlever


    // TODO : Trouver une meilleur façon de gérer les erreurs
    value.pathvideo !== undefined  ? (value.pathvideo=value.pathvideo) : (value.pathvideo = '')

    value.pathvideo !== undefined  ? (value.pathvideo=value.pathvideo) : (value.pathvideo = '')
    value.media1_title  !== undefined ? (value.media1_title=value.media1_title) : (value.media1_title = '')
    value.media1_source  !== undefined ? (value.media1_source=value.media1_source) : (value.media1_source = '')
    value.media1_type  !== undefined ? (value.media1_type=value.media1_type) : (value.media1_type = '')

    value.media2_title  !== undefined ? (value.media2_title=value.media2_title) : (value.media2_title = '')
    value.media2_source  !== undefined ? (value.media2_source=value.media2_source) : (value.media2_source = '')
    value.media2_type  !== undefined ? (value.media2_type=value.media2_type) : (value.media2_type = '')

    value.media3_title  !== undefined ? (value.media3_title=value.media3_title) : (value.media3_title = '')
    value.media3_source  !== undefined ? (value.media3_source=value.media3_source) : (value.media3_source = '')
    value.media3_type  !== undefined ? (value.media3_type=value.media3_type) : (value.media3_type = '')

    value.media4_title  !== undefined ? (value.media4_title=value.media4_title) : (value.media4_title = '')
    value.media4_source  !== undefined ? (value.media4_source=value.media4_source) : (value.media4_source = '')
    value.media4_type  !== undefined ? (value.media4_type=value.media4_type) : (value.media4_type = '')

    // TODO : Ajouter un JSON beautifier pour narrative
    component_result += compiled(value)

    fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
  }

});

fs.writeFileSync('composant/component_result.json', component_result , {encoding: 'utf8'})
