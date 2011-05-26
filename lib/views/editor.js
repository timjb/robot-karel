Karel.Views.Editor = Skin.extend({

  className: 'editor',

  initialize: function() {
    _.bindAll(this, 'updateMode', 'gotoLine')
    
    this.codeMirror = CodeMirror(this.el, {
      indentWithTabs: true,
      indentUnit:     2,
      lineNumbers:    true,
      onChange:       _.bind(function() { this.model.set({ code: this.getValue() }) }, this),
      onKeyEvent:     function(_editor, event) { jQuery.Event(event).stopPropagation() }
    })
    
    this.setValue(this.model.get('code'))
    this.model.bind('line', this.gotoLine)
    this.model.bind('change:language', this.updateMode)
    this.updateMode()
  },

  onInsert: function() { this.onResize() },
  onResize: function() { this.codeMirror.refresh() /* resize editor */ },

  updateMode: function() {
    var language = this.model.get('language')
    ,   mode     = language === 'javascript' ? 'javascript' : 'karol'
    this.codeMirror.setOption('mode', mode)
  },

  getValue: function() {
    return this.codeMirror.getValue()
  },

  setValue: function(v) {
    this.codeMirror.setValue(v)
  },

  gotoLine: function(n) {
    this.codeMirror.setCursor({ line: n, ch: 0 })
  }
})
