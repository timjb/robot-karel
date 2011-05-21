var path   = require('path')
,   fs     = require('fs')
,   assert = require('assert')
,   karol  = require('../../lib/parser/compiler')

var EXAMPLES_DIR = __dirname + '/examples'

var extKdp = /\.kdp$/

function test (kdpPath, jsPath) {
  var kdpCode    = fs.readFileSync(kdpPath, 'utf-8')
  ,   jsExpected = fs.readFileSync(jsPath, 'utf-8').trim()
  ,   jsCompiled = karol.compile(kdpCode)
  try {
    assert.equal(jsCompiled, jsExpected, kdpPath)
  } catch (exc) {
    console.log("Expected:\n\""+jsExpected+"\" ("+jsExpected.length+")")
    console.log("Got:\n\""     +jsCompiled+"\" ("+jsCompiled.length+")")
    throw exc
  }
}

fs.readdirSync(EXAMPLES_DIR)
  .filter(function (filename) { return filename.match(extKdp) })
  .sort()
  .forEach(function (kdpFilename) {
    var kdpPath = EXAMPLES_DIR + '/' + kdpFilename
    ,   jsPath  = kdpPath.replace(extKdp, '.js')
    if (path.existsSync(jsPath)) {
      exports['test_' + kdpFilename.replace(extKdp, '')] = function () {
        test(kdpPath, jsPath)
      }
    }
  })
