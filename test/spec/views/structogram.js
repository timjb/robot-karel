(function () {

var Project = Karel.Models.Project
,   Structogram = Karel.Views.Structogram

describe("Structogram (View)", function () {

  it("should render sequences as an ul", function () {
    var project = new Project({ code: 'putBrick move turnLeft' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    expect($('ul > li', el).length).toBe(3)
    expect($('ul > li', el).eq(1).html()).toBe('move')
  })

  it("should render functions as a h4 followed by an ul", function () {
    var project = new Project({ code: 'anweisung turnAround turnLeft turnLeft *anweisung' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var functionEl = $('> ul > li', el)
    expect(functionEl.length).toBe(1)
    expect($('h4', functionEl).text()).toBe('Anweisung turnaround')
    expect($('ul > li', functionEl).length).toBe(2)
  })

  it("should render conditionals as a table", function () {
    var project = new Project({ code: 'wenn nicht isWall dann putBrick move sonst turnLeft *wenn' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var ifEl = $('> ul > li > table', el)
    expect(ifEl.length).toBe(1)
    expect($('> thead > tr', ifEl).length).toBe(2)
    expect($('th[colspan=2]', ifEl).text()).toBe('wenn nicht iswall')
    expect($('th', ifEl).eq(1).text()).toBe('wahr')
    expect($('th', ifEl).eq(2).text()).toBe('falsch')
    expect($('td > ul', ifEl).eq(0).children().length).toBe(2)
    expect($('td > ul', ifEl).eq(1).children().length).toBe(1)
  })

  it("should render while loops", function () {
    var project = new Project({ code: 'solange nicht isWall tue move *solange' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var whileEl = $('> ul > li', el)
    expect(whileEl.length).toBe(1)
    expect(whileEl.text()).toMatch(/^solange nicht iswall/)
    expect($('div.loop-body > ul > li', whileEl).length).toBe(1)
  })

  it("should render do while loops", function () {
    var project = new Project({ code: 'wiederhole move *wiederhole solange nicht isBrick' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var whileEl = $('> ul > li', el)
    expect(whileEl.length).toBe(1)
    expect(whileEl.text()).toMatch(/solange nicht isbrick$/)
    expect($('div.loop-body > ul > li', whileEl).length).toBe(1)
  })

  it("should render infinite (while true) loops", function () {
    var project = new Project({ code: 'wiederhole immer hinlegen *wiederhole' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var whileEl = $('> ul > li', el)
    expect(whileEl.length).toBe(1)
    expect(whileEl.text()).toMatch(/^wiederhole immer/)
    expect($('div.loop-body > ul > li', whileEl).length).toBe(1)
  })

  it("should render for loops", function () {
    var project = new Project({ code: 'wiederhole 3 mal hinlegen schritt markesetzen *wiederhole' })
    ,   structogram = new Structogram({ model: project })
    ,   el = $(structogram.render().el)
    
    expect(el.children().length).toBe(1)
    var whileEl = $('> ul > li', el)
    expect(whileEl.length).toBe(1)
    expect(whileEl.text()).toMatch(/^wiederhole 3 mal/)
    expect($('div.loop-body > ul > li', whileEl).length).toBe(3)
  })

})

})()
