function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.clone = function() {
  return new Position(this.x, this.y);
};

Position.prototype.plus = function(another) {
  return new Position(this.x + another.x, this.y + another.y);
};

Position.prototype.equals = function(another) {
  return another instanceof Position
         && another.x == this.x
         && another.y == this.y;
};

Position.NORTH = new Position(0, -1);
Position.prototype.isNorth = function() {
  return this.equals(Position.NORTH);
};

Position.SOUTH = new Position(0, 1);
Position.prototype.isSouth = function() {
  return this.equals(Position.SOUTH);
};

Position.WEST = new Position(-1, 0);
Position.prototype.isWest = function() {
  return this.equals(Position.WEST);
};

Position.EAST = new Position(1, 0);
Position.prototype.isEast = function() {
  return this.equals(Position.EAST);
};
