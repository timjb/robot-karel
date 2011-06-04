(function(exports) {

var n      = require('./nodes')   || Karel.Parser
,   parser = (require('./parser') || { parser: karol }).parser

parser.yy = n

exports.compile = function (code) {
  n.For.reset()
  return parser.parse(code.toLowerCase()).compile()
}


// Node.js
// -------

// Make .kdp files require()-able
if (require.extensions) {
  var fs = require('fs')
  require.extensions['.kdp'] = function (module, filename) {
    var content = exports.compile(fs.readFileSync(filename, 'utf-8'))
    module._compile(content, filename)
  }
}


// Nodes
// -----

var TAB = '  '

n.Block.prototype.compile = function () {
  var str = this.statements
      .map(function (statement) { return statement.compile() })
      .join('\n')
    if (!this.isToplevel) {
      str = str.split('\n')
        .map(function (line) { return TAB + line })
        .join('\n')
    }
    return str
}

n.Definition.prototype.compile = function () {
  return 'function '+this.identifier.compile()+this.formalParameters.compile()+' {\n'
       + (this.isCondition ? TAB + 'var result;\n' : '')
       + this.block.compile() + '\n'
       + (this.isCondition ? TAB + 'return result;\n' : '')
       + '}'
}

n.If.prototype.compile = function () {
  return 'if (' + this.condition.compile() + ') {\n'
       + this.ifBlock.compile() + '\n'
       + '}'
       + (this.elseBlock ? ' else {\n' + this.elseBlock.compile() + '\n}' : '')
}

n.While.prototype.compile = function () {
  return 'while (' + this.condition.compile() + ') {\n'
       + this.block.compile() + '\n'
       + '}'
}

n.DoWhile.prototype.compile = function () {
  return 'do {\n'
       + this.block.compile() + '\n'
       + '} while (' + this.condition.compile() + ');'
}

n.WhileTrue.prototype.compile = function () {
  return 'while (true) {\n'
       + this.block.compile() + '\n'
       + '}'
}

n.For.reset = function() {
  n.For.currentCharCode = 'i'.charCodeAt(0)
}

n.For.prototype.compile = function () {
  var v = String.fromCharCode(n.For.currentCharCode)
  n.For.currentCharCode++
  return 'for (var '+v+' = 0; ' +v+' < '+this.times.compile()+'; '+v+'++) {\n'
       + this.block.compile() + '\n'
       + '}'
}

n.Number.prototype.compile = function() {
  return this.value.toString(10)
}

n.Identifier.prototype.compile = function () {
  return this.toString('!')
}

n.BoolStatement.prototype.compile = function () {
  return 'result = ' + this.value + ';'
}

n.Inversion.prototype.compile = function () {
  return '!' + this.wrapped.compile()
}

n.Import.prototype.compile = function () {
  return 'require(\'' + this.identifier.compile() + '\');'
}

n.FunctionInvocation.prototype.compile = function () {
  return this.identifier.compile() + this.parameters.compile()
       + (this.inline ? '' : ';')
}

n.FormalParameters.prototype.compile = function () {
  return '(' + (this.identifier ? this.identifier.compile() : '') + ')'
}

n.Parameters.prototype.compile = function () {
  return '(' + (this.argument ? this.argument.compile() : '') + ')'
}


})(exports || Karel.Parser)
