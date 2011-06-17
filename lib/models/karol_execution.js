(function (exports) {

var _           = require('underscore')            || this._
,   Backbone    = require('backbone')              || this.Backbone
,   Interpreter = require('../parser/interpreter') || Karel.Parser

var KarolExecution = exports.KarolExecution = function (code, globals) {
  this.code    = code
  this.globals = globals
}

_.extend(KarolExecution.prototype, Backbone.Events)

var ENDED = {}

KarolExecution.prototype._beginExecution = function () {
  if (this._continuation) return
  
  this._continuation = Interpreter.eval(this.code, this.globals, function () {})
                    || ENDED
}

KarolExecution.prototype.hasEnded = function () {
  return this._continuation === ENDED
}

KarolExecution.prototype.run = function () {
  this._beginExecution()
  
  while (typeof this._continuation === 'function') {
    this.step()
  }
}

KarolExecution.prototype.step = function () {
  this._beginExecution()
  
  // TODO: slow, fast
  
  try {
    var continuation = this._continuation = this._continuation() || ENDED
    if (continuation && continuation.attachment && continuation.attachment.location) {
      this.trigger('line', continuation.attachment.location.first_line)
    }
  } catch (exc) {
    this._continuation = ENDED
    this.trigger('error', exc)
  }
}

})(exports || Karel.Models)
