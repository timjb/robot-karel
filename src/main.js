new (require('controllers/application'))()

require('backbone').history.start()
if(location.hash == '') {
  location.hash = 'examples/conways_game_of_life'
}
