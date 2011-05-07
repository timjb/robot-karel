Skin.hasCanvasSupport =
  typeof document.createElement('canvas').getContext === 'function'

Karel.Views.World3D = Karel.Views.WorldBase.extend(!Skin.hasCanvasSupport ? {} : {

  initialize: function() {
    _(this).bindAll('updateRobot', 'updateField', 'delayRender')
    
    this.model
      .bind('change:field', this.updateField)
      .bind('change:robot', this.updateRobot)
      .bind('change',       this.delayRender)
    
    this.createFields()
    this.renderer = new THREE.CanvasRenderer()
    
    /* I made the canvas "position: absolute;" because of a weird Firefox bug */
    $(this.el).css({ position: 'relative' })
    $(this.renderer.domElement).css({ position: 'absolute' })
    $(this.el).append(this.renderer.domElement)
    
    this.scene = new THREE.Scene()
    this.degrees = 45
    this.cameraZ = 120
    this.radius  = 400
    this.createRobot()
    this.createGrid()
    this.createLights()
    this.updateAllFields()
  },

  GW: 40, // Grid Width
  GH: 22, // Grid Height
  WALL_HEIGHT: 5,

  events: _.extend({
    mousedown: 'onMousedown'
  }, Karel.Views.WorldBase.prototype.events),

  onInsert: function() {
    this.render()
    this.delegateEvents()
    this.initScrollEvents()
  },

  onRemove: function() {
    this.removeScrollEvents()
  },

  onMousedown: function(event) {
    event.preventDefault() // Disable text selection
    
    var down = { x: event.clientX, y: event.clientY }
    
    $('body')
      .css('cursor', 'move')
      .mousemove(_(function(event) {
        var newDown = { x: event.clientX, y: event.clientY }
        var d_x = down.x - newDown.x
        ,   d_y = down.y - newDown.y
        this.degrees += d_x / 4
        this.cameraZ -= d_y * 2
        this.updateCameraPosition()
        this.renderScene()
        down = newDown
      }).bind(this))
      .mouseup(function() {
        $('body')
          .css('cursor', 'default')
          .unbind('mousemove') // TODO: don't unbind all bound functions
          .unbind('mouseup')   // - " -
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
        this.renderScene()
      }
    }).bind(this)
    
    // IE, WebKit, Opera
    $(document).bind('mousewheel', this.onMousewheel = function(event) {
      zoom(1 - event.wheelDelta/2400)
    })
    // Firefox
    $(window).bind('DOMMouseScroll', this.onDOMMouseScroll = function(event) {
      zoom(1 + event.detail/20)
    })
  },

  removeScrollEvents: function() {
    $(document).unbind('mousewheel', this.onMousewheel)
    $(window).unbind('DOMMouseScroll', this.onDOMMouseScroll)
  },

  createRobot: function() {
    var Model = window['simple_robot']
    this.robot = new THREE.Mesh(new Model(), new THREE.MeshFaceMaterial())
    var scale = this.robot.scale
    scale.x = scale.y = scale.z = 2
    this.scene.addObject(this.robot)
    this.updateRobot()
  },

  createGrid: function() {
    var model = this.model
    var w = model.get('width')
    ,   d = model.get('depth')
    ,   h = this.WALL_HEIGHT
    
    var material = new THREE.MeshBasicMaterial({
      color: 0x5555cc,
      wireframe: true
    })
    var GW = this.GW
    ,   GH = this.GH
    
    // Ground
    var plane = new THREE.Mesh(new THREE.Plane(w*GW, d*GW, w, d), material)
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Back
    var plane = new THREE.Mesh(new THREE.Plane(w*GW, h*GH, w, h), material)
    plane.position.y = (d/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.x = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
    
    // Left Side
    var plane = new THREE.Mesh(new THREE.Plane(h*GH, d*GW, h, d), material)
    plane.position.x = -(w/2)*GW
    plane.position.z = (h/2)*GH
    plane.rotation.y = Math.PI/2
    plane.doubleSided = true
    this.scene.addObject(plane)
  },

  createLights: function() {
    var l = new THREE.AmbientLight(0x888888)
    this.scene.addLight(l)
    
    var l = this.light = new THREE.DirectionalLight(0xaaaaaa)
    this.scene.addLight(l)
  },

  createFields: function() {
    var m = this.model
    this.fields = Karel.Helpers.matrix(m.get('width'), m.get('depth'), function() {
      return { bricks: [], marker: null }
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
    
    while (field.bricks < fieldObj.bricks.length) {
      scene.removeObject(fieldObj.bricks.pop())
      if (fieldObj.marker) {
        fieldObj.marker.position.z = fieldObj.bricks.length*GH
      }
    }
    
    while (field.bricks > fieldObj.bricks.length) {
      var z = fieldObj.bricks.length
      var cube = new THREE.Mesh(
        new THREE.Cube(GW, GW, GH, 1, 1),
        new THREE.MeshLambertMaterial({
          color: Karel.settings.COLORS.BRICK,
          shading: THREE.FlatShading
        })
      )
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH/2 + z*GH
      scene.addObject(cube)
      fieldObj.bricks.push(cube)
      if (fieldObj.marker) {
        fieldObj.marker.position.z = fieldObj.bricks.length*GH
      }
    }
    
    if (!field.marker && fieldObj.marker) {
      scene.removeObject(fieldObj.marker)
      delete fieldObj.marker
    }
    
    if (field.marker && !fieldObj.marker) {
      var marker = new THREE.Mesh(
        new THREE.Plane(GW, GW, 1, 1),
        new THREE.MeshBasicMaterial({ color: Karel.settings.COLORS.MARKER })
      )
      marker.position.x = GW/2 + x0 + x*GW
      marker.position.y = -GW/2 + y0 - y*GW
      marker.position.z = fieldObj.bricks.length*GH + 1
      marker.doubleSided = true
      scene.addObject(marker)
      fieldObj.marker = marker
    }
    
    if (field.block && !fieldObj.block) {
      var cube = new THREE.Mesh(
        new THREE.Cube(GW, GW, 2*GH, 1, 1),
        new THREE.MeshLambertMaterial({
          color: Karel.settings.COLORS.BLOCK,
          shading: THREE.FlatShading
        })
      )
      cube.position.x = GW/2 + x0 + x*GW
      cube.position.y = -GW/2 + y0 - y*GW
      cube.position.z = GH
      scene.addObject(cube)
      fieldObj.block = cube
    }
    
    if (!field.block && fieldObj.block) {
      scene.removeObject(fieldObj.block)
      delete fieldObj.block
    }
  },

  updateRobot: function() {
    var robot     = this.model.get('robot')
    ,   position  = robot.get('position')
    ,   dir       = robot.get('direction')
    
    var GW = this.GW
    ,   GH = this.GH
    ,   w  = this.model.get('width')
    ,   d  = this.model.get('depth')
    
    this.robot.position.x = -(w/2)*GW + GW*(.5 + position.x)
    this.robot.position.y = +(d/2)*GW - GW*(.5 + position.y)
    this.robot.position.z = GH * robot.currentField().bricks
    
    this.robot.rotation.z = (-Math.PI/2) *
      [dir.isSouth(), dir.isWest(), dir.isNorth(), dir.isEast()].indexOf(true)
  },

  onResize: function() {
    this.render()
  },

  render: function() {
    var parent = $(this.el).parent()
    ,   width  = parent.innerWidth()
    ,   height = parent.innerHeight()
    
    this.createCamera(width, height)
    this.renderer.setSize(width, height)
    
    this.renderScene()
    return this
  },

  renderScene: function() {
    console.log('Render 3D')
    this.renderer.render(this.scene, this.camera)
    return this
  },

  createCamera: function(width, height) {
    this.camera = new THREE.Camera(75, width/height, 1, 1e5)
    this.camera.up = new THREE.Vector3(0, 0, 1)
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

})
