// http://en.wikipedia.org/wiki/Conway's_Game_of_Life

/*
 * Marks are used to indicate whether a field is "living" or not.
 * 
 * The algorithm used for each step:
 * 1. Add a ziegel underneath all marks
 * 2. For each field, count the living neighbors (those with a ziegel) and
 *    a) Let the field die (remove mark) if it has fewer than 2 or more than 3 living neighbors
 *    b) Let a dead field come to life (add mark) if it has exactly 3 living neighbors
 * 3. Remove all ziegels
 */

function turn_around() {
  karol.linksDrehen();
  karol.linksDrehen();
}

function each_until_wall(fn) {
  while (true) {
    fn();
    if (karol.istWand()) break;
    karol.schritt();
  }
}

function goto_wall() {
  while (!karol.istWand()) karol.schritt();
}

function each_field(fn) {
  while (true) {
    karol.linksDrehen();
    each_until_wall(fn);
    turn_around();
    goto_wall();
    karol.linksDrehen();
    if (karol.istWand()) break;
    karol.schritt();
  }
  turn_around();
  goto_wall();
  turn_around();
}

function each_direction(fn) {
  for (var i = 0; i < 4; i++) {
    karol.linksDrehen();
    fn();
  }
}

function add_ziegel_here() {
  karol.schritt();
  turn_around();
  karol.hinlegen();
  karol.schritt();
}

function add_ziegel_if_mark() {
  if (karol.istMarke()) {
    if (karol.istWand()) {
      turn_around();
      add_ziegel_here();
    } else {
      add_ziegel_here();
      turn_around();
    }
  }
}

function count_living_neighbors() {
  var result = 0;
  each_direction(function() {
    // count the horizontal or vertically neighbors:
    if (karol.istZiegel()) result++;
    // count the diagonal neighbors:
    if (!karol.istWand()) {
      karol.schritt();
      karol.linksDrehen();
      if (karol.istZiegel()) result++;
      karol.linksDrehen();
      karol.schritt();
      turn_around();
    }
  });
  return result;
}

function live_or_die() {
  var n = count_living_neighbors();
  if (karol.istMarke()) { // living
    if (n < 2 || n > 3) karol.markeLoeschen(); // die
  } else {
    if (n == 3) karol.markeSetzen(); // new cell
  }
}

function remove_neighbor_ziegels() {
  each_direction(function() {
    if (karol.istZiegel()) karol.aufheben();
  });
}

function step() {
  each_field(add_ziegel_if_mark);
  each_field(live_or_die);
  each_field(remove_neighbor_ziegels);
}

function main() {
  //var interval = setInterval(step, 500);
  for (var i = 0; i < 2; i++) {
    goto_wall();
    karol.linksDrehen();
  }
  step();
}

main();
