App.Controllers.Application = Backbone.Controller.extend({

  initialize: function() {
    this.mainToolbar = new App.Views.MainToolbar({ controller: this, el: $('#main-toolbar') })
    this.editor = new App.Views.Editor({ el: $('#editor') })
    
    this.environment = new App.Models.Environment(this.mainToolbar.getNewDimensions())
    this.environment.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    this.mainToolbar.model = this.environment
    this.environmentToolbar = new App.Views.EnvironmentToolbar({
      el: $('#environment-toolbar'),
      model: this.environment
    })
    
    $('#environment').html('') // clear
    this.environment2D = new App.Views.Environment2D({ model: this.environment })
    this.environment3D = new App.Views.Environment3D({ model: this.environment })
    this.mainToolbar.changeView()
  },

  routes: {
    'examples/:name': 'loadExample'
  },

  loadExample: function(name) {
    $.ajax({
      url: 'examples/'+name+'.js',
      dataType: 'text',
      success: _.bind(this.editor.setValue, this.editor)
    })
  },

  show2D: function() {
    this.environment3D.remove()
    this.environment2D.appendTo($('#environment'))
  },

  show3D: function() {
    this.environment2D.remove()
    this.environment3D.appendTo($('#environment'))
  },

  run: function() {
    this.environment.run(this.editor.getValue())
  }

})
