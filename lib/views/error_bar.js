Karel.Views.ErrorBar = Skin.extend({

  className: 'error-bar alert-message error',

  initialize: function () {
    this.model.bind('error', _.bind(function (exc) {
      console.error(exc)
      this.msg = "" + exc
      this.render()
    }, this))
  },

  events: {
    'click .close': 'hide'
  },

  render: function () {
    if (this.msg) {
      $(this.el)
        .removeClass('hide')
        .html('<a href="#" class="close">x</a><p>' + this.msg + '</p>')
    } else {
      $(this.el)
        .addClass('hide')
        .html('')
    }
    if (this.parentView) this.parentView.trigger('resize')
  },

  hide: function (event) {
    event.preventDefault()
    delete this.msg
    this.render()
  }

})
