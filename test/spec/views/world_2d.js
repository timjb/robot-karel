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
      var position = model.getRobot().get('position')
      expect(view.fields[position.y][position.x].hasClass('marker'))
        .toEqual(model.getField(position).marker)
    }
    
    test()
    model.getRobot().putMarker()
    view.render()
    test()
  })

  it("should display blocks", function() {
    var test = function() {
      var robot     = model.getRobot()
      ,   position  = robot.get('position')
      ,   direction = robot.get('direction')
      ,   nextPos   = position.plus(direction)
      
      expect(view.fields[nextPos.y][nextPos.x].hasClass('block'))
        .toEqual(model.getField(nextPos).block)
    }
    
    test()
    model.getRobot().putBlock()
    view.render()
    test()
  })

  it("should display bricks", function() {
    var last = function (arr) { return arr[arr.length - 1] }
    var padLeft = function (str, n, padChar) {
      while (str.length < n) {
        str = padChar + str
      }
      return str
    }
    var toCSS = function (n) { return '#' + padLeft(n.toString(16), 6, '0') }
    var test = function () {
      var robot     = model.getRobot()
      ,   position  = robot.get('position')
      ,   direction = robot.get('direction')
      ,   nextPos   = position.plus(direction)
      
      var td    = view.fields[nextPos.y][nextPos.x]
      var field = model.getField(nextPos)
      
      expect(td.hasClass('brick')).toEqual(field.bricks.length > 0)
      if (field.bricks.length > 0) {
        expect(td.css('background').replace(/\s/g, '')).toBe(new THREE.Color(last(field.bricks)).getContextStyle())
        expect(parseInt(td.text(), 10)).toEqual(field.bricks.length)
      } else {
        expect(td.css('background')).toBe('')
        expect(td.text()).toEqual('')
      }
    }
    
    var robot = model.getRobot()
    test()
    robot.putBrick()
    view.render()
    test()
    robot.setGreen().putBrick()
    view.render()
    test()
    while (robot.isBrick()) {
      robot.removeBrick()
      view.render()
      test()
    }
  })

  var directions = ['\u25bc','\u25c4','\u25b2','\u25ba'] // S, W, N, E

  it("should display the position and direction of the robot", function() {
    var test = function() {
      var robot    = model.getRobot()
      ,   position = robot.get('position')
      ,   dir      = robot.get('direction')
      
      var directionIndex =
        [dir.isSouth(), dir.isWest(), dir.isNorth(), dir.isEast()].indexOf(true)
      expect(view.fields[position.y][position.x].text())
        .toEqual(directions[directionIndex])
    }

    var robot = model.getRobot()
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
    expect(model.getRobot().get('position').equals(position)).toBeTruthy()
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
