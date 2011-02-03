function Environment(width, depth, height) {
  this.width = width;
  this.depth = depth;
  this.height = height;
  
  this.position = new Position(0, 0);
  this.direction = Position.SOUTH.clone();
  
  this.createFields();
  this.initBeepSound();
}

_.extend(Environment.prototype, Backbone.Events);

Environment.prototype.createFields = function() {
  var w = this.width,
      d = this.depth;
  
  var fields = this.fields = [];
  for (var i = 0; i < w; i++) {
    var row = [];
    for (var j = 0; j < d; j++) {
      row.push(new Field());
    }
    fields.push(row);
  }
};

Environment.prototype.getField = function(position) {
  return this.fields[position.x][position.y];
};

Environment.prototype.forward = function() {
  return this.position.plus(this.direction);
};

Environment.prototype.istZiegel = function(n) {
  if (this.istWand()) return false;
  var ziegel = this.getField(this.forward()).ziegel;
  return n ? (ziegel == n) : !!ziegel;
};

Environment.prototype.hinlegen = function() {
  if (this.istWand()) error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.");
  var nextPosition = this.forward();
  var field = this.getField(nextPosition);
  if (field.ziegel >= this.height) error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.");
  field.ziegel += 1;
  this.trigger('change-field', nextPosition);
};

Environment.prototype.aufheben = function() {
  if (this.istWand()) error("Karol kann keinen Ziegel aufheben. Er steht vor einer Wand.");
  var nextPosition = this.forward();
  var field = this.getField(nextPosition);
  if (!field.ziegel) error("Karol kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.");
  field.ziegel--;
  this.trigger('change-field', nextPosition);
};

Environment.prototype.markeSetzen = function() {
  this.getField(this.position).marke = true;
  this.trigger('change-field', this.position);
};

Environment.prototype.markeLoeschen = function() {
  this.getField(this.position).marke = false;
  this.trigger('change-field', this.position);
};

Environment.prototype.marke = function() {
  var field = this.getField(this.position);
  field.marke = !field.marke;
  this.trigger('change-field', this.position);
};

Environment.prototype.istMarke = function() {
  return this.getField(this.position).marke;
};

Environment.prototype.isValid = function(position) {
  var x = position.x,
      z = position.y;
  return x >= 0 && x < this.width && z >= 0 && z < this.depth;
};

Environment.prototype.istWand = function() {
  var next = this.forward();
  return !this.isValid(next) || this.getField(next).quader;
};

Environment.prototype.linksDrehen = function() {
  this.direction = new Position(this.direction.y, -this.direction.x);
  this.trigger('change-robot');
};

Environment.prototype.rechtsDrehen = function() {
  this.direction = new Position(-this.direction.y, this.direction.x);
  this.trigger('change-robot');
};

Environment.prototype.schritt = function() {
  if (this.istWand()) error("Karol kann keinen Schritt machen, er steht vor einer Wand.");
  var newPosition = this.forward();
  if (Math.abs(this.getField(this.position).ziegel - this.getField(newPosition).ziegel) > 1)
    error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.");
  this.position = newPosition;
  this.trigger('change-robot');
};

Environment.prototype.quader = function() {
  var position = this.forward();
  if (!this.isValid(position)) error("Karol kann keinen Quader hinlegen. Er steht vor einer Wand.");
  var field = this.getField(position);
  if (field.quader) error("Karol kann keinen Quader hinlegen, da schon einer liegt.");
  if (field.ziegel) error("Karol kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.");
  field.quader = true;
  this.trigger('change-field', position);
};

Environment.prototype.entfernen = function() {
  var position = this.forward();
  if (!this.isValid(position)) error("Karol kann keinen Quader entfernen. Er steht vor einer Wand.");
  var field = this.getField(position);
  if (!field.quader) error("Karol kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.");
  field.quader = false;
  this.trigger('change-field', position);
};

Environment.prototype.initBeepSound = function() {
  if (window.Audio) {
    var sound = this.beepSound = new window.Audio();
    if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
      sound.src = 'assets/beep.ogg';
    } else if (sound.canPlayType('audio/mpeg;')) {
      sound.src = 'assets/beep.mp3';
    }
  }
};

Environment.prototype.ton = function() {
  var sound = this.beepSound;
  if (sound) {
    sound.play();
    this.initBeepSound(); // Because Chrome can't replay
  }
};

Environment.prototype.istNorden = function() {
  return this.direction.equals(new Position(0, -1));
};

Environment.prototype.istSueden = function() {
  return this.direction.equals(new Position(0, 1));
};

Environment.prototype.istWesten = function() {
  return this.direction.equals(new Position(-1, 0));
};

Environment.prototype.istOsten = function() {
  return this.direction.equals(new Position(1, 0));
};

Environment.prototype.probiere = function(fn) {
  var clone = this.clone();
  try {
    return fn();
  } catch(exc) {
    this.copy(clone);
    this.trigger('complete-change');
  }
};

Environment.prototype.run = function(code) {
  this.backup = this.clone();
  
  var self = this;
  this.execute(code, function(stack) {
    log('Commands: ' + stack.join(', '));
    self.stack = stack;
  });
};

Environment.prototype.clone = function() {
  var env = new Environment(this.width, this.depth, this.height);
  env.copy(this);
  return env;
};

Environment.prototype.copy = function(other) {
  this.position  = other.position.clone();
  this.direction = other.direction.clone();
  this.fields = clone(other.fields);
};

Environment.prototype.execute = function(code, callback) {
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  var win = iframe.contentWindow;
  win.parent = null;
  var karol = win.karol = {};
  var stack = [];
  var self = this;
  var timed = [];
  var END_EXC = new Error('end');
  
  function stopAll() {
    each(timed, stop);
    timed = [];
  }
  
  function exec(fn) {
    try {
      fn();
    } catch (exc) {
      if (exc != END_EXC) {
        stack.push(exc);
      }
      stopAll();
    }
    end();
  }
  
  function end() {
    if (!timed.length) {
      document.body.removeChild(iframe);
      callback(stack);
    }
  }
  
  _.each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke', 'istNorden', 'istSueden', 'istWesten', 'istOsten', 'ton', 'probiere'], function(name) {
    karol[name] = function(n) {
      n = n || 1;
      
      if (HIGHLIGHT_LINE) {
        try {
          error();
        } catch (exc) {
          var lineNumber = getLineNumber(exc.stack, 1);
        }
      } else {
        var lineNumber = null;
      }
      
      if (self[name].length == 0) {
        for (var i = 0; i < n; i++) {
          var result = self[name]();
          stack.push([name, lineNumber]);
        }
      } else {
        var result = self[name].apply(self, arguments);
        stack.push([name, lineNumber]);
      }
      return result;
    };
  });
  
  win.warten = function(fn, ms) {
    var timeout = setTimeout(function() {
      removeFromArray(timed, timeout);
      exec(fn);
    }, ms);
    timed.push(timeout);
    return timeout;
  };
  
  win.periode = function(fn, ms) {
    var interval = setInterval(function() {
      exec(fn);
    }, ms);
    timed.push(interval);
    return interval;
  };
  
  win.laden = function(url, fn) {
    var req = xhr(url, function(responseText, responseXML) {
      log(url, responseText, responseXML);
      removeFromArray(timed, req);
      exec(bind(fn, null, responseText, responseXML));
    }, function() {
      log('Loading failed: ' + url);
    });
    timed.push(req);
    return req;
  };
  
  win.stoppen = function(obj) {
    stop(obj);
    removeFromArray(timed, obj);
    end();
  };
  
  win.beenden = function() {
    throw END_EXC;
  };
  
  exec(function() {
    win.document.write('<script>'+code+'</script>'); // evil, I know
  });
};

Environment.prototype.next = function() {
  var pair = this.stack.shift()
  ,   command = pair[0]
  ,   lineNumber = pair[1];
  
  if (typeof command == 'string') {
    this[command]();
  } else if (command instanceof Error) {
    window.alert(command);
  }
  
  if (lineNumber) {
    this.trigger('line', lineNumber);
  }
};

Environment.prototype.replay = function() {
  this.reset();
  
  var self = this;
  var interval = setInterval(function() {
    if (self.stack.length == 0) {
      clearInterval(interval);
    } else {
      self.next();
      self.onchange && self.onchange();
    }
  }, 150);
};

Environment.prototype.reset = function() {
  this.copy(this.backup);
  this.trigger('complete-change');
};

Environment.prototype.eachField = function(fn) {
  var w = this.width
  ,   d = this.depth;
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < d; y++) {
      fn(x, y, this.fields[x][y]);
    }
  }
};
