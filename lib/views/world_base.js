Karel.Views.WorldBase = Skin.extend({

  events: {
    dragover:  'preventDefault',
    dragenter: 'preventDefault',
    drop:      'onDrop'
  },

  onDrop: function(event) {
    event.preventDefault()
    // Events get wrapped by jQuery => we need to unwrap it
    if (event.originalEvent) event = event.originalEvent
    var reader = new FileReader()
    reader.onloadend = _.bind(function() {
      this.trigger('drop-world', reader.result)
    }, this)
    reader.readAsText(event.dataTransfer.files[0])
  },

  delayRender: function() {
    clearTimeout(this.renderTimeout)
    this.renderTimeout = setTimeout(_.bind(this.render, this), 20)
  }

})
