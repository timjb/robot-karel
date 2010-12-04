(function(win, doc, T, undefined) {
  /*
   * Helpers
   */
  
  function $(id) {
    return doc.getElementById(id);
  }
  
  function bind(fn, obj) {
    return function() {
      fn.apply(obj, arguments);
    };
  }
  
  function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', url);
    xhr.send(null);
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
  
  
  /*
   * Model
   */
  
  function Field() {
    this.ziegel = 0;
    this.marke = false;
  }
  
  Field.prototype.clone = function() {
    var f = new Field();
    f.ziegel = this.ziegel;
    f.marke = this.marke;
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
    this.direction = new Position(1, 0);
    
    this.createFields();
  }
  
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
    var position = this.forward();
    if (this.isValid(position)) {
      var field = this.getField(position);
      if (field.ziegel < this.height) {
        field.ziegel += 1;
      } else {
        throw new Error("Karol kann keinen Ziegel hinlegen, da die Maximalhoehe erreicht wurde.");
      }
    } else {
      throw new Error("Karol kann keinen Ziegel hinlegen. Er steht vor einer Wand.");
    }
  };
  
  Environment.prototype.aufnehmen = function() {
    var position = this.forward();
    if (this.isValid(position)) {
      var field = this.getField(position);
      if (field.ziegel > 0) {
        field.ziegel--;
      } else {
        throw new Error("Karol kann keinen Ziegel aufnehmen, da kein Ziegel vor ihm liegt.");
      }
    } else {
      throw new Error("Karol kann keinen Ziegel aufnehmen. Er steht vor einer Wand.");
    }
  };
  
  Environment.prototype.markeSetzen = function() {
    this.getField(this.position).marke = true;
  };
  
  Environment.prototype.markeLoeschen = function() {
    this.getField(this.position).marke = false;
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
    return !this.isValid(this.forward());
  };
  
  Environment.prototype.linksDrehen = function() {
    this.direction = new Position(this.direction.y, -this.direction.x);
  };
  
  Environment.prototype.rechtsDrehen = function() {
    this.direction = new Position(-this.direction.y, this.direction.x);
  };
  
  Environment.prototype.schritt = function() {
    var newPosition = this.forward();
    if (this.isValid(newPosition)) {
      if (Math.abs(this.getField(this.position).ziegel - this.getField(newPosition).ziegel) <= 1) {
        this.position = newPosition;
      } else {
        throw new Error("Karol kann nur einen Ziegel pro Schritt nach oben oder unten springen.");
      }
    } else {
      throw new Error("Karol kann keinen Schritt machen, er steht vor einer Wand.");
    }
  };
  
  Environment.prototype.run = function(code) {
    this.stack = this.clone().execute(code);
    this.slowly();
    //this.onchange && this.onchange();
  };
  
  Environment.prototype.clone = function() {
    var env = new Environment(this.width, this.depth, this.height);
    env.position  = this.position.clone();
    env.direction = this.direction.clone();
    env.fields = clone(this.fields);
    return env;
  };
  
  Environment.prototype.execute = function(code) {
    var karol = {};
    var stack = [];
    var environment = this;
    var methods = ['istWand', 'schritt', 'linksDrehen', 'rechtsDrehen',
                   'hinlegen', 'aufheben', 'istZiegel',
                   'markeSetzen', 'markeLoeschen', 'istMarke'];
    
    for (var i = 0, l = methods.length; i < l; i++) {
      (function(name) {
        karol[name] = function(n) {
          n = n || 1;
          
          //var p = new printStackTrace.implementation();
          //var stacktrace = p.run();
          //console.log(stacktrace[2]);
          
          for (var i = 0; i < n; i++) {
            var result = environment[name]();
            stack.push(name);
          }
          return result;
        };
      })(methods[i]);
    }
    
    win.karol = karol;
    try {
      win.eval(code); // evil, I know
    } catch (exc) {
      //var stacktrace = (new printStackTrace.implementation).run(exc);
      stack.push(exc);
    }
    delete win.karol;
    
    return stack;
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
        win.clearInterval(interval);
      } else {
        self.next();
        self.onchange && self.onchange();
      }
    }, 250);
  };
  
  
  /*
   * View
   */
  
  function EnvironmentView(el, model) {
    this.model = model;
    this.createFields();
    
    var self = this;
    model.onchange = function() {
      self.updateFields();
      self.render();
    };
    
    this.el = el;
    this.createMouseListener();
    this.renderer = new T.CanvasRenderer();
    this.scene = new T.Scene();
    this.updateSize();
    this.degrees = 45;
    this.updateCameraPosition;
    this.createGrid();
    this.render();
    this.inject();
  }
  
  EnvironmentView.GW = 40; // Grid Width
  EnvironmentView.GH = 25; // Grid Height
  
  EnvironmentView.prototype.createMouseListener = function() {
    var self = this;
    this.el.onmousemove = function(evt) {
      var box = self.el.getBoundingClientRect();
      var x = evt.clientX - box.left;
      self.degrees = 180 * (x/box.width);
      self.updateCameraPosition();
      self.render();
    };
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
    this.scene.addObject(plane);
    
    // Back
    var plane = new T.Mesh(new Plane(w*GW, h*GH, w, h), material);
    plane.position.y = (d/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.x = Math.PI/2;
    this.scene.addObject(plane);
    
    // Left Side
    var plane = new T.Mesh(new Plane(h*GH, d*GW, h, d), material);
    plane.position.x = -(w/2)*GW;
    plane.position.z = (h/2)*GH;
    plane.rotation.y = Math.PI/2;
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
  
  EnvironmentView.prototype.updateFields = function() {
    var model = this.model;
    var w = model.width,
        d = model.depth;
    
    var scene = this.scene;
    
    var GW = EnvironmentView.GW;
    var GH = EnvironmentView.GH;
    var x0 = -GW*(model.width/2);
    var y0 = GW*(model.depth/2);
    
    var MATERIALS = [];
    for (var i = 0; i < 6; i++) {
      MATERIALS.push([new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })]);
    }
    
    //var M = T.MeshBasicMaterial({ color: 0xff0000 });
    //var MATERIALS = [[M], [M], [M], [M], [M], [M]];
    
    var fields = this.fields;
    for (var x = 0; x < w; x++) {
      var row = fields[x];
      for (var y = 0; y < d; y++) {
        var fieldObj = row[y];
        var field = model.fields[x][y];
        
        // TODO: Adjust position of marke
        
        while (field.ziegel < fieldObj.ziegel.length) {
          scene.removeObject(fieldObj.ziegel.pop());
          if (fieldObj.marke) {
            fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
          }
        }
        
        while (field.ziegel > fieldObj.ziegel.length) {
          var z = fieldObj.ziegel.length;
          var cube = new T.Mesh(new Cube(GW, GW, GH, 1, 1, MATERIALS), new T.MeshFaceMaterial());
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
      }
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
    camera.position.z = 120;
    
    this.renderer.setSize(width, height);
  };
  
  EnvironmentView.prototype.updateCameraPosition = function() {
    var degrees = this.degrees;
    var radian = degrees * (Math.PI/180);
    var position = this.camera.position;
    
    var RADIUS = 600;
    position.x =  Math.sin(radian) * RADIUS;
    position.y = -Math.cos(radian) * RADIUS;
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
    this.environment = new Environment(
      Number($('width').value),
      Number($('depth').value),
      Number($('height').value)
    );
    this.environmentView = new EnvironmentView($('environment'), this.environment);
  };
  
  AppController.prototype.initBespin = function() {
    var self = this;
    bespin.useBespin($('editor')).then(function(env) {
      self.bespinEnv = env;
      self.editor = env.editor;
      self.editor.syntax = 'js';
      self.initExampleCode();
    }, function() {
      win.console && win.console.log && console.log('Bespin launch failed');
    });
  };
  
  AppController.prototype.initExampleCode = function() {
    if (this.exampleCode && this.editor) {
      this.editor.value = this.exampleCode;
    }
  };
  
  AppController.prototype.initButtons = function() {
    $('run-button').onclick = bind(this.run, this);
    $('reset-button').onclick = bind(this.reset, this);
  };
  
  AppController.prototype.addEvents = function() {
    var self = this;
    function resize() {
      self.bespinEnv.dimensionsChanged();
      self.environmentView.dimensionsChanged();
    }
    
    var resizeTimeout = null;
    win.onresize = function() {
      win.clearTimeout(resizeTimeout);
      win.setTimeout(resize, 25);
    };
  };
  
  AppController.prototype.run = function() {
    this.environment.run(this.editor.value);
  };
  
  AppController.prototype.reset = function() {
    this.environmentView.dispose();
    this.initModelAndView();
  };
  
  new AppController();
})(window, document, THREE);
