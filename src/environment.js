var Environment = Backbone.Model.extend({

  initialize: function() {
    if (!this.get('position')) { // not cloned
      this.set({
        position: new Position(0, 0),
        direction: Position.SOUTH.clone(),
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
  },

  triggerChangeField: function(p) {
    this.trigger('change-field', p.x, p.y, this.getField(p))
  },

  getField: function(position) {
    return this.get('fields')[position.x][position.y]
  },

  forward: function() {
    return this.get('position').plus(this.get('direction'))
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
    this.getField(this.get('position')).marke = true
    this.triggerChangeField(this.get('position'))
  },

  markeLoeschen: function() {
    this.getField(this.get('position')).marke = false
    this.triggerChangeField(this.get('position'))
  },

  marke: function() {
    var field = this.getField(this.get('position'))
    field.marke = !field.marke
    this.triggerChangeField(this.get('position'))
  },

  istMarke: function() {
    return this.getField(this.get('position')).marke
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
    var d = this.get('direction')
    this.set({ direction: new Position(d.y, -d.x) })
  },

  rechtsDrehen: function() {
    var d = this.get('direction')
    this.set({ direction: new Position(-d.y, d.x) })
  },

  schritt: function() {
    if (this.istWand()) error("Karol kann keinen Schritt machen, er steht vor einer Wand.")
    var newPosition = this.forward()
    if (Math.abs(this.getField(this.get('position')).ziegel - this.getField(newPosition).ziegel) > 1)
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

  istNorden: function() {
    return this.direction.isNorth()
  },

  istSueden: function() {
    return this.direction.isSouth()
  },

  istWesten: function() {
    return this.direction.isWest()
  },

  istOsten: function() {
    return this.direction.isEast()
  },

  probiere: function(fn) {
    var clone = this.clone()
    try {
      return fn()
    } catch(exc) {
      this.copy(clone)
      this.trigger('complete-change')
    }
  },

  run: function(code) {
    this.backup = this.clone()
    
    var self = this
    this.execute(code, function(stack) {
      log('Commands: ' + stack.join(', '))
      self.stack = stack
    })
  },

  /*clone: function() {
    var env = new Environment(this.width, this.depth, this.height)
    env.copy(this)
    return env
  },

  copy: function(other) {
    this.get('position') = other.position.clone()
    this.direction = other.direction.clone()
    this.fields = clone(other.fields)
  },*/

  execute: function(code, callback) {
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
    
    win.laden = function(url, fn) {
      var req = xhr(url, function(responseText, responseXML) {
        log(url, responseText, responseXML)
        removeFromArray(timed, req)
        exec(bind(fn, null, responseText, responseXML))
      }, function() {
        log('Loading failed: ' + url)
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
    
    if (lineNumber) {
      this.trigger('line', lineNumber)
    }
  },

  replay: function() {
    this.reset()
    
    var self = this
    var interval = setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval)
      } else {
        self.next()
        self.onchange && self.onchange()
      }
    }, 150)
  },

  reset: function() {
    this.copy(this.backup)
    this.trigger('complete-change')
  },

  eachField: function(fn) {
    var fields = this.get('fields')
    ,   w = this.get('width')
    ,   d = this.get('depth')
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < d; y++) {
        fn(x, y, fields[x][y])
      }
    }
  }

})
