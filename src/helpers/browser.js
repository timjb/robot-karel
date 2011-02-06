// Browser detection
// https://github.com/mootools/mootools-core/blob/601c6dd6a6a98d8635c1a8e6ee840b8b3f7022d1/Source/Browser/Browser.js
var browser = (function() {
  var ua = navigator.userAgent.toLowerCase()
  var UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0]
  return (UA[1] == 'version') ? UA[3] : UA[1]
})()

window.console && console.log('browser detected: ' + browser)
