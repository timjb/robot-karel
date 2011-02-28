(function() {
var _ = require('underscore')

module.exports = require('backbone').Controller.extend({

  initialize: function() {
    this.mainToolbar = new (require('views/main_toolbar'))({ el: $('#main-toolbar') })
    this.mainToolbar.bind('change:view', _.bind(function(x) {
      this.toggle.show(['2D', '3D'].indexOf(x))
    }, this))
    this.mainToolbar.bind('run', _.bind(this.run, this))
    
    this.editor = new (require('views/editor'))()
    this.world  = new (require('models/world'))(this.mainToolbar.getNewDimensions())
    
    this.initWorld()
    
    this.mainToolbar.model = this.world
    this.worldToolbar = new (require('views/world_toolbar'))({
      el: $('#world-toolbar'),
      model: this.world
    })
  },

  initWorld: function() {
    this.world.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#world').html('') // clear
    this.world2D = new (require('views/world_2d'))({ model: this.world })
    this.world3D = new (require('views/world_3d'))({ model: this.world })
    
    var onDropWorld = _.bind(function(textData) {
      this.world = require('models/world').fromString(textData)
      this.initWorld()
      this.world.trigger('change:all')
      this.world.trigger('change', 'all')
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
    
    this.toggle = new (require('views/toggle'))({
      subviews: [this.world2D, this.world3D]
    })
    if (this.split) this.split.el.html('')
    this.split = new (require('views/split'))({
      el: $('#split-view'),
      left: this.editor,
      right: this.toggle,
      ratio: 0.4
    })
    this.split.render()
    
    this.mainToolbar.changeView()
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
      .text(this.world.toString())
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

  run: function() {
    this.world.run(this.editor.getValue())
  }

}, {
  path: 'controllers/application'
})

})()
