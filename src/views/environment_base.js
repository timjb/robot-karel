module.exports = require('backbone').View.extend({

  onDrop: function(evt) {
    evt.preventDefault()
    evt = evt.originalEvent
    var reader = new FileReader()
    reader.onloadend = _.bind(function(evt) {
      this.trigger('drop-environment', evt.target.result)
    }, this)
    reader.readAsText(evt.dataTransfer.files[0])
  },

  appendTo: function(p) {
    p.append(this.el)
    this.trigger('dom:insert')
  },

  isVisible: function() {
    return !!$(this.el).parent().length
  },

  delayRender: function() {
    if (this.isVisible()) {
      clearTimeout(this.renderTimeout)
      this.renderTimeout = setTimeout(_.bind(this.render, this), 20)
    }
  },

  preventDefault: function(evt) {
    evt.preventDefault()
  }

}, {
  path: 'views/environment_base'
})
