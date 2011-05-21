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

n.ConditionDefinition = function (id, formalParameters, block) {
  this.identifier       = id
  this.formalParameters = formalParameters
  this.block            = block
}

n.FunctionDefinition = function (id, formalParameters, block) {
  this.identifier       = id
  this.formalParameters = formalParameters
  this.block            = block
}


// Control Statements
// ------------------

n.If = function (condition, ifBlock, elseBlock) {
  this.condition = condition
  this.ifBlock   = ifBlock
  this.elseBlock = elseBlock
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


// Other statements
// ----------------

n.FunctionInvocation = function (id, parameters) {
  this.identifier = id
  this.parameters = parameters
}

n.FunctionInvocation.prototype.setInline = function () {
  this.inline = true
  return this
}

n.Import = function (identifier) {
  this.identifier = identifier
}

n.BoolStatement = function (value) {
  this.value = value
}


// Elementary
// ----------

n.Number = function(value) {
  this.value = parseInt(value, 10)
}

n.Identifier = function (name) {
  this.name = name
}

// Turns an identifier into javaScriptCamelCase
n.Identifier.prototype.jsify = function () {
  parts = this.name
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

n.Identifier.prototype.toString = function () {
  var jsName = this.jsify()
  return jsName in BUILT_IN ? BUILT_IN[jsName] : jsName
}

n.Inversion = function (wrapped) {
  this.wrapped = wrapped
}

n.FormalParameters = function (identifier) {
  this.identifier = identifier
}

n.Parameters = function (argument) {
  this.argument = argument
}


})(exports || Karel.Parser)
