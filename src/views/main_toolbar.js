module.exports = require('backbone').View.extend({

  events: {
    'click #run-button': 'run',
    'click #replay-button': 'replay',
    'click #reset-button': 'reset',
    'click input[name=view-select]': 'clickChangeView',
    'change input[name=view-select]': 'changeView',
    
    'click #new-button, #new-cancel-button': 'toggleNewPane',
    'click #new-apply-button': 'newApply'
  },

  run: function() {
    this.trigger('run')
  },

  replay: function() {
    this.model.replay()
  },

  reset: function() {
    this.model.reset()
  },

  // mainly for testing with zombie.js
  clickChangeView: function(evt) {
    $('input[name=view-select]').attr('checked', false)
    $(evt.target).attr('checked', true)
    this.changeView()
  },

  changeView: function() {
    this.trigger('change:view', $('input[name=view-select]:checked').val())
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

}, {
  path: 'views/main_toolbar'
})
