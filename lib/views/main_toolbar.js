Karel.Views.MainToolbar = Skin.Toolbar.extend({

  initialize: function() {
    var self = this
    this
      .add(Skin.button("Run",    function() { self.model.run() }))
      .add(Skin.button("Replay", function() { self.model.replay() }))
      .add(Skin.button("Reset",  function() { self.model.reset() }))
      .add(Skin.button("Save",   function() { self.model.save() }))
    
    this.add(this.viewSelect = Skin.select([
      { text: "2D" },
      { text: "3D", selected: true }
    ], _.bind(function() {
      this.trigger('select-world-view')
    }, this)))
    
    this.add(Skin.button("New", function() {
      var proto = new Karel.Models.World()
      var overlay = new Skin.Overlay({ childViews: [
        new Skin.Form({
          model: proto,
          fields: [
            { attribute: 'width', attrs: { type: 'number', autofocus: 'autofocus' } },
            { attribute: 'depth', attrs: { type: 'number' } }
          ],
          submit: true
        }).bind('submit', function() {
          overlay.close()
          self.model.set({
            world: new Karel.Models.World({
              width: proto.get('width'),
              depth: proto.get('depth')
            })
          })
        })
      ] }).appendTo(document.body)
    }))
  },

  selectedWorldView: function() {
    return this.viewSelect.val()
  }

  /*
  // mainly for testing with zombie.js
  clickChangeView: function(evt) {
    $('input[name=view-select]').attr('checked', false)
    $(evt.target).attr('checked', true)
    this.changeView()
  },
  */

})
