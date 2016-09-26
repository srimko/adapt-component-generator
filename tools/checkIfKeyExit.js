function checkIfKeyExit (value) {

  let objectKeys = [
    'pathvideo',
    'pathimage',
    'poster',
    'mp4',
    'itemBody',
    'displayTitle',
    'media1_title',
    'image_root',
    'media1_source',
    'media1_type',
    'media2_title',
    'media2_source',
    'media2_type',
    'media3_title',
    'media3_source',
    'media3_type',
    'media4_title',
    'media4_source',
    'media4_type']
  for(let i = 0; i < objectKeys.length; i++) {
    if(value[objectKeys[i]] === undefined ) {
      value[objectKeys[i]] !== undefined  ? (value[objectKeys[i]]=value[objectKeys[i]]) : (value[objectKeys[i]] = '')
    }
    else {
    }
  }
}


module.exports = checkIfKeyExit
