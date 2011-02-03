function EnvironmentView3D(model) {
  this.model = model;
  this.createFields();
  
  var self = this;
  model
    .bind('change-field', function (position) {
      var x = position.x, y = position.y;
      self.updateField(x, y, model.get('fields')[x][y]);
      self.delayRender();
    })
    .bind('change-robot', function() {
      // TODO: Update the position of the robot
      self.delayRender();
    })
    .bind('complete-change', function() {
      self.updateAllFields();
      self.render();
    });
  
  this.renderer = new THREE.CanvasRenderer();
  this.createMouseListener();
  this.scene = new THREE.Scene();
  this.degrees = 45;
  this.cameraZ = 120;
  this.createGrid();
  this.createLights();
}

EnvironmentView3D.GW = 40; // Grid Width
EnvironmentView3D.GH = 22; // Grid Height

EnvironmentView3D.prototype = new View();

EnvironmentView3D.prototype.createMouseListener = function() {
  var self = this;
  
  $(this.renderer.domElement).mousedown(function(evt) {
    var down = { x: evt.clientX, y: evt.clientY };
    
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
      $('body')
        .css('cursor', 'default')
        .unbind('mousemove', onMouseMove)
        .unbind('mouseup', onMouseUp);
    }
    
    $('body')
      .css('cursor', 'move')
      .mousemove(onMouseMove)
      .mouseup(onMouseUp);
  });
};

EnvironmentView3D.prototype.createGrid = function() {
  var model = this.model;
  var w = model.get('width')
  ,   d = model.get('depth')
  ,   h = model.get('height');
  
  var material = new THREE.MeshBasicMaterial({ color: 0x5555cc, wireframe: true });
  var GW = EnvironmentView3D.GW;
  var GH = EnvironmentView3D.GH;
  
  // Ground
  var plane = new THREE.Mesh(new Plane(w*GW, d*GW, w, d), material);
  plane.doubleSided = true;
  this.scene.addObject(plane);
  
  // Back
  var plane = new THREE.Mesh(new Plane(w*GW, h*GH, w, h), material);
  plane.position.y = (d/2)*GW;
  plane.position.z = (h/2)*GH;
  plane.rotation.x = Math.PI/2;
  plane.doubleSided = true;
  this.scene.addObject(plane);
  
  // Left Side
  var plane = new THREE.Mesh(new Plane(h*GH, d*GW, h, d), material);
  plane.position.x = -(w/2)*GW;
  plane.position.z = (h/2)*GH;
  plane.rotation.y = Math.PI/2;
  plane.doubleSided = true;
  this.scene.addObject(plane);
};

EnvironmentView3D.prototype.createLights = function() {
  var l = new THREE.AmbientLight(0x888888);
  this.scene.addLight(l);
  
  var l = this.light = new THREE.DirectionalLight(0xaaaaaa);
  this.scene.addLight(l);
};

EnvironmentView3D.prototype.createFields = function() {
  var m = this.model;
  this.fields = matrix(m.get('width'), m.get('depth'), function() {
    return { ziegel: [], marke: null };
  });
};

EnvironmentView3D.prototype.updateAllFields = function() {
  this.model.eachField(_.bind(this.updateField, this));
};

EnvironmentView3D.prototype.updateField = function(x, y, field) {
  var model = this.model;
  var scene = this.scene;
  var fieldObj = this.fields[x][y];
  log(fieldObj);
  
  var GW = EnvironmentView3D.GW,
      GH = EnvironmentView3D.GH;
  var x0 = -GW*(model.get('width')/2),
      y0 = GW*(model.get('depth')/2);
  
  while (field.ziegel < fieldObj.ziegel.length) {
    scene.removeObject(fieldObj.ziegel.pop());
    if (fieldObj.marke) {
      fieldObj.marke.position.z = fieldObj.ziegel.length*GH;
    }
  }
  
  while (field.ziegel > fieldObj.ziegel.length) {
    var z = fieldObj.ziegel.length;
    var cube = new THREE.Mesh(
      new Cube(GW, GW, GH, 1, 1, new THREE.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.ziegel.hex, shading: THREE.FlatShading })),
      new THREE.MeshFaceMaterial()
    );
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
    var marke = new THREE.Mesh(
      new Plane(GW, GW, 1, 1),
      new THREE.MeshBasicMaterial({ color: ENVIRONMENT_COLORS.marke.hex })
    );
    marke.position.x = GW/2 + x0 + x*GW;
    marke.position.y = -GW/2 + y0 - y*GW;
    marke.position.z = fieldObj.ziegel.length*GH + 1;
    scene.addObject(marke);
    fieldObj.marke = marke;
  }
  
  if (field.quader && !fieldObj.quader) {
    var cube = new THREE.Mesh(new Cube(GW, GW, 2*GH, 1, 1), new THREE.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.quader.hex, shading: THREE.FlatShading }));
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

EnvironmentView3D.prototype.render = function() {
  log('render 3d');
  this.renderer.render(this.scene, this.camera);
};

EnvironmentView3D.prototype.updateSize = function(width, height) {
  this.createCamera(width, height);
  this.renderer.setSize(width, height);
};

EnvironmentView3D.prototype.createCamera = function(width, height) {
  var camera = this.camera = new THREE.Camera(75, width/height, 1, 1e5);
  camera.up = new THREE.Vector3(0, 0, 1);
  this.updateCameraPosition();
};

EnvironmentView3D.prototype.updateCameraPosition = function() {
  var degrees = this.degrees;
  var radian = degrees * (Math.PI/180);
  var p1 = this.camera.position;
  var p2 = this.light.position;
  
  var RADIUS = 400;
  p1.x = p2.x =  Math.sin(radian) * RADIUS;
  p1.y = p2.y = -Math.cos(radian) * RADIUS;
  p1.z = p2.z = this.cameraZ;
  
  p2.normalize();
};

EnvironmentView3D.prototype.getElement = function() {
  return $(this.renderer.domElement);
};

EnvironmentView3D.prototype.inject = function() {
  View.prototype.inject.apply(this, arguments);
  this.createMouseListener();
};
