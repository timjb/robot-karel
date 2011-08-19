(function () {

var Project = Karel.Models.Project
,   MainToolbar = Karel.Views.MainToolbar


describe("Main Toolbar", function () {
  var project, mainToolbar

  beforeEach(function () {
    project = new Project({})
    mainToolbar = new MainToolbar({ model: project })
    mainToolbar.appendTo(document.body)
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

  it("should open a dialog when the user clicks the 'New' button", function () {
    expect($('.new-world-overlay').length).toBe(0)
    mainToolbar.$('.new-button').click()
    expect($('.new-world-overlay').length).toBe(1)
    $('.new-world-overlay input[name=width]').val('13').trigger('change')
    $('.new-world-overlay input[name=depth]').val('17').trigger('change')
    $('.new-world-overlay input[type=submit]').click()
    expect($('.new-world-overlay').length).toBe(0)
    expect(project.get('world').get('width')).toBe(13)
    expect(project.get('world').get('depth')).toBe(17)
    // Make sure to remove the overlay
    $('.new-world-overlay').remove()
  })

})

})()
