(function (exports) {

var _           = require('underscore')            || this._
,   Backbone    = require('backbone')              || this.Backbone
,   Interpreter = require('../parser/interpreter') || Karel.Parser

var KarolExecution = exports.KarolExecution = function (code, globals) {
  this.code    = code
  this.globals = globals
}

_.extend(KarolExecution.prototype, Backbone.Events)

KarolExecution.prototype._beginExecution = function () {
  if (this._continuation) return
  
  var triggerEnd = _.bind(this.trigger, this, 'end')
  
  this._continuation = Interpreter.eval(this.code, this.globals, triggerEnd)
}

KarolExecution.prototype._step = function () {
  try {
    this._continuation = this._continuation()
  } catch (exc) {
    delete this._continuation
    this.trigger('error', exc)
        .trigger('end')
  }
}

KarolExecution.prototype.run = function () {
  this._beginExecution()
  while (typeof this._continuation === 'function') this._step()
}

KarolExecution.prototype.step = function () {
  this._beginExecution()
  
  // TODO: slow, fast
  
  this._step()
  
  var cont = this._continuation, atta, loca
  if (cont && (atta = cont.attachment) && (loca = atta.location)) {
    // Frankly, I have no idea why I need to use `last_line` instead of
    // `first_line` here, but it must have something to do with parsing.
    this.trigger('line', loca.last_line - 1)
  }
}

})(exports || Karel.Models)
