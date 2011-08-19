// This is intended only for the frontend

Karel.Models.CouchDBSession = Backbone.Model.extend({

  defaults: { loggedIn: false
            , name: ''
            , password: '' },

  login: function (options) {
    options = options || {}
    $.couch.login({
      name: this.get('name'),
      password: this.get('password'),
      success: _.bind(function (resp) {
        this.unset('password')
        this.trigger('login')
        this.set({ loggedIn: true })
        if (options.success) options.success(resp)
      }, this),
      error: function (status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
  },

  logout: function (options) {
    options = options || {}
    $.couch.logout({
      success: _.bind(function (resp) {
        this.clear()
        this.trigger('logout')
        this.set({ loggedIn: false })
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
    
    $.couch.signup(this.toJSON(), this.get('password'), {
      success: _.bind(function (resp) {
        this.unset('password')
        this.trigger('signup')
        this.set({ loggedIn: true })
        if (options.success) options.success(resp)
      }, this),
      error: function (status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
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
  },


  // (De-) Serialisation
  // ===================

  toJSON: function () {
    var result = _.clone(this.attributes)
    delete result.password
    delete result.loggedIn
    return result
  },

  parse: function (obj) {
    var result = obj.userCtx
    result.name = result.name || ''
    result.loggedIn = result.name.length > 0
    return result
  }

})
