['position_and_direction', 'world_and_robot', 'compiler/test_all']
  .forEach(function(name) {
    var module = require('./'+name)
    
    console.log('= Testing ' + name)
    
    Object.keys(module)
      .filter(function (name) {
        return typeof module[name] == 'function'
            && name.slice(0, 4) == 'test'
      })
      .forEach(function (name) {
        console.log('  * ' + name)
        module[name]()
      })
  })
