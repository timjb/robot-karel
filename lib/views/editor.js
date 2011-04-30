Karel.Views.Editor = Skin.extend({

  className: 'editor',

  initialize: function() {
    _.bindAll(this, 'render', 'updateMode', 'gotoLine')
    
    $(this.el).css({ position: 'relative' })
    
    try {
      var e = this.editor  = ace.edit(this.el)
      var s = this.session = e.getSession()
      
      this.updateMode()
      this.model.bind('change:language', this.updateMode)
      s.setTabSize(2)
      s.setUseSoftTabs(true)
      e.setShowPrintMargin(false)
      
      s.on('change', _.bind(function() {
        console.log('Editor change')
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
    
    this.model.bind('line', this.gotoLine)
    
    this.setValue(this.model.get('code'))
    this.bind('insert', this.render)
  },

  updateMode: function() {
    var language = this.model.get('language')
    
    if (language === 'javascript') {
      var mode = new (require('ace/mode/javascript').Mode)
    } else {
      var mode = new (require('karel/mode/karol').Mode)
    }
    this.session.setMode(mode)
  },

  render: function() {
    console.log('Render Editor')
    this.editor.resize()
    return this
  },

  onResize: function() {
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
