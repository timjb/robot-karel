(function(exports) {

var _         = require('underscore') || this._
,   Backbone  = require('backbone')   || this.Backbone

exports.Project = Backbone.Model.extend({
  url: '/projects'
})

})(exports || Karel.Models)
