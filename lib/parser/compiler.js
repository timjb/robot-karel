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
    if (this.indent) {
      str = str.split('\n')
        .map(function (line) { return TAB + line })
        .join('\n')
    }
    return str
}

n.ConditionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + TAB + 'var result;\n'
       + this.block.compile() + '\n'
       + TAB + 'return result;\n'
       + '}'
}

n.FunctionDefinition.prototype.compile = function () {
  return 'function ' + this.identifier.compile() + '() {\n'
       + this.block.compile() + '\n'
       + '}'
}

n.If.prototype.compile = function () {
  return 'if (' + this.condition.compile() + ') {\n'
       + this.blockIf.compile() + '\n'
       + '}'
       + (this.blockElse ? ' else {\n' + this.blockElse.compile() + '\n}' : '')
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
  return 'for (var '+v+' = 0; ' +v+' < '+this.times+'; '+v+'++) {\n'
       + this.block.compile() + '\n'
       + '}'
}

n.Identifier.prototype.compile = function () {
  return this.toString('!')
}

// TODO: this is really a statement
n.Bool.prototype.compile = function () {
  return 'result = ' + this.value + ';'
}

n.Inversion.prototype.compile = function () {
  return '!' + this.wrapped.compile()
}

n.Import.prototype.compile = function () {
  return 'require(\'' + this.identifier.compile() + '\');'
}

n.FunctionInvocation.prototype.compile = function () {
  return this.identifier.compile() + this.argumentList.compile()
       + (this.inline ? '' : ';')
}

n.ArgumentList.prototype.compile = function () {
  return '(' + (this.argument ? this.argument : '') + ')'
}


})(exports || Karel.Parser)
