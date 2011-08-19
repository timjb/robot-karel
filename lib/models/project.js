(function(exports) {

var _              = require('underscore')         || this._
,   Backbone       = require('backbone')           || this.Backbone
,   World          = (require('./world')           || Karel.Models).World
,   Robot          = (require('./robot')           || Karel.Models).Robot
,   JSExecution    = (require('./js_execution')    || Karel.Models).JSExecution
,   KarolExecution = (require('./karol_execution') || Karel.Models).KarolExecution

exports.Project = (Backbone.couch ? Backbone.couch : Backbone).Model.extend({


  // Initialization
  // ==============

  defaults: function () {
    return {
      world:       new World(),
      type:        'project',
      language:    'karol',
      code:        '',
      description: ''
    }
  },


  // (De-) Serialization
  // ===================

  parse: function (resp) {
    if (resp.world) resp.world = World.fromString(resp.world)
    return resp
  },

  toJSON: function () {
    var attrs = _.clone(this.attributes)
    delete attrs.worldBackup
    attrs.world = attrs.world.toString()
    return attrs
  },


  // Save & restore state
  // ====================

  backup: function () {
    this._worldBackup = this.get('world').clone()
  },

  reset: function () {
    if (!this._worldBackup) { throw new Error("Can't reset 'cause there's no backup!") }
    this.set({ world: this._worldBackup })
    //delete this._worldBackup
  },


  // Execution
  // =========

  _getExecution: function () {
    if (this._execution) return this._execution
    
    var self = this
    
    this.backup()
    
    var globals = {}
    _.each(_.methods(Robot.prototype), function (name) {
      globals[name] = function () {
        var robot = self.get('world').get('robot')
        return robot[name].apply(robot, arguments)
      }
    })
    
    var lang = this.get('language')
    ,   code = this.get('code')
    
    var execution = new (lang === 'javascript' ? JSExecution : KarolExecution)
                        (code, globals, _.bind(this.reset, this))

    execution.bind('line',  function (num) { self.trigger('line',  num) })
             .bind('end',   function ()    { self.trigger('end'); delete self._execution })
             .bind('error', function (exc) { self.trigger('error', exc) })
    
    return this._execution = execution
  },

  run:  function () { this._getExecution().run()  },
  step: function () { this._getExecution().step() }

})

})(exports || Karel.Models)
