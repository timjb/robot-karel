(function(exports) {

function getLineNumber(stack, n) {
  var fn
  if ($.browser.webkit)  fn = getLineNumber.webkit
  if ($.browser.mozilla) fn = getLineNumber.mozilla
  return fn ? fn(stack, n) : null
}

getLineNumber.webkit = function(stack, n) {
  var lines = stack.split("\n")
  var line = lines[1+n]
  var match = line.match(/:(\d+):\d+\)?$/)
  if (match) {
    return Number(match[1])
  } else {
    return null
  }
}

getLineNumber.mozilla = function(stack, n) {
  var lines = stack.split("\n")
  var line = lines[1+n]
  var match = line.match(/:(\d+)$/)
  if (match) {
    return Number(match[1])
  } else {
    return null
  }
}

getLineNumber.possible = function() {
  return $.browser.webkit || $.browser.mozilla
}

exports.getLineNumber = getLineNumber

})(exports || Karel.Helpers)
