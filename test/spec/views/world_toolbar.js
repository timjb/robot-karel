(function () {

var Direction = Karel.Models.Direction
,   Position  = Karel.Models.Position

describe("World Toolbar", function () {
  var world, robot, worldToolbar

  beforeEach(function () {
    world = new Karel.Models.World()
    robot = world.get('robot')
    worldToolbar = new Karel.Views.WorldToolbar({ model: world })
    worldToolbar.appendTo(document.body)
  })

  afterEach(function () {
    worldToolbar.remove()
  })

  it("should do the right thing (TM) if the user presses a button", function () {
    var g = function (s) { return worldToolbar.$(s) }
    
    expect(robot).toHaveDirection(Direction.SOUTH)
    g('.turn-left-button').click()
    expect(robot).toHaveDirection(Direction.EAST)
    g('.turn-right-button').click()
    expect(robot).toHaveDirection(Direction.SOUTH)
    
    expect(robot).toHavePosition(new Position(0,0))
    g('.move-button').click()
    expect(robot).toHavePosition(new Position(0,1))
    
    expect(robot.isBrick()).toBe(false)
    g('.put-brick-button').click()
    expect(robot.isBrick()).toBe(true)
    g('.remove-brick-button').click()
    expect(robot.isBrick()).toBe(false)
    
    expect(robot.isMarker()).toBe(false)
    g('.toggle-marker-button').click()
    expect(robot.isMarker()).toBe(true)
    g('.toggle-marker-button').click()
    expect(robot.isMarker()).toBe(false)
    
    expect(robot.isWall()).toBe(false)
    g('.put-block-button').click()
    expect(robot.isWall()).toBe(true)
    g('.remove-block-button').click()
    expect(robot.isWall()).toBe(false)
  })

  it("should do the right thing if the user presses a key", function () {
    var t = function (keyCode) {
      $(document).trigger(new $.Event('keydown', { keyCode: keyCode }))
    }
    
    expect(robot).toHaveDirection(Direction.SOUTH)
    t(39) // right
    expect(robot).toHaveDirection(Direction.WEST)
    t(37) // left
    expect(robot).toHaveDirection(Direction.SOUTH)
    
    expect(robot).toHavePosition(new Position(0,0))
    t(38) // up
    expect(robot).toHavePosition(new Position(0,1))
    t(40) // down
    expect(robot).toHavePosition(new Position(0,0))
    
    expect(robot.isBrick()).toBe(false)
    t("H".charCodeAt(0))
    expect(robot.isBrick(1)).toBe(true)
    t(13) // enter
    expect(robot.isBrick(2)).toBe(true)
    t("A".charCodeAt(0))
    expect(robot.isBrick(1)).toBe(true)
    t(8) // backspace
    expect(robot.isBrick()).toBe(false)
    
    expect(robot.isMarker()).toBe(false)
    t("M".charCodeAt(0))
    expect(robot.isMarker()).toBe(true)
    t(32) // space
    expect(robot.isMarker()).toBe(false)
    
    expect(robot.isWall()).toBe(false)
    t("Q".charCodeAt(0))
    expect(robot.isWall()).toBe(true)
    t("E".charCodeAt(0))
    expect(robot.isWall()).toBe(false)
    t("Q".charCodeAt(0))
    expect(robot.isWall()).toBe(true)
    t(46) // delete
    expect(robot.isWall()).toBe(false)
  })
})

})()
