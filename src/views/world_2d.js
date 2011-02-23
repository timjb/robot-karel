(function() {
var _        = require('underscore')
,   Position = require('models/position_and_direction').Position

module.exports = require('views/world_base').extend({

  initialize: function() {
    _(this).bindAll('render', 'delayRender', 'delegateEvents')
    
    this.model.bind('change', this.delayRender)
    
    this
      .bind('dom:insert', this.delegateEvents)
      .bind('dom:insert', this.render)
    
    this.createTable()
  },

  createTable: function() {
    var width     = this.model.get('width')
    ,   height    = this.model.get('depth')
    
    this.fields = []
    
    var el = $(this.el)
    for (var i = 0; i < height; i++) {
      var tr = $('<tr />')
      this.fields[i] = []
      for (var j = 0; j < width; j++) {
        var td = $('<td />')
        td.attr('data-x', j)
        td.attr('data-y', i)
        this.fields[i][j] = td
        tr.append(td)
      }
      el.append(tr)
    }
  },

  tagName: 'table',
  className: 'world-2d',

  events: {
    mousedown:   'onMousedown',
    contextmenu: 'preventDefault',
    dragover:    'preventDefault',
    dragenter:   'preventDefault',
    drop:        'onDrop'
  },

  onMousedown: function(evt) {
    var td = $(evt.target)
    if (!td.is('td')) return
    
    var position = new Position(
      parseInt(td.attr('data-x'), 10),
      parseInt(td.attr('data-y'), 10)
    )
    
    if (evt.which == 1) { // left click
      this.model.get('robot').set({ position: position })
    } else {
      var field = this.model.getField(position)
      field.marke = !field.marke
      this.model.triggerChangeField(position)
    }
  },

  render: function() {
    console.log('Render 2D')
    
    var el = $(this.el)
    el.css('display', 'none')
    
    var model = this.model
    var fields = this.fields
    
    model.eachField(function(x, y, field) {
      var td = fields[y][x]
      td[field.marke  ? 'addClass' : 'removeClass']('marke')
      td[field.quader ? 'addClass' : 'removeClass']('quader')
      td[field.ziegel ? 'addClass' : 'removeClass']('ziegel')
      td.text(field.ziegel ? field.ziegel : '')
    })
    
    ;(function() {
      var robot        = model.get('robot')
      ,   position     = robot.get('position')
      ,   direction    = robot.get('direction')
      ,   currentField = model.getField(position)
      ,   currentTd    = fields[position.y][position.x]
      
      var char
      if      (direction.isNorth()) char = '\u25b2'
      else if (direction.isSouth()) char = '\u25bc'
      else if (direction.isWest())  char = '\u25c4'
      else    /* east */            char = '\u25ba'
      currentTd.html(char)
    })()
    
    el.css('display', '')
  }

}, {
  path: 'views/world_2d'
})

})()
