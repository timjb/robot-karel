(function() {
var _         = require('underscore')
,   settings  = require('settings')
,   beep      = require('helpers/beep')
,   Position  = require('models/position_and_direction').Position
,   Direction = require('models/position_and_direction').Direction


function error(msg) {
  throw new Error(msg)
}

function errorFunction(msg) {
  return _(error).bind(null, msg)
}


var Robot = require('backbone').Model.extend({

  /*
   * Internals
   */

  defaults: {
    position: new Position(0, 0),
    direction: Direction.SOUTH
  },

  initialize: function(opts) {
    // Cache (for performance reasons)
    var setCurrentField = _.bind(function() {
      this.$currentField = this.getField(this.$position)
    }, this)
    setCurrentField()
    this.bind('change:position', setCurrentField)
    this.$world.bind('change:fields', setCurrentField)
  },

  // Overwrite backbone's set method for performance reasons
  set: function(attrs, options) {
    // - validations, - escaped attributes, - changes tracking
    if (attrs.attributes) attrs = attrs.attributes
    var silent = options && options.silent
    var change = false
    for (var attr in attrs) {
      change = true
      var val = attrs[attr]
      this.attributes[attr] = val
      this['$'+attr] = val
      if (!silent) this.trigger('change:'+attr)
    }
    if (change && !silent) this.trigger('change')
  },

  getField: function(position) {
    return this.$world.getField(position)
  },

  forward: function() {
    return this.$position.plus(this.$direction)
  },

  isValid: function(position) {
    var x = position.x
    ,   z = position.y
    return x >= 0 && x < this.$world.get('width') && z >= 0 && z < this.$world.get('depth')
  },


  /*
   * API
   */

  isBrick: function(n) {
    if (this.istWand()) return false
    var bricks = this.getField(this.forward()).bricks
    return n ? (bricks == n) : !!bricks
  },

  putBrick: function() {
    if (this.istWand()) error("karel kann keinen Ziegel hinlegen. Er steht vor einer Wand.")
    var nextPosition = this.forward()
    this.getField(nextPosition).bricks += 1
    this.$world.triggerChangeField(nextPosition)
    return this
  },

  removeBrick: function() {
    if (this.istWand()) error("karel kann keinen Ziegel aufheben. Er steht vor einer Wand.")
    var nextPosition = this.forward()
    var field = this.getField(nextPosition)
    if (!field.bricks) error("karel kann keinen Ziegel aufheben, da kein Ziegel vor ihm liegt.")
    field.bricks--
    this.$world.triggerChangeField(nextPosition)
    return this
  },

  putMarker: function() {
    this.$currentField.marker = true
    this.$world.triggerChangeField(this.$position)
    return this
  },

  removeMarker: function() {
    this.$currentField.marker = false
    this.$world.triggerChangeField(this.$position)
    return this
  },

  toggleMarker: function() {
    this.$currentField.marker = !this.$currentField.marker
    this.$world.triggerChangeField(this.$position)
    return this
  },

  isMarker: function() {
    return this.$currentField.marker
  },

  isWall: function() {
    var next = this.forward()
    return !this.isValid(next) || this.getField(next).block
  },

  turnLeft: function() {
    this.set({ direction: this.$direction.turnLeft() })
    return this
  },

  turnRight: function() {
    this.set({ direction: this.$direction.turnRight() })
    return this
  },

  move: function() {
    if (this.istWand()) error("karel kann keinen Schritt machen, er steht vor einer Wand.")
    var newPosition = this.forward()
    if (Math.abs(this.$currentField.bricks - this.getField(newPosition).bricks) > settings.MAX_JUMP_HEIGHT) {
      error("karel kann nur einen Ziegel pro Schritt nach oben oder unten springen.")
    }
    this.set({ position: newPosition })
    return this
  },

  moveBackwards: function() {
    var newPosition = this.$position.plus(this.$direction.turnLeft().turnLeft())
    var field = this.getField(newPosition)
    if (!this.isValid(newPosition) || field.block) error("karel kann keinen Schritt rueckwaerts machen, hinter ihm ist eine Wand.")
    if (Math.abs(this.$currentField.bricks - field.bricks) > settings.MAX_JUMP_HEIGHT) {
      error("karel kann nur einen Ziegel pro Schritt nach oben oder unten springen.")
    }
    this.set({ position: newPosition })
    return this
  },

  putBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error("karel kann keinen Quader hinlegen. Er steht vor einer Wand.")
    var field = this.getField(position)
    if (field.block) error("karel kann keinen Quader hinlegen, da schon einer liegt.")
    if (field.bricks) error("karel kann keinen Quader hinlegen, da auf dem Feld schon Ziegel liegen.")
    field.block = true
    this.$world.triggerChangeField(position)
    return this
  },

  removeBlock: function() {
    var position = this.forward()
    if (!this.isValid(position)) error("karel kann keinen Quader entfernen. Er steht vor einer Wand.")
    var field = this.getField(position)
    if (!field.block) error("karel kann keinen Quader entfernen, da auf dem Feld kein Quader liegt.")
    field.block = false
    this.$world.triggerChangeField(position)
    return this
  },

  beep: function() {
    beep()
    return this
  },

  isNorth: function() { return this.$direction.isNorth() },
  isSouth: function() { return this.$direction.isSouth() },
  isWest:  function() { return this.$direction.isWest() },
  isEast:  function() { return this.$direction.isEast() },

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

}, {
  path: 'models/robot'
})

var translate = function(dict) {
  for (var word in dict) {
    if (dict.hasOwnProperty(word)) {
      Robot.prototype[dict[word]] = Robot.prototype[word]
    }
  }
}

// German
translate({
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
  removeBlock:   'quaderEntfernen'
})

module.exports = Robot

})()
