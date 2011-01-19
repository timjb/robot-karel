// http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking

Number.prototype.times = function(fn) {
  for (var i = 0; i < this; i++) {
    fn(i);
  }
}

function rand(n) {
  return Math.floor(Math.random() * n);
}


/*
 * Generic Helpers
 */

function goto_corner() {
  (2).times(function() {
    while (!karol.istWand()) karol.schritt();
    karol.linksDrehen();
  });
}

function turn_around() {
  karol.linksDrehen();
  karol.linksDrehen();
}

function sidestep_left() {
  karol.linksDrehen();
  karol.schritt();
  karol.rechtsDrehen();
}

function backwards() {
  turn_around();
  karol.schritt();
  turn_around();
}

function is_marke_ahead() {
  karol.schritt();
  var result = karol.istMarke();
  backwards();
  return result;
}

function each_direction(fn) {
  (4).times(function() {
    karol.linksDrehen();
    fn();
  });
}

function remove_all_ziegels() {
  while (karol.istZiegel()) {
    karol.aufheben();
  }
}


/*
 * Create Grid
 */

function stripe() {
  while (!karol.istWand()) {
    if (!karol.istZiegel()) karol.hinlegen();
    karol.schritt();
  }
}

function create_stripes() {
  outer_loop: while (true) {
    stripe();
    turn_around();
    stripe();
    karol.rechtsDrehen();
    for (var i = 0; i < 2; i++) {
      if (karol.istWand()) break outer_loop;
      karol.schritt();
    }
    karol.rechtsDrehen();
  }
}

function create_grid() {
  goto_corner(); // #1
  (2).times(function() {
    sidestep_left();
    create_stripes();
    turn_around();
  });
  goto_corner(); // we should be in the same corner as in #1
}


/*
 * Create Connections
 */


function count_possibilities() {
  var result = 0;
  each_direction(function() {
    if (is_valid()) result++;
  });
  return result;
}

function is_valid() {
  return !karol.istWand() && karol.istZiegel(1);
}

function break_through() {
  karol.aufheben();
  each_direction(function() {
    if (!karol.istWand() && karol.istZiegel()) karol.hinlegen();
  });
  (2).times(function() {
    karol.schritt();
    karol.markeSetzen();
  });
}

function turn_back() {
  for (var i = 0; i < 4; i++) {
    karol.linksDrehen();
    if (!karol.istWand() && !karol.istZiegel() && is_marke_ahead()) {
      return true;
    }
  }
  return false;
}

function build_3m_walls() {
  each_direction(function() {
    if (!karol.istWand() && (karol.istZiegel(1) || karol.istZiegel(2))) {
      while (!karol.istZiegel(3)) {
        karol.hinlegen();
      }
    }
  });
}

function go_back() {
  each_direction(function() {
    if (!karol.istWand() && karol.istZiegel()) karol.hinlegen();
  });
  karol.markeLoeschen();
  karol.schritt();
  build_3m_walls();
  karol.markeLoeschen();
  karol.schritt();
  each_direction(function() {
    if (!karol.istWand() && karol.istZiegel()) karol.aufheben();
  });
}

function create_connections() {
  karol.markeSetzen();
  while (true) {
    var possibilities = count_possibilities();
    if (possibilities) {
      var turns = rand(possibilities) + 1;
      while (turns) {
        karol.linksDrehen();
        if (is_valid()) turns--;
      }
      break_through();
    } else {
      if (!turn_back()) break;
      go_back();
    }
  }
}


/*
 * Main
 */

function main() {
  console.log('test');
  create_grid();
  create_connections();
}

main();
