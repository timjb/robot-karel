var _        = require('underscore')
,   Backbone = require('backbone')

var MainToolbar  = require('../views/main_toolbar')
,   WorldToolbar = require('../views/world_toolbar')
,   Editor       = require('../views/editor')
,   World2D      = require('../views/world_2d')
,   World3D      = require('../views/world_3d')
,   Toggle       = require('../views/toggle')
,   Split        = require('../views/split')

var World   = require('../models/world')
,   Project = require('../models/project')


module.exports = Backbone.Controller.extend({

  initialize: function() {
    this.mainToolbar = new MainToolbar({ el: $('#main-toolbar') })
    this.mainToolbar.bind('change:view', _.bind(function(x) {
      this.toggle.show(['2D', '3D'].indexOf(x))
    }, this))
    this.mainToolbar.bind('run',  _.bind(this.run, this))
    this.mainToolbar.bind('save', _.bind(this.save, this))
    
    this.editor = new Editor()
    this.world  = new World(this.mainToolbar.getNewDimensions())
    
    this.initWorld()
    
    this.mainToolbar.model = this.world
    this.worldToolbar = new WorldToolbar({
      el: $('#world-toolbar'),
      model: this.world
    })
  },

  initWorld: function() {
    this.world.bind('line', _.bind(this.editor.gotoLine, this.editor))
    
    $('#world').html('') // clear
    this.world2D = new World2D({ model: this.world })
    this.world3D = new World3D({ model: this.world })
    
    var onDropWorld = _.bind(function(textData) {
      this.world = World.fromString(textData)
      this.initWorld()
      this.world.trigger('change:all')
      this.world.trigger('change', 'all')
    }, this)
    
    this.world2D.bind('drop-world', onDropWorld)
    this.world3D.bind('drop-world', onDropWorld)
    
    this.toggle = new Toggle({
      subviews: [this.world2D, this.world3D]
    })
    if (this.split) this.split.el.html('')
    this.split = new Split({
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
  },

  save: function() {
    var project = new Project()
    project.set({
      world: this.world.toString(),
      code:  this.editor.getValue()
    })
    project.save()
  }

})
