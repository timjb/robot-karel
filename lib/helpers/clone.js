(function(exports) {

// deep clone
exports.clone = function(obj) {
  if (typeof obj.clone == 'function') {
    return obj.clone()
  } else if (obj instanceof Array) {
    var n = []
    for (var i = 0, l = obj.length; i < l; i++) {
      n[i] = clone(obj[i])
    }
    return n
  } else if (typeof obj == 'object') {
    var n = {}
    for (var key in obj) {
      n[key] = clone(obj[key])
    }
    return n
  } else {
    return obj
  }
}

})(exports || Karel.Helpers)
