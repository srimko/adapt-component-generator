const fs = require('fs')
const _ = require('lodash')
const XLSX = require('xlsx')

const fileName = process.argv[2] || 'src/test.xlsx'

const workbook = XLSX.readFile('src/test.xlsx')

const sheet_name_list = workbook.SheetNames


const firstJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])



firstJson.forEach(function(value, key) {

  const file = fs.readFileSync('model/' + value.composant + '.json', 'utf-8')

  const compiled = _.template(file)

  // console.log(value._id);
  // console.log(value.body);
  // console.log(value.pathvideo);

  if(value.body !== undefined) {
    var re = /"/g;
    var str = value.body;
    value.body = str.replace(re, '\\"');
  }
  else {
    value.body = ''
  }

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

  

  fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
});
