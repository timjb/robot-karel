(function() {
var _      = require('underscore')
,   getKey = require('helpers/get_key')

module.exports = require('backbone').View.extend({

  initialize: function() {
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
      down:  'schrittRueckwaerts',
      space:     'markeUmschalten',
      enter:     'hinlegen',
      backspace: 'aufheben',
      'delete':  'entfernen',
      h: 'hinlegen',
      a: 'aufheben',
      m: 'markeUmschalten',
      q: 'quader',
      e: 'entfernen'
    }
    
    $(document).keydown(_(function(evt) {
      var key = getKey(evt)
      console.log('key pressed: ' + key)
      if (actions.hasOwnProperty(key)) {
        this.model.get('robot')[actions[key]]()
      }
    }).bind(this))
  }

}, {
  path: 'views/world_toolbar'
})

})()
