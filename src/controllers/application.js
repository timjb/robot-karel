App.Controllers.Application = Backbone.Controller.extend({

  initialize: function() {
    this.mainToolbar = new App.Views.MainToolbar({ controller: this, el: $('#main-toolbar') })
    this.editor = new App.Views.Editor({ el: $('#editor') })
    
    this.environment = new App.Models.Environment(this.mainToolbar.getNewDimensions())
    this.initEnvironment()
    
    this.mainToolbar.model = this.environment
    this.environmentToolbar = new App.Views.EnvironmentToolbar({
      el: $('#environment-toolbar'),
      model: this.environment
    })
  },

  initEnvironment: function() {
    this.environment.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#environment').html('') // clear
    this.environment2D = new App.Views.Environment2D({ model: this.environment })
    this.environment3D = new App.Views.Environment3D({ model: this.environment })
    this.mainToolbar.changeView()
    
    var onDropEnvironment = _.bind(function(textData) {
      this.environment = App.Models.Environment.fromString(textData)
      this.initEnvironment()
      this.environment.trigger('change:all')
      this.environment.trigger('change', 'all')
    }, this)
    this.environment2D.bind('drop-environment', onDropEnvironment)
    this.environment3D.bind('drop-environment', onDropEnvironment)
  },

  routes: {
    'examples/:name': 'loadExample',
    'export': 'showSource'
  },

  loadExample: function(name) {
    $.ajax({
      url: 'examples/'+name+'.js',
      dataType: 'text',
      success: _.bind(this.editor.setValue, this.editor)
    })
  },

  showSource: function() {
    history.pushState(null, "export", 'welt.kdw')
    var overlay = $('<div class="export" />')
      .text(this.environment.toString())
      .appendTo($('body'))
    
    var selection = window.getSelection()
    var range = document.createRange()
    range.selectNodeContents(overlay.get(0))
    selection.removeAllRanges()
    selection.addRange(range)
    
    window.onpopstate = function() {
      overlay.remove()
      delete window.onpushstate
    }
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
