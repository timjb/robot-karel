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
    while (!karel.istWand()) karel.schritt();
    karel.linksDrehen();
  });
}

function turn_around() {
  karel.linksDrehen();
  karel.linksDrehen();
}

function sidestep_left() {
  karel.linksDrehen();
  karel.schritt();
  karel.rechtsDrehen();
}

function backwards() {
  turn_around();
  karel.schritt();
  turn_around();
}

function is_marke_ahead() {
  karel.schritt();
  var result = karel.istMarke();
  backwards();
  return result;
}

function each_direction(fn) {
  (4).times(function() {
    karel.linksDrehen();
    fn();
  });
}

function remove_all_ziegels() {
  while (karel.istZiegel()) {
    karel.aufheben();
  }
}


/*
 * Create Grid
 */

function stripe() {
  while (!karel.istWand()) {
    if (!karel.istZiegel()) karel.hinlegen();
    karel.schritt();
  }
}

function create_stripes() {
  outer_loop: while (true) {
    stripe();
    turn_around();
    stripe();
    karel.rechtsDrehen();
    for (var i = 0; i < 2; i++) {
      if (karel.istWand()) break outer_loop;
      karel.schritt();
    }
    karel.rechtsDrehen();
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
  return karel.istZiegel(1);
}

function break_through() {
  karel.aufheben();
  each_direction(function() {
    if (karel.istZiegel()) karel.hinlegen();
  });
  (2).times(function() {
    karel.schritt();
    karel.markeSetzen();
  });
}

function turn_back() {
  for (var i = 0; i < 4; i++) {
    karel.linksDrehen();
    if (!karel.istWand() && !karel.istZiegel() && is_marke_ahead()) {
      return true;
    }
  }
  return false;
}

function build_3m_walls() {
  each_direction(function() {
    if (karel.istZiegel(1) || karel.istZiegel(2)) {
      while (!karel.istZiegel(3)) {
        karel.hinlegen();
      }
    }
  });
}

function go_back() {
  each_direction(function() {
    if (karel.istZiegel()) karel.hinlegen();
  });
  karel.markeLoeschen();
  karel.schritt();
  build_3m_walls();
  karel.markeLoeschen();
  karel.schritt();
  each_direction(function() {
    if (karel.istZiegel()) karel.aufheben();
  });
}

function create_connections() {
  karel.markeSetzen();
  while (true) {
    var possibilities = count_possibilities();
    if (possibilities) {
      var turns = rand(possibilities) + 1;
      while (turns) {
        karel.linksDrehen();
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
  create_grid();
  create_connections();
  build_3m_walls();
}

main();
