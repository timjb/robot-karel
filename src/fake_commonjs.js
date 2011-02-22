var oldRequire = require // ACE uses RequireJS

var require = function(name) {
  return require.table[name] || oldRequire.apply(window, arguments)
}

require.__proto__ = oldRequire

THREE.Cube = Cube
THREE.Plane = Plane

require.table = {
  jquery: $,
  underscore: _,
  backbone: Backbone,
  ace: ace,
  three: THREE
}

var module = {
  set exports(obj) {
    if (typeof obj.path == 'string') require.table[obj.path] = obj
  }
}
