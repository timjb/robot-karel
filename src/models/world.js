(function() {
var _             = require('underscore')
,   clone         = require('helpers/clone')
,   getLineNumber = require('helpers/get_line_number')
,   matrix        = require('helpers/matrix')
,   Position      = require('models/position_and_direction').Position
,   Robot         = require('models/robot')


function Field() {
  this.ziegel = 0
  this.marke = false
  this.quader = false
}

Field.prototype.clone = function() {
  var f = new Field()
  f.ziegel = this.ziegel
  f.marke  = this.marke
  f.quader = this.quader
  return f
}


module.exports = require('backbone').Model.extend({

  initialize: function(opts) {
    if (!this.get('fields')) {
      this.set({
        fields: matrix(
          this.get('width'),
          this.get('depth'),
          function() { return new Field() }
        )
      })
    }
    
    this.$fields = this.get('fields')
    this.bind('change:fields', function() {
      this.trigger('change:all')
      this.$fields = this.get('fields')
    })
    
    this.createRobot(opts.robotOptions)
  },

  createRobot: function(opts) {
    opts = opts || {}
    opts.world = this
    var r = new Robot(opts)
    
    r.bind('change', _.bind(function() {
      this.trigger('change:robot')
      this.trigger('change', 'robot')
    }, this))
    
    this.set({ robot: r })
    return r
  },

  // Overwrite backbone's clone method
  clone: function() {
    // + make a copy of the attributes
    return new this.constructor(clone(this.attributes))
  },

  triggerChangeField: function(p) {
    this.trigger('change:field', p.x, p.y, this.getField(p))
    this.trigger('change')
  },

  getField: function(position) {
    return this.$fields[position.x][position.y]
  },

  run: function(code) {
    this.backup = this.clone()
    
    var self = this
    this.execute(code, function(stack) {
      console.log('Commands: ', stack)
      self.stack = stack
    })
  },

  execute: function(code, callback) {
    // TODO: refactor?
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    var win = iframe.contentWindow
    win.parent = null
    var karel = win.karel = {}
    var stack = []
    var self = this
    var timed = []
    var addTimed = _.bind(timed.push, timed)
    var removeTimed = function(obj) {
      var index = timed.indexOf(obj)
      if (index != -1) timed.splice(index, 1)
    }
    var END_EXC = new Error('end')
    
    function stop(obj) {
      clearTimeout(obj)
      clearInterval(obj)
      if (typeof obj.abort == 'function') obj.abort()
    }
    
    function stopAll() {
      _(timed).each(stop)
      timed = []
    }
    
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
      if (!timed.length) {
        document.body.removeChild(iframe)
        callback(stack)
      }
    }
    
    var robot = this.get('robot')
    _.each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
      karel[name] = function(n) {
        n = n || 1
        
        if (HIGHLIGHT_LINE) {
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
    
    win.warten = function(fn, ms) {
      var timeout = setTimeout(function() {
        removeTimed(timeout)
        exec(fn)
      }, ms)
      addTimed(timeout)
      return timeout
    }
    
    win.periode = function(fn, ms) {
      var interval = setInterval(function() {
        exec(fn)
      }, ms)
      addTimed(interval)
      return interval
    }
    
    win.laden = function(opts, fn) {
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
    
    win.stoppen = function(obj) {
      stop(obj)
      removeTimed(obj)
      end()
    }
    
    win.beenden = function() {
      throw END_EXC
    }
    
    exec(function() {
      win.document.write('<script>'+code+'</script>') // evil, I know
    })
  },

  next: function() {
    var pair = this.stack.shift()
    ,   command = pair[0]
    ,   lineNumber = pair[1]
    
    if (typeof command == 'string') {
      this[command]()
    } else if (command instanceof Error) {
      alert(command)
    }
    
    if (lineNumber) this.trigger('line', lineNumber)
  },

  replay: function() {
    this.reset()
    
    var self = this
    var interval = setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval)
      } else {
        self.next()
      }
    }, 150)
  },

  reset: function() {
    this.set(this.backup.attributes)
    this.trigger('change:all')
    this.trigger('change')
  },

  eachField: function(fn) {
    var fields = this.$fields
    ,   w = this.get('width')
    ,   d = this.get('depth')
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < d; y++) {
        fn(x, y, fields[x][y])
      }
    }
  },

  toString: function() {
    var tokens = []
    var p = function(c) { field_height--; tokens.push(c) }
    
    var fields = this.get('fields')
    var height = Math.max(5, 1 + _.max(_.map(fields, function(row) {
      return _.max(_.pluck(row, 'ziegel'))
    })))
    
    p('KarolVersion2Deutsch')
    
    p(this.get('width'))
    p(this.get('depth'))
    p(height)
    
    var position = this.get('robot').get('position')
    p(position.x)
    p(position.y)
    p(this.getField(position).ziegel)
    
    var x = this.get('width')
    ,   y = this.get('depth')
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = fields[i][j]
        ,   field_height = height
        if (field.quader) {
          p('q'); p('q')
        } else {
          _.times(field.ziegel, function() { p('z') })
        }
        while (field_height > 0) p('n')
        p(field.marke ? 'm' : 'o')
      }
    }
    
    return tokens.join(' ') + ' '
  }

}, {
  path: 'models/world',
  
  Field: Field,
  
  fromString: function(str) {
    // Parse .kdw files
    
    console.log('a')
    var tokens = str.split(/\s/)
    var shift = _(tokens.shift).bind(tokens)
    var _int = function() { return parseInt(shift(), 10) }
    
    tokens.shift() // "KarolVersion2Deutsch"
    
    // Dimensions of the world
    var x = _int(), y = _int(), z = _int()
    
    // Position of the robot
    var px = _int(), py = _int(), pz = _int()
    
    var world = new this({
      width: x,
      depth: y,
      robotOptions: {
        position: new Position(px, py)
      }
    })
    
    var fields = world.get('fields')
    
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = new Field()
        if (tokens[0] == 'q') field.quader = true
        for (var k = 0; k < z; k++) {
          if (shift() == 'z') field.ziegel++
        }
        field.marke = (shift() == 'm')
        fields[i][j] = field
      }
    }
    
    return world
  }

})

})()
