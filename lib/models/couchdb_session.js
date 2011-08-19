// This is intended only for the frontend

Karel.Models.CouchDBSession = Backbone.Model.extend({
  loggedIn: function () {
    return !!this.get('name')
  },

  login: function (options) {
    options = options || {}
    $.couch.login(_.extend(this.toJSON(), {
      success: _.bind(function (resp) {
        this.unset('password')
        this.trigger('login')
        if (options.success) options.success(resp)
      }, this),
      error: function (status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    }))
    return this
  },

  logout: function (options) {
    options = options || {}
    $.couch.logout({
      success: _.bind(function (resp) {
        this.clear()
        this.trigger('logout')
        if (options.success) options.success(resp)
      }, this),
      error: function (status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
  },

  signup: function (options) {
    options = options || {}
    $.couch.signup({
      name: this.get('name')
    }, this.get('password'), {
      success: _.bind(function (resp) {
        this.unset('password')
        this.trigger('signup')
        if (options.success) options.success(resp)
      }, this),
      error: function (status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
  },

  parse: function (obj) {
    return obj.userCtx
  },

  sync: function (method, model, options) {
    if (method === 'read') {
      $.couch.session({
        success: function (resp) {
          if (options.success) options.success(resp)
        },
        error: function (status, error, reason) {
          if (options.error) options.error(status, error, reason)
        }
      })
    } else {
      throw new Error("A CouchDBSession can be fetched only.")
    }
  }
})
