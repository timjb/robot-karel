(function(exports) {

var fs       = require('fs')
,   parser   = (require('./parser') || { parser: karol }).parser
,   nodes    = require('./nodes') || Karel.Compiler

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

var parse = exports.parse = function(code) {
  nodes.reset()
  code = stripComments(replaceUmlaute(code.toLowerCase()))
  return parser.parse(code)
}

var compile = exports.compile = function(code) {
  return parse(code).compile()
}

parser.yy = nodes

})(exports || Karel.Compiler)
