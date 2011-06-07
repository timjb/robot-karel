describe("Karol Interpreter", function() {
  var globals, stops

  var eval = function (code) {
    var continuation = Karel.Parser.eval(code, globals)
    stops = 0
    while (typeof continuation === 'function') {
      stops += 1
      continuation = continuation()
    }
  }

  beforeEach(function() {
    console.log("-----------------------")
    var i = 3
    globals = { foo: jasmine.createSpy()
              , bar: jasmine.createSpy()
              , yes: function () { return true  }
              , no:  function () { return false }
              , countdown: function () { return (i--) > 0 }
              , fail: function () { throw 42 } }
  })

  it("should call primitive functions", function() {
    // (primitive functions === functions defined in JavaScript)
    eval('foo; bar; foo')
    expect(stops).toBe(3)
    expect(globals.foo.callCount).toBe(2)
    expect(globals.bar.callCount).toBe(1)
  })

  it("should pass parameters to primitive functions", function() {
    eval('foo(3)')
    expect(stops).toBe(1)
    expect(globals.foo).toHaveBeenCalledWith(3)
  })

  it("should let me define functions", function() {
    eval('anweisung test foo foo *anweisung test test')
    expect(stops).toBe(6)
    expect(globals.foo.callCount).toBe(4)
  })

  it("should pass parameters to my functions", function() {
    eval('anweisung test(n) bar(n) *anweisung test(42)')
    expect(stops).toBe(2)
    expect(globals.bar).toHaveBeenCalledWith(42)
  })

  it("should eval branches conditionally (if statement)", function() {
    eval('wenn no dann foo sonst bar *wenn')
    expect(stops).toBe(2)
    expect(globals.foo).not.toHaveBeenCalled()
    expect(globals.bar).toHaveBeenCalled()
    eval('wenn yes dann foo sonst bar *wenn')
    expect(stops).toBe(2)
    expect(globals.foo.callCount).toBe(1)
    expect(globals.bar.callCount).toBe(1)
    eval('wenn yes dann bar *wenn')
    expect(stops).toBe(2)
    expect(globals.bar.callCount).toBe(2)
    eval('wenn no dann bar *wenn')
    expect(stops).toBe(1)
    expect(globals.bar.callCount).toBe(2)
  })

  it("should invert the condition", function() {
    eval('wenn nicht no dann foo *wenn')
    expect(stops).toBe(2)
    expect(globals.foo).toHaveBeenCalled()
  })

  it("should eval the body of a loop while the head holds true", function() {
    eval('solange countdown tue foo *solange')
    expect(stops).toBe(7)
    expect(globals.foo.callCount).toBe(3)
  })

  it("should eval the body of a do-while-loop before checking the condition the first time", function() {
    eval('wiederhole foo *wiederhole solange no')
    expect(stops).toBe(2)
    expect(globals.foo).toHaveBeenCalled()
    eval('wiederhole bar *wiederhole solange countdown')
    expect(stops).toBe(8)
    expect(globals.bar.callCount).toBe(4)
  })

  it("should eval the body of an infinite loop until an error occurs", function() {
    expect(function() {
      eval('wiederhole immer wenn countdown dann foo sonst fail *wenn *wiederhole')
    }).toThrow()
    expect(stops).toBe(8)
    expect(globals.foo.callCount).toBe(3)
  })

  it("should eval the body of a for loop n times", function() {
    eval('wiederhole 13 mal foo *wiederhole')
    expect(stops).toBe(13)
    expect(globals.foo.callCount).toBe(13)
  })

  it("should let me define my own conditions", function() {
    eval('bedingung stimmt wahr *bedingung wenn stimmt dann foo *wenn')
    expect(stops).toBe(3)
    expect(globals.foo.callCount).toBe(1)
    eval('bedingung invert wenn yes dann falsch sonst wahr *wenn *bedingung '
        +'wenn invert dann foo sonst bar *wenn')
    expect(stops).toBe(4)
    expect(globals.foo.callCount).toBe(1)
    expect(globals.bar).toHaveBeenCalled()
  })

  it("should hoist functions to the top", function() {
    eval('test test anweisung test foo foo *anweisung')
    expect(stops).toBe(6)
    expect(globals.foo.callCount).toBe(4)
    eval('wenn blub dann bar *wenn bedingung blub wahr *bedingung')
    expect(stops).toBe(3)
    expect(globals.bar).toHaveBeenCalled()
  })
})
