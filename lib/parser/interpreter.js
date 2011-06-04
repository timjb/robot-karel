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

var log = function(klass) { /*console.log(klass + '#eval')*/ }

n.Block.prototype.eval = function (env) {
  log("Block")
  
  var definitions = []
  ,   other       = []
  
  var statements = this.statements
  for (var i = 0, l = statements.length; i < l; i++) {
    var statement = statements[i]
    ,   isDefinition = statement instanceof n.Definition
    ;(isDefinition ? definitions : other).push(statement)
  }
  
  for (var i = 0, l = definitions.length; i < l; i++) {
    definitions[i].eval(env)
  }
  
  for (var i = 0, l = other.length; i < l; i++) {
    other[i].eval(env)
  }
}

n.Definition.prototype.eval = function (topEnv) {
  log("Definition")
  var definition = this
  topEnv[this.identifier.name] = { apply: function (_rcvr, parameters) {
    var env = Object.create(topEnv)
    
    // Bind the formal parameter to it's value
    if (definition.formalParameters.identifier) {
      env[definition.formalParameters.identifier.name] = parameters[0]
    }
    
    env.__result__ = false
    definition.block.eval(env)
    return env.__result__
  } }
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
  var t = this.times.value
  while (t--) {
    this.block.eval(env)
  }
}

n.Identifier.prototype.eval = function (env) {
  log("Identifier")
  return env[this.name] || env[this.toString()]
}

n.Number.prototype.eval = function(_env) {
  return this.value
}

n.BoolStatement.prototype.eval = function (env) {
  log("BoolStatement")
  env.__result__ = this.value
}

n.Inversion.prototype.eval = function (env) {
  log("Inversion")
  return !this.wrapped.eval(env)
}

n.Import.prototype.eval = function () {
  log("Import")
  // TODO
}

n.FunctionInvocation.prototype.eval = function (env) {
  log("FunctionInvocation")
  return this.identifier.eval(env).apply(null, this.parameters.eval(env))
}

n.Parameters.prototype.eval = function (env) {
  log("Parameters")
  if (!this.argument) return []
  return [this.argument.eval(env)]
}


})(exports || Karel.Parser)
