describe("Editor Toolbar", function () {
  var project, editorToolbar

  beforeEach(function () {
    project = new Karel.Models.Project({ code: 'trolololo', language: 'javascript' })
    editorToolbar = new Karel.Views.EditorToolbar({ model: project })
    editorToolbar.render()
  })

  it("should have the language of the project preselected", function () {
    expect(editorToolbar.$('.language-selection').val()).toBe('javascript')
  })

  it("should change the language of the project when the user selects a language", function () {
    editorToolbar.$('.language-selection').val('karol').trigger('change')
    expect(project.get('language')).toBe('karol')
  })

  it("should trigger 'show-structogram' if the user clicks this button", function () {
    var showStructogramSpy = jasmine.createSpy()
    editorToolbar.bind('show-structogram', showStructogramSpy)
    editorToolbar.$('.show-structogram-button').click()
    expect(showStructogramSpy).toHaveBeenCalled()
  })
})
