var BUILT_IN_CMDS = require('../src/models/robot').BUILT_IN_CMDS
var BUILT_IN = {}
BUILT_IN_CMDS.forEach(function (cmd) {
  BUILT_IN[cmd.toLowerCase()] = cmd
})


exports.reset = function () {
  For.currentCharCode = 'i'.charCodeAt(0)
}


// Nodes

var Block = exports.Block = function () {
  this.statements = []
  this.indent = true
}

Block.prototype.dontIndent = function () {
  this.indent = false
  return this
}

Block.prototype.addStatement = function (statement) {
  this.statements.push(statement)
  return this
}

Block.prototype.compile = function () {
  var str = this.statements
      .map(function (statement) { return statement.compile() })
      .join('\n')
    if (this.indent) {
      str = str.split('\n')
        .map(function (line) { return TAB + line })
        .join('\n')
    }
    return str
}


// Definitions

var ConditionDefinition = exports.ConditionDefinition = function (id, block) {
  this.identifier = id
  this.block      = block
}

ConditionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + TAB + 'var result;\n'
       + this.block.compile() + '\n'
       + TAB + 'return result;\n'
       + '}'
}


var FunctionDefinition = exports.FunctionDefinition = function (id, block) {
  this.identifier = id
  this.block      = block
}

FunctionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + this.block.compile() + '\n'
       + '}'
}


// Control Structures

var If = exports.If = function (condition, blockIf, blockElse) {
  this.condition = condition
  this.blockIf   = blockIf
  this.blockElse = blockElse
}

If.prototype.compile = function () {
  return 'if (' + this.condition.compile() + ') {\n'
       + this.blockIf.compile() + '\n'
       + '}'
       + (this.blockElse ? ' else {\n' + this.blockElse.compile() + '\n}' : '')
}


var While = exports.While = function (condition, block) {
  this.condition = condition
  this.block     = block
}

While.prototype.compile = function () {
  return 'while (' + this.condition.compile() + ') {\n'
       + this.block.compile() + '\n'
       + '}'
}


var DoWhile = exports.DoWhile = function (condition, block) {
  this.condition = condition
  this.block     = block
}

DoWhile.prototype.compile = function () {
  return 'do {\n'
       + this.block.compile() + '\n'
       + '} while (' + this.condition.compile() + ');'
}


var WhileTrue = exports.WhileTrue = function (block) {
  this.block = block
}

WhileTrue.prototype.compile = function () {
  return 'while (true) {\n'
       + this.block.compile() + '\n'
       + '}'
}


var For = exports.For = function (times, block) {
  this.times = times
  this.block = block
}

For.prototype.compile = function () {
  var v = String.fromCharCode(For.currentCharCode)
  For.currentCharCode++
  return 'for (var '+v+' = 0; ' +v+' < '+this.times+'; '+v+'++) {\n'
       + this.block.compile() + '\n'
       + '}'
}


// Elementary

var Identifier = exports.Identifier = function (name) {
  this.name = name
}

// Turns an identifier into javaScriptCamelCase
Identifier.jsify = function (name) {
    parts = name
      .split(/[_-]/g)
      .filter(function (a) { return !!a }) // compact
    return parts[0].toLowerCase() + parts.slice(1).map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
}

Identifier.prototype.compile = function () {
  var jsName = Identifier.jsify(this.name)
  if (jsName in BUILT_IN) {
    jsName = BUILT_IN[jsName]
  }
  var rest
  if (jsName.match(/^nicht/) && (rest = jsName.slice(5)) in BUILT_IN) {
    jsName = '!' + BUILT_IN[rest]
  }
  return jsName
}


var Bool = exports.Bool = function (value) {
  this.value = value
}

// TODO: this is really a statement
Bool.prototype.compile = function () {
  return 'result = ' + this.value + ';'
}


var Inversion = exports.Inversion = function (wrapped) {
  this.wrapped = wrapped
}

Inversion.prototype.compile = function () {
  return '!' + this.wrapped.compile()
}


var Import = exports.Import = function (identifier) {
  this.identifier = identifier
}

Import.prototype.compile = function () {
  return 'require(\'' + this.identifier.compile() + '\');'
}


var FunctionInvocation = exports.FunctionInvocation = function (id, argumentList) {
  this.identifier = id
  this.argumentList = argumentList
}

FunctionInvocation.prototype.setInline = function () {
  this.inline = true
  return this
}

FunctionInvocation.prototype.compile = function () {
  return this.identifier.compile() + this.argumentList.compile()
       + (this.inline ? '' : ';')
}

var ArgumentList = exports.ArgumentList = function (argument) {
  this.argument = argument
}

ArgumentList.prototype.compile = function () {
  return '(' + (this.argument ? this.argument : '') + ')'
}

var TAB = '  '
