(function(exports) {

var _         = require('underscore') || this._
,   Backbone  = require('backbone')   || this.Backbone
,   World     = (require('./world')   || Karel.Models).World

exports.Project = Backbone.Model.extend({
  parse: function(resp) {
    if (resp.world) resp.world = World.fromString(resp.world)
    return resp
  },

  toJSON: function() {
    var attrs = _.clone(this.attributes)
    attrs.world = attrs.world.toString()
    return attrs
  },

  run: function() {
    var world = this.get('world')
    ,   code  = this.get('code')
    
    this.set({ worldBackup: world.clone() })
    
    var self = this
    this._execute(code, function(sequence) {
      console.log("Commands:\n"
        + sequence.map(function(cmd) {
          return cmd[0] + '(' + [].join.call(cmd[1], ',') + ')'
        }).join('\n'))
      self.sequence = sequence
    })
  },

  reset: function() {
    this.set({ world: this.get('worldBackup') })
    this.unset('worldBackup')
  },

  _next: function() {
    var triple     = this.sequence.shift()
    ,   command    = triple[0]
    ,   args       = triple[1]
    ,   lineNumber = triple[2]
    
    if (typeof command == 'string') {
      var robot = this.get('world').get('robot')
      robot[command].apply(robot, args)
    } else if (command instanceof Error) {
      // TODO: alert ist moppelkotze
      alert(command)
    }
    
    if (typeof lineNumber === 'function') lineNumber = lineNumber()
    if (lineNumber) this.trigger('line', lineNumber)
  },

  replay: function() {
    this.reset()
    
    var interval = setInterval(_.bind(function() {
      if (this.sequence.length == 0) {
        clearInterval(interval)
      } else {
        this._next()
      }
    }, this), Karel.settings.STEP_INTERVAL)
  },

  // TODO: refactor!!!
  _execute: function(code, callback) {
    var sequence = []
    
    /*
    var timed = []
    var addTimed = _.bind(timed.push, timed)
    var removeTimed = function(obj) {
      var index = timed.indexOf(obj)
      if (index != -1) timed.splice(index, 1)
    }
    */
    var END_EXC = new Error('end')
    
    /*
    function stop(obj) {
      clearTimeout(obj)
      clearInterval(obj)
      if (typeof obj.abort == 'function') obj.abort()
    }
    
    function stopAll() {
      _(timed).each(stop)
      timed = []
    }
    */
    
    function exec(fn) {
      try {
        fn()
      } catch (exc) {
        //if (exc != END_EXC) {
          sequence.push(exc)
        //}
        //stopAll()
      }
      end()
    }
    
    function end() {
      //if (!timed.length) {
        callback(sequence)
      //}
    }
    
    var globals = {}
    
    // These are different strategies for figuring out the line number of
    // the code that is n below in the stack
    var noLineNumber = function() {
      return null
    }
    var getLineNumberNow = function(n) {
      try {
        throw new Error()
      } catch (exc) {
        return Karel.Helpers.getLineNumber(exc.stack, n+1)
      }
    }
    var getLineNumberLater = function(n) {
      try {
        throw new Error()
      } catch (exc) {
        return function() {
          return Karel.Helpers.getLineNumber(exc.stack, n+1)
        }
      }
    }
    
    // Decide based on the settings which strategy to use
    // Right now getLineNumberLater isn't considered
    var getLineNumber = Karel.settings.HIGHLIGHT_LINE
      ? getLineNumberLater
      : noLineNumber
    
    // Export the robots methods
    var robot = this.get('world').get('robot')
    globals.karel = {}
    _.each(_.keys(robot.constructor.prototype), function(name) {
      globals[name] = globals.karel[name] = function(n) {
        var result = robot[name].apply(robot, arguments)
        sequence.push([name, arguments, getLineNumber(1)])
        return result
      }
    })
    
    /*
    globals.warten = function(fn, ms) {
      var timeout = setTimeout(function() {
        removeTimed(timeout)
        exec(fn)
      }, ms)
      addTimed(timeout)
      return timeout
    }
    
    globals.periode = function(fn, ms) {
      var interval = setInterval(function() {
        exec(fn)
      }, ms)
      addTimed(interval)
      return interval
    }
    
    globals.laden = function(opts, fn) {
      var req = $.ajax(opts)
        .success(function(responseText) {
          removeTimed(req)
          exec(_.bind(fn, null, responseText))
        })
        .error(function() {
          removeTimed(req)
        })
      addTimed(req)
      return req
    }
    
    globals.stoppen = function(obj) {
      stop(obj)
      removeTimed(obj)
      end()
    }
    */
    
    globals.beenden = function() {
      throw END_EXC
    }
    
    exec(function() {
      Karel.Helpers.run(code, globals)
    })
  }
})

})(exports || Karel.Models)
