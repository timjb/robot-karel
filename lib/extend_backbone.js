// Freedom-patch Backbone

var _        = require('underscore')
,   Backbone = require('backbone')

_.extend(Backbone.View.prototype, {

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
  },

  detach: function() {
    $(this.el).detach()
    this.trigger('dom:remove')
    return this
  }

})
