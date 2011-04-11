var _        = require('underscore')
,   Backbone = require('backbone')
,   getKey   = require('../helpers/get_key')

module.exports = Backbone.View.extend({

  initialize: function() {
    this.initButtons()
    this.initKeyboard()
  },

  initButtons: function() {
    var robot = this.model.get('robot')
    this.$('input[type=button]').live('click', function() {
      robot[$(this).attr('data-method')]()
    })
  },

  initKeyboard: function() {
    var actions = {
           left: 'turnLeft',
          right: 'turnRight',
             up: 'move',
           down: 'moveBackwards',
          space: 'toggleMarker',
          enter: 'putBrick',
      backspace: 'removeBrick',
       'delete': 'removeBlock',
              h: 'putBrick',     // Ziegel *h*inlegen
              a: 'removeBrick',  // Ziegel *a*ufheben
              m: 'toggleMarker', // *M*arke umschalten
              q: 'putBlock',     // *Q*uader aufstellen
              e: 'removeBlock'   // Quader *e*ntfernen
    }
    
    $(document).keydown(_(function(evt) {
      var key = getKey(evt)
      console.log('key pressed: ' + key)
      if (actions.hasOwnProperty(key)) {
        this.model.get('robot')[actions[key]]()
      }
    }).bind(this))
  }

})
