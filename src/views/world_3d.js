(function() {
var _      = require('underscore')
,   matrix = require('helpers/matrix')
,   three  = require('three')

module.exports = require('views/world_base').extend({

  initialize: function() {
    _(this).bindAll(
      'updateRobot', 'updateField', 'updateAllFields', 'delegateEvents',
      'resizeAndRender', 'resize', 'render', 'delayRender'
    )
    
    this.model
      .bind('change:field', this.updateField)
      .bind('change:robot', this.updateRobot)
      .bind('change:all', this.updateAllFields)
      .bind('change:all', this.updateRobot)
      .bind('change', this.delayRender)
    
    this
      .bind('dom:insert', this.resizeAndRender)
      .bind('dom:insert', this.delegateEvents)
    
    $(window).resize(this.resizeAndRender)
    
    this.createFields()
    this.renderer = new three.CanvasRenderer()
    this.el = $(this.renderer.domElement)
    this.scene = new three.Scene()
    this.degrees = 45
    this.cameraZ = 120
    this.radius = 400
    this.createGrid()
    this.createLights()
    
    this.initScrollEvents()
  },

  GW: 40, // Grid Width
  GH: 22, // Grid Height
  WALL_HEIGHT: 5,

  events: {
    mousedown: 'onMousedown',
    dragover:  'preventDefault',
    dragenter: 'preventDefault',
    drop:      'onDrop'
  },

  onMousedown: function(evt) {
    var down = { x: evt.clientX, y: evt.clientY }
    
    $('body')
      .css('cursor', 'move')
      .mousemove(_(function(evt) {
        var newDown = { x: evt.clientX, y: evt.clientY }
        var d_x = down.x - newDown.x
        ,   d_y = down.y - newDown.y
        this.degrees += d_x / 4
        this.cameraZ -= d_y * 2
        this.updateCameraPosition()
        this.render()
        down = newDown
      }).bind(this))
      .mouseup(function() {
        $('body')
          .css('cursor', 'default')
          .unbind('mousemove')
          .unbind('mouseup')
      })
  },

  initScrollEvents: function() {
    var hover = false
    $(this.el)
      .mouseover(function() { hover = true })
      .mouseout (function() { hover = false })
    
    var zoom = _(function(r) {
      if (hover) {
        this.radius *= r
        this.updateCameraPosition()
        this.render()
      }
    }).bind(this)
    
    // IE, Webkit, Opera
    $(document).bind('mousewheel', function(evt) {
      zoom(1 - evt.wheelDelta/2400)
    })
    // Firefox
    $(window).bind('DOMMouseScroll', function(evt) {
      zoom(1 + evt.detail/20)
    })
  },

  createGrid: function() {
    var model = this.model
    var w = model.get('width')
    ,   d = model.get('depth')
    ,   h = this.WALL_HEIGHT
    
    var material = new three.MeshBasicMaterial({ color: 0x5555cc, wireframe: true })
    var GW = this.GW
    ,   GH = this.GH
    
    // Ground
    var plane = new three.Mesh(new Plane(w*GW, d*GW, w, d), material)
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Back
    var plane = new three.Mesh(new Plane(w*GW, h*GH, w, h), material)
    plane.position.y = (d/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.x = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Left Side
    var plane = new three.Mesh(new Plane(h*GH, d*GW, h, d), material)
    plane.position.x = -(w/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.y = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
  },

  createLights: function() {
    var l = new three.AmbientLight(0x888888)
    this.scene.addLight(l)
    
    var l = this.light = new three.DirectionalLight(0xaaaaaa)
    this.scene.addLight(l)
  },

  createFields: function() {
    var m = this.model
    this.fields = matrix(m.get('width'), m.get('depth'), function() {
      return { ziegel: [], marke: null }
    })
  },

  updateAllFields: function() {
    this.model.eachField(_.bind(this.updateField, this))
  },

  updateField: function(x, y, field) {
    var model = this.model
    var scene = this.scene
    var fieldObj = this.fields[x][y]
    
    var GW = this.GW
    ,   GH = this.GH
    var x0 = -GW*(model.get('width')/2)
    ,   y0 = GW*(model.get('depth')/2)
    
    while (field.ziegel < fieldObj.ziegel.length) {
      scene.removeObject(fieldObj.ziegel.pop())
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH
      }
    }
    
    while (field.ziegel > fieldObj.ziegel.length) {
      var z = fieldObj.ziegel.length
      var cube = new three.Mesh(
        new Cube(GW, GW, GH, 1, 1, new three.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.ziegel.hex, shading: three.FlatShading })),
        new three.MeshFaceMaterial()
      )
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH/2 + z*GH
      scene.addObject(cube)
      fieldObj.ziegel.push(cube)
      if (fieldObj.marke) {
        fieldObj.marke.position.z = fieldObj.ziegel.length*GH
      }
    }
    
    if (!field.marke && fieldObj.marke) {
      scene.removeObject(fieldObj.marke)
      delete fieldObj.marke
    }
    
    if (field.marke && !fieldObj.marke) {
      var marke = new three.Mesh(
        new Plane(GW, GW, 1, 1),
        new three.MeshBasicMaterial({ color: ENVIRONMENT_COLORS.marke.hex })
      )
      marke.position.x = GW/2 + x0 + x*GW
      marke.position.y = -GW/2 + y0 - y*GW
      marke.position.z = fieldObj.ziegel.length*GH + 1
      scene.addObject(marke)
      fieldObj.marke = marke
    }
    
    if (field.quader && !fieldObj.quader) {
      var cube = new three.Mesh(new Cube(GW, GW, 2*GH, 1, 1), new three.MeshLambertMaterial({ color: ENVIRONMENT_COLORS.quader.hex, shading: three.FlatShading }))
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH
      scene.addObject(cube)
      fieldObj.quader = cube
    }
    
    if (!field.quader && fieldObj.quader) {
      scene.removeObject(fieldObj.quader)
      delete fieldObj.quader
    }
  },

  updateRobot: function() {
    // TODO: Update the position of the robot
  },

  resizeAndRender: function() {
    this.resize()
    this.render()
  },

  resize: function() {
    var parent = $(this.el).parent()
    ,   width  = parent.innerWidth()
    ,   height = parent.innerHeight()
    
    this.createCamera(width, height)
    this.renderer.setSize(width, height)
  },

  render: function() {
    console.log('Render 3D')
    this.renderer.render(this.scene, this.camera)
  },

  createCamera: function(width, height) {
    this.camera = new three.Camera(75, width/height, 1, 1e5)
    this.camera.up = new three.Vector3(0, 0, 1)
    this.updateCameraPosition()
  },

  updateCameraPosition: function() {
    var degrees = this.degrees
    var radian = degrees * (Math.PI/180)
    var p1 = this.camera.position
    var p2 = this.light.position
    
    p1.x = p2.x =  Math.sin(radian) * this.radius
    p1.y = p2.y = -Math.cos(radian) * this.radius
    p1.z = p2.z = this.cameraZ
    
    p2.normalize()
  }

}, {
  path: 'views/world_3d'
})

})()