Karel.Views.ErrorBar = Skin.extend({

  className: 'error-bar',

  initialize: function() {
    this.model.bind('error', _.bind(function(exc) {
      console.error(exc)
      this.msg = "" + exc
      this.render()
    }, this))
  },

  events: {
    'click a': 'hide'
  },

  render: function() {
    if (this.msg) {
      $(this.el).html(this.msg + ' <a href="#">Hide</a>')
    } else {
      $(this.el).html('')
    }
    if (this.parentView) this.parentView.trigger('resize')
  },

  hide: function(event) {
    event.preventDefault()
    delete this.msg
    this.render()
  }

})
