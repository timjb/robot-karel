(function() {
var _ = require('underscore')

module.exports = require('views/environment_base').extend({

  initialize: function() {
    _(this).bindAll('render', 'delayRender', 'delegateEvents')
    
    this.model.bind('change', this.delayRender)
    
    this
      .bind('dom:insert', this.delegateEvents)
      .bind('dom:insert', this.render)
    
    $(window).resize(this.render)
  },

  tagName: 'canvas',

  events: {
    mousedown:   'onMousedown',
    contextmenu: 'preventDefault',
    dragover:    'preventDefault',
    dragenter:   'preventDefault',
    drop:        'onDrop'
  },

  onMousedown: function(evt) {
    var rect = $(this.el).offset()
    ,   x = evt.clientX - rect.left
    ,   y = evt.clientY - rect.top
    
    var position = new Position(
      Math.floor((x-this.GAP) / this.GW),
      Math.floor((y-this.GAP) / this.GW)
    )
    
    if (evt.which == 1) { // left click
      this.model.set({ position: position })
    } else {
      var field = this.model.getField(position)
      field.marke = !field.marke
      this.model.triggerChangeField(position)
    }
  },

  render: function() {
    console.log('Render 2D')
    
    var parent = $(this.el).parent()
    ,   width  = parent.innerWidth()
    ,   height = parent.innerHeight()
    
    var model     = this.model
    ,   position  = model.get('position')
    ,   direction = model.get('direction')
    
    var GAP = this.GAP = 4
    ,   GW  = this.GW  = Math.round(Math.min(
      (width-GAP)  / model.get('width'),
      (height-GAP) / model.get('depth')
    )) // GridWidth
    
    $(this.el).attr({ width: width, height: height })
    var ctx = this.el.getContext('2d')
    
    // Fill everything => border between squares
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, width, height)
    
    function fill(x, y, color) {
      ctx.fillStyle = color
      ctx.fillRect(GAP+x*GW, GAP+y*GW, GW-GAP, GW-GAP)
    }
    
    function letter(x, y, color, letter) {
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = (0.5*GW) + 'px Helvetica, Arial, sans-serif'
      ctx.fillText(letter, GAP + x*GW + 0.5*(GW-GAP), GAP + y*GW + 0.5*(GW-GAP))
    }
    
    model.eachField(function(x, y, field) {
      var bg, fg;
      if      (field.quader) { bg = ENVIRONMENT_COLORS.quader.css }
      else if (field.marke)  { bg = ENVIRONMENT_COLORS.marke.css;  fg = '#000' }
      else if (field.ziegel) { bg = ENVIRONMENT_COLORS.ziegel.css; fg = '#fff' }
      else    /* nothing */  { bg = '#fff'; fg = '#000' }
      fill(x, y, bg)
      if (position.x == x && position.y == y) {
        var char;
        if      (direction.isNorth()) char = '\u25b2'
        else if (direction.isSouth()) char = '\u25bc'
        else if (direction.isWest())  char = '\u25c4'
        else    /* east */            char = '\u25ba'
        letter(x, y, fg, char)
      } else if (field.ziegel) letter(x, y, fg, field.ziegel)
    });
  }

}, {
  path: 'views/environment_2d'
})

})()
