Karel.Views.EditorToolbar = Skin.Toolbar.extend({

  initialize: function() {
    this.languageSelection = Skin.select([
      { text: "JavaScript", value: 'javascript',
        selected: this.model.get('language') === 'javascript' },
      { text: "Robot Karol", value: 'karol',
        selected: this.model.get('language') === 'karol' }
    ], _.bind(function() {
      this.model.set({ language: this.languageSelection.val() })
    }, this)).attr('class', 'language-selection')
    
    var showStructogram = _.bind(function () { this.trigger('show-structogram') }, this)
    this.showStructogramButton = Skin.button("Show structogram", showStructogram)
      .attr('class', 'show-structogram-button')
    
    var updateButtonState = _.bind(function () {
      this.showStructogramButton.prop('disabled', this.model.get('language') !== 'karol')
    }, this)
    updateButtonState()
    this.model.bind('change:language', updateButtonState)
    
    this.add(this.languageSelection)
    this.add(this.showStructogramButton)
  }

})
