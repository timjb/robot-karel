Karel.Views.Application = Skin.extend({

  id: 'application',

  initialize: function() {
    this.bind('insert', _.bind(function() {
      this.container.trigger('insert')
    }, this))
  },
  
  render: function() {
    var world = this.model.get('world')
    
    this.container = new Skin.Split({
      ratio: 0.4,
      left: new Skin.Container({ childViews: [
        new Skin.Toolbar().add($('<h1 />').text("Karel.js")),
        this.editor = new Karel.Views.Editor({ model: this.model }),
        this.editorToolbar = new Karel.Views.EditorToolbar({ model: this.model })
      ] }),
      right: new Skin.Container({ childViews: [
        this.mainToolbar = new Karel.Views.MainToolbar({ model: this.model }),
        this.toggle = new Skin.Toggle({ childViews: [
          this.world2D = new Karel.Views.World2D({ model: world }),
          this.world3D = new Karel.Views.World3D({ model: world })
        ] }),
        this.errorBar = new Karel.Views.ErrorBar({ model: this.model }),
        this.worldToolbar = new Karel.Views.WorldToolbar({ model: world })
      ] })
    }).appendTo(this.el)
    
    $(window).resize(_.bind(function() {
      this.container.resize()
    }, this))
    
    this.editorToolbar.bind('show-structogram', _.bind(function() {
      new Skin.Overlay({ childViews: [
        new Karel.Views.Structogram({ model: this.model })
      ] }).appendTo(document.body)
    }, this))
    
    var changeWorldView = _.bind(function() {
      this.toggle.show(['2D', '3D'].indexOf(this.mainToolbar.selectedWorldView()))
    }, this)
    this.mainToolbar.bind('select-world-view', changeWorldView)
    changeWorldView()
    
    this.model.bind('change:world', _.bind(function() {
      var world = this.model.get('world')
      this.world2D = new Karel.Views.World2D({ model: world })
        .replace(this.world2D)
      this.world3D = new Karel.Views.World3D({ model: world })
        .replace(this.world3D)
      this.worldToolbar = new Karel.Views.WorldToolbar({ model: world })
        .replace(this.worldToolbar)
      this.world2D.bind('drop-world', onDropWorld)
      this.world3D.bind('drop-world', onDropWorld)
    }, this))
    
    var onDropWorld = _.bind(function(textData) {
      this.world = Karel.Models.World.fromString(textData)
      this.model.set({ world: this.world })
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
  }

})
