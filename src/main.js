$(function() {
  new AppController()
  Backbone.history.start()
  
  if(location.hash == '') {
    location.hash = 'examples/conways_game_of_life'
  }
})
