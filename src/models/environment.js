(function() {

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

    initialize: function() {
      if (!this.get('position')) { // not cloned
        this.set({
          position: new Position(0, 0),
          direction: Direction.SOUTH.clone(),
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
      
      // Cache (for performance reasons
      this.$fields = this.get('fields')
      this.$position = this.get('position')
      this.$currentField = this.getField(this.$position)
      this.$direction = this.get('direction')
      this
        .bind('change:position', _(function() {
          this.$position = this.get('position')
          this.$currentField = this.getField(this.$position)
        }).bind(this))
        .bind('change:direction', _(function() {
          this.$direction = this.get('direction')
        }).bind(this))
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
      var field = this.getField(nextPosition)
      if (field.ziegel >= this.height) error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.")
      field.ziegel += 1
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
      var x = position.x,
          z = position.y
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
      if (Math.abs(this.$currentField.ziegel - this.getField(newPosition).ziegel) > 1)
        error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.")
      this.set({ position: newPosition })
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

    ton: function() {
      beep()
    },

    istNorden: function() { return this.$direction.isNorth() },
    istSueden: function() { return this.$direction.isSouth() },
    istWesten: function() { return this.$direction.isWest() },
    istOsten:  function() { return this.$direction.isEast() },

    probiere: function(fn) {
      var clone = this.clone()
      try {
        return fn()
      } catch(exc) {
        this.copy(clone) // TODO
        this.trigger('change:all')
        this.trigger('change')
      }
    },

    run: function(code) {
      this.backup = this.clone()
      
      var self = this
      this.execute(code, function(stack) {
        log('Commands: ', stack)
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
          self.onchange && self.onchange() // TODO
        }
      }, 150)
    },

    reset: function() {
      this.copy(this.backup) // TODO
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
    }

  })

})()
