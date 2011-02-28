module.exports = require('backbone').View.extend({

  className: 'toggle-view',

  initialize: function(opts) {
    this.subviews = opts.subviews
    this.show(0)
  },

  show: function(n) {
    _.each(this.subviews, function(v) {
      v.remove()
    })
    
    this.subviews[n].appendTo(this.el).render()
  },

  resize: function() {
    _.each(this.subviews, function(v) {
      if (typeof v.resize == 'function') v.resize()
    })
  }

}, {
  path: 'views/toggle'
})
