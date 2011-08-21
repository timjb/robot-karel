(function () {

var Project = Karel.Models.Project
,   MainToolbar = Karel.Views.MainToolbar


describe("Main Toolbar", function () {
  var project, mainToolbar

  beforeEach(function () {
    project = new Project({})
    mainToolbar = new MainToolbar({ model: project })
    mainToolbar.appendTo(testEl)
  })

  afterEach(function () {
    mainToolbar.remove()
  })

  it("should call the corresponding method on the model if the user clicks the 'Run', 'Step', 'Reset' or 'Save' button", function () {
    var test = function (methodName) {
      var spy = spyOn(project, methodName)
      mainToolbar.$('.' + methodName + '-button').click()
      expect(spy).toHaveBeenCalled()
    }
    
    test('run')
    test('step')
    test('reset')
    test('save')
  })

  it("should trigger 'select-world-view' when the user changes the selection (2D or 3D)", function () {
    expect(mainToolbar.selectedWorldView()).toBe('3D')
    var spy = jasmine.createSpy()
    mainToolbar.bind('select-world-view', spy)
    mainToolbar.$('.world-view-selection').val('2D').trigger('change')
    expect(spy).toHaveBeenCalled()
    expect(mainToolbar.selectedWorldView()).toBe('2D')
  })

  it("should trigger 'show-new-world-dialog' when the user clicks the 'New' button", function () {
    var spy = jasmine.createSpy()
    mainToolbar.bind('show-new-world-dialog', spy)
    mainToolbar.$('.new-button').click()
    expect(spy).toHaveBeenCalled()
  })

})

})()
