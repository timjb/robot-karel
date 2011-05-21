(function(exports) {

var _ = require('underscore') || window._

var BUILT_IN_CMDS = (require('../models/robot') || Karel.Models).Robot.BUILT_IN_CMDS
var BUILT_IN = {}
BUILT_IN_CMDS.forEach(function (cmd) {
  BUILT_IN[cmd.toLowerCase()] = cmd
})


var n = exports


// Nodes
// =====

n.Block = function () {
  this.statements = []
  this.indent = true
}

n.Block.prototype.dontIndent = function () {
  this.indent = false
  return this
}

n.Block.prototype.addStatement = function (statement) {
  this.statements.push(statement)
  return this
}


// Definitions
// -----------

n.ConditionDefinition = function (id, block) {
  this.identifier = id
  this.block      = block
}

n.FunctionDefinition = function (id, formalParameters, block) {
  this.identifier       = id
  this.formalParameters = formalParameters
  this.block            = block
}


// Control Structures
// ------------------

n.If = function (condition, blockIf, blockElse) {
  this.condition = condition
  this.blockIf   = blockIf
  this.blockElse = blockElse
}

n.While = function (condition, block) {
  this.condition = condition
  this.block     = block
}

n.DoWhile = function (condition, block) {
  this.condition = condition
  this.block     = block
}

n.WhileTrue = function (block) {
  this.block = block
}

n.For = function (times, block) {
  this.times = times
  this.block = block
}


// Elementary
// ----------

n.Identifier = function (name) {
  this.name = name
}

// Turns an identifier into javaScriptCamelCase
n.Identifier.jsify = function (name) {
    parts = name
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .split(/[_-]/g)
      .filter(function (a) { return !!a }) // compact
    return parts[0].toLowerCase() + parts.slice(1).map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
}

n.Identifier.prototype.toString = function (negationPrefix) {
  var jsName = n.Identifier.jsify(this.name)
  if (jsName in BUILT_IN) {
    jsName = BUILT_IN[jsName]
  }
  var rest
  if (jsName.match(/^nicht/) && (rest = jsName.slice(5)) in BUILT_IN) {
    jsName = negationPrefix + BUILT_IN[rest]
  }
  return jsName
}

n.Bool = function (value) {
  this.value = value
}

n.Inversion = function (wrapped) {
  this.wrapped = wrapped
}

n.Import = function (identifier) {
  this.identifier = identifier
}

n.FunctionInvocation = function (id, parameters) {
  this.identifier = id
  this.parameters = parameters
}

n.FunctionInvocation.prototype.setInline = function () {
  this.inline = true
  return this
}

n.FormalParameters = function (identifier) {
  this.identifier = identifier
}

n.Parameters = function (argument) {
  this.argument = argument
}


})(exports || Karel.Parser)
