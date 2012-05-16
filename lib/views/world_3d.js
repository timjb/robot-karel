Skin.hasCanvasSupport =
  typeof document.createElement('canvas').getContext === 'function'

Karel.Views.World3D = Karel.Views.WorldBase.extend(!Skin.hasCanvasSupport ? {} : {

  className: 'world-3d',

  initialize: function (options, povOptions) {
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
    
    this.setOptions(povOptions || {})
    
    this.scene = new THREE.Scene()
    this.createRobot()
    this.createGrid()
    this.createLights()
    this.updateAllFields()
  },

  setOptions: function (options) {
    var defaultOptions = { degrees: 45
                         , cameraY: 120
                         , radius: 400
                         , gridColor:   0x5555cc
                         , markerColor: 0xcccc55
                         , blockColor:  0x666666
                         }
    
    for (option in defaultOptions) {
      if (defaultOptions.hasOwnProperty(option)) {
        this[option] = options.hasOwnProperty(option)
                     ? options[option]
                     : defaultOptions[option]
      }
    }
  },

  GW: 40, // Grid Width
  GH: 22, // Grid Height
  WALL_HEIGHT: 5,

  events: _.extend({
    mousedown: 'onMousedown'
  }, Karel.Views.WorldBase.prototype.events),

  onInsert: function () {
    this.render()
    this.delegateEvents()
    this.initScrollEvents()
  },

  onRemove: function () {
    this.removeScrollEvents()
  },

  onMousedown: function (event) {
    event.preventDefault() // Disable text selection
    
    var down = { x: event.clientX, y: event.clientY }
    
    var onMousemove, onMouseup
    
    $('body')
      .css('cursor', 'move')
      .mousemove(onMousemove = _(function (event) {
        var newDown = { x: event.clientX, y: event.clientY }
        var d_x = down.x - newDown.x
        ,   d_y = down.y - newDown.y
        this.degrees += d_x / 4
        this.cameraY -= d_y * 2
        this.updateCameraPosition()
        this.renderScene()
        down = newDown
      }).bind(this))
      .mouseup(onMouseup = function () {
        $('body')
          .css('cursor', 'default')
          .unbind('mousemove', onMousemove)
          .unbind('mouseup', onMouseup)
      })
  },

  initScrollEvents: function () {
    var hover = false
    $(this.el)
      .mouseover(function () { hover = true })
      .mouseout (function () { hover = false })
    
    var zoom = _(function (r) {
      if (hover) {
        this.radius *= r
        this.updateCameraPosition()
        this.renderScene()
      }
    }).bind(this)
    
    // IE, WebKit, Opera
    $(document).bind('mousewheel', this.onMousewheel = function (event) {
      zoom(1 - event.originalEvent.wheelDelta/2400)
    })
    // Firefox
    $(window).bind('DOMMouseScroll', this.onDOMMouseScroll = function (event) {
      zoom(1 + event.originalEvent.detail/20)
    })
  },

  removeScrollEvents: function () {
    $(document).unbind('mousewheel', this.onMousewheel)
    $(window).unbind('DOMMouseScroll', this.onDOMMouseScroll)
  },

  createRobot: function () {
    var Model = window['simple_robot']
    this.robot = new THREE.Mesh(new Model(), new THREE.MeshFaceMaterial())
    this.robot.rotation.x = -Math.PI/2
    var scale = this.robot.scale
    scale.x = scale.y = scale.z = 2
    this.scene.add(this.robot)
    this.updateRobot()
  },

  createGrid: function () {
    var model = this.model
    var w = model.get('width')
    ,   d = model.get('depth')
    ,   h = this.WALL_HEIGHT
    
    var material = new THREE.MeshBasicMaterial({
      color: this.gridColor,
      wireframe: true
    })
    var GW = this.GW
    ,   GH = this.GH
    
    // Ground
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(w*GW, d*GW, w, d), material)
    plane.doubleSided = true
    this.scene.add(plane)
    
    // Back
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(w*GW, h*GH, w, h), material)
    plane.position.y = (h/2)*GH
    plane.position.z = -(d/2)*GW
    plane.rotation.x = Math.PI/2
    plane.doubleSided = true
    this.scene.add(plane)
    
    // Left Side
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(d*GW, h*GH, d, h), material)
    plane.position.x = -(w/2)*GW
    plane.position.y = (h/2)*GH
    plane.rotation.x = Math.PI/2
    plane.rotation.z = Math.PI/2
    plane.doubleSided = true
    this.scene.add(plane)
  },

  createLights: function () {
    var l = new THREE.AmbientLight(0x888888)
    this.scene.add(l)
    
    var l = this.light = new THREE.DirectionalLight(0xaaaaaa)
    this.scene.add(l)
  },

  createFields: function () {
    var m = this.model
    this.fields = Karel.Helpers.matrix(m.get('width'), m.get('depth'), function () {
      return { bricks: [], marker: null }
    })
  },

  updateAllFields: function () {
    this.model.eachField(_.bind(this.updateField, this))
  },

  updateField: function (x, y, field) {
    var model = this.model
    var scene = this.scene
    var fieldObj = this.fields[x][y]
    
    var GW = this.GW
    ,   GH = this.GH
    
    var setGroundPosition = _.bind(function (position) {
      this.setGroundPosition(position, x, y);
    }, this);
    
    if (field.marker && fieldObj.marker
                     && field.bricks.length !== fieldObj.bricks.length) {
      fieldObj.marker.position.y = field.height()*GH
    }
    
    while (field.bricks.length < fieldObj.bricks.length) {
      scene.remove(fieldObj.bricks.pop())
    }
    
    while (field.bricks.length > fieldObj.bricks.length) {
      var height = fieldObj.bricks.length
      ,   color = field.bricks[height]
      var cube = new THREE.Mesh(
        new THREE.CubeGeometry(GW, GH, GW, 1, 1),
        new THREE.MeshLambertMaterial({ color: color
                                      , shading: THREE.FlatShading })
      )
      setGroundPosition(cube.position)
      cube.position.y = GH/2 + height*GH
      scene.add(cube)
      fieldObj.bricks.push(cube)
    }
    
    if (!field.marker && fieldObj.marker) {
      scene.remove(fieldObj.marker)
      delete fieldObj.marker
    }
    
    if (field.marker && !fieldObj.marker) {
      var marker = new THREE.Mesh(
        new THREE.PlaneGeometry(GW, GW, 1, 1),
        new THREE.MeshBasicMaterial({ color: this.markerColor })
      )
      marker.rotation.x = Math.PI/2
      setGroundPosition(marker.position)
      marker.position.y = fieldObj.bricks.length*GH + 1
      marker.doubleSided = true
      scene.add(marker)
      fieldObj.marker = marker
    }
    
    if (field.block && !fieldObj.block) {
      var cube = new THREE.Mesh(
        new THREE.CubeGeometry(GW, 2*GH, GW, 1, 1),
        new THREE.MeshLambertMaterial({ color: this.blockColor
                                      , shading: THREE.FlatShading })
      )
      setGroundPosition(cube.position)
      cube.position.y = GH
      scene.add(cube)
      fieldObj.block = cube
    }
    
    if (!field.block && fieldObj.block) {
      scene.remove(fieldObj.block)
      delete fieldObj.block
    }
  },

  updateRobot: function () {
    var robot     = this.model.getRobot()
    ,   position  = robot.get('position')
    ,   dir       = robot.get('direction')
    
    this.setGroundPosition(this.robot.position, position.x, position.y);
    this.robot.position.y = this.GH * robot.currentField().height()
    
    this.robot.rotation.z = (-Math.PI/2) *
      [dir.isSouth(), dir.isWest(), dir.isNorth(), dir.isEast()].indexOf(true)
  },

  onResize: function () {
    this.render()
  },

  render: function () {
    var parent = $(this.el).parent()
    ,   width  = this.width  = parent.innerWidth()
    ,   height = this.height = parent.innerHeight()
    
    this.createCamera(width, height)
    this.renderer.setSize(width, height)
    
    this.renderScene()
    return this
  },

  renderScene: function () {
    console.log("Render 3D")
    this.renderer.render(this.scene, this.camera)
    return this
  },

  setGroundPosition: function (position, x, y) {
    var GW = this.GW
    ,   GH = this.GH
    var x0 = GW*this.model.get('width')/2
    ,   z0 = GW*this.model.get('depth')/2
    position.x = GW/2 - x0 + x*GW
    position.z = GW/2 - z0 + y*GW
  },

  createCamera: function (width, height) {
    if (this.camera) {
      this.scene.remove(this.camera);
    }
    this.camera = new THREE.PerspectiveCamera(50, width/height, 1, 1e5)
    this.updateCameraPosition()
    this.scene.add(this.camera)
  },

  updateCameraPosition: function () {
    var degrees = this.degrees
    var radian = degrees * (Math.PI/180)
    var p1 = this.camera.position
    var p2 = this.light.position
    
    p1.y = p2.y = this.WALL_HEIGHT*this.GH/2 + this.cameraY;
    p1.x = p2.x = Math.sin(radian) * this.radius
    p1.z = p2.z = Math.cos(radian) * this.radius
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    p2.normalize()
  }

})
