//this.initBeepSound() // Because Chrome can't replay
if (this.window && window.Audio) {
  var sound = new Audio()
  if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
    sound.src = 'assets/beep.ogg'
  } else if (sound.canPlayType('audio/mpeg;')) {
    sound.src = 'assets/beep.mp3'
  }
  var beep = function() { sound.play() }
} else {
  var beep = function() {}
}

module.exports = beep
