describe("Project", function () {

  var project

  beforeEach(function () {
    project = new Karel.Models.Project({
      author:      "Mr. Foo",
      description: "Karel turns left",
      language:    'karol',
      code:        'linksDrehen'
    })
  })

  it("should have a world", function () {
    expect(project.get('world')).toBeInstanceof(Karel.Models.World)
  })

  it("should parse the world string", function () {
    project.set(project.parse({
      world: "KarolVersion2Deutsch 1 1 5 0 0 0 n n n n n o " // 1x1 world
    }, { silent: true }))
    expect(project.get('world')).toBeInstanceof(Karel.Models.World)
    expect(project.get('world').get('width')).toBe(1)
  })

  it("should stringify it's world", function () {
    expect(project.toJSON().world).toHaveType('string')
  })

  it("should run Karel code", function () {
    var startDirection = project.get('world').getRobot().get('direction')
    project.run()
    var endDirection = project.get('world').getRobot().get('direction')
    expect(endDirection.equals(startDirection.turnLeft())).toBeTruthy()
  })

  describe("should run JavaScript code", function () {
    var startPosition, endPosition, errorCallback

    beforeEach(function () {
      project.set({
        language: 'javascript',
        code:     'for (var i = 0; i < 2; i++) {\n'
                 +'  move();\n'
                 +'}\n'
                 +'move();\n'
                 +'noSuchMethod();'
      })
      project.bind('error', errorCallback = jasmine.createSpy())
      startPosition = project.get('world').getRobot().get('position')
      project.run()
      endPosition = project.get('world').getRobot().get('position')
    })

    it("should have moved the robot three fields", function () {
      var d = project.get('world').getRobot().get('direction')
      expect(endPosition.equals(startPosition.plus(d).plus(d).plus(d))).toBeTruthy()
    })

    it("should have created a backup of the world before running", function () {
      expect(project._worldBackup).toBeInstanceof(Karel.Models.World)
      var backupPosition = project._worldBackup.getRobot().get('position')
      expect(backupPosition.equals(startPosition)).toBeTruthy()
    })

    it("should be resettable", function () {
      project.reset()
      var positionAfterReset = project.get('world').getRobot().get('position')
      expect(startPosition.equals(positionAfterReset)).toBeTruthy()
    })

    // Now, it should only save the sequence when running step by step
    /*
    it("should have saved the sequence of commands", function () {
      var commands = project._execution._sequence.map(function (a) { return a[0] })
      expect(commands).toEqual(['move','move','move'])
    })*/

    it("should throw an error", function () {
      expect(errorCallback).toHaveBeenCalled()
    })

    it("should be able to replay the commands", function () {
      var former = Karel.settings.HIGHLIGHT_LINE
      Karel.settings.HIGHLIGHT_LINE = true
      
      var lineSpy = jasmine.createSpy()
      project.bind('line', lineSpy)
      var endSpy = jasmine.createSpy()
      project.bind('end', endSpy)
      var errorSpy = jasmine.createSpy()
      project.bind('error', errorSpy)
      
      var getRobot = function () { return project.get('world').getRobot() }
      var startPosition = getRobot().get('position')
      var getPosition = function () { return getRobot().get('position') }
      var d = getRobot().get('direction')
      
      project.step()
      expect(lineSpy).toHaveBeenCalledWith(1) // line-numbers are zero-based
      expect(getPosition()).toEquals(startPosition.plus(d))
      project.step()
      expect(lineSpy).toHaveBeenCalledWith(3)
      expect(getPosition()).toEquals(startPosition.plus(d).plus(d))
      project.step()
      expect(lineSpy.callCount).toBe(2)
      expect(getPosition()).toEquals(startPosition.plus(d).plus(d).plus(d))
      expect(endSpy).not.toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
      project.step()
      expect(endSpy).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      
      Karel.settings.HIGHLIGHT_LINE = former
    })

  // replay
  })

})
