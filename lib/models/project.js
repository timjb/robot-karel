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
    this._execute(code, function(stack) {
      console.log("Commands:\n" + stack.join('\n'))
      self.stack = stack
    })
  },

  reset: function() {
    /**/
    this.get('world').set(this.get('worldBackup').attributes)
    this.get('world').trigger('change:all')
    this.get('world').trigger('change')
    /**/
  },

  _next: function() {
    var pair       = this.stack.shift()
    ,   command    = pair[0]
    ,   lineNumber = pair[1]
    
    if (typeof command == 'string') {
      this.get('robot')[command]()
    } else if (command instanceof Error) {
      // TODO: alert ist moppelkotze
      alert(command)
    }
    
    if (lineNumber) this.trigger('line', lineNumber)
  },

  replay: function() {
    this.reset()
    
    var interval = setInterval(_.bind(function() {
      if (this.stack.length == 0) {
        clearInterval(interval)
      } else {
        this.next()
      }
    }, this), Karel.settings.STEP_INTERVAL)
  },

  // TODO: refactor!!!
  _execute: function(code, callback) {
    var stack = []
    var self = this
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
        if (exc != END_EXC) {
          stack.push(exc)
        }
        stopAll()
      }
      end()
    }
    
    function end() {
      //if (!timed.length) {
        callback(stack)
      //}
    }
    
    var globals = {}
    
    var robot = this.get('world').get('robot')
    ,   karel = globals.karel = {}
    _.each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
      karel[name] = function(n) {
        n = n || 1
        
        if (Karel.settings.HIGHLIGHT_LINE) {
          try {
            throw new Error()
          } catch (exc) {
            var lineNumber = getLineNumber(exc.stack, 1)
          }
        } else {
          var lineNumber = null
        }
        
        if (robot[name].length == 0) {
          for (var i = 0; i < n; i++) {
            var result = robot[name]()
            stack.push([name, lineNumber])
          }
        } else {
          var result = robot[name].apply(robot, arguments)
          stack.push([name, lineNumber])
        }
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
