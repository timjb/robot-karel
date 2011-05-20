(function(exports) {

var _         = require('underscore') || this._
,   Backbone  = require('backbone') || this.Backbone
,   settings  = (require('../settings') || Karel).settings
,   beep      = (require('../helpers/beep') || Karel.Helpers).beep
,   PositionAndDirection = require('../models/position_and_direction') || Karel.Models
,   Position  = PositionAndDirection.Position
,   Direction = PositionAndDirection.Direction


function error(key) {
  throw new Error(settings.ERRORS[key])
}

function errorFunction(msg) {
  return _(error).bind(null, msg)
}


var Robot = Backbone.Model.extend({

  // Internals
  // ---------

  defaults: {
    position: new Position(0, 0),
    direction: Direction.SOUTH
  },

  equals: function(other) {
    return this.get('position').equals(other.get('position'))
        && this.get('direction').equals(other.get('direction'))
  },

  getField: function(position) {
    return this.get('world').getField(position)
  },

  currentField: function() {
    return this.getField(this.get('position'))
  },

  forward: function() {
    return this.get('position').plus(this.get('direction'))
  },

  isValid: function(position) {
    var x = position.x
    ,   z = position.y
    return x >= 0 && x < this.get('world').get('width')
        && z >= 0 && z < this.get('world').get('depth')
  },


  // API
  // ---

  isBrick: function(n) {
    if (this.istWand()) return false
    var bricks = this.getField(this.forward()).bricks
    return n ? (bricks == n) : !!bricks
  },

  putBrick: function(n) {
    if (this.istWand()) error('put_brick_wall')
    var nextPosition = this.forward()
    this.getField(nextPosition).bricks += 1
    this.get('world').triggerChangeField(nextPosition)
    return n > 1 ? this.putBrick(n-1) : this
  },

  removeBrick: function(n) {
    if (this.istWand()) error('remove_brick_wall')
    var nextPosition = this.forward()
    var field = this.getField(nextPosition)
    if (!field.bricks) error('remove_brick_no_brick')
    field.bricks--
    this.get('world').triggerChangeField(nextPosition)
    return n > 1 ? this.removeBrick(n-1) : this
  },

  putMarker: function() {
    this.currentField().marker = true
    this.get('world').triggerChangeField(this.get('position'))
    return this
  },

  removeMarker: function() {
    this.currentField().marker = false
    this.get('world').triggerChangeField(this.get('position'))
    return this
  },

  toggleMarker: function() {
    this.currentField().marker = !this.currentField().marker
    this.get('world').triggerChangeField(this.get('position'))
    return this
  },

  isMarker: function() {
    return this.currentField().marker
  },

  isWall: function() {
    var next = this.forward()
    return !this.isValid(next) || this.getField(next).block
  },

  turnLeft: function() {
    this.set({ direction: this.get('direction').turnLeft() })
    return this
  },

  turnRight: function() {
    this.set({ direction: this.get('direction').turnRight() })
    return this
  },

  move: function(n) {
    if (this.istWand()) error('move_wall')
    var newPosition = this.forward()
    if (Math.abs(this.currentField().bricks - this.getField(newPosition).bricks) > settings.MAX_JUMP_HEIGHT) {
      error('move_too_high')
    }
    this.set({ position: newPosition })
    return n > 1 ? this.move(n-1) : this
  },

  moveBackwards: function(n) {
    var newPosition = this.get('position').plus(this.get('direction').turnLeft().turnLeft())
    var field = this.getField(newPosition)
    if (!this.isValid(newPosition) || field.block) error('move_wall')
    if (Math.abs(this.currentField().bricks - field.bricks) > settings.MAX_JUMP_HEIGHT) {
      error('move_too_high')
    }
    this.set({ position: newPosition })
    return n > 1 ? this.moveBackwards(n-1) : this
  },

  putBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error('put_block_wall')
    var field = this.getField(position)
    if (field.block) error('put_block_already_is_block')
    if (field.bricks) error('put_block_is_brick')
    field.block = true
    this.get('world').triggerChangeField(position)
    return this
  },

  removeBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error('remove_block_wall')
    var field = this.getField(position)
    if (!field.block) error('remove_block_no_block')
    field.block = false
    this.get('world').triggerChangeField(position)
    return this
  },

  beep: function() {
    beep()
    return this
  },

  isNorth: function() { return this.get('direction').isNorth() },
  isSouth: function() { return this.get('direction').isSouth() },
  isWest:  function() { return this.get('direction').isWest() },
  isEast:  function() { return this.get('direction').isEast() },

  attempt: function(fn) {
    var clone = this.clone()
    try {
      return fn()
    } catch(exc) {
      this.set(clone)
      this.trigger('change:all')
      this.trigger('change')
    }
    return this
  },

  fast:   function() { this.isFast = true },
  slowly: function() { this.isFast = false }

})

var translate = function(dict) {
  for (var word in dict) {
    if (dict.hasOwnProperty(word)) {
      Robot.prototype[dict[word]] = Robot.prototype[word]
    }
  }
  return dict
}

// German
var GERMAN_TRANSLATION = translate({
  attempt:       'probiere',
  move:          'schritt',
  moveBackwards: 'schrittRueckwaerts',
  turnLeft:      'linksDrehen',
  turnRight:     'rechtsDrehen',
  beep:          'tonErzeugen',
  isNorth:       'istNorden',
  isSouth:       'istSueden',
  isWest:        'istWesten',
  isEast:        'istOsten',
  isWall:        'istWand',
  isBrick:       'istZiegel',
  putBrick:      'hinlegen',
  removeBrick:   'aufheben',
  isMarker:      'istMarke',
  putMarker:     'markeSetzen',
  toggleMarker:  'markeUmschalten',
  removeMarker:  'markeLoeschen',
  putBlock:      'quaderAufstellen',
  removeBlock:   'quaderEntfernen',
  fast:          'schnell',
  slowly:        'langsam'
})

// Export German commands for compiling .kdp files
Robot.BUILT_IN_CMDS = Object.keys(GERMAN_TRANSLATION)
  .map(function(key) {
    return GERMAN_TRANSLATION[key]
  })
  .concat(['schnell', 'langsam', 'istLeer', 'istVoll']) // TODO: implement these commands

exports.Robot = Robot

})(exports || Karel.Models)
