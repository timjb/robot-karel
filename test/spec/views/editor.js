(function () {

var Project = Karel.Models.Project
,   Editor  = Karel.Views.Editor

describe("Editor", function () {
  var project, editor
  
  beforeEach(function () {
    project = new Project({
      language: 'karol',
      code: 'putBrick\nmove\nputBrick\nturnLeft'
    })
    editor = new Editor({ model: project })
    editor.appendTo(document.body)
  })

  afterEach(function () {
    editor.remove()
  })

  it("should have the code of the project as it's initial value", function () {
    expect(editor.getValue()).toBe(project.get('code'))
  })

  it("should set the project's code when the user enters text", function () {
    var currentValue = project.get('code')
    ,   nextValue    = currentValue + '\nturnRight'
    editor.setValue(nextValue)
    expect(project.get('code')).toBe(nextValue)
  })

  it("should stop the propagation of all key events", function () {
    /*
     * Doesn't work at the moment.
     * Maybe that's because we need to use DOM APIs to create events.
    var spy = jasmine.createSpy()
    $(editor.el).keydown(spy)
    editor.$('textarea').trigger(new $.Event('keydown'))
    expect(spy).not.toHaveBeenCalled()
     */
  })

  it("should update the mode if the language changes", function () {
    expect(editor.codeMirror.getOption('mode')).toBe('karol')
    project.set({ language: 'javascript' })
    expect(editor.codeMirror.getOption('mode')).toBe('javascript')
  })

  it("should mark lines", function () {
    expect(editor.$('.current-line').length).toBe(0)
    editor.markLine(1)
    expect(editor.$('.current-line').length).toBe(1)
    editor.markLine(2)
    expect(editor.$('.current-line').length).toBe(1) // only one marker
  })

  it("should mark a line at each step of the execution", function () {
    expect(editor.$('.current-line').length).toBe(0)
    project.step()
    expect(editor.$('.current-line').length).toBe(1)
    project.step()
    expect(editor.$('.current-line').length).toBe(1)
    project.run()
    expect(editor.$('.current-line').length).toBe(0)
  })

  it("should unmark lines", function () {
    editor.markLine(1)
    expect(editor.$('.current-line').length).toBe(1)
    editor.removeMarker()
    expect(editor.$('.current-line').length).toBe(0)
  })
})

})()
