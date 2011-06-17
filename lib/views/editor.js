Karel.Views.Editor = Skin.extend({

  className: 'editor',

  initialize: function () {
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

  onInsert: function () { this.onResize() },
  onResize: function () { this.codeMirror.refresh() /* resize editor */ },

  getValue: function ()  { return this.codeMirror.getValue() },
  setValue: function (v) { this.codeMirror.setValue(v) },

  updateMode: function () {
    this.codeMirror.setOption('mode', this.model.get('language'))
  },

  gotoLine: function (n) {
    console.log('gotoLine: ' + n)
    this.codeMirror.setCursor({ line: n-1, ch: 0 })
  }
})
