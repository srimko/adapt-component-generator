function cleanText (text) {

  if(text !== undefined) {
    let clearQuote = /"/g;
    text = text.replace(clearQuote,'\\"');
    let clearRetourLigneLOL = /\n/g;
    text = text.replace(clearRetourLigneLOL, '');
  } else {
    text = ''
  }

  return text
}

module.exports = cleanText
