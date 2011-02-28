['position_and_direction', 'world_and_robot']
  .forEach(function(name) {
    var module = require('./'+name)
    
    console.log('= Testing ' + name)
    for (name in module) {
      if (typeof module[name] == 'function' && name.slice(0, 4) == 'test') {
        console.log('  * '+name)
        module[name]()
      }
    }
  })
