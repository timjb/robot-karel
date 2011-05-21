(function(exports) {

var _ = require('underscore') || window._

var n      = require('./nodes')   || Karel.Parser
,   parser = (require('./parser') || { parser: karol }).parser

parser.yy = n

exports.eval = function (code, globals) {
  return parser.parse(code.toLowerCase()).eval(globals || {})
}


// Nodes
// -----

var log = function(klass) { console.log(klass + '#eval') }

n.Block.prototype.eval = function (env) {
  log("Block")
  var statements = this.statements
  for (var i = 0, l = statements.length; i < l; i++) {
    statements[i].eval(env)
  }
}

n.ConditionDefinition.prototype.eval = function () {
  log("ConditionDefinition")
  // TODO
}

n.FunctionDefinition.prototype.eval = function (env) {
  log("FunctionDefinition")
  env[this.identifier.name] = this
  this.env = env
}

n.FunctionDefinition.prototype.apply = function (_rcvr, parameters) {
  var env = Object.create(this.env)
  
  // Bind the formal parameter to it's value
  if (this.formalParameters.identifier) {
    env[this.formalParameters.identifier.name] = parameters[0]
  }
  
  console.log(env)
  
  this.block.eval(env)
}

n.If.prototype.eval = function (env) {
  log("If")
  if (this.condition.eval(env)) {
    return this.ifBlock.eval(env)
  } else if (this.elseBlock) {
    return this.elseBlock.eval(env)
  }
}

n.While.prototype.eval = function (env) {
  log("While")
  while (this.condition.eval(env)) {
    this.block.eval(env)
  }
}

n.DoWhile.prototype.eval = function (env) {
  log("DoWhile")
  do {
    this.block.eval(env)
  } while (this.condition.eval(env))
}

n.WhileTrue.prototype.eval = function (env) {
  log("WhileTrue")
  while (true) {
    this.block.eval(env)
  }
}

n.For.prototype.eval = function (env) {
  log("For")
  var t = this.times
  while (t--) {
    this.block.eval(env)
  }
}

n.Identifier.prototype.eval = function (env) {
  log("Identifier")
  return env[this.name]
}

// TODO: this is really a statement
n.Bool.prototype.eval = function () {
  // TODO
}

n.Inversion.prototype.eval = function (env) {
  return !this.wrapped.eval(env)
}

n.Import.prototype.eval = function () {
  // TODO
}

n.FunctionInvocation.prototype.eval = function (env) {
  log("FunctionInvocation")
  return this.identifier.eval(env).apply(null, this.parameters.eval(env))
}

n.Parameters.prototype.eval = function (env) {
  log("Parameters")
  if (!this.argument) return []
  return [ this.argument.eval ? this.argument.eval(env) : this.argument ]
}


})(exports || Karel.Parser)
