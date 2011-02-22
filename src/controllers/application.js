(function() {
var _ = require('underscore')

module.exports = require('backbone').Controller.extend({

  initialize: function() {
    this.mainToolbar = new (require('views/main_toolbar'))({
      controller: this,
      el: $('#main-toolbar')
    })
    this.editor = new (require('views/editor'))({ el: $('#editor') })
    
    this.environment = new (require('models/environment'))(this.mainToolbar.getNewDimensions())
    this.initEnvironment()
    
    this.mainToolbar.model = this.environment
    this.environmentToolbar = new (require('views/environment_toolbar'))({
      el: $('#environment-toolbar'),
      model: this.environment
    })
  },

  initEnvironment: function() {
    this.environment.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#environment').html('') // clear
    this.environment2D = new (require('views/environment_2d'))({ model: this.environment })
    this.environment3D = new (require('views/environment_3d'))({ model: this.environment })
    this.mainToolbar.changeView()
    
    var onDropEnvironment = _.bind(function(textData) {
      this.environment = require('models/environment').fromString(textData)
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

}, {
  path: 'controllers/application'
})

})()
