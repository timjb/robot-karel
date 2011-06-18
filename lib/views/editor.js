Karel.Views.Editor = Skin.extend({

  className: 'editor',

  initialize: function () {
    _.bindAll(this, 'updateMode', 'markLine', 'removeMarker')
    
    this.codeMirror = CodeMirror(this.el, {
      indentWithTabs: true,
      indentUnit:     2,
      lineNumbers:    true,
      onChange:       _.bind(function() { this.model.set({ code: this.getValue() }) }, this),
      onKeyEvent:     function(_editor, event) { jQuery.Event(event).stopPropagation() }
    })
    
    this.setValue(this.model.get('code'))
    this.model.bind('line', this.markLine)
              .bind('end', this.removeMarker)
              .bind('change:language', this.updateMode)
    this.updateMode()
  },

  onInsert: function () { this.onResize() },
  onResize: function () { this.codeMirror.refresh() /* resize editor */ },

  getValue: function ()  { return this.codeMirror.getValue() },
  setValue: function (v) { this.codeMirror.setValue(v) },

  updateMode: function () {
    this.codeMirror.setOption('mode', this.model.get('language'))
  },

  markLine: function (n) {
    this.removeMarker()
    this._line = n
    // Add a marker to the gutter
    this.codeMirror.setMarker(n, '&rArr;', 'current-line')
    // Make sure the line is visible
    this.codeMirror.setCursor({ line: n, ch: 0 })
  },

  removeMarker: function () {
    if (typeof this._line === 'number') {
      this.codeMirror.clearMarker(this._line)
      delete this._line
    }
  }
})
