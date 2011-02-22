function Position(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.plus = function(another) {
  return new Position(this.x + another.x, this.y + another.y)
}


function Direction(x, y) {
  this.x = x
  this.y = y
}

Direction.NORTH = new Direction(0, -1)
Direction.prototype.isNorth = function() {
  return this.equals(Direction.NORTH)
}

Direction.SOUTH = new Direction(0, 1)
Direction.prototype.isSouth = function() {
  return this.equals(Direction.SOUTH)
}

Direction.WEST = new Direction(-1, 0)
Direction.prototype.isWest = function() {
  return this.equals(Direction.WEST)
}

Direction.EAST = new Direction(1, 0)
Direction.prototype.isEast = function() {
  return this.equals(Direction.EAST)
}

Direction.prototype.turnRight = function() {
  return new Direction(-this.y, this.x)
}

Direction.prototype.turnLeft = function() {
  return new Direction(this.y, -this.x)
}


Position.prototype.clone = Direction.prototype.clone = function() {
  return new this.constructor(this.x, this.y)
}

Position.prototype.equals = Direction.prototype.equals = function(another) {
  return another instanceof this.constructor
    && another.x == this.x
    && another.y == this.y
}



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



App.Models.Environment = Backbone.Model.extend({

  defaults: {
    position: new Position(0, 0),
    direction: Direction.SOUTH
  },

  initialize: function() {
    if (!this.get('fields')) {
      this.set({
        fields: matrix(
          this.get('width'),
          this.get('depth'),
          function() { return new Field() }
        )
      })
    }
    
    this
      .bind('change:position',  _.bind(this.trigger, this, 'change:robot'))
      .bind('change:direction', _.bind(this.trigger, this, 'change:robot'))
      .bind('change:fields',    _.bind(this.trigger, this, 'change:all'))
    
    // Cache (for performance reasons)
    var setCurrentField = _(function() {
      this.$currentField = this.getField(this.$position)
    }).bind(this)
    setCurrentField()
    this
      .bind('change:position', setCurrentField)
      .bind('change:fields',   setCurrentField)
  },

  // Overwrite backbone's set method for performance reasons
  set: function(attrs, options) {
    // - validations, - escaped attributes, - changes tracking
    if (attrs.attributes) attrs = attrs.attributes
    var silent = options && options.silent
    var change = false
    for (var attr in attrs) {
      change = true
      var val = attrs[attr]
      this.attributes[attr] = val
      this['$'+attr] = val
      if (!silent) this.trigger('change:'+attr)
    }
    if (change && !silent) this.trigger('change')
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

  forward: function() {
    return this.$position.plus(this.$direction)
  },

  istZiegel: function(n) {
    if (this.istWand()) return false
    var ziegel = this.getField(this.forward()).ziegel
    return n ? (ziegel == n) : !!ziegel
  },

  hinlegen: function() {
    if (this.istWand()) error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.")
    var nextPosition = this.forward()
    this.getField(nextPosition).ziegel += 1
    this.triggerChangeField(nextPosition)
  },

  aufheben: function() {
    if (this.istWand()) error("Karol kann keinen Ziegel aufheben. Er steht vor einer Wand.")
    var nextPosition = this.forward()
    var field = this.getField(nextPosition)
    if (!field.ziegel) error("Karol kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.")
    field.ziegel--
    this.triggerChangeField(nextPosition)
  },

  markeSetzen: function() {
    this.$currentField.marke = true
    this.triggerChangeField(this.$position)
  },

  markeLoeschen: function() {
    this.$currentField.marke = false
    this.triggerChangeField(this.$position)
  },

  marke: function() {
    this.$currentField.marke = !this.$currentField.marke
    this.triggerChangeField(this.$position)
  },

  istMarke: function() {
    return this.$currentField.marke
  },

  isValid: function(position) {
    var x = position.x
    ,   z = position.y
    return x >= 0 && x < this.get('width') && z >= 0 && z < this.get('depth')
  },

  istWand: function() {
    var next = this.forward()
    return !this.isValid(next) || this.getField(next).quader
  },

  linksDrehen: function() {
    this.set({ direction: this.$direction.turnLeft() })
  },

  rechtsDrehen: function() {
    this.set({ direction: this.$direction.turnRight() })
  },

  schritt: function() {
    if (this.istWand()) error("Karol kann keinen Schritt machen, er steht vor einer Wand.")
    var newPosition = this.forward()
    if (Math.abs(this.$currentField.ziegel - this.getField(newPosition).ziegel) > 1) {
      error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.")
    }
    this.set({ position: newPosition })
  },

  schrittRueckwaerts: function() {
    this.probiere(_(function() {
      this.linksDrehen()
      this.linksDrehen()
      this.schritt()
      this.linksDrehen()
      this.linksDrehen()
    }).bind(this))
  },

  quader: function() {
    var position = this.forward()
    if (!this.isValid(position)) error("Karol kann keinen Quader hinlegen. Er steht vor einer Wand.")
    var field = this.getField(position)
    if (field.quader) error("Karol kann keinen Quader hinlegen, da schon einer liegt.")
    if (field.ziegel) error("Karol kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.")
    field.quader = true
    this.triggerChangeField(position)
  },

  entfernen: function() {
    var position = this.forward()
    if (!this.isValid(position)) error("Karol kann keinen Quader entfernen. Er steht vor einer Wand.")
    var field = this.getField(position)
    if (!field.quader) error("Karol kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.")
    field.quader = false
    this.triggerChangeField(position)
  },

  ton: beep,

  istNorden: function() { return this.$direction.isNorth() },
  istSueden: function() { return this.$direction.isSouth() },
  istWesten: function() { return this.$direction.isWest() },
  istOsten:  function() { return this.$direction.isEast() },

  probiere: function(fn) {
    var clone = this.clone()
    try {
      return fn()
    } catch(exc) {
      this.set(clone)
      this.trigger('change:all')
      this.trigger('change')
    }
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
    var karol = win.karol = {}
    var stack = []
    var self = this
    var timed = []
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
    
    _.each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
      karol[name] = function(n) {
        n = n || 1
        
        if (HIGHLIGHT_LINE) {
          try {
            error()
          } catch (exc) {
            var lineNumber = getLineNumber(exc.stack, 1)
          }
        } else {
          var lineNumber = null
        }
        
        if (self[name].length == 0) {
          for (var i = 0; i < n; i++) {
            var result = self[name]()
            stack.push([name, lineNumber])
          }
        } else {
          var result = self[name].apply(self, arguments)
          stack.push([name, lineNumber])
        }
        return result
      }
    })
    
    win.warten = function(fn, ms) {
      var timeout = setTimeout(function() {
        removeFromArray(timed, timeout)
        exec(fn)
      }, ms)
      timed.push(timeout)
      return timeout
    }
    
    win.periode = function(fn, ms) {
      var interval = setInterval(function() {
        exec(fn)
      }, ms)
      timed.push(interval)
      return interval
    }
    
    win.laden = function(opts, fn) {
      var req = $.ajax(opts)
        .success(function(responseText) {
          removeFromArray(timed, req)
          exec(_.bind(fn, null, responseText))
        })
        .error(function() {
          removeFromArray(timed, req)
        })
      timed.push(req)
      return req
    }
    
    win.stoppen = function(obj) {
      stop(obj)
      removeFromArray(timed, obj)
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
    
    p(this.$position.x)
    p(this.$position.y)
    p(this.$currentField.ziegel)
    
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
    
    return tokens.join(' ')
  }

}, {

  Field: Field,
  Position: Position,
  Direction: Direction,
  
  fromString: function(str) {
    // Parse .kdw files
    
    var tokens = str.split(/\s/)
    var shift = _(tokens.shift).bind(tokens)
    var _int = function() { return parseInt(shift(), 10) }
    
    tokens.shift() // "KarolVersion2Deutsch"
    
    // Dimensions of the world
    var x = _int(), y = _int(), z = _int()
    
    // Position of the robot
    var px = _int(), py = _int(), pz = _int()
    
    var env = new App.Models.Environment({
      width: x,
      depth: y,
      position: new Position(px, py)
    })
    var fields = env.get('fields')
    
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
    
    return env
  }

})
