var _ = require('underscore')

var run
if (typeof document == 'object') { // assume we're in the browser
  run = function(code, globals) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    var win = iframe.contentWindow
    win.parent = null
    _.extend(win, globals)
    win.document.write('<script>'+code+'</script>') // evil, I know
  }
} else { // Node.js
  run = require('vm').runInNewContext
}

exports.run = run
