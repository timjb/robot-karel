(function (exports) {

var _              = require('underscore') || this._
,   Backbone       = require('backbone') || this.Backbone
,   run            = (require('../helpers/sandbox') || Karel.Helpers).run
,   settings       = (require('../settings') || Karel).settings
,   getLineNumber  = (require('../helpers/get_line_number') || Karel.Helpers).getLineNumber

var execute = function (code, globals) {
  // These are different strategies for figuring out the line number of
  // the code that is n below in the stack.
  var noLineNumber = function () {
    return null
  }
  // The problem with try-catch is that catching errors tends to be slow.
  // Getting the stack of an error is even slower. But I don't know any other
  // way to get the line number of running JavaScript code.
  var getLineNumberNow = function (n) {
    try {
      throw new Error()
    } catch (exc) {
      return getLineNumber(exc.stack, n+1)
    }
  }
  // Defer the `stack` property access. This saves computation during execution.
  // But more work has to be done when stepping through the recorded sequence of
  // instructions.
  var getLineNumberLater = function (n) {
    try {
      throw new Error()
    } catch (exc) {
      return function() {
        return getLineNumber(exc.stack, n+1)
      }
    }
  }
  
  // Decide based on the settings which strategy to use
  // Right now getLineNumberNow isn't considered
  var getLineNumber_ = settings.HIGHLIGHT_LINE
                     ? getLineNumberLater
                     : noLineNumber
  
  var sequence = []
  
  var jsGlobals = {}
  _.each(globals, function (value, key) {
    if (typeof value === 'function') {
      jsGlobals[key] = function () {
        // Record the function call.
        sequence.push([key, arguments, getLineNumber_(1)])
        // Apply the function.
        return globals[key].apply(globals, arguments)
      }
    } else {
      jsGlobals[key] = value
    }
  })
  
  try {
    run(code, jsGlobals)
  } catch (exc) {
    sequence.push(exc)
  }
  
  return sequence
}

var JSExecution = exports.JSExecution = function (code, globals, reset) {
  this.code    = code
  this.globals = globals
  this._reset  = reset
}

_.extend(JSExecution.prototype, Backbone.Events)

JSExecution.prototype.hasEnded = function () {
  return this._sequence && !this._sequence.length
}

JSExecution.prototype._execute = function () {
  this._sequence = execute(this.code, this.globals)
}

JSExecution.prototype.run = function () {
  if (this._sequence) {
    while (this._sequence.length) {
      this.step()
    }
  } else {
    this._execute()
    var last
    if (!(last = this._sequence.pop()).length) this.trigger('error', last)
    this._sequence = []
  }
}

JSExecution.prototype.step = function () {
  if (!this._sequence) {
    this._execute()
    this._reset()
  }
  
  // TODO: slow, fast
  
  var next = this._sequence.shift()
  if (next.length) {
    var command    = next[0]
    ,   args       = next[1]
    ,   lineNumber = next[2]
    this.globals[command].apply(this.globals, args)
  } else {
    this.trigger('error', next)
  }
  
  if (typeof lineNumber === 'function') lineNumber = lineNumber()
  if (typeof lineNumber === 'number') this.trigger('line', lineNumber-1)
}

})(exports || Karel.Models)
