var assert = require('assert')

var position_and_direction = require('../lib/models/position_and_direction')
,   Position  = position_and_direction.Position
,   Direction = position_and_direction.Direction

exports.testEqual = function() {
  assert.ok(new Position(3,5).equals(new Position(3,5)))
  assert.ok(new Direction(3,5).equals(new Direction(3,5)))
  assert.equal(new Direction(1337,42).equals(new Direction(1,1)), false)
}

exports.testPlus = function() {
  assert.ok(new Position(42,7).plus(new Position(-6,8)).equals(new Position(36,15)))
  assert.ok(new Position(42,7).plus(new Direction(-6,8)).equals(new Position(36,15)))
}

exports.testClone = function() {
  var position = new Position(11,13).clone()
  var clone    = position.clone()
  assert.notEqual(position.clone())
  assert.ok(position.equals(clone))
}

exports.testTurnLeft = function() {
  var direction = new Direction(2,7)
  assert.ok(direction.turnLeft().equals(new Direction(7,-2)))
  assert.ok(direction.turnLeft().turnLeft().turnLeft().turnLeft().equals(direction)) // turn around
}

exports.testTurnRight = function() {
  var direction = new Direction(2,7)
  assert.ok(direction.turnRight().equals(new Direction(-7,2)))
  assert.ok(direction.turnRight().turnRight().turnRight().turnRight().equals(direction)) // turn around
}

exports.testCardinalPoints = function() {
  var north = Direction.NORTH
  ,   west  = north.turnLeft()
  ,   south = west.turnLeft()
  ,   east  = south.turnLeft()
  
  assert.ok(north.isNorth())
  assert.ok(west.isWest())
  assert.ok(south.isSouth())
  assert.ok(east.isEast())
  assert.ok(east.turnLeft().isNorth())
}
