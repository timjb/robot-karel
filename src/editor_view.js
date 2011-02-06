var EditorView = Backbone.View.extend({

  initialize: function() {
    var e = this.editor  = ace.edit($(this.el).get(0))
    var s = this.session = e.getSession()
    
    s.setMode(new (require('ace/mode/javascript').Mode))
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
