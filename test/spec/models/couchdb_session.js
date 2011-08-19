(function () {

var CouchDBSession = Karel.Models.CouchDBSession

describe("CouchDB Session (Model)", function () {

  var original, session, letSessionCallFail

  beforeEach(function () {
    original = $.couch
    
    var loggedIn = false
    
    $.couch = {
      login: function (options) {
        setTimeout(function () {
          // Kids, don't try this at home!
          if (options.name === 'admin' && options.password === '1234') {
            loggedIn = true
            options.success(null)
          } else {
            options.error(null, null, null)
          }
        }, 10)
      },
      
      logout: function (options) {
        setTimeout(function () {
          if (loggedIn) {
            loggedIn = false
            options.success(null)
          } else {
            options.error(null, null, null)
          }
        }, 10)
      },
      
      signup: function (userCtx, password, options) {
        setTimeout(function () {
          if (userCtx.name !== 'admin') {
            options.success(null)
          } else {
            options.error(null, null, null)
          }
        }, 10)
      },
      
      session: function (options) {
        setTimeout(function () {
          if (!letSessionCallFail) {
            options.success({ userCtx: { name: 'admin' } })
          } else {
            options.error(null, null, null)
          }
        }, 10)
      }
    }
    
    session = new CouchDBSession()
  })

  afterEach(function () { $.couch = original })

  it("successful login", function () {
    var successSpy, errorSpy, loginSpy
    
    runs(function () {
      session.set({ name: 'admin', password: '1234' })
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      loginSpy   = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.login(options)).toBe(session)
      session.bind('login', loginSpy)
    })
    
    waits(20)
    
    runs(function () {
      expect(successSpy).toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
      expect(loginSpy).toHaveBeenCalled()
      expect(session.get('password')).toBeUndefined()
    })
  })

  it("failed login", function () {
    var successSpy, errorSpy, loginSpy
    
    runs(function () {
      session.set({ name: 'admin', password: 'trolololo' })
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      loginSpy   = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.login(options)).toBe(session)
      session.bind('login', loginSpy)
    })
    
    waits(20)
    
    runs(function () {
      expect(successSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      expect(loginSpy).not.toHaveBeenCalled()
      expect(session.get('password')).toBe('trolololo')
    })
  })

  it("successful logout", function () {
    var successSpy, errorSpy, logoutSpy

    runs(function () {
      session.set({ name: 'admin', password: '1234' })
      session.login()
    })

    waits(20)

    runs(function () {
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      logoutSpy  = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.logout(options)).toBe(session)
      session.bind('logout', logoutSpy)
    })

    waits(20)

    runs(function () {
      expect(successSpy).toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
      expect(logoutSpy).toHaveBeenCalled()
      expect(session.get('name')).toBeUndefined()
      expect(session.get('password')).toBeUndefined()
    })
  })

  it("failed logout", function () {
    var successSpy, errorSpy, logoutSpy

    // Don't log in

    runs(function () {
      session.set({ name: 'admin', password: '4321' })
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      logoutSpy  = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.logout(options)).toBe(session)
      session.bind('logout', logoutSpy)
    })

    waits(20)

    runs(function () {
      expect(successSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      expect(logoutSpy).not.toHaveBeenCalled()
      expect(session.get('name')).not.toBeUndefined()
      expect(session.get('password')).not.toBeUndefined()
    })
  })

  it("successful signup", function () {
    var successSpy, errorSpy, signupSpy

    runs(function () {
      session.set({ name: 'free_username', password: 'asdf' })
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      signupSpy  = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.signup(options)).toBe(session)
      session.bind('signup', signupSpy)
    })

    waits(20)

    runs(function () {
      expect(successSpy).toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
      expect(signupSpy).toHaveBeenCalled()
      expect(session.get('password')).toBeUndefined()
    })
  })

  it("failed signup", function () {
    var successSpy, errorSpy, signupSpy

    runs(function () {
      session.set({ name: 'admin', password: 'asdf' })
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      signupSpy  = jasmine.createSpy()
      var options = { success: successSpy, error: errorSpy }
      expect(session.signup(options)).toBe(session)
      session.bind('signup', signupSpy)
    })

    waits(20)

    runs(function () {
      expect(successSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      expect(signupSpy).not.toHaveBeenCalled()
      expect(session.get('password')).not.toBeUndefined()
    })
  })

  it("successful fetch", function () {
    var successSpy, errorSpy

    runs(function () {
      letSessionCallFail = false
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      session.fetch({ success: successSpy, error: errorSpy })
    })

    waits(20)

    runs(function () {
      expect(successSpy).toHaveBeenCalled()
      expect(errorSpy).not.toHaveBeenCalled()
      expect(session.get('name')).toBe('admin')
    })
  })

  it("failed fetch", function () {
    var successSpy, errorSpy

    runs(function () {
      letSessionCallFail = true
      successSpy = jasmine.createSpy()
      errorSpy   = jasmine.createSpy()
      session.fetch({ success: successSpy, error: errorSpy })
    })

    waits(20)

    runs(function () {
      expect(successSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
      expect(session.get('name')).toBeUndefined()
    })
  })

})

})()
