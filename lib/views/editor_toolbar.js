Karel.Views.EditorToolbar = Skin.Toolbar.extend({

  initialize: function() {
    this.add(this.languageSelection = Skin.select([
      { text: "JavaScript", value: 'javascript',
        selected: this.model.get('language') === 'javascript' },
      { text: "Robot Karol", value: 'karol',
        selected: this.model.get('language') === 'karol' }
    ], _.bind(function() {
      this.model.set({ language: this.languageSelection.val() })
    }, this)))
  }

})
