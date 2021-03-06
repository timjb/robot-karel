Karel.Views.World2D = Karel.Views.WorldBase.extend({

  className: 'world-2d',

  initialize: function() {
    this.model.bind('change', _.bind(this.delayRender, this))
    
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

  events: _.extend({
    mousedown:   'onMousedown',
    contextmenu: 'preventDefault',
  }, Karel.Views.WorldBase.prototype.events),

  onInsert: function() {
    this.render()
    this.delegateEvents()
  },

  onMousedown: function(event) {
    event.preventDefault() // Disable text selection
    
    var td = $(event.target)
    if (!td.is('td')) return
    
    var position = new Karel.Models.Position(
      parseInt(td.attr('data-x'), 10),
      parseInt(td.attr('data-y'), 10)
    )
    
    if (event.which == 1) { // left click
      if (!this.model.getField(position).block) {
        this.model.getRobot().set({ position: position })
      }
    } else {
      var field = this.model.getField(position)
      field.marker = !field.marker
      this.model.triggerChangeField(position)
    }
  },

  render: function() {
    console.log('Render 2D')
    
    function repeat (str, n) {
      var s = '';
      while (n--) {
        s += str;
      }
      return s;
    }
    
    function pad (str, n, ch) {
      return repeat(ch, n - str.length) + str
    }
    
    function toCSSColor (numColor) {
      return '#' + pad(numColor.toString(16), 6, '0')
    }
    
    var el = $(this.el)
    el.css('display', 'none') // Minimize reflows
    
    var model  = this.model
    var fields = this.fields
    
    model.eachField(function(x, y, field) {
      var td = fields[y][x]
      td[field.marker ? 'addClass' : 'removeClass']('marker')
      td[field.block  ? 'addClass' : 'removeClass']('block')
      if (field.bricks.length > 0) {
        td.addClass('brick')
          .text(''+field.bricks.length)
          .css('background', toCSSColor(_.last(field.bricks)))
      } else {
        td.removeClass('brick')
          .text('')
          .css('background', '')
      }
    })
    
    ;(function() {
      var robot        = model.getRobot()
      ,   position     = robot.get('position')
      ,   direction    = robot.get('direction')
      ,   currentField = model.getField(position)
      ,   currentTd    = fields[position.y][position.x]
      
      var char
      if      (direction.isSouth()) char = '\u25bc'
      else if (direction.isWest())  char = '\u25c4'
      else if (direction.isNorth()) char = '\u25b2'
      else    /* east */            char = '\u25ba'
      currentTd.html(char)
    })()
    
    el.css('display', '')
    
    return this
  }

})
