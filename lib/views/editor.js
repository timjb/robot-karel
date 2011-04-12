var _ = require('underscore')
,   Backbone = require('backbone')

module.exports = Backbone.View.extend({

  className: 'editor',

  initialize: function() {
    $(this.el).css({ position: 'relative' })
    var el = $('<div />')
      .css({ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 })
      .appendTo(this.el)
    
    try {
      var e = this.editor  = ace.edit(el.get(0))
      var s = this.session = e.getSession()
      
      // Use ACE's require function, thus `window`
      s.setMode(new (window.require('ace/mode/javascript').Mode))
      s.setTabSize(2)
      s.setUseSoftTabs(true)
      e.setShowPrintMargin(false)
      
      var focused = false
      e.onBlur = _.wrap(e.onBlur, function(old) {
        focused = false
        old.apply(this)
      })
      e.onFocus = _.wrap(e.onFocus, function(old) {
        focused = true
        old.apply(this)
      })
      
      $(this.el).keydown(function(evt) {
        if (focused) evt.stopPropagation()
      })
    } catch (exc) {
      // this happens when testing with zombie.js
      console.error(exc)
    }
  },

  resize: function() {
    this.editor.resize()
  },

  getValue: function() {
    return this.session.getValue()
  },

  setValue: function(v) {
    return this.session.setValue(v)
  },

  gotoLine: function(n) {
    this.editor.gotoLine(n)
  }
})