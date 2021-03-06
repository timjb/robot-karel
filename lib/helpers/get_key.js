(function(exports) {

var table = {
  13: 'enter',
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',
  27: 'esc',
  32: 'space',
  8:  'backspace',
  9:  'tab',
  46: 'delete',
  16: 'shift'
}

exports.getKey = function(evt) {
  var key = table[evt.keyCode]
  if (!key) {
    key = String.fromCharCode(evt.keyCode)
    if (!evt.shiftKey) {
      key = key.toLowerCase()
    }
  }
  return key
}

})(exports || Karel.Helpers)
