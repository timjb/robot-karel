function clone(obj) {
  if (obj instanceof Array) {
    var n = []
    for (var i = 0, l = obj.length; i < l; i++) {
      n[i] = clone(obj[i])
    }
    return n
  } else {
    if (typeof obj.clone == 'function') {
      obj = obj.clone()
    }
    return obj
  }
}
