describe("World3D", function () {

  // This is very hard to test, since the scene is rendered in a canvas.
  // But we can test some internals.

  var model, view

  beforeEach(function () {
    model = new Karel.Models.World()
    view  = new Karel.Views.World3D({ model: model })
    view.appendTo(testEl)
  })

  afterEach(function () {
    view.remove()
  })

  it("should accept an object specifying the degrees and cameraY of the pov", function () {
    view = new Karel.Views.World3D({ model: model }, { degrees: 77, cameraY: 0, radius: 777 })
    expect(view.degrees).toBe(77)
    expect(view.cameraY).toBe(0)
    expect(view.radius).toBe(777)
  })

  it("should rotate when dragging", function () {
    var startDegrees = view.degrees
    ,   startCameraZ = view.cameraY
    
    var el     = $(view.el)
    ,   offset = el.offset()
    ,   start  = { clientX: offset.left + el.outerWidth()/2
                 , clientY: offset.top  + el.outerHeight()/2 }
    ,   end    = { clientX: start.clientX + 100
                 , clientY: start.clientY + 20}
    
    el.trigger(new $.Event('mousedown', start))
    $(document.body)
      .trigger(new $.Event('mousemove', {
        clientX: (start.clientX + end.clientX) / 2,
        clientY: (start.clientY + end.clientY) / 2
      }))
      .trigger(new $.Event('mousemove', end))
      .trigger(new $.Event('mouseup'))
    
    var endDegrees = view.degrees
    ,   endCameraZ = view.cameraY
    
    expect(endDegrees).not.toBe(startDegrees)
    expect(endCameraZ).toBeGreaterThan(startCameraZ)
  })

  it("should zoom when scrolling", function () {
    var startRadius = view.radius
    
    var scroll = function () {
      $(document).trigger(new $.Event('mousewheel', { originalEvent: { wheelDelta: 120 } }))
      $(window).trigger(new $.Event('DOMMouseScroll', { originalEvent: { detail: -3 } }))
    }
    
    _.times(3, scroll)
    
    expect(view.radius).toBe(startRadius)
    
    $(view.el).trigger(new $.Event('mouseover'))
    _.times(3, scroll)
    
    expect(view.radius).toBeLessThan(startRadius)
  })

  // updateField
  var expectAllFieldsToBeUpToDate = function () {
    model.eachField(function (x, y, field) {
      var fieldObj = view.fields[x][y]
      expect(fieldObj.bricks.length).toBe(field.height())
      _.each(fieldObj.bricks, function (brickObj, i) {
        expect(brickObj).toBeInstanceof(THREE.Mesh)
        expect(brickObj.material.color.getHex()).toBe(field.bricks[i])
      })
      expect(!!fieldObj.marker).toBe(field.marker)
      if (fieldObj.marker) {
        expect(fieldObj.marker).toBeInstanceof(THREE.Mesh)
        expect(fieldObj.marker.position.y).toBe(field.bricks.length*view.GH+1)
      }
      expect(!!fieldObj.block).toBe(field.block)
      if (fieldObj.block) expect(fieldObj.block).toBeInstanceof(THREE.Mesh)
    })
  }

  it("should update all fields and the robot", function () {
    var startObjectCount = view.scene.__objects.length
    ,   startPosition    = view.robot.position.clone()
    ,   startRotation    = view.robot.rotation.clone()
    
    expectAllFieldsToBeUpToDate()
    model.getRobot()
      .putBrick()
      .move()
      .setBlue()
      .putBrick()
      .removeBrick()
      .setPurple()
      .putBrick(2)
      .move()
      .putMarker()
      .turnLeft()
      .putBlock()
    expectAllFieldsToBeUpToDate()
    
    var endObjectCount = view.scene.__objects.length
    ,   endPosition    = view.robot.position.clone()
    ,   endRotation    = view.robot.rotation.clone()
    
    // +1 marker, +3 bricks, +1 block
    expect(endObjectCount - startObjectCount).toBe(5)
    expect(endPosition).not.toEqual(startPosition)
    expect(endRotation).not.toEqual(startRotation)
  })

})
