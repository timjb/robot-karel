CodeMirror.defineMode('karol', function(config, parserConfig) {

  var keywords = {}

  function map(type) {
    return function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        keywords[arguments[i].toLowerCase()] = type
      }
    }
  }

  map('keyword')
    ( 'solange', 'wenn', 'wiederhole', 'anweisung', 'bedingung'
    , 'programm', 'einfügen', 'karol', 'tue', 'dann'
    , 'sonst', 'mal', 'immer', 'nicht' )

  map('command')
    ( 'schritt', 'schrittRückwaerts'
    , 'linksDrehen', 'rechtsDrehen'
    , 'hinlegen', 'aufheben'
    , 'markeSetzen', 'markeUmschalten','markeLöschen'
    , 'quaderAufstellen', 'quaderEntfernen'
    , 'tonErzeugen','probiere','schnell','langsam' )

  map('boolean')
    ( 'wahr', 'falsch' )

  var CONDITIONS = [ 'istNorden', 'istSüden', 'istWesten', 'istOsten'
                   , 'istWand','istZiegel','istMarke' ]
  map('condition').apply(null, CONDITIONS)
  map('condition').apply(null, _.map(CONDITIONS, function(i) { return 'nicht' + i }))

  var isChar = /[A-Za-zäöüüß]/

  function normal(stream, state) {
    if (stream.eatSpace()) return null
    
    var ch = stream.next()
    if (ch === '{') {
      state.f = blockComment
      return blockComment(stream, state)
    } else if (ch === '/' && stream.eat('/')) {
      stream.skipToEnd()
      return 'karol-comment'
    } else if (ch.match(/\d/)) {
      stream.match(/\d+/)
      return 'karol-number'
    } if (ch === '*') {
      stream.eat('*')
      stream.eatWhile(isChar)
      var identifier = stream.current().toLowerCase().slice(1)
      var type = keywords[identifier]
      return type === 'keyword' ? 'karol-keyword' : null
    } else {
      stream.eatWhile(isChar)
      var identifier = stream.current().toLowerCase()
      return 'karol-' + (keywords[identifier] || 'identifier')
    }
  }

  function blockComment(stream, state) {
    var ch
    while (ch = stream.next()) {
      if (ch === '}') {
        state.f = normal
        break;
      }
    }
    return 'karol-comment'
  }

  return {
    startState: function()  { return { f: normal } },
    copyState:  function(s) { return { f: s.f } },
    
    token: function(stream, state) {
      var token = state.f(stream, state)
      return token
    }
  }

})
