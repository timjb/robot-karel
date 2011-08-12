describe("Editor Toolbar", function () {
  var project, editorToolbar

  beforeEach(function () {
    project = new Karel.Models.Project({ code: 'trolololo', language: 'karol' })
    editorToolbar = new Karel.Views.EditorToolbar({ model: project })
    editorToolbar.render()
  })

  it("should have the language of the project preselected", function () {
    expect(editorToolbar.$('.language-selection').val()).toBe('karol')
  })

  it("should change the language of the project when the user selects a language", function () {
    editorToolbar.$('.language-selection').val('javascript').trigger('change')
    expect(project.get('language')).toBe('javascript')
  })

  it("should trigger 'show-structogram' if the user clicks this button", function () {
    var showStructogramSpy = jasmine.createSpy()
    editorToolbar.bind('show-structogram', showStructogramSpy)
    editorToolbar.$('.show-structogram-button').click()
    expect(showStructogramSpy).toHaveBeenCalled()
  })

  it("should disable the show-structugram-button if the language is javascript", function () {
    var showStructogramButton = editorToolbar.$('.show-structogram-button')
    expect(showStructogramButton.prop('disabled')).toBe(false)
    project.set({ language: 'javascript' })
    expect(showStructogramButton.prop('disabled')).toBe(true)
  })
})
