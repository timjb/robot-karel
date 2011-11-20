(function(exports) {

var _ = require('underscore') || window._

var BUILT_IN_CMDS = (require('../models/robot') || Karel.Models).Robot.BUILT_IN_CMDS
var BUILT_IN = {}
BUILT_IN_CMDS.forEach(function (cmd) {
  BUILT_IN[cmd.toLowerCase()] = cmd
})


var n = exports


// Base-"class"
// ============

var Node = function () {}

Node.prototype.l = function (o) {
  this.location = o
  return this
}

var extendNode = function (constructor) {
  constructor.prototype = new Node()
  constructor.prototype.constructor = constructor
  return constructor
}


// Nodes
// =====

n.Block = extendNode(function () {
  this.statements     = [] // All statements
  this.definitions    = [] // All statements that are definitions
  this.nonDefinitions = [] // All statements except all definitions
  this.indent = true
})

n.Block.prototype.setToplevel = function () {
  this.isToplevel = true
  return this
}

n.Block.prototype.addStatement = function (statement) {
  var isDefinition = statement instanceof n.Definition
  this[isDefinition ? 'definitions' : 'nonDefinitions'].push(statement)
  this.statements.push(statement)
  return this
}


// Definitions (functions or conditions)
// -------------------------------------

n.Definition = extendNode(function (id, formalParameters, block, isCondition) {
  this.identifier       = id
  this.formalParameters = formalParameters
  this.block            = block
  this.isCondition      = isCondition
})


// Control Statements
// ------------------

n.If = extendNode(function (condition, ifBlock, elseBlock) {
  this.condition = condition
  this.ifBlock   = ifBlock
  this.elseBlock = elseBlock
})

n.While = extendNode(function (condition, block) {
  this.condition = condition
  this.block     = block
})

n.DoWhile = extendNode(function (condition, block) {
  this.condition = condition
  this.block     = block
})

n.WhileTrue = extendNode(function (block) {
  this.block = block
})

n.For = extendNode(function (times, block) {
  this.times = times
  this.block = block
})


// Other statements
// ----------------

n.FunctionInvocation = extendNode(function (id, parameters) {
  this.identifier = id
  this.parameters = parameters
})

n.FunctionInvocation.prototype.setInline = function () {
  this.inline = true
  return this
}

n.Import = extendNode(function (identifier) {
  this.identifier = identifier
})

n.BoolStatement = extendNode(function (value) {
  this.value = value
})


// Elementary
// ----------

n.Number = extendNode(function(value) {
  this.value = parseInt(value, 10)
})

n.Identifier = extendNode(function (name) {
  this.name = name
})

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

n.Inversion = extendNode(function (wrapped) {
  this.wrapped = wrapped
})

n.FormalParameters = extendNode(function (list) {
  this.list = list
})

n.Parameters = extendNode(function (list) {
  this.list = list
})


})(exports || Karel.Parser)
