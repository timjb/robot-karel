describe("Project", function() {

  var project

  beforeEach(function() {
    project = new Karel.Models.Project({
      author:      "Mr. Foo",
      description: "Karel turns left",
      language:    'karol',
      code:        'linksDrehen'
    })
  })

  it("should have a world", function() {
    expect(project.get('world')).toBeInstanceof(Karel.Models.World)
  })

  it("should parse the world string", function() {
    project.set(project.parse({
      world: "KarolVersion2Deutsch 1 1 5 0 0 0 n n n n n o " // 1x1 world
    }, { silent: true }))
    expect(project.get('world')).toBeInstanceof(Karel.Models.World)
    expect(project.get('world').get('width')).toBe(1)
  })

  it("should stringify it's world", function() {
    expect(project.toJSON().world).toHaveType('string')
  })

  it("should run Karel code", function() {
    var startDirection = project.get('world').get('robot').get('direction')
    project.run()
    var endDirection = project.get('world').get('robot').get('direction')
    expect(endDirection.equals(startDirection.turnLeft())).toBeTruthy()
  })

  describe("should run JavaScript code", function() {
    var startPosition, endPosition, errorCallback

    beforeEach(function() {
      project.set({
        language: 'javascript',
        code:     'for (var i = 0; i < 2; i++) {\n'
                 +'  move();\n'
                 +'}\n'
                 +'move();\n'
                 +'noSuchMethod();'
      })
      project.bind('error', errorCallback = jasmine.createSpy())
      startPosition = project.get('world').get('robot').get('position')
      project.run()
      endPosition = project.get('world').get('robot').get('position')
    })

    it("should have moved the robot three fields", function() {
      var d = project.get('world').get('robot').get('direction')
      expect(endPosition.equals(startPosition.plus(d).plus(d).plus(d))).toBeTruthy()
    })

    it("should have created a backup of the world before running", function() {
      expect(project._worldBackup).toBeInstanceof(Karel.Models.World)
      var backupPosition = project._worldBackup.get('robot').get('position')
      expect(backupPosition.equals(startPosition)).toBeTruthy()
    })

    it("should be resettable", function() {
      project.reset()
      var positionAfterReset = project.get('world').get('robot').get('position')
      expect(startPosition.equals(positionAfterReset)).toBeTruthy()
    })

    // Now, it should only save the sequence when running step by step
    /*
    it("should have saved the sequence of commands", function() {
      var commands = project._execution._sequence.map(function(a) { return a[0] })
      expect(commands).toEqual(['move','move','move'])
    })*/

    it("should throw an error", function() {
      expect(errorCallback).toHaveBeenCalled()
    })

    it("should be able to replay the commands", function() {
      var former = Karel.settings.HIGHLIGHT_LINE
      Karel.settings.HIGHLIGHT_LINE = true
      
      var currentLine = null, hasEnded = false, error = null
      project.bind('line',  function (n) { currentLine = n })
      project.bind('end',   function ()  { hasEnded = true })
      project.bind('error', function (e) { error = e       })
      
      var getRobot = function () { return project.get('world').get('robot') }
      var startPosition = getRobot().get('position')
      var getPosition = function () { return getRobot().get('position') }
      var d = getRobot().get('direction')
      
      expect(currentLine).toBeNull()
      project.step()
      expect(currentLine).toBe(1) // line-numbers are zero-based
      expect(getPosition()).toEquals(startPosition.plus(d))
      project.step()
      expect(currentLine).toBe(1)
      expect(getPosition()).toEquals(startPosition.plus(d).plus(d))
      project.step()
      expect(currentLine).toBe(3)
      expect(getPosition()).toEquals(startPosition.plus(d).plus(d).plus(d))
      expect(hasEnded).toBeFalsy()
      expect(error).toBeNull()
      project.step()
      expect(hasEnded).toBeTruthy()
      expect(error).not.toBeNull()
      
      Karel.settings.HIGHLIGHT_LINE = former
    })

  // replay
  })

})
