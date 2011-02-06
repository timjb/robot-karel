var beep = (function() {
  //this.initBeepSound() // Because Chrome can't replay
  if (window.Audio) {
    var sound = this.beepSound = new Audio()
    if (sound.canPlayType('audio/ogg; codecs="vorbis"')) {
      sound.src = 'assets/beep.ogg'
    } else if (sound.canPlayType('audio/mpeg;')) {
      sound.src = 'assets/beep.mp3'
    }
    return _.bind(sound.play, sound)
  }
  return function() {}
})
