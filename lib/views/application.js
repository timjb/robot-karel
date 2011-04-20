Karel.Views.Application = Backbone.View.extend({

  id: 'application',

  initialize: function() {
    this.bind('insert', _.bind(function() {
      this.container.trigger('insert')
    }, this))
  },
  
  render: function() {
    var world = this.model.get('world')
    
    //world = new Karel.Models.World(this.mainToolbar.getNewDimensions())
    
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
        this.worldToolbar = new Karel.Views.WorldToolbar({ model: world })
      ] })
    }).appendTo(this.el)
    
    $(window).resize(_.bind(function() {
      this.container.resize()
    }, this))
    
    var changeWorldView = _.bind(function() {
      this.toggle.show(['2D', '3D'].indexOf(this.mainToolbar.selectedWorldView()))
    }, this)
    this.mainToolbar.bind('select-world-view', changeWorldView)
    changeWorldView()
    
    this.model.bind('change:world', _.bind(function() {
      console.log('change world')
      var world = this.model.get('world')
      this.world2D = new Karel.Views.World2D({ model: world })
        .replace(this.world2D)
      this.world3D = new Karel.Views.World3D({ model: world })
        .replace(this.world3D)
      this.worldToolbar = new Karel.Views.WorldToolbar({ model: world })
        .replace(this.worldToolbar)
    }, this))
    
    /*
    var onDropWorld = _.bind(function(textData) {
      this.world = Karel.Models.World.fromString(textData)
      this.project.set({ world: this.world })
      this.initWorld()
      this.world.trigger('change:all')
      this.world.trigger('change', 'all')
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
    */
  }

})
