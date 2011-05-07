describe("WorldBase", function() {

  // http://www.w3.org/TR/FileAPI/#file
  var FileMock = function(name, lastModifiedDate, _contents) {
    this.name             = name
    this.lastModifiedDate = lastModifiedDate
    this._contents        = _contents
  }

  // http://www.w3.org/TR/FileAPI/#FileReader-interface
  var FileReaderMock = function() {}

  // ...

  // http://www.w3.org/TR/FileAPI/#readAsDataText
  FileReaderMock.prototype.readAsText = function(file) {
    this.result = null
    setTimeout(_.bind(function() {
      this.result = file._contents
      if (this.onloadend) {
        this.onloadend({ target: this })
      }
    }, this), 50)
  }

  var kdwContents = 'KarolVersion2Deutsch 1 1 1 0 0 0 n o '

  var view

  beforeEach(function() {
    view = new Karel.Views.WorldBase()
  })

  it("should be the super-'class' of World2D and World3D", function() {
    var model = new Karel.Models.World()
    expect(new Karel.Views.World2D({ model: model }))
      .toBeInstanceof(Karel.Views.WorldBase)
    expect(new Karel.Views.World3D({ model: model }))
      .toBeInstanceof(Karel.Views.WorldBase)
  })

  it("should accept .kdw files for drag and drop", function() {
    var OldFileReader, dropWorldSpy
    
    runs(function() {
      OldFileReader = window.FileReader
      window.FileReader = FileReaderMock
      
      dropWorldSpy = jasmine.createSpy()
      view.bind('drop-world', dropWorldSpy)
      
      var el = $(view.el)
      
      var dragoverEvent = new $.Event('dragover')
      el.trigger(dragoverEvent)
      expect(dragoverEvent.isDefaultPrevented).toBeTruthy()
      
      var dragenterEvent = new $.Event('dragenter')
      el.trigger(dragenterEvent)
      expect(dragenterEvent.isDefaultPrevented).toBeTruthy()
      
      var dropEvent = new $.Event('drop', { dataTransfer: {
        files: [new FileMock('world.kdw', '', kdwContents)]
      } })
      el.trigger(dropEvent)
    })

    waits(100)

    runs(function() {
      expect(dropWorldSpy).toHaveBeenCalledWith(kdwContents)
      window.FileReader = OldFileReader
    })
  })

  it("should defer the rendering", function() {
    runs(function() {
      spyOn(view, 'render')
      view.delayRender()
      expect(view.render).not.toHaveBeenCalled()
    })

    waits(50)

    runs(function() {
      expect(view.render).toHaveBeenCalled()
    })
  })

})
