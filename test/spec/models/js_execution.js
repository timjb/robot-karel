(function () {

var JSExecution = Karel.Models.JSExecution

describe("JSExecution", function () {

  var reset, foo, bar, globals
  beforeEach(function () {
    reset = jasmine.createSpy()
    foo   = jasmine.createSpy()
    bar   = jasmine.createSpy()
    globals = { foo: foo, bar: bar }
  })

  it("should run everything at once", function () {
    var jse = new JSExecution('foo(1+2); bar(5); noSuchFunction();', globals, reset)
    var endSpy = jasmine.createSpy()
    jse.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    jse.bind('error', errorSpy)
    jse.run()
    expect(foo).toHaveBeenCalledWith(3)
    expect(bar).toHaveBeenCalledWith(5)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
    expect(reset).not.toHaveBeenCalled()
  })

  it("should run the code step by step (or pretend to)", function () {
    var jse = new JSExecution('var f = function () {\nfoo(1+2);\nbar(5); };\nf(); noSuchFunction();', globals, reset)
    var endSpy = jasmine.createSpy()
    jse.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    jse.bind('error', errorSpy)
    var lineSpy = jasmine.createSpy()
    jse.bind('line', lineSpy)
    jse.step()
    expect(reset).toHaveBeenCalled()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(1)
    expect(lineSpy).toHaveBeenCalledWith(2)
    jse.step()
    expect(endSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
    jse.step()
    expect(lineSpy.callCount).toBe(1)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(2)
  })

  it("should begin running step by step and the run the rest at once", function () {
    var jse = new JSExecution('var f = function () {\nfoo(1+2);\nbar(5); };\nf(); noSuchFunction();', globals, reset)
    var endSpy = jasmine.createSpy()
    jse.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    jse.bind('error', errorSpy)
    var lineSpy = jasmine.createSpy()
    jse.bind('line', lineSpy)
    jse.step()
    expect(reset).toHaveBeenCalled()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(1)
    expect(lineSpy).toHaveBeenCalledWith(2)
    jse.run()
    expect(lineSpy.callCount).toBe(1)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(2)
  })

})

})()
