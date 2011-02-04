// Freedom-patch Backbone

_(Backbone.View.prototype).extend({
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
      this.renderTimeout = setTimeout(_.bind(this.render, this), 50)
    }
  },

  preventDefault: function(evt) {
    evt.preventDefault()
  }
});
