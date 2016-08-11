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

  if(value.body !== undefined){
    var re = /"/g;
    var str = value.body;
    value.body = str.replace(re, '\\"');
    console.log(value.body);
  }

  fs.writeFileSync('composant/' + value.composant  + '_' + value._id +  '.json', compiled(value) , {encoding: 'utf8'})
});
