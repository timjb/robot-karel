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
    var startDirection, completed
    
    runs(function() {
      startDirection = project.get('world').get('robot').get('direction')
      project.run(function() { completed = true })
    })
    
    waitsFor(function() { return completed }, "Run never completed.", 500)
    
    runs(function() {
      var endDirection = project.get('world').get('robot').get('direction')
      expect(endDirection.equals(startDirection.turnLeft())).toBeTruthy()
    })
  })

  describe("should run JavaScript code", function() {
    var startPosition, endPosition, errorCallback, completed

    beforeEach(function() {
      runs(function() {
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
        project.run(function() { completed = true })
      })
      
      waitsFor(function() { return completed }, "Run never completed.", 500)
      
      runs(function() {
        endPosition = project.get('world').get('robot').get('position')
      })
    })

    it("should have moved the robot three fields", function() {
      var d = project.get('world').get('robot').get('direction')
      expect(endPosition.equals(startPosition.plus(d).plus(d).plus(d))).toBeTruthy()
    })

    it("should have created a backup of the world before running", function() {
      expect(project.get('worldBackup')).toBeInstanceof(Karel.Models.World)
      var backupPosition = project.get('worldBackup').get('robot').get('position')
      expect(backupPosition.equals(startPosition)).toBeTruthy()
    })

    it("should be resettable", function() {
      project.reset()
      var positionAfterReset = project.get('world').get('robot').get('position')
      expect(startPosition.equals(positionAfterReset)).toBeTruthy()
    })

    it("should have saved the sequence of commands", function() {
      var commands = project.sequence.map(function(a) { return a[0] })
      expect(commands).toEqual(['move','move','move'])
    })

    it("should throw an error", function() {
      expect(errorCallback).toHaveBeenCalled()
    })

    it("should be able to replay the commands", function() {
      var former, states, completed
      
      runs(function() {
        former = Karel.settings.HIGHLIGHT_LINE
        Karel.settings.HIGHLIGHT_LINE = true
        
        callCount = 0
        lineNumbers = []
        worldStates = []
        project.bind('line', function(lineNumber) {
          callCount++
          lineNumbers.push(lineNumber)
          worldStates.push(project.get('world').clone())
        })
        project.replay(function() { completed = true })
        worldStates.push(project.get('world').clone())
      })

      waitsFor(function() { return completed }, "Replay never completed.", 4*Karel.settings.STEP_INTERVAL)
      
      runs(function() {
        expect(callCount).toBe(3)
        expect(lineNumbers).toEqual([2,2,4])
        var positions = _.map(worldStates, function(world) {
          return world.get('robot').get('position')
        })
        var d = project.get('world').get('robot').get('direction')
        expect(positions[0].equals(startPosition)).toBeTruthy()
        expect(positions[1].equals(startPosition.plus(d))).toBeTruthy()
        expect(positions[2].equals(startPosition.plus(d).plus(d))).toBeTruthy()
        expect(positions[3].equals(startPosition.plus(d).plus(d).plus(d))).toBeTruthy()
      })

      runs(function() {
        Karel.settings.HIGHLIGHT_LINE = former
      })
    })

  // replay
  })

})
