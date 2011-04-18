(function(exports) {

var _         = require('underscore') || this._
,   Backbone  = require('backbone')   || this.Backbone
,   World     = (require('./world')   || Karel.Models).World

exports.Project = Backbone.Model.extend({
  //collection: Backbone.Collection.extend({
  //  url: '/projects'
  //})

  run: function() {
    this.get('world').run(this.get('code'))
  },

  parse: function(resp) {
    if (resp.world) resp.world = World.fromString(resp.world)
    return resp
  },

  toJSON: function() {
    var attrs = _.clone(this.attributes)
    attrs.world = attrs.world.toString()
    return attrs
  }
})

})(exports || Karel.Models)
