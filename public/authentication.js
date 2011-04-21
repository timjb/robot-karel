var CouchDBSession = Backbone.Model.extend({
  loggedIn: function() {
    return !!this.get('name')
  },

  login: function(options) {
    options = options || {}
    $.couch.login(_.extend(this.toJSON(), {
      success: _.bind(function(resp) {
        this.unset('password')
        this.trigger('login')
        if (options.success) options.success(resp)
      }, this),
      error: function(status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    }))
    return this
  },

  logout: function(options) {
    options = options || {}
    $.couch.logout({
      success: _.bind(function(resp) {
        this.clear()
        this.trigger('logout')
        if (options.success) options.success(resp)
      }, this),
      error: function(status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
  },

  signup: function(options) {
    options = options || {}
    $.couch.signup({
      name: this.get('name')
    }, this.get('password'), {
      success: _.bind(function(resp) {
        this.unset('password')
        this.trigger('signup')
        if (options.success) options.success(resp)
      }, this),
      error: function(status, error, reason) {
        if (options.error) options.error(status, error, reason)
      }
    })
    return this
  },

  parse: function(obj) {
    return obj.userCtx
  },

  sync: function(method, model, options) {
    if (method === 'read') {
      $.couch.session({
        success: function(resp) {
          if (options.success) options.success(resp)
        },
        error: function(status, error, reason) {
          if (options.error) options.error(status, error, reason)
        }
      })
    } else {
      throw new Error("A CouchDBSession can be fetched only.")
    }
  }
})


var CouchDBSessionView = Backbone.View.extend({
  tagName: 'form',
  className: 'session',

  initialize: function() {
    _.bindAll(this, 'render')
    this.model
      .bind('login',  this.render)
      .bind('logout', this.render)
      .bind('signup', this.render)
      .fetch({ success: this.render })
  },

  events: {
    'click .login':  'login',
    'click .signup': 'signup',
    'click .logout': 'logout'
  },

  render: function() {
    if (this.model.loggedIn()) {
      $(this.el).html("Welcome " + this.model.escape('name') + "!"
                    + '<input type="button" class="logout" value="Logout" />')
    } else {
      $(this.el).html(
        '<input type="text" class="username" value="" placeholder="username" /> '
      + '<input type="password" class="password" value="" placeholder="password" /> '
      + '<input type="submit" class="login" value="Login" /> '
      + '<input type="button" class="signup" value="Signup" />')
    }
    return this
  },

  updateModel: function() {
    this.model.set({
      name:     this.$('.username').val(),
      password: this.$('.password').val()
    })
  },

  login: function() {
    this.updateModel()
    this.model.login()
    return false
  },

  signup: function() {
    this.updateModel()
    this.model.signup()
    return false
  },

  logout: function() {
    this.model.logout()
    return false
  }
})


window.session = new CouchDBSession().fetch()

$(document).ready(function() {
  $('#wrapper').prepend(new CouchDBSessionView({
    model: window.session
  }).render().el)
})
