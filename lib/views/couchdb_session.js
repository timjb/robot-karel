Karel.Views.CouchDBSession = Skin.extend({

  tagName: 'form',
  className: 'session',

  initialize: function () {
    _.bindAll(this, 'render')
    this.model.bind('change:loggedIn', this.render)
  },

  events: {
    'click .login':  'login',
    'click .signup': 'signup',
    'click .logout': 'logout'
  },

  render: function () {
    if (this.model.get('loggedIn')) {
      $(this.el).html("Welcome " + this.model.escape('name') + "!"
                    + '<input type="button" class="logout" value="Logout" />')
    } else {
      $(this.el).html(
        '<input type="text" class="username" value="" placeholder="username" /> '
      + '<input type="password" class="password" value="" placeholder="password" /> '
      + '<input type="submit" class="btn primary login" value="Login" /> '
      + '<input type="button" class="btn signup" value="Signup" />')
    }
    return this
  },

  updateModel: function () {
    this.model.set({
      name:     this.$('.username').val(),
      password: this.$('.password').val()
    })
  },

  login: function () {
    this.updateModel()
    this.model.login()
    return false
  },

  signup: function () {
    this.updateModel()
    this.model.signup()
    return false
  },

  logout: function () {
    this.model.logout()
    return false
  }

})
