(function(exports) {

var _             = require('underscore') || this._
,   Backbone      = require('backbone') || this.Backbone
,   clone         = (require('../helpers/clone') || this.Karel.Helpers).clone
,   getLineNumber = (require('../helpers/get_line_number') || this.Karel.Helpers).getLineNumber
,   matrix        = (require('../helpers/matrix') || this.Karel.Helpers).matrix
,   settings      = (require('../settings') || this.Karel).settings
,   sandbox       = (require('../helpers/sandbox') || this.Karel.Helpers).sandbox
,   Position      = (require('../models/position_and_direction') || this.Karel.Models).Position
,   Direction     = (require('../models/position_and_direction') || this.Karel.Models).Direction
,   Robot         = (require('../models/robot') || this.Karel.Models).Robot


function Field() {
  this.bricks = 0
  this.marker = false
  this.block  = false
}

Field.prototype.clone = function() {
  var f = new Field()
  f.bricks = this.bricks
  f.marker = this.marker
  f.block  = this.block 
  return f
}

Field.prototype.equals = function(other) {
  return this.bricks === other.bricks
      && this.marker === other.marker
      && this.block  === other.block
}


exports.World = Backbone.Model.extend({

  defaults: {
    width: 5,
    depth: 11
  },

  initialize: function(opts) {
    if (!this.get('fields')) {
      this.set({
        fields: matrix(
          this.get('width'),
          this.get('depth'),
          function() { return new Field() }
        )
      })
    }
    
    this.createRobot(opts.robotOptions)
  },

  createRobot: function(opts) {
    opts = opts || {}
    opts.world = this
    var r = new Robot(opts)
    
    r.bind('change', _.bind(function() {
      this.trigger('change:robot')
      this.trigger('change', 'robot')
    }, this))
    
    this.set({ robot: r })
    return r
  },

  // Overwrite Backbone's clone method
  clone: function() {
    return new this.constructor({
      depth: this.get('depth'),
      width: this.get('width'),
      fields: clone(this.get('fields')),
      robotOptions: {
        position:  this.get('robot').get('position'),
        direction: this.get('robot').get('direction')
      }
    })
  },

  equals: function(other) {
    var areFieldsEqual = function(fields1, fields2) {
      if (fields1.length !== fields2.length) return false
      for (var i = 0, l = fields1.length; i < l; i++) {
        var row1 = fields1[i]
        ,   row2 = fields2[i]
        if (row1.length !== row2.length) return false
        for (var j = 0, k = row1.length; j < k; j++) {
          var field1 = row1[j]
          ,   field2 = row2[j]
          if (!field1.equals(field2)) return false
        }
      }
      return true
    }
    
    return this.get('width') === other.get('width')
        && this.get('depth') === other.get('depth')
        && this.get('robot').equals(other.get('robot'))
        && areFieldsEqual(this.get('fields'), other.get('fields'))
  },

  triggerChangeField: function(p) {
    this.trigger('change:field', p.x, p.y, this.getField(p))
    this.trigger('change')
  },

  getField: function(position) {
    return this.get('fields')[position.x][position.y]
  },

  eachField: function(fn) {
    var fields = this.get('fields')
    ,   w = this.get('width')
    ,   d = this.get('depth')
    for (var x = 0; x < w; x++) {
      for (var y = 0; y < d; y++) {
        fn(x, y, fields[x][y])
      }
    }
  },

  toString: function() {
    var tokens = []
    var p = function(c) { field_height--; tokens.push(c) }
    
    var fields = this.get('fields')
    var height = Math.max(5, 1 + _.max(_.map(fields, function(row) {
      return _.max(_.pluck(row, 'bricks'))
    })))
    
    p('KarolVersion2Deutsch')
    
    p(this.get('width'))
    p(this.get('depth'))
    p(height)
    
    var position = this.get('robot').get('position')
    p(position.x)
    p(position.y)
    var d = this.get('robot').get('direction')
    p([d.isSouth(), d.isWest(), d.isNorth(), d.isEast()].indexOf(true))
    
    var x = this.get('width')
    ,   y = this.get('depth')
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = fields[i][j]
        ,   field_height = height
        if (field.block) {
          p('q'); p('q')
        } else {
          _.times(field.bricks, function() { p('z') })
        }
        while (field_height > 0) p('n')
        p(field.marker ? 'm' : 'o')
      }
    }
    
    return tokens.join(' ') + ' '
  }

}, {

  Field: Field,

  fromString: function(str) {
    // Parse .kdw files
    
    var tokens = str.split(/\s/)
    var shift = _(tokens.shift).bind(tokens)
    var _int = function() { return parseInt(shift(), 10) }
    
    tokens.shift() // "KarolVersion2Deutsch"
    
    // Dimensions of the world
    var x = _int(), y = _int(), z = _int()
    
    // Position of the robot
    var position = new Position(_int(), _int())
    
    // Direction of the robot
    var direction = Direction[['SOUTH','WEST','NORTH','EAST'][_int()]]
    
    var fields = matrix(x, y, function() { return new Field() })
    
    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        var field = fields[i][j]
        if (tokens[0] == 'q') field.block = true
        for (var k = 0; k < z; k++) {
          if (shift() == 'z') field.bricks++
        }
        field.marker = (shift() == 'm')
      }
    }
    
    return new this({
      width: x,
      depth: y,
      fields: fields,
      robotOptions: {
        direction: direction,
        position: position
      }
    })
  }

})

})(exports || Karel.Models)
