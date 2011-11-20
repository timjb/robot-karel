(function() {

var Position  = Karel.Models.Position
,   Direction = Karel.Models.Direction
,   World     = Karel.Models.World
,   Field     = World.Field
,   settings  = Karel.settings

describe("Field", function() {
  it("should have no bricks, blocks or markers when new", function () {
    var field = new Field()
    expect(field.bricks).toEqual([])
    expect(field.marker).toBe(false)
    expect(field.block).toBe(false)
  })
  
  it("should make a clone of a field", function() {
    var field = new Field()
    field.bricks = [0xff0000, 0xff0000]
    field.marker = true
    var clone = field.clone()
    expect(clone).not.toBe(field)
    expect(clone.bricks).toEqual(field.bricks)
    expect(clone.marker).toBe(field.marker)
  })

  it("should be testable for equality", function() {
    var field1 = new Field()
    field1.bricks = []
    field1.marker = true
    field1.block  = false
    var field2 = field1.clone()
    
    expect(field1.equals(field2)).toBe(true)
    
    field2.block = true
    expect(field1.equals(field2)).toBe(false)
    field2.block = field1.block
    
    field2.bricks.push(0xff0000)
    expect(field1.equals(field2)).toBe(false)
  })

  it("should tell me if and how many bricks it has", function () {
    var field = new Field()
    expect(field.hasBrick()).toBe(false)
    expect(field.height()).toBe(0)
    field.bricks = [0xff0000, 0x00ff00]
    expect(field.hasBrick()).toBe(true)
    expect(field.height()).toBe(2)
  })
})


describe("World and Robot", function() {
  var world, robot

  beforeEach(function() {
    world = new World({ width: 3, depth: 3 })
    robot = world.getRobot()
  })

  // Dimensions

  it("should start on the position (0,0)", function() {
    expect(robot).toHavePosition(new Position(0,0))
  })

  it("should look south at first", function() {
    expect(robot).toHaveDirection(new Direction(0,1))
  })

  it("should lay red bricks per default", function () {
    expect(robot.get('color')).toBe(0xff0000)
  })

  // Movement

  it("should move when told to", function() {
    robot.move()
    expect(robot).toHavePosition(new Position(0,1))
  })

  it("should also move backwards", function() {
    robot.move()
    robot.moveBackwards()
    expect(robot).toHavePosition(new Position(0,0))
    expect(function() { robot.moveBackwards() }).toThrow()
  })

  it("should turn left", function() {
    robot.turnLeft()
    expect(robot).toHaveDirection(new Direction(1,0))
    robot.move()
    expect(robot).toHavePosition(new Position(1,0))
  })

  it("should turn right", function() {
    robot.turnRight()
    expect(robot).toHaveDirection(new Direction(-1,0))
    robot.moveBackwards()
    expect(robot).toHavePosition(new Position(1,0))
  })

  it("should have a depth of 3", function() {
    robot.move()
    robot.move()
    expect(function() { robot.move() }).toThrow()
  })

  it("should have a width of 3", function() {
    robot.turnLeft()
    robot.move()
    robot.move()
    expect(function() { robot.move() }).toThrow()
  })


  // Markers

  it("should put a marker on a field", function() {
    var isMarker = function() { return robot.get('world').getField(robot.get('position')).marker }
    expect(isMarker()).toBeFalsy()
    robot.putMarker()
    expect(isMarker()).toBeTruthy()
  })

  it("should test if there is a marker", function() {
    expect(robot.isMarker()).toBeFalsy()
    robot.putMarker()
    expect(robot.isMarker()).toBeTruthy()
  })

  it("should remove a marker", function() {
    robot.putMarker()
    robot.removeMarker()
    expect(robot.isMarker()).toBeFalsy()
  })

  it("should put a marker if there is none and the other way round", function() {
    robot.toggleMarker()
    expect(robot.isMarker()).toBeTruthy()
    robot.toggleMarker()
    expect(robot.isMarker()).toBeFalsy()
    robot.toggleMarker()
    expect(robot.isMarker()).toBeTruthy()
  })


  // Bricks

  it("should put bricks in the current color on a field", function() {
    var field = world.getField(new Position(0,1))
    expect(field.bricks).toEqual([])
    robot.putBrick()
    expect(field.bricks).toEqual([0xff0000])
    robot.setGreen()
    robot.putBrick()
    expect(field.bricks).toEqual([0xff0000, 0x00ff00])
  })

  it("should remove bricks", function() {
    var field = world.getField(new Position(0,1))
    robot.putBrick()
    robot.setBlue()
    robot.putBrick()
    robot.removeBrick()
    expect(field.bricks).toEqual([0xff0000])
    robot.removeBrick()
    expect(field.bricks).toEqual([])
    expect(function() { robot.removeBrick() }).toThrow()
  })

  it("should test if there is any brick or a specified number of bricks", function() {
    expect(robot.isBrick()).toBeFalsy()
    robot.putBrick()
    robot.putBrick()
    expect(robot.isBrick()).toBeTruthy()
    expect(robot.isBrick(2)).toBeTruthy()
    expect(robot.isBrick(1)).toBeFalsy()
  })

  it("shouldn't be able to move more than n bricks up or down", function() {
    while (!robot.isBrick(settings.MAX_JUMP_HEIGHT + 1)) robot.putBrick()
    expect(function() { robot.move() }).toThrow()
    robot.removeBrick()
    expect(function() { robot.move() }).not.toThrow()
  })


  // Blocks

  it("should put blocks on fields", function() {
    var field = world.getField(new Position(0,1))
    robot.putBlock()
    expect(field.block).toBeTruthy()
  })

  it("should remove blocks", function() {
    var field = world.getField(new Position(0,1))
    robot.putBlock()
    robot.removeBlock()
    expect(field.block).toBeFalsy()
  })

  it("shouldn't be able to move if there is a block", function() {
    robot.putBlock()
    expect(function() { robot.move() }).toThrow()
    robot.removeBlock()
    expect(function() { robot.move() }).not.toThrow()
  })


  // Various

  it("should be testable for equality", function() {
    expect(new World().getRobot().equals(robot)).toBeTruthy()
    expect(new World().getRobot().turnLeft().equals(robot)).toBeFalsy()
    expect(new World({ width: 3, depth: 3 }).equals(world)).toBeTruthy()
    expect(new World({ width: 3, depth: 3 }).getRobot()
      .putBrick()
      .get('world').equals(world)).toBeFalsy()
  })

  it("should test if there is a wall", function() {
    expect(robot.isWall()).toBe(false)
    robot.putBlock()
    expect(robot.isWall()).toBe(true)
    robot.removeBlock()
    robot.move()
    robot.move()
    expect(robot.isWall()).toBe(true)
  })

  it("should attempt an operation and if it fails, restore the initial state", function() {
    var goRight = function() {
      robot.turnRight()
      robot.move()
      robot.turnLeft()
    }

    robot.attempt(goRight)
    expect(robot).toHavePosition(new Position(0,0))
    expect(robot).toHaveDirection(new Direction(0,1))

    robot.turnLeft()
    robot.attempt(goRight)
    expect(robot).toHavePosition(new Position(0,1))
    expect(robot).toHaveDirection(new Direction(1,0))
  })

  //it("should beep", function() {
    // Can't really test it
  //})

  // Import and export

  it("should import .kdw", function() {
    var kdw = 'KarolVersion2Deutsch 4 4 5 3 2 3 n n n n n m n n n n n o n n n n n o q q n n n o z n n n n m n n n n n o n n n n n o q q n n n o z z n n n m n n n n n o n n n n n o q q n n n o z z z n n m z z n n n o z n n n n o q q n n n o '
    world = World.fromString(kdw)
    robot = world.getRobot()

    expect(robot).toHavePosition(new Position(3,2))
    expect(robot).toHaveDirection(Direction.EAST)

    var repeat = function (el, n) {
      var arr = []
      while (var i = 0; i < n; i++) {
        arr[i] = el
      }
      return arr
    }

    var f = function(z, m, q) {
      var field = new Field()
      field.bricks = repeat(0xff0000, z)
      field.marker = !!m
      field.block  = !!q
      return field
    }

    expect(world.get('fields')).toEqual([
      [f(0,1), f(),  f(),  f(0,0,1)],
      [f(1,1), f(),  f(),  f(0,0,1)],
      [f(2,1), f(),  f(),  f(0,0,1)],
      [f(3,1), f(2), f(1), f(0,0,1)]
    ])
  })

  it("should export the world to .kdw", function() {
    world = new World({ width: 2, depth: 2 })
    robot = world.getRobot()

    robot.putMarker()
    robot.putBrick()
    robot.move()
    robot.turnLeft()
    robot.putBrick()
    robot.putBrick()
    robot.move()
    robot.turnLeft()
    robot.putMarker()
    robot.putBlock()

    var kdwString = 'KarolVersion2Deutsch 2 2 5 1 1 2 n n n n n m z n n n n o q q n n n o z z n n n m '
    expect(world.toString()).toBe(kdwString)
  })

  it("should provide a negation of all testing functions", function() {
    expect(robot.notIsMarker()).toBeTruthy()
    robot.putMarker()
    expect(robot.notIsMarker()).toBeFalsy()

    robot.putBrick(2)
    expect(robot.notIsBrick()).toBeFalsy()
    expect(robot.notIsBrick(3)).toBeTruthy()
    robot.removeBrick(2)
    expect(robot.notIsBrick()).toBeTruthy()

    expect(robot.notIsWall()).toBeTruthy()
    robot.putBlock()
    expect(robot.notIsWall()).toBeFalsy()

    expect(robot.notIsSouth()).toBeFalsy()
    expect(robot.notIsWest()).toBeTruthy()
    expect(robot.notIsNorth()).toBeTruthy()
    expect(robot.notIsEast()).toBeTruthy()
  })

  it("should have a chainable API", function() {
    expect(robot
      .move()
      .moveBackwards()
      .putMarker()
      .removeMarker()
      .toggleMarker()
      .setRed()
      .setGreen()
      .setBlue()
      .setWhite()
      .setOrange()
      .setPurple()
      .setBlack()
      .setYellow()
      .putBrick()
      .putBrick(2)
      .removeBrick(3)
      .putBlock()
      .removeBlock()
      .turnLeft()
      .turnRight()).toBe(robot)
  })

  it("should provide German aliases of all methods", function() {
    var r = robot

    expect(r.schritt).toBe(r.move)
    expect(r.schrittRueckwaerts).toBe(r.moveBackwards)
    expect(r.linksDrehen).toBe(r.turnLeft)
    expect(r.rechtsDrehen).toBe(r.turnRight)

    expect(r.hinlegen).toBe(r.putBrick)
    expect(r.aufheben).toBe(r.removeBrick)
    expect(r.istZiegel).toBe(r.isBrick)

    expect(r.markeSetzen).toBe(r.putMarker)
    expect(r.markeLoeschen).toBe(r.removeMarker)
    expect(r.markeUmschalten).toBe(r.toggleMarker)
    expect(r.istMarke).toBe(r.isMarker)

    expect(r.quaderAufstellen).toBe(r.putBlock)
    expect(r.quaderEntfernen).toBe(r.removeBlock)

    expect(r.istNorden).toBe(r.isNorth)
    expect(r.istSueden).toBe(r.isSouth)
    expect(r.istWesten).toBe(r.isWest)
    expect(r.istOsten).toBe(r.isEast)

    expect(r.istWand).toBe(r.isWall)
    expect(r.tonErzeugen).toBe(r.beep)
    expect(r.probiere).toBe(r.attempt)

    expect(r.setzeRot).toBe(r.setRed)
    expect(r.setzeGruen).toBe(r.setGreen)
    expect(r.setzeBlau).toBe(r.setBlue)
    expect(r.setzeWeiss).toBe(r.setWhite)
    expect(r.setzeOrange).toBe(r.setOrange)
    expect(r.setzeLila).toBe(r.setPurple)
    expect(r.setzeSchwarz).toBe(r.setBlack)
    expect(r.setzeGelb).toBe(r.setYellow)

    expect(r.nichtIstWand).toBe(r.notIsWall)
    expect(r.nichtIstMarke).toBe(r.notIsMarker)
    expect(r.nichtIstZiegel).toBe(r.notIsBrick)
    expect(r.nichtIstSueden).toBe(r.notIsSouth)
    expect(r.nichtIstWesten).toBe(r.notIsWest)
    expect(r.nichtIstNorden).toBe(r.notIsNorth)
    expect(r.nichtIstOsten).toBe(r.notIsEast)
  })
})

})()
