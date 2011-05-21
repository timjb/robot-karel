(function(exports) {

var _           = require('underscore') || this._
,   Backbone    = require('backbone')   || this.Backbone
,   World       = (require('./world')   || Karel.Models).World
,   settings    = (require('../settings') || Karel).settings
,   Interpreter = require('../parser/interpreter') || Karel.Parser
,   run         = (require('../helpers/sandbox') || Karel.Helpers).run
,   getLineNumber = (require('../helpers/get_line_number') || Karel.Helpers).getLineNumber

exports.Project = (Backbone.couch ? Backbone.couch : Backbone).Model.extend({

  defaults: {
    type:        'project',
    language:    'karol',
    code:        '',
    description: ''
  },

  initialize: function() {
    if (!this.get('world')) {
      this.set({ world: new World() })
    }
  },

  parse: function(resp) {
    if (resp.world) resp.world = World.fromString(resp.world)
    return resp
  },

  toJSON: function() {
    var attrs = _.clone(this.attributes)
    delete attrs.worldBackup
    attrs.world = attrs.world.toString()
    return attrs
  },

  run: function(callback) {
    var world = this.get('world')
    ,   code  = this.get('code')
    
    this.set({ worldBackup: world.clone() })
    
    if (this.get('language') === 'karol') {
      var robot = this.get('world').get('robot')
      _(robot).bindAll.apply(_(robot), _.methods(robot.constructor.prototype))
      try {
        Interpreter.eval(code, robot)
      } catch (exc) {
        this.trigger('error', exc)
      }
    } else { // javascript
      this._execute(code, settings, _.bind(function(sequence) {
        /*console.log("Commands:\n" +
          sequence.map(function(cmd) {
            return cmd[0] + '(' + [].join.call(cmd[1], ',') + ')'
          }).join('\n'))*/
        this.sequence = sequence
        if (callback) callback()
      }, this))
    }
  },

  reset: function() {
    this.set({ world: this.get('worldBackup') })
    this.unset('worldBackup')
  },

  _next: function() {
    var robot = this.get('world').get('robot')
    robot.isFast = false
    
    do {
      var triple     = this.sequence.shift()
      ,   command    = triple[0]
      ,   args       = triple[1]
      ,   lineNumber = triple[2]
      robot[command].apply(robot, args)
    } while (robot.isFast && this.sequence.length)
    
    if (typeof lineNumber === 'function') lineNumber = lineNumber()
    if (lineNumber) this.trigger('line', lineNumber)
  },

  replay: function(callback) {
    this.reset()
    
    var interval = setInterval(_.bind(function() {
      if (this.sequence.length === 0) {
        clearInterval(interval)
        if (callback) callback()
      } else {
        this._next()
      }
    }, this), settings.STEP_INTERVAL)
  },

  // TODO: refactor!!!
  _execute: function(code, options, callback) {
    var self = this
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
          self.trigger('error', exc)
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
        return getLineNumber(exc.stack, n+1)
      }
    }
    var getLineNumberLater = function(n) {
      try {
        throw new Error()
      } catch (exc) {
        return function() {
          return getLineNumber(exc.stack, n+1)
        }
      }
    }
    
    // Decide based on the options which strategy to use
    // Right now getLineNumberLater isn't considered
    var getLineNumber = options.HIGHLIGHT_LINE
      ? getLineNumberLater
      : noLineNumber
    
    // Export the robots methods
    var robot = this.get('world').get('robot')
    globals.karel = {}
    _.each(_.keys(robot.constructor.prototype), function(name) {
      globals[name] = globals.karel[name] = function(n) {
        sequence.push([name, arguments, getLineNumber(1)])
        return robot[name].apply(robot, arguments)
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
      run(code, globals)
    })
  }
})

})(exports || Karel.Models)
