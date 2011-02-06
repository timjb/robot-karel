function getLineNumber(stack, n) {
  var self = getLineNumber
  if (self.hasOwnProperty(browser)) {
    return self[browser](stack, n)
  } else {
    return null
  }
}

getLineNumber.chrome = function(stack, n) {
  var lines = stack.split("\n")
  var line = lines[1+n]
  var match = line.match(/:(\d+):\d+\)?$/)
  if (match) {
    return Number(match[1])
  } else {
    return null
  }
}

getLineNumber.firefox = function(stack, n) {
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
  return this.hasOwnProperty(browser)
}
