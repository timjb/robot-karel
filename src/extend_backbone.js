// Freedom-patch Backbone

require('underscore').extend(require('backbone').View.prototype, {

  // handy in events hash
  preventDefault: function(evt) {
    evt.preventDefault()
  },

  appendTo: function(p) {
    $(p).append(this.el)
    this.trigger('dom:insert')
    return this
  },

  remove: function() {
    $(this.el).remove()
    this.trigger('dom:remove')
    return this
  }

})
