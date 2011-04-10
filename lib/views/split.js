var _        = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  className: 'split-view',

  initialize: function(opts) {
    _.bindAll(this, 'onMousedown', 'onMousemove', 'render')
    
    this.left  = opts.left
    this.right = opts.right
    this.ratio = opts.ratio || 0.5
    
    this.leftEl    = $(this.left.el)
    this.separator = $('<div class="separator" />')
    this.rightEl   = $(this.right.el)
    
    this.el.append(this.leftEl)
    this.el.append(this.separator)
    this.el.append(this.rightEl)
    
    $(window).resize(this.render)
    this.separator.mousedown(this.onMousedown)
  },

  onMousedown: function(evt) {
    this.x = evt.pageX
    
    $(document)
      .mousemove(this.onMousemove)
      .mouseup(function onMouseup() {
        $(this)
          .unbind('mousemove', this.onMousemove)
          .unbind('mouseup',   onMouseup)
      })
  },

  onMousemove: function(evt) {
    this.resizeSubviews(evt.pageX - this.x)
    this.x = evt.pageX
  },

  resizeSubviews: function(deltaX) {
    var left  = this.leftEl
    ,   right = this.rightEl
    ,   leftWidth = left.width() + deltaX
    ,   rightWidth = right.width() - deltaX
    
    this.ratio = leftWidth / (leftWidth+rightWidth)
    
    left.width(leftWidth)
    if (typeof this.left.resize == 'function') this.left.resize()
    right.width(rightWidth)
    if (typeof this.right.resize == 'function') this.right.resize()
  },

  resize: function() {
    this.render()
  },

  render: function() {
    var availWidth = $(this.el).width() - this.separator.width()
    ,   leftWidth  = Math.round(this.ratio * availWidth)
    ,   rightWidth = availWidth - leftWidth
    
    this.leftEl.width(leftWidth)
    this.rightEl.width(rightWidth)
    
    this.left.render()
    this.right.render()
    
    return this
  }

})
