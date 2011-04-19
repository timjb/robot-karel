Karel.Views.MainToolbar = Skin.Toolbar.extend({

  /*events: {
    'click #new-button, #new-cancel-button': 'toggleNewPane',
    'click #new-apply-button': 'newApply'
  },*/

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
    
    // <input type=button class=right id=new-button value="New World">
    // <div id=new-pane>
    //   <label><span>Width</span> <input id=width type=number value=11></label>
    //   <label><span>Depth</span> <input id=depth type=number value=9></label>
    //   <input type=button id=new-cancel-button value=Cancel>
    //   <input type=button id=new-apply-button value=Apply>
    // </div>
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

  toggleNewPane: function() {
    this.$('#new-pane').toggleClass('visible')
  },

  newApply: function() {
    this.controller.initialize()
    this.toggleNewPane()
  },

  getNewDimensions: function() {
    return {
      width: parseInt(this.$('#width').val(), 10),
      depth: parseInt(this.$('#depth').val(), 10)
    }
  }
  */

})
