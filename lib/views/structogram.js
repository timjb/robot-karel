Karel.Views.Structogram = Skin.extend({

  className: 'structogram',

  initialize: function () {
    if (this.model.get('language') !== 'karol') {
      throw new Error("Can't produce a structogram of programs written in any language but karol.")
    }
  },

  render: function () {
    console.log("Render structogram")
    $(this.el).html(Karel.Parser.render(this.model.get('code')))
    return this
  }

})
