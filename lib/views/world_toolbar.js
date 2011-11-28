Karel.Views.WorldToolbar = Skin.Toolbar.extend({

  className: 'world-toolbar',

  initialize: function() {
    Skin.Toolbar.prototype.initialize.call(this)
    
    var robot = this.model.getRobot()
    var keymap = {}
    
    _.each([
      // Label , Tooltip            , Keys              , Command
      ["←" , "Links drehen"         , ['left'         ] , 'turnLeft'    ],
      ["↑" , "Schritt"              , ['up'           ] , 'move'        ],
      ["→" , "Rechts drehen"        , ['right'        ] , 'turnRight'   ],
      ["H" , "Hinlegen"             , ['h','enter'    ] , 'putBrick'    ],
      ["A" , "Aufheben"             , ['a','backspace'] , 'removeBrick' ],
      ["M" , "Marke setzen/löschen" , ['m','space'    ] , 'toggleMarker'],
      ["Q" , "Quader hinstellen"    , ['q'            ] , 'putBlock'    ],
      ["E" , "Quader entfernen"     , ['e','delete'   ] , 'removeBlock' ]
    ], _.bind(function (o) {
      var f = function() { robot[o[3]]() }
      var className = o[3].replace(/[A-Z]/, function (letter) {
        return '-' + letter.toLowerCase()
      }) + '-button'
      var button = Skin.button(o[0], f).attr({ title: o[1] }).addClass(className)
      if (['turnLeft', 'move', 'turnRight'].indexOf(o[3]) >= 0) button.addClass('primary');
      this.add(button)
      _.each(o[2], function (key) {
        keymap[key] = f
      })
    }, this))
    
    keymap.down = function () { robot.moveBackwards() }
    
    var onKeydown = _(function (event) {
      var key = Karel.Helpers.getKey(event)
      console.log("key pressed: " + key)
      if (keymap[key]) keymap[key]()
    }).bind(this)
    
    this.bind('insert', function () {
      $(document).keydown(onKeydown)
    })
    this.bind('remove', function () {
      $(document).unbind('keydown', onKeydown)
    })
  }

})
