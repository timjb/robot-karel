App.Views.EnvironmentToolbar = Backbone.View.extend({

  initialize: function() {
    log('init')
    this.initButtons()
    this.initKeyboard()
  },

  initButtons: function() {
    var model = this.model
    this.$('input[type=button]').live('click', function() {
      model[$(this).attr('data-method')]()
    })
  },

  initKeyboard: function() {
    var actions = {
      left:  'linksDrehen',
      right: 'rechtsDrehen',
      up:    'schritt',
    //down:  'rueckwaerts',
      space:     'marke',
      enter:     'hinlegen',
      backspace: 'aufheben',
      'delete':  'entfernen',
      h: 'hinlegen',
      a: 'aufheben',
      m: 'marke',
      q: 'quader',
      e: 'entfernen'
    }
    
    $(document).keydown(_(function(evt) {
      var key = getKey(evt)
      log('key pressed: ' + key)
      if (actions.hasOwnProperty(key)) {
        this.model[actions[key]]()
      }
    }).bind(this))
  }

})
