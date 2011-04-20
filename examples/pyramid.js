// Basiert auf dem karel-Script von Norbert Handick

// Führt eine Funktion n-mal aus
Number.prototype.mal = function(fn) {
  for (var i = 0; i < this; i++) {
    fn();
  }
};

function umdrehen() {
  linksDrehen();
  linksDrehen();
}

function unterlegen() {
  schritt();
  umdrehen();
  hinlegen();
  umdrehen();
}

function diagonal_1() {
  schritt();
  linksDrehen();
  schritt();
  rechtsDrehen();
}

function kranz() {
  (4).mal(function() {
    while (!istWand()) {
      hinlegen();
      schritt();
      markeSetzen();
    }
    linksDrehen();
  });
  diagonal_1();
}

function kranzFuellen() {
  while (!istMarke()) {
    unterlegen();
    if (istMarke()) {
      linksDrehen();
      schritt();
      linksDrehen();
      schritt();
      while (!istMarke()) {
        schritt();
      }
      umdrehen();
      schritt();
    }
  }
  rechtsDrehen();
  schritt();
  rechtsDrehen();
  schritt();
}

function pyramidenring() {
  (4).mal(function() {
    while (!istMarke()) {
      markeSetzen();
      unterlegen();
    }
    umdrehen();
    schritt();
    rechtsDrehen();
    schritt();
  });
}

function ausgangsposition() {
  (2).mal(function() {
    while (!istWand()) {
      schritt();
    }
    linksDrehen();
  });
}

function zumStart() {
  rechtsDrehen();
  (2).mal(function() {
    while (!istWand()) {
      schritt();
    }
    linksDrehen();
  });
}

function kranzMarkeWeg() {
  (4).mal(function() {
    while (!istWand()) {
      schritt();
      markeLoeschen();
    }
    linksDrehen();
  });
}

function ringMarkeWeg() {
  (4).mal(function() {
    while (istMarke()) {
      markeLoeschen();
      schritt();
    }
    umdrehen();
    schritt();
    rechtsDrehen();
    schritt();
  });
  linksDrehen();
  if (istMarke()) {
    rechtsDrehen();
  } else {
    umdrehen();
    schritt();
  }
}

function hauptprogramm() {
  kranz();
  kranzFuellen();
  while (!istMarke()) {
    pyramidenring();
    kranzFuellen();
  }
  ausgangsposition();
  kranzMarkeWeg();
  diagonal_1();
  while (istMarke()) {
    ringMarkeWeg();
  }
  zumStart();
}

hauptprogramm();
