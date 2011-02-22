module.exports = require('backbone').View.extend({

  initialize: function(opts) {
    this.left  = opts.left
    this.right = opts.right
    this.el.html()
  },

  events: {
    'mousedown .separator': 'resize'
  }

}, {
  path: 'views/split'
})
