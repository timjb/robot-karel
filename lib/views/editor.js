Karel.Views.Editor = Backbone.View.extend({

  className: 'editor',

  initialize: function() {
    _.bindAll(this, 'render')
    
    $(this.el).css({ position: 'relative' })
    var el = $('<div />')
      .css({ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 })
      .appendTo(this.el)
    
    try {
      var e = this.editor  = ace.edit(el.get(0))
      var s = this.session = e.getSession()
      
      s.setMode(new (require('ace/mode/javascript').Mode))
      s.setTabSize(2)
      s.setUseSoftTabs(true)
      e.setShowPrintMargin(false)
      
      s.on('change', _.bind(function() {
        console.log('ACE change')
        this.model.set({ code: this.getValue() })
      }, this))
      
      var focused = false
      e.on('blur',  function() { focused = false })
      e.on('focus', function() { focused = true })
      $(this.el).keydown(function(evt) {
        if (focused) evt.stopPropagation()
      })
    } catch (exc) {
      // this happens when testing with zombie.js
      console.error(exc)
    }
    
    this.setValue(this.model.get('code'))
    this.bind('insert', this.render)
  },

  render: function() {
    console.log('Render Editor')
    this.editor.resize()
    return this
  },

  resize: function() {
    this.render()
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
