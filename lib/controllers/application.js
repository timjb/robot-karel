Karel.Controllers.Application = Backbone.Controller.extend({

  initialize: function(options) {
    this.project = options.project
    this.world = this.project.get('world')
    this.mainToolbar = new Karel.Views.MainToolbar({ el: $('#main-toolbar') })
    this.mainToolbar.bind('change:view', _.bind(function(x) {
      this.toggle.show(['2D', '3D'].indexOf(x))
    }, this))
    this.mainToolbar.bind('run',  _.bind(this.run, this))
    this.mainToolbar.bind('save', _.bind(this.save, this))
    
    this.editor = new Karel.Views.Editor()
    this.editor.setValue(this.project.get('code'))
    //this.world  = new Karel.Models.World(this.mainToolbar.getNewDimensions())
    
    this.initWorld()
    
    this.mainToolbar.model = this.world
    this.worldToolbar = new Karel.Views.WorldToolbar({
      el: $('#world-toolbar'),
      model: this.world
    })
  },

  initWorld: function() {
    //this.world.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#world').html('') // clear
    this.world2D = new Karel.Views.World2D({ model: this.world })
    this.world3D = new Karel.Views.World3D({ model: this.world })
    
    var onDropWorld = _.bind(function(textData) {
      this.world = Karel.Models.World.fromString(textData)
      this.project.set({ world: this.world })
      this.initWorld()
      this.world.trigger('change:all')
      this.world.trigger('change', 'all')
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
    
    this.toggle = new Karel.Views.Toggle({
      subviews: [this.world2D, this.world3D]
    })
    if (this.split) this.split.el.html('')
    this.split = new Karel.Views.Split({
      el: $('#split-view'),
      left: this.editor,
      right: this.toggle,
      ratio: 0.4
    })
    this.split.render()
    
    this.mainToolbar.changeView()
  },

  run: function() {
    this.world.run(this.editor.getValue())
  },

  save: function() {
    this.project.set({
      code:  this.editor.getValue()
    }).save()
  }

})
