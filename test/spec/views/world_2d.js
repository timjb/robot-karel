describe("World2D", function() {

  var model, view

  beforeEach(function() {
    model = new Karel.Models.World()
    view  = new Karel.Views.World2D({ model: model })
    view.render()
  })

  it("should display a grid with the same dimensions as the world", function() {
    expect($('tr', view.el).length).toEqual(model.get('depth'))
    expect($('td', view.el).length).toEqual(model.get('depth') *
                                            model.get('width'))
  })

  it("should display markers", function() {
    var test = function() {
      var position = model.get('robot').get('position')
      expect(view.fields[position.y][position.x].hasClass('marker'))
        .toEqual(model.getField(position).marker)
    }
    
    test()
    model.get('robot').putMarker()
    view.render()
    test()
  })

  it("should display blocks", function() {
    var test = function() {
      var robot     = model.get('robot')
      ,   position  = robot.get('position')
      ,   direction = robot.get('direction')
      ,   nextPos   = position.plus(direction)
      
      expect(view.fields[nextPos.y][nextPos.x].hasClass('block'))
        .toEqual(model.getField(nextPos).block)
    }
    
    test()
    model.get('robot').putBlock()
    view.render()
    test()
  })

  it("should display bricks", function() {
    var test = function() {
      var robot     = model.get('robot')
      ,   position  = robot.get('position')
      ,   direction = robot.get('direction')
      ,   nextPos   = position.plus(direction)
      
      var td    = view.fields[nextPos.y][nextPos.x]
      var field = model.getField(nextPos)
      
      expect(td.hasClass('brick')).toEqual(!!field.bricks)
      if (field.bricks) {
        expect(parseInt(td.text(), 10)).toEqual(field.bricks)
      } else {
        expect(td.text()).toEqual('')
      }
    }
    
    var robot = model.get('robot')
    test()
    robot.putBrick()
    view.render()
    test()
    robot.putBrick()
    view.render()
    test()
    while (robot.isBrick()) robot.removeBrick()
    view.render()
    test()
  })

  var directions = ['\u25bc','\u25c4','\u25b2','\u25ba'] // S, W, N, E

  it("should display the position and direction of the robot", function() {
    var test = function() {
      var robot    = model.get('robot')
      ,   position = robot.get('position')
      ,   dir      = robot.get('direction')
      
      var directionIndex =
        [dir.isSouth(), dir.isWest(), dir.isNorth(), dir.isEast()].indexOf(true)
      expect(view.fields[position.y][position.x].text())
        .toEqual(directions[directionIndex])
    }

    var robot = model.get('robot')
    test()
    robot.set({ position: new Karel.Models.Position(4,2) })
    view.render()
    test()
    robot.set({ direction: Karel.Models.Direction.EAST })
    view.render()
    test()
    robot.turnLeft()
    view.render()
    test()
  })

  it("should set the position when left-clicking on a field", function() {
    var position = new Karel.Models.Position(2,3)
    var event = new $.Event('mousedown', { which: 1 })
    view.fields[position.y][position.x].trigger(event)
    expect(model.get('robot').get('position').equals(position)).toBeTruthy()
  })

  it("should toggle the marker when right-clicking on a field", function() {
    var position = new Karel.Models.Position(3,3)
    var event = new $.Event('mousedown', { which: 3 })
    view.fields[position.y][position.x].trigger(event)
    expect(model.getField(position).marker).toBeTruthy()
    view.fields[position.y][position.x].trigger(event)
    expect(model.getField(position).marker).toBeFalsy()
  })

})
