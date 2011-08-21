(function () {

var Application = Karel.Views.Application
,   Project = Karel.Models.Project
,   World = Karel.Models.World

describe("Application (View)", function () {

  var project, application

  beforeEach(function () {
    project = new Project({
      language: 'karol',
      code: 'solange nicht istwand tue schritt *solange'
    })
    application = new Application({ model: project })
    application.appendTo(testEl)
  })

  afterEach(function () {
    application.remove()
  })

  it("should contain all subviews that make up the application", function () {
    expect(application.$('h1').length).toBe(1)
    expect(application.$('.editor').length).toBe(1)
    expect(application.$('.editor-toolbar').length).toBe(1)
    expect(application.$('.main-toolbar').length).toBe(1)
    expect(application.$('.world-3d').length).toBe(1)
    expect(application.$('.error-bar').length).toBe(1)
    expect(application.$('.world-toolbar').length).toBe(1)
  })

  it("should resize itself when the window resizes", function () {
    var spy = jasmine.createSpy()
    application.container.bind('resize', spy)
    $(window).resize()
    expect(spy).toHaveBeenCalled()
  })

  it("should show the structogram", function () {
    expect($('.structogram').length).toBe(0)
    application.editorToolbar.trigger('show-structogram')
    var structogramEl = $('.structogram')
    expect(structogramEl.length).toBe(1)
    expect($('> ul > li > .loop-body > ul > li', structogramEl).length).toBe(1)
    structogramEl.parent().remove()
  })

  it("should change the world view", function () {
    var toolbar = application.mainToolbar
    expect(application.$('.world-3d').length).toBe(1)
    expect(application.$('.world-2d').length).toBe(0)
    toolbar.$('.world-view-selection').val('2D')
    toolbar.trigger('select-world-view')
    expect(application.$('.world-3d').length).toBe(0)
    expect(application.$('.world-2d').length).toBe(1)
    toolbar.$('.world-view-selection').val('3D')
    toolbar.trigger('select-world-view')
    expect(application.$('.world-3d').length).toBe(1)
    expect(application.$('.world-2d').length).toBe(0)
  })

  it("should replace the old views for the world when the world is replaced by a new one", function () {
    var oldWorld2D = application.world2D
    ,   oldWorld3D = application.world3D
    ,   oldWorldToolbar = application.worldToolbar
    expect(oldWorld2D).not.toBeFalsy()
    expect(oldWorld3D).not.toBeFalsy()
    expect(oldWorldToolbar).not.toBeFalsy()
    project.set({ world: new World() })
    expect(application.world2D).not.toBe(oldWorld2D)
    expect(application.world3D).not.toBe(oldWorld3D)
    expect(application.worldToolbar).not.toBe(oldWorldToolbar)
    expect($(oldWorld2D.el).parent().length).toBe(0)
    expect($(oldWorld3D.el).parent().length).toBe(0)
    expect($(oldWorldToolbar.el).parent().length).toBe(0)
  })

  it("should replace the world with a new when the user drops it on a world view", function () {
    expect(project.get('world').get('width')).not.toBe(2)
    expect(project.get('world').get('depth')).not.toBe(2)
    application.world2D.trigger('drop-world', 'KarolVersion2Deutsch 2 2 5 0 0 0 n n n n n o n n n n n o n n n n n o n n n n n o ')
    expect(project.get('world').get('width')).toBe(2)
    expect(project.get('world').get('depth')).toBe(2)
    application.world3D.trigger('drop-world', 'KarolVersion2Deutsch 1 1 5 0 0 0 n n n n n o ')
    expect(project.get('world').get('width')).toBe(1)
    expect(project.get('world').get('depth')).toBe(1)
  })

})

})()
