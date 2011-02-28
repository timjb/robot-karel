require('./test_helper')

var assert = require('assert')
,   fs     = require('fs')

var World = require('models/world')
,   Field = World.Field
,   Robot = require('models/robot')
,   positionAndDirection = require('models/position_and_direction')
,   Position = positionAndDirection.Position
,   Direction = positionAndDirection.Direction

function newWorld(opts) {
  opts = opts || {}
  if (!('width' in opts)) opts.width = 3
  if (!('depth' in opts)) opts.depth = 3
  return new World(opts)
}

function newRobot(opts) {
  return newWorld(opts).get('robot')
}

exports.testFieldClone = function() {
  var field = new Field()
  field.ziegel = 3
  field.marke  = true
  var clone = field.clone()
  assert.ok(field != clone)
  assert.equal(field.ziegel, clone.ziegel)
  assert.equal(field.marke,  clone.marke)
}

exports.testStartPosition = function() {
  assert.ok(newRobot().get('position').equals(new Position(0,0)))
}

exports.testStartDirection = function() {
  assert.ok(newRobot().get('direction').equals(new Direction(0,1)))
}


// Movement

exports.testMove = function() {
  var robot = newRobot()
  robot.move()
  assert.ok(robot.get('position').equals(new Position(0,1)))
}

exports.testMoveBackwards = function() {
  var robot = newRobot()
  robot.move()
  robot.moveBackwards()
  assert.ok(robot.get('position').equals(new Position(0,0)))
  assert.throws(function() { robot.moveBackwards() })
}

exports.testTurnLeft = function() {
  var robot = newRobot()
  robot.turnLeft()
  assert.ok(robot.get('direction').equals(new Direction(1,0)))
  robot.move()
  assert.ok(robot.get('position').equals(new Position(1,0)))
}

exports.testTurnRight = function() {
  var robot = newRobot()
  robot.turnRight()
  assert.ok(robot.get('direction').equals(new Direction(-1,0)))
  robot.moveBackwards()
  assert.ok(robot.get('position').equals(new Position(1,0)))
}

exports.testDepth = function() {
  var robot = newRobot()
  robot.move()
  robot.move()
  assert.throws(function() { robot.move() })
}

exports.testWidth = function() {
  var robot = newRobot()
  robot.turnLeft()
  robot.move()
  robot.move()
  assert.throws(function() { robot.move() })
}


// Markers

exports.testPutMarker = function() {
  var robot = newRobot()
  assert.ok(!robot.get('world').getField(robot.get('position')).marke)
  robot.putMarker()
  assert.ok(robot.get('world').getField(robot.get('position')).marke)
}

exports.testIsMarker = function() {
  var robot = newRobot()
  assert.ok(!robot.isMarker())
  robot.putMarker()
  assert.ok(robot.isMarker())
}

exports.testRemoveMarker = function() {
  var robot = newRobot()
  robot.putMarker()
  robot.removeMarker()
  assert.ok(!robot.isMarker())
}

exports.testToggleMarker = function() {
  var robot = newRobot()
  robot.toggleMarker()
  assert.ok(robot.isMarker())
  robot.toggleMarker()
  assert.ok(!robot.isMarker())
  robot.toggleMarker()
  assert.ok(robot.isMarker())
}


// Bricks

exports.testPutBrick = function() {
  var robot = newRobot()
  ,   world = robot.get('world')
  ,   field = world.getField(new Position(0,1))
  assert.equal(0, field.ziegel)
  robot.putBrick()
  assert.equal(1, field.ziegel)
  robot.putBrick()
  assert.equal(2, field.ziegel)
}

exports.testRemoveBrick = function() {
  var robot = newRobot()
  ,   world = robot.get('world')
  ,   field = world.getField(new Position(0,1))
  robot.putBrick()
  robot.putBrick()
  robot.removeBrick()
  assert.equal(1, field.ziegel)
  robot.removeBrick()
  assert.equal(0, field.ziegel)
  assert.throws(function() { robot.removeBrick() })
}

exports.testIsBrick = function() {
  var robot = newRobot()
  assert.ok(!robot.isBrick())
  robot.putBrick()
  robot.putBrick()
  assert.ok(robot.isBrick())
  assert.ok(robot.isBrick(2))
  assert.ok(!robot.isBrick(1))
}

exports.testCantMoveMoreThanOneDownOrUp = function() {
  var robot = newRobot()
  robot.putBrick()
  robot.putBrick()
  assert.throws(function() { robot.move() })
  robot.removeBrick()
  assert.doesNotThrow(function() { robot.move() })
}


// Blocks

exports.testPutBlock = function() {
  var robot = newRobot()
  ,   world = robot.get('world')
  ,   field = world.getField(new Position(0,1))
  robot.putBlock()
  assert.ok(field.quader)
}

exports.testRemoveBlock = function() {
  var robot = newRobot()
  ,   world = robot.get('world')
  ,   field = world.getField(new Position(0,1))
  robot.putBlock()
  robot.removeBlock()
  assert.ok(!field.quader)
}

exports.testCantMoveIfBlock = function() {
  var robot = newRobot()
  robot.putBlock()
  assert.throws(function() { robot.move() })
  robot.removeBlock()
  assert.doesNotThrow(function() { robot.move() })
}


// Various

exports.testIsWall = function() {
  var robot = newRobot()
  assert.ok(!robot.isWall())
  robot.putBlock()
  assert.ok(robot.isWall())
  robot.removeBlock()
  robot.move()
  robot.move()
  assert.ok(robot.isWall())
}

exports.testAttempt = function() {
  var robot = newRobot()
  ,   world = robot.get('world')
  
  var goRight = function() {
    robot.turnRight()
    robot.move()
    robot.turnLeft()
  }
  
  robot.attempt(goRight)
  assert.ok(robot.get('position').equals(new Position(0,0)))
  assert.ok(robot.get('direction').equals(new Direction(0,1)))
  
  robot.turnLeft()
  robot.attempt(goRight)
  assert.ok(robot.get('position').equals(new Position(0,1)))
  assert.ok(robot.get('direction').equals(new Direction(1,0)))
}

exports.testBeep = function() {
  // Can't really test beep
}


// Import and export

exports.testImport = function() {
  var world = World.fromString(fs.readFileSync(__dirname+'/test-import.kdw', 'utf-8'))
  
  var f = function(z, m, q) {
    var field = new Field()
    field.ziegel = z || 0
    field.marke  = !!m
    field.quader = !!q
    return field
  }
  
  assert.deepEqual(world.get('fields'), [
    [f(0,1), f(),  f(),  f(0,0,1)],
    [f(1,1), f(),  f(),  f(0,0,1)],
    [f(2,1), f(),  f(),  f(0,0,1)],
    [f(3,1), f(2), f(1), f(0,0,1)]
  ])
}

exports.testExport = function() {
  var robot = newRobot({ width: 2, depth: 2})
  ,   world = robot.get('world')
  
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
  
  assert.equal(fs.readFileSync(__dirname+'/test-export.kdw', 'utf-8'), world.toString())
}


// Translation

exports.testGermanAPI = function() {
  var p = Robot.prototype
  
  assert.equal(p.schritt, p.move)
  assert.equal(p.rueckwaerts, p.moveBackwards)
  assert.equal(p.linksDrehen, p.turnLeft)
  assert.equal(p.rechtsDrehen, p.turnRight)
  
  assert.equal(p.hinlegen, p.putBrick)
  assert.equal(p.aufheben, p.removeBrick)
  assert.equal(p.istZiegel, p.isBrick)
  
  assert.equal(p.markeSetzen, p.putMarker)
  assert.equal(p.markeLoeschen, p.removeMarker)
  assert.equal(p.markeUmschalten, p.toggleMarker)
  assert.equal(p.istMarke, p.isMarker)
  
  assert.equal(p.quaderAufstellen, p.putBlock)
  assert.equal(p.quaderEntfernen, p.removeBlock)
  
  assert.equal(p.istNorden, p.isNorth)
  assert.equal(p.istSueden, p.isSouth)
  assert.equal(p.istWesten, p.isWest)
  assert.equal(p.istOsten, p.isEast)
  
  assert.equal(p.istWand, p.isWall)
  assert.equal(p.tonErzeugen, p.beep)
  assert.equal(p.probiere, p.attempt)
}
