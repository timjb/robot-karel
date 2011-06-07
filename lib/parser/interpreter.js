(function(exports) {

var _ = require('underscore') || window._

var n      = require('./nodes')   || Karel.Parser
,   parser = (require('./parser') || { parser: karol }).parser

parser.yy = n

exports.eval = function (code, globals) {
  var ast = parser.parse(code.toLowerCase())
  var result = null
  ast.eval(globals || {}, function(val) { result = val })
  return result
}

var log = function(klass) { /*console.log(klass + '#eval')*/ }


// Env(ironment)
// =============

//var emptyEnv = {}
var extendEnv = function(env) {
  return Object.create(env)
}
var setEnv = function(env, k, v) {
  env[k] = v
}


// Eval
// ====

// Callback-passing style (async)
// ------------------------------

n.Block.prototype.eval = function (env, cb) {
  log("Block")
  var self = this
  
  var definitions = this.definitions
  for (var i = 0, l = definitions.length; i < l; i++) {
    definitions[i].eval(env)
  }
  
  var i = 0
  var next = function() {
    var statement = self.nonDefinitions[i]
    i += 1
    if (statement) statement.eval(env, next)
    else           cb()
  }
  
  next()
}

n.If.prototype.eval = function (env, cb) {
  log("If")
  var self = this
  
  self.condition.eval(env, function(val) {
    if (val) {
      self.ifBlock.eval(env, cb)
    } else if (self.elseBlock) {
      self.elseBlock.eval(env, cb)
    } else {
      cb()
    }
  })
}

n.While.prototype.eval = function (env, cb) {
  log("While")
  var self = this
  
  self.condition.eval(env, function(val) {
    if (val) {
      self.block.eval(env, function() {
        self.eval(env, cb) // recurse
      })
    } else {
      cb()
    }
  })
}

n.DoWhile.prototype.eval = function (env, cb) {
  log("DoWhile")
  var self = this
  
  self.block.eval(env, function() {
    self.condition.eval(env, function(val) {
      if (val) {
        self.eval(env, cb) // recurse
      } else {
        cb()
      }
    })
  })
}

n.WhileTrue.prototype.eval = function (env, _cb) {
  log("WhileTrue")
  var self = this
  
  self.block.eval(env, function() {
    self.eval(env, _cb) // recurse
  })
}

n.For.prototype.eval = function (env, cb) {
  log("For")
  var self = this
  
  var t = self.times.value
  var iter = function() {
    if (t--) {
      self.block.eval(env, iter)
    } else {
      cb()
    }
  }
  
  iter()
}

n.BoolStatement.prototype.eval = function (env, cb) {
  log("BoolStatement")
  env.__result__ = this.value
  cb()
}

n.Inversion.prototype.eval = function (env, cb) {
  log("Inversion")
  this.wrapped.eval(env, function(val) { cb(!val) })
}

n.FunctionInvocation.prototype.eval = function (env, cb) {
  log("FunctionInvocation")
  // EVAL -> APPLY
  apply(this.identifier.eval(env), this.parameters.eval(env), cb)
}


// Blocking style (sync)
// ---------------------

n.Definition.prototype.eval = function (env) {
  log("Definition")
  var self = this
  
  setEnv(env, self.identifier.name, { env: env, definition: self })
}

n.Identifier.prototype.eval = function (env) {
  log("Identifier")
  return env[this.name] || env[this.toString()]
}

n.Number.prototype.eval = function(_env) {
  return this.value
}

n.Import.prototype.eval = function () {
  log("Import")
  // TODO
  throw new Error("Import statement is not implemented yet.")
}

n.Parameters.prototype.eval = function (env) {
  log("Parameters")
  if (!this.argument) return []
  return [this.argument.eval(env)]
}


// Apply
// =====

var apply = function(fn, parameters, cb) {
  if (typeof fn === 'function') { // A primitive function.
    cb(fn.apply(null, parameters))
  } else if (typeof fn === 'object' && fn.env && fn.definition) {
    var env = extendEnv(fn.env)
    ,   def = fn.definition
    
    // Bind the formal parameter to it's value
    if (def.formalParameters.identifier) {
      env[def.formalParameters.identifier.name] = parameters[0]
    }
    
    env.__result__ = false
    // APPLY -> EVAL
    def.block.eval(env, function() {
      cb(env.__result__)
    })
  } else {
    throw new Error("Can't apply function: " + fn)
  }
}


})(exports || Karel.Parser)
