function setParentId (_id, type) {
  let _parentId = ''

  _parentId = _id.split('-')

  if (type === undefined) {
    _parentId[0] = 'b'
  } else {
    _parentId[0] = type
    _parentId.pop()
  }

  _parentId = _parentId.join('-')

  return _parentId
}

module.exports = setParentId
