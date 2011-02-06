function log() {
  if (window.console && typeof console.log == 'function') {
    console.log.apply(console, arguments)
  }
}
