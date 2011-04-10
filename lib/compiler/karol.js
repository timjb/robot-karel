var fs       = require('fs')
,   parser   = require('./parser').parser
,   nodes    = require('./nodes')
,   COMMANDS = require('../models/robot').COMMANDS

if (require.extensions) {
  require.extensions['.kdp'] = function (module, filename) {
    var content = compile(fs.readFileSync(filename, 'utf8'))
    module._compile(content, filename)
  }
}

var comment = /(?:\{[^\}]*\}|\/{2}[^\n]*\n)/g

function stripComments (str) {
  return str.replace(comment, '')
}

function replaceUmlaute (str) {
  return str
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
}

var compile = exports.compile = function (code) {
  nodes.reset()
  var code = stripComments(replaceUmlaute(code.toLowerCase()))
  ,   tree = parser.parse(code)
  //console.log(require('util').inspect(tree, false, 5))
  var js = tree.compile()
  return js
}

parser.yy = nodes
