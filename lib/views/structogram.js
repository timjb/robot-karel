Karel.Views.Structogram = Backbone.View.extend({

  className: 'structogram',

  initialize: function() {
    if (this.model.get('language') !== 'karol') {
      throw new Error("Can't produce a structogram of programs written in any other language but karol.")
    }
  },

  render: function() {
    console.log('render structogram')
    $(this.el).html(Karel.Compiler.parse(this.model.get('code')).render())
  }

})
