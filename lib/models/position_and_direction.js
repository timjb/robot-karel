(function(exports) {

function Position(x, y) {
  this.x = x
  this.y = y
}

Position.prototype.plus = function(another) {
  return new Position(this.x + another.x, this.y + another.y)
}


function Direction(x, y) {
  this.x = x
  this.y = y
}

Direction.NORTH = new Direction(0, -1)
Direction.prototype.isNorth = function() {
  return this.equals(Direction.NORTH)
}

Direction.SOUTH = new Direction(0, 1)
Direction.prototype.isSouth = function() {
  return this.equals(Direction.SOUTH)
}

Direction.WEST = new Direction(-1, 0)
Direction.prototype.isWest = function() {
  return this.equals(Direction.WEST)
}

Direction.EAST = new Direction(1, 0)
Direction.prototype.isEast = function() {
  return this.equals(Direction.EAST)
}

Direction.prototype.turnRight = function() {
  return new Direction(-this.y, this.x)
}

Direction.prototype.turnLeft = function() {
  return new Direction(this.y, -this.x)
}


Position.prototype.clone = Direction.prototype.clone = function() {
  return new this.constructor(this.x, this.y)
}

Position.prototype.equals = Direction.prototype.equals = function(another) {
  return another instanceof this.constructor
    && another.x == this.x
    && another.y == this.y
}

exports.Position = Position
exports.Direction = Direction

})(exports || Karel.Models)
