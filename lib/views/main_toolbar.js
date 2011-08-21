Karel.Views.MainToolbar = Skin.Toolbar.extend({

  className: 'main-toolbar',

  initialize: function () {
    Skin.Toolbar.prototype.initialize.call(this)
    
    var self = this
    this
      .add(Skin.button("Run",   function () { self.model.run()   }).addClass('run-button'))
      .add(Skin.button("Step",  function () { self.model.step()  }).addClass('step-button'))
      .add(Skin.button("Reset", function () { self.model.reset() }).addClass('reset-button'))
      .add(Skin.button("Save",  function () { self.model.save()  }).addClass('save-button'))
    
    this.add(this.viewSelect = Skin.select([
      { text: "2D" },
      { text: "3D", selected: true }
    ], _.bind(function () {
      this.trigger('select-world-view')
    }, this)).addClass('world-view-selection'))
    
    this.add(Skin.button("New", _.bind(function () {
      this.trigger('show-new-world-dialog')
    }, this)).addClass('new-button'))
  },

  selectedWorldView: function () {
    return this.viewSelect.val()
  }

})
