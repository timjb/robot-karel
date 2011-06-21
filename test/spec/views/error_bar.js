describe("Error Bar", function() {
  var project, errorBar

  beforeEach(function() {
    project = new Karel.Models.Project({ code: 'asdf' })
    errorBar = new Karel.Views.ErrorBar({ model: project })
    errorBar.render()
  })

  it("should show the bar", function() {
    var el = $(errorBar.el)
    expect(el.html()).toEqual('')
    project.run()
    expect(el.html()).toMatch(/asdf\b.*\bnot defined/)
  })

  it("should hide the bar", function() {
    project.run()
    errorBar.$('a').click()
    expect($(errorBar.el).html()).toEqual('')
  })

})
