//= require <BespinEmbedded.uncompressed>

(function(win, doc, undefined) {
  //= require <stacktrace>
  //= require <Three>
  var T = THREE;
  //= require <Cube>
  //= require <Plane>
  
  
  /*
   * Helpers
   */
  
  //= require <xhr>
  var get = xhr;
  //= require <each>
  //= require <bind>
  //= require <addevent>
  //= require <mixin>
  //= require <events>
  
  function $(id) {
    return doc.getElementById(id);
  }
  
  function log() {
    if (win.console && typeof win.console.log == 'function') {
      win.console.log.apply(console, arguments);
    }
  }
  
  function clone(obj) {
    if (obj instanceof Array) {
      var n = [];
      for (var i = 0, l = obj.length; i < l; i++) {
        n[i] = clone(obj[i]);
      }
      return n;
    } else {
      if (typeof obj.clone == 'function') {
        obj = obj.clone();
      }
      return obj;
    }
  }
  
  function toArray(obj) {
    if (obj instanceof Array) return obj;
    if (obj != undefined && obj != null) return [obj];
    return [];
  }
  
  function errorFunction(msg) {
    var error = new Error(msg);
    return function() {
      throw error;
    };
  }
  
  function removeFromArray(arr, obj) {
    var index = arr.indexOf(obj);
    if (index != -1) arr.splice(index, 1);
  }
  
  function stop(obj) {
    clearTimeout(obj);
    clearInterval(obj);
    if (typeof obj.abort == 'function') obj.abort();
  }
  
  function capitalize(str) {
    return str.replace(/(?:\s|-|_)([a-z])/g, function(x, letter) {
      return letter.toUpperCase();
    });
  }
  
  
  /*
   * Model
   */
  
  function Field() {
    this.ziegel = 0;
    this.marke = false;
    this.quader = false;
  }
  
  Field.prototype.clone = function() {
    var f = new Field();
    f.ziegel = this.ziegel;
    f.marke = this.marke;
    f.quader = this.quader;
    return f;
  };
  
  
  function Position(x, y) {
    this.x = x;
    this.y = y;
  }
  
  Position.prototype.clone = function() {
    return new Position(this.x, this.y);
  };
  
  Position.prototype.plus = function(another) {
    return new Position(this.x + another.x, this.y + another.y);
  };
  
  
  function Environment(width, depth, height) {
    this.width = width;
    this.depth = depth;
    this.height = height;
    
    this.position = new Position(0, 0);
    this.direction = new Position(0, 1);
    
    this.createFields();
    this.initBeepSound();
  }
  
  mixin(Environment.prototype, Events);
  
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
  
  Environment.prototype.istZiegel = function() {
    return this.getField(this.forward()).ziegel > 0;
  };
  
  Environment.prototype.hinlegen = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.");
    var nextPosition = this.forward();
    var field = this.getField(nextPosition);
    if (field.ziegel >= this.height) throw new Error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.");
    field.ziegel += 1;
    this._fireEvent('change', nextPosition);
  };
  
  Environment.prototype.aufheben = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Ziegel aufheben. Er steht vor einer Wand.");
    var nextPosition = this.forward();
    var field = this.getField(nextPosition);
    if (!field.ziegel) throw new Error("Karol kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.");
    field.ziegel--;
    this._fireEvent('change', nextPosition);
  };
  
  Environment.prototype.markeSetzen = function() {
    this.getField(this.position).marke = true;
    this._fireEvent('change', this.position);
  };
  
  Environment.prototype.markeLoeschen = function() {
    this.getField(this.position).marke = false;
    this._fireEvent('change', this.position);
  };
  
  Environment.prototype.marke = function() {
    var field = this.getField(this.position);
    field.marke = !field.marke;
    this._fireEvent('change', this.position);
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
  };
  
  Environment.prototype.rechtsDrehen = function() {
    this.direction = new Position(-this.direction.y, this.direction.x);
  };
  
  Environment.prototype.schritt = function() {
    if (this.istWand()) throw new Error("Karol kann keinen Schritt machen, er steht vor einer Wand.");
    var newPosition = this.forward();
    if (Math.abs(this.getField(this.position).ziegel - this.getField(newPosition).ziegel) > 1)
      throw new Error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.");
    this.position = newPosition;
  };
  
  Environment.prototype.quader = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader hinlegen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (field.quader) throw new Error("Karol kann keinen Quader hinlegen, da schon einer liegt.");
    if (field.ziegel) throw new Error("Karol kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.");
    field.quader = true;
    this._fireEvent('change', position);
  };
  
  Environment.prototype.initBeepSound = function() {
    if (win.Audio) {
      var sound = this.beepSound = new win.Audio();
      if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
        sound.src = 'beep.ogg';
      } else if (sound.canPlayType('audio/mpeg;')) {
        sound.src = 'beep.mp3';
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
  
  Environment.prototype.entfernen = function() {
    var position = this.forward();
    if (!this.isValid(position)) throw new Error("Karol kann keinen Quader entfernen. Er steht vor einer Wand.");
    var field = this.getField(position);
    if (!field.quader) throw new Error("Karol kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.");
    field.quader = false;
    this._fireEvent('change', position);
  };
  
  Environment.prototype.run = function(code) {
    var self = this;
    this.clone().execute(code, function(stack) {
      self.stack = stack;
      self.slowly();
    });
    //this.onchange && this.onchange();
  };
  
  Environment.prototype.clone = function() {
    var env = new Environment(this.width, this.depth, this.height);
    env.position  = this.position.clone();
    env.direction = this.direction.clone();
    env.fields = clone(this.fields);
    return env;
  };
  
  Environment.prototype.execute = function(code, callback) {
    var iframe = doc.createElement('iframe');
    iframe.style.display = 'none';
    doc.body.appendChild(iframe);
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
        callback(stack);
      }
    }
    
    each(['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen', 'hinlegen', 'aufheben', 'istZiegel', 'markeSetzen', 'markeLoeschen', 'istMarke'], function(name) {
      karol[name] = function(n) {
        n = n || 1;
        
        //var p = new printStackTrace.implementation();
        //var stacktrace = p.run();
        //log(stacktrace[2]);
        
        for (var i = 0; i < n; i++) {
          var result = self[name]();
          stack.push(name);
        }
        return result;
      };
    });
    
    karol.ton = function() {
      stack.push('ton');
    };
    
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
      var xhr = get(url, function(responseText, responseXML) {
        log(url, responseText, responseXML);
        removeFromArray(timed, xhr);
        exec(bind(fn, null, responseText, responseXML));
      }, function() {
        log('Loading failed: ' + url);
      });
      timed.push(xhr);
      return xhr;
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
      win.eval(code); // evil, I know
    });
  };
  
  Environment.prototype.next = function() {
    var command = this.stack.shift();
    if (typeof command == 'string') {
      this[command]();
    } else if (command instanceof Error) {
      win.alert(command);
    }
  };
  
  Environment.prototype.slowly = function() {
    var self = this;
    var interval = win.setInterval(function() {
      if (self.stack.length == 0) {
        clearInterval(interval);
      } else {
        self.next();
        self.onchange && self.onchange();
      }
    }, 150);
  };
  
  
  /*
   * View
   */
  
  function EnvironmentView(el, model) {
    this.model = model;
    this.createFields();
    
    var self = this;
    model.addEvent('change', function(position) {
      self.updateField(position.x, position.y);
      self.render();
    });
    
    this.el = el;
    this.renderer = new T.CanvasRenderer();
    this.createMouseListener();
    this.scene = new T.Scene();
    this.updateSize();
    this.degrees = 45;
    this.cameraZ = 120;
    this.updateCameraPosition();
    this.createGrid();
    this.render();
    this.inject();
  }
  
  EnvironmentView.GW = 40; // Grid Width
  EnvironmentView.GH = 25; // Grid Height
  
  EnvironmentView.prototype.createMouseListener = function() {
    var self = this;
    
    addEvent(this.renderer.domElement, 'mousedown', function(evt) {
      var down = { x: evt.clientX, y: evt.clientY };
      doc.body.style.cursor = 'move';
      
      function onMouseMove(evt) {
        var newDown = { x: evt.clientX, y: evt.clientY };
        var d_x = down.x - newDown.x,
            d_y = down.y - newDown.y;
        self.degrees += d_x / 4;
        self.cameraZ -= d_y * 2;
        self.updateCameraPosition();
        self.render();
        down = newDown;
      }
      
      function onMouseUp() {
        doc.body.style.cursor = 'default';
        removeEvent(doc.body, 'mousemove', onMouseMove);
        removeEvent(doc.body, 'mouseup', onMouseUp);
      }
      
      addEvent(doc.body, 'mousemove', onMouseMove);
      addEvent(doc.body, 'mouseup', onMouseUp);
    });
  };
  
  EnvironmentView.prototype.createGrid = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth,
        h = model.height;
    
    var material = new T.MeshBasicMaterial({ color: 0x5555cc, wireframe: true });
    var GW = EnvironmentView.GW;
    var GH = EnvironmentView.GH;
    
    // Ground
    var plane = new T.Mesh(new Plane(w*GW, d*GW, w, d), material);
    plane.doubleSided = true;
    this.scene.addObject(plane);
    
    // Back
    var plane = new T.Mesh(new Plane(w*GW, h*GH, w, h), material);
    plane.position.y = (d/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.x = Math.PI/2;
    plane.doubleSided = true;
    this.scene.addObject(plane);
    
    // Left Side
    var plane = new T.Mesh(new Plane(h*GH, d*GW, h, d), material);
    plane.position.x = -(w/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.y = Math.PI/2;
    plane.doubleSided = true;
    this.scene.addObject(plane);
  };
  
  EnvironmentView.prototype.createFields = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth;
    
    var fields = this.fields = [];
    for (var i = 0; i < w; i++) {
      var row = [];
      for (var j = 0; j < d; j++) {
        row.push({ ziegel: [], marke: null });
      }
      fields.push(row);
    }
  };
  
  EnvironmentView.prototype.updateField = function(x, y) {
    var model = this.model;
    var w = model.width,
        d = model.depth;
    
    var scene = this.scene;
    
    var GW = EnvironmentView.GW,
        GH = EnvironmentView.GH;
    var x0 = -GW*(model.width/2),
        y0 = GW*(model.depth/2);
    
    function createCubeMaterial(props) {
      var materials = [];
      for (var i = 0; i < 6; i++) {
        materials.push([new T.MeshBasicMaterial(props)]);
      }
      return materials;
    }
    
    var ZIEGEL_MATERIAL = createCubeMaterial({ color: 0xff0000, wireframe: true });
    var QUADER_MATERIAL = createCubeMaterial({ color: 0x666666 });
    
    //var M = T.MeshBasicMaterial({ color: 0xff0000 });
    //var MATERIALS = [[M], [M], [M], [M], [M], [M]];
    
    var fieldObj = this.fields[x][y];
    var field = model.fields[x][y];
    
    while (field.ziegel < fieldObj.ziegel.length) {
      scene.removeObject(fieldObj.ziegel.pop());
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
      }
    }
    
    while (field.ziegel > fieldObj.ziegel.length) {
      var z = fieldObj.ziegel.length;
      var cube = new T.Mesh(new Cube(GW, GW, GH, 1, 1, ZIEGEL_MATERIAL), new T.MeshFaceMaterial());
      cube.position.x = GW/2 + x0 + x*GW;
      cube.position.y = -GW/2 + y0 - y*GW;
      cube.position.z = GH/2 + z*GH;
      scene.addObject(cube);
      fieldObj.ziegel.push(cube);
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
      }
    }
    
    if (!field.marke && fieldObj.marke) {
      scene.removeObject(fieldObj.marke);
      delete fieldObj.marke;
    }
    
    if (field.marke && !fieldObj.marke) {
      var marke = new T.Mesh(
        new Plane(GW, GW, 1, 1),
        new T.MeshBasicMaterial({ color: 0xcccc55 })
      );
      marke.position.x = GW/2 + x0 + x*GW;
      marke.position.y = -GW/2 + y0 - y*GW;
      marke.position.z = fieldObj.ziegel.length*GH;
      scene.addObject(marke);
      fieldObj.marke = marke;
    }
    
    if (field.quader && !fieldObj.quader) {
      var cube = new T.Mesh(new Cube(GW, GW, 2*GH, 1, 1, QUADER_MATERIAL), new T.MeshFaceMaterial());
      cube.position.x = GW/2 + x0 + x*GW;
      cube.position.y = -GW/2 + y0 - y*GW;
      cube.position.z = GH;
      scene.addObject(cube);
      fieldObj.quader = cube;
    }
    
    if (!field.quader && fieldObj.quader) {
      scene.removeObject(fieldObj.quader);
      delete fieldObj.quader;
    }
  };
  
  EnvironmentView.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
  };
  
  EnvironmentView.prototype.updateSize = function() {
    var box = this.el.getBoundingClientRect(),
        width = box.width,
        height = box.height;
    
    var camera = this.camera = new T.Camera(75, width/height, 1, 1e5);
    camera.up = new T.Vector3(0, 0, 1);
    
    this.renderer.setSize(width, height);
  };
  
  EnvironmentView.prototype.updateCameraPosition = function() {
    var degrees = this.degrees;
    var radian = degrees * (Math.PI/180);
    var position = this.camera.position;
    
    var RADIUS = 400;
    position.x =  Math.sin(radian) * RADIUS;
    position.y = -Math.cos(radian) * RADIUS;
    position.z = this.cameraZ;
  };
  
  EnvironmentView.prototype.dimensionsChanged = function() {
    this.updateSize();
    this.render();
  };
  
  EnvironmentView.prototype.inject = function() {
    this.el.appendChild(this.renderer.domElement);
  };
  
  EnvironmentView.prototype.dispose = function() {
    this.el.removeChild(this.renderer.domElement);
  };
  
  
  /*
   * Controller
   */
  
  function AppController() {
    this.initModelAndView();
    
    win.onBespinLoad = bind(this.initBespin, this);
    var self = this;
    get('example.js', function(text) {
      self.exampleCode = text;
      self.initExampleCode();
    });
    
    this.initButtons();
    this.addEvents();
  }
  
  AppController.prototype.initModelAndView = function() {
    var environmentElement = $('environment');
    environmentElement.innerHTML = '';
    this.environment = new Environment(
      Number($('width').value),
      Number($('depth').value),
      Number($('height').value)
    );
    this.environmentView = new EnvironmentView(environmentElement, this.environment);
  };
  
  AppController.prototype.initBespin = function() {
    var self = this;
    bespin.useBespin($('editor')).then(function(env) {
      self.bespinEnv = env;
      self.editor = env.editor;
      self.editor.syntax = 'js';
      self.initExampleCode();
    }, function() {
      log('Bespin launch failed');
    });
  };
  
  AppController.prototype.initExampleCode = function() {
    if (this.exampleCode && this.editor) {
      this.editor.value = this.exampleCode;
    }
  };
  
  AppController.prototype.initButtons = function() {
    var self = this;
    
    addEvent($('run-button'),        'click', bind(this.run, this));
    addEvent($('reset-button'),      'click', bind(this.reset, this));
    addEvent($('new-button'),        'click', bind(this.toggleNewPane, this));
    addEvent($('new-cancel-button'), 'click', bind(this.toggleNewPane, this));
    addEvent($('new-apply-button'),  'click', function() {
      self.initModelAndView();
      self.toggleNewPane();
    });
    
    each(['links-drehen', 'schritt', 'rechts-drehen', 'hinlegen', 'aufheben', 'marke', 'quader', 'entfernen'], function(name) {
      var button = $(name);
      var method = capitalize(name);
      addEvent(button, 'click', function() {
        try {
          self.environment[method]();
        } catch (exc) {
          alert(exc);
        }
        self.environmentView.render();
      });
    });
  };
  
  AppController.prototype.addEvents = function() {
    var self = this;
    function resize() {
      self.bespinEnv.dimensionsChanged();
      self.environmentView.dimensionsChanged();
    }
    
    var resizeTimeout = null;
    addEvent(win, 'resize', function() {
      win.clearTimeout(resizeTimeout);
      win.setTimeout(resize, 25);
    });
  };
  
  AppController.prototype.run = function() {
    this.environment.run(this.editor.value);
  };
  
  AppController.prototype.reset = function() {
    this.environmentView.dispose();
    this.initModelAndView();
  };
  
  AppController.prototype.toggleNewPane = function() {
    var el = $('new-pane');
    var classRegex = /(^|\s)visible(\s|$)/
    if (el.className.match(classRegex)) {
      el.className = el.className.replace(classRegex, ' ');
    } else {
      el.className += ' visible';
    }
  };
  
  new AppController();
})(window, document);
