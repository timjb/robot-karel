var path   = require('path')
,   fs     = require('fs')
,   assert = require('assert')

var World       = require('../lib/models/world').World
,   Project     = require('../lib/models/project').Project
,   compiler    = require('../lib/parser/compiler')
,   interpreter = require('../lib/parser/interpreter')

var EXAMPLES_DIR   = path.join(__dirname, '../examples/old')
,   TRANSLATED_DIR = path.join(__dirname, '../examples/old_in_js')

var extKdp = /\.kdp$/

function test (kdpPath, jsPath, kdwPath) {
  var kdpCode = fs.readFileSync(kdpPath, 'utf-8')
  ,   jsCode  = fs.readFileSync(jsPath,  'utf-8')
  ,   kdwCode = fs.readFileSync(kdwPath, 'utf-8')
  
  var worldC = World.fromString(kdwCode)
  ,   worldI = World.fromString(kdwCode)
  
  var projectC = new Project({ language: 'javascript', code: jsCode,  world: worldC })
  var projectI = new Project({ language: 'karol',      code: kdpCode, world: worldI })
  
  
  try { projectC.run() } catch (exc) {
    console.log("Exception while running compiled JavaScript"); throw exc
  }
  global.setTimeout = function(cb) { cb() } // make execution of karol synchronous
  try { projectI.run() } catch (exc) {
    console.log("Exception while eval'ing Karol"); throw exc
  }
  
  assert.ok(worldC.equals(worldI))
}

fs.readdirSync(EXAMPLES_DIR)
  .filter(function (filename) { return filename.match(extKdp) })
  // Exclude Sortieren.kdp since it uses imports
  .filter(function (filename) { return !filename.match(/Sortieren/) })
  .sort()
  .forEach(function (kdpFilename) {
    var kdpPath = EXAMPLES_DIR + '/' + kdpFilename
    ,   jsPath  = TRANSLATED_DIR + '/' + kdpFilename.replace(extKdp, '.js')
    ,   kdwPath = kdpPath.replace(extKdp, '.kdw')
    if (path.existsSync(jsPath) && path.existsSync(kdwPath)) {
      exports['test_' + kdpFilename.replace(extKdp, '')] = function () {
        test(kdpPath, jsPath, kdwPath)
      }
    }
  })
