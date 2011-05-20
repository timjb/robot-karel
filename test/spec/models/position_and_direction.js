(function() {

var Position  = Karel.Models.Position
,   Direction = Karel.Models.Direction

describe("Position and Direction", function() {
  it("should test for equality", function() {
    expect(new Position(3,5).equals(new Position(3,5))).toBeTruthy()
    expect(new Direction(3,5).equals(new Direction(3,5))).toBeTruthy()
    expect(new Direction(1337,42).equals(new Direction(1,1))).toBeFalsy()
  })

  it("should add positions and directions", function() {
    expect(new Position(42,7).plus(new Position(-6,8))).toEquals(new Position(36,15))
    expect(new Position(42,7).plus(new Direction(-6,8))).toEquals(new Position(36,15))
  })

  it("should clone positions and directions", function() {
    var position = new Position(11,13).clone()
    var clone    = position.clone()
    expect(clone).not.toBe(position)
    expect(clone).toEquals(position)
  })

  it("should turn left", function() {
    var direction = new Direction(2,7)
    expect(direction.turnLeft()).toEquals(new Direction(7,-2))
    // Turn around
    expect(direction.turnLeft().turnLeft().turnLeft().turnLeft()).toEquals(direction)
  })

  it("should turn left", function() {
    var direction = new Direction(2,7)
    expect(direction.turnRight()).toEquals(new Direction(-7,2))
    // turn around
    expect(direction.turnRight().turnRight().turnRight().turnRight()).toEquals(direction)
  })

  it("should have constants representing all four cardinal points", function() {
    var north = Direction.NORTH
    ,   west  = north.turnLeft()
    ,   south = west.turnLeft()
    ,   east  = south.turnLeft()

    expect(north.isNorth()).toBeTruthy()
    expect(west.isWest()).toBeTruthy()
    expect(south.isSouth()).toBeTruthy()
    expect(east.isEast()).toBeTruthy()
    expect(east.turnLeft().isNorth()).toBeTruthy()
  })
})

})()
