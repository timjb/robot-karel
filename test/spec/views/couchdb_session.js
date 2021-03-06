(function () {

var CouchDBSession = Karel.Models.CouchDBSession
var CouchDBSessionView = Karel.Views.CouchDBSession


describe("CouchDB Session (View)", function () {

  var session, sessionView

  beforeEach(function () {
    session = new CouchDBSession({})
    sessionView = new CouchDBSessionView({ model: session })
    sessionView.appendTo(testEl)
  })

  afterEach(function () {
    sessionView.remove()
  })

  it("should try to log in using the entered username and password when the user clicks 'Login'", function () {
    var loginSpy = spyOn(session, 'login')
    sessionView.$('.username').val('admin')
    sessionView.$('.password').val('1234')
    sessionView.$('.login').click()
    expect(session.get('name')).toBe('admin')
    expect(session.get('password')).toBe('1234')
    expect(loginSpy).toHaveBeenCalled()
    
    expect($(sessionView.el).html()).not.toMatch(/Welcome/)
    session.set({ loggedIn: true })
    expect($(sessionView.el).html()).toMatch(/Welcome/)
  })

  it("should try to sign up using the entered username and password when the user clicks 'Signup'", function () {
    var signupSpy = spyOn(session, 'signup')
    sessionView.$('.username').val('admin')
    sessionView.$('.password').val('1234')
    sessionView.$('.signup').click()
    expect(session.get('name')).toBe('admin')
    expect(session.get('password')).toBe('1234')
    expect(signupSpy).toHaveBeenCalled()
    
    expect($(sessionView.el).html()).not.toMatch(/Welcome/)
    session.set({ loggedIn: true })
    expect($(sessionView.el).html()).toMatch(/Welcome/)
  })

  it("should try to log out if the user clicks the 'Logout' button", function () {
    expect(sessionView.$('.logout').length).toBe(0)
    expect(sessionView.$('.login').length).toBe(1)
    
    // Log in
    session.login = function (options) {
      if (options && options.success) options.success(null)
      this.trigger('login')
      this.set({ loggedIn: true })
    }
    sessionView.$('.username').val('admin')
    sessionView.$('.password').val('1234')
    sessionView.$('.login').click()
    
    expect(sessionView.$('.logout').length).toBe(1)
    expect(sessionView.$('.login').length).toBe(0)
    
    var logoutSpy = spyOn(session, 'logout')
    sessionView.$('.logout').click()
    expect(logoutSpy).toHaveBeenCalled()
    
    session.set({ loggedIn: false })
    expect(sessionView.$('.logout').length).toBe(0)
    expect(sessionView.$('.login').length).toBe(1)
  })

})

})()
