(function () {

var KarolExecution = Karel.Models.KarolExecution

describe("KarolExecution", function () {

  it("should create a new KarolExecution object saving the code and globals", function () {
    var ke = new KarolExecution('move', { mOvE: function () {} })
    expect(ke.code).toBe('move')
    expect(ke.globals).toHaveType('object')
    expect(ke.globals.mOvE).toHaveType('function')
    expect(ke.globals.move).toHaveType('function')
  })

  var foo, bar, globals
  beforeEach(function () {
    foo = jasmine.createSpy()
    bar = jasmine.createSpy()
    globals = { foo: foo, bar: bar }
  })

  it("should run everything at once", function () {
    var ke = new KarolExecution('wiederhole 2 mal foo bar *wiederhole', globals)
    var endSpy = jasmine.createSpy()
    ke.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    ke.bind('error', endSpy)
    ke.run()
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(2)
  })

  it("should trigger 'error' when an error occurs", function () {
    var ke = new KarolExecution('foo nosuchfunction', globals)
    var endSpy = jasmine.createSpy()
    ke.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    ke.bind('error', errorSpy)
    ke.run()
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
    expect(foo).toHaveBeenCalled()
  })

  it("should step through the code", function () {
    var ke = new KarolExecution('wiederhole 2 mal\nfoo\nbar\n*wiederhole', globals)
    var endSpy = jasmine.createSpy()
    ke.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    ke.bind('error', endSpy)
    var lineSpy = jasmine.createSpy()
    ke.bind('line', lineSpy)
    ke.step()
    expect(foo.callCount).toBe(1)
    expect(bar.callCount).toBe(0)
    expect(lineSpy).toHaveBeenCalledWith(2)
    ke.step()
    expect(foo.callCount).toBe(1)
    expect(bar.callCount).toBe(1)
    expect(lineSpy).toHaveBeenCalledWith(1)
    ke.step()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(1)
    expect(lineSpy).toHaveBeenCalledWith(2)
    expect(endSpy).not.toHaveBeenCalled()
    ke.step()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(2)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it("should begin stepping through the code and then run the rest at once", function () {
    var ke = new KarolExecution('wiederhole 2 mal\nfoo\nbar\n*wiederhole', globals)
    var endSpy = jasmine.createSpy()
    ke.bind('end', endSpy)
    var errorSpy = jasmine.createSpy()
    ke.bind('error', endSpy)
    ke.step()
    ke.step()
    expect(foo.callCount).toBe(1)
    expect(bar.callCount).toBe(1)
    ke.run()
    expect(foo.callCount).toBe(2)
    expect(bar.callCount).toBe(2)
    expect(endSpy).toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

})

})()
