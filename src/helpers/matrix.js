(function() {

function matrix(x, y, fn) {
  var result = []
  for (var i = 0; i < x; i++) {
    var row = []
    for (var j = 0; j < y; j++) {
      row.push(fn())
    }
    result.push(row)
  }
  return result
}

matrix.path = 'helpers/matrix'
module.exports = matrix

})()
