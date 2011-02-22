var HIGHLIGHT_LINE = false
var ENVIRONMENT_COLORS = (function() {
  var C = {}
  function def(name, hex) {
    C[name] = {
      css: '#'+hex,
      hex: parseInt(hex, 16)
    }
  }
  
  def('ziegel', 'ff0000')
  def('quader', '666666')
  def('marke',  'cccc55')
  
  return C
})()
