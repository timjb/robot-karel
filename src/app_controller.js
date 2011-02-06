var AppController = Backbone.Controller.extend({

  initialize: function() {
    this.mainToolbarView = new MainToolbarView({ controller: this, el: $('#main-toolbar') })
    this.editorView = new EditorView({ el: $('#editor') })
    
    this.environment = new Environment(this.mainToolbarView.getNewDimensions())
    this.environment.bind('line', _.bind(this.editorView.gotoLine, this.editorView))
    
    this.mainToolbarView.model = this.environment
    this.environmentToolbarView = new EnvironmentToolbarView({
      el: $('#environment-toolbar'),
      model: this.environment
    })
    
    $('#environment').html('') // clear
    this.environmentView2D = new EnvironmentView2D({ model: this.environment })
    this.environmentView3D = new EnvironmentView3D({ model: this.environment })
    this.mainToolbarView.changeView()
  },

  routes: {
    'examples/:name': 'loadExample'
  },

  loadExample: function(name) {
    $.ajax({
      url: 'examples/'+name+'.js',
      dataType: 'text',
      success: _.bind(this.editorView.setValue, this.editorView)
    })
  },

  show2D: function() {
    this.environmentView3D.remove()
    this.environmentView2D.appendTo($('#environment'))
  },

  show3D: function() {
    this.environmentView2D.remove()
    this.environmentView3D.appendTo($('#environment'))
  },

  run: function() {
    this.environment.run(this.editorView.getValue())
  }

})
