(function(exports) {

var _ = require('underscore') || window._

var n      = require('./nodes')   || Karel.Parser
,   parser = (require('./parser') || { parser: karol }).parser

parser.yy = n

exports.eval = function (code, globals, cb) {
  var ast = parser.parse(code.toLowerCase())
  return ast.eval(globals || {}, cb || function () {})
}

var log = function (klass) { /*console.log(klass + '#eval')*/ }

var attach = function (attachment, obj) {
  obj.attachment = attachment
  return obj
}


// Env(ironment)
// =============

//var emptyEnv = {}
var extendEnv = function (env) {
  return Object.create(env)
}
var setEnv = function (env, k, v) {
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
    return statement ? statement.eval(env, next) : cb()
  }
  
  return next()
}

n.If.prototype.eval = function (env, cb) {
  log("If")
  var self = this
  
  return self.condition.eval(env, function (val) {
    if (val) {
      return self.ifBlock.eval(env, cb)
    } else if (self.elseBlock) {
      return self.elseBlock.eval(env, cb)
    } else {
      return cb()
    }
  })
}

n.While.prototype.eval = function (env, cb) {
  log("While")
  var self = this
  
  return self.condition.eval(env, function(val) {
    if (val) {
      return self.block.eval(env, function() {
        return self.eval(env, cb) // recurse
      })
    } else {
      return cb()
    }
  })
}

n.DoWhile.prototype.eval = function (env, cb) {
  log("DoWhile")
  var self = this
  
  return self.block.eval(env, function() {
    return self.condition.eval(env, function(val) {
      if (val) {
        return self.eval(env, cb) // recurse
      } else {
        return cb()
      }
    })
  })
}

n.WhileTrue.prototype.eval = function (env, _cb) {
  log("WhileTrue")
  var self = this
  
  return self.block.eval(env, function() {
    return self.eval(env, _cb) // recurse
  })
}

n.For.prototype.eval = function (env, cb) {
  log("For")
  var self = this
  
  var t = self.times.value
  var iter = function() {
    if (t--) {
      return self.block.eval(env, iter)
    } else {
      return cb()
    }
  }
  
  return iter()
}

n.BoolStatement.prototype.eval = function (env, cb) {
  log("BoolStatement")
  var self = this
  
  return attach(self, function () {
    env.__result__ = self.value
    return cb()
  })
}

n.Inversion.prototype.eval = function (env, cb) {
  log("Inversion")
  var self = this
  
  return self.wrapped.eval(env, function(val) { return cb(!val) })
}

n.FunctionInvocation.prototype.eval = function (env, cb) {
  log("FunctionInvocation")
  var self = this
  
  return attach(self, function () {
    // EVAL -> APPLY
    return apply(self.identifier.eval(env), self.parameters.eval(env), cb)
  })
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
    return cb(fn.apply(null, parameters))
  } else if (typeof fn === 'object' && fn.env && fn.definition) {
    var env = extendEnv(fn.env)
    ,   def = fn.definition
    
    // Bind the formal parameter to it's value
    if (def.formalParameters.identifier) {
      env[def.formalParameters.identifier.name] = parameters[0]
    }
    
    env.__result__ = false
    // APPLY -> EVAL
    return def.block.eval(env, function() {
      return cb(env.__result__)
    })
  } else {
    throw new Error("Can't apply function: " + fn)
  }
}


})(exports || Karel.Parser)
