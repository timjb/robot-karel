// Basiert auf dem karel-Script von Norbert Handick

Number.prototype.mal = function(fn) {
  for (var i = 0; i < this; i++) {
    fn();
  }
};

function umdrehen() {
  karel.linksDrehen();
  karel.linksDrehen();
}

function unterlegen() {
  karel.schritt();
  umdrehen();
  karel.hinlegen();
  umdrehen();
}

function diagonal_1() {
  karel.schritt();
  karel.linksDrehen();
  karel.schritt();
  karel.rechtsDrehen();
}

function kranz() {
  4..mal(function() {
    while (!karel.istWand()) {
      karel.hinlegen();
      karel.schritt();
      karel.markeSetzen();
    }
    karel.linksDrehen();
  });
  diagonal_1();
}

function kranz_fuellen() {
  while (!karel.istMarke()) {
    unterlegen();
    if (karel.istMarke()) {
      karel.linksDrehen();
      karel.schritt();
      karel.linksDrehen();
      karel.schritt();
      while (!karel.istMarke()) {
        karel.schritt();
      }
      umdrehen();
      karel.schritt();
    }
  }
  karel.rechtsDrehen();
  karel.schritt();
  karel.rechtsDrehen();
  karel.schritt();
}

function pyramidenring() {
  4..mal(function() {
    while (!karel.istMarke()) {
      karel.markeSetzen();
      unterlegen();
    }
    umdrehen();
    karel.schritt();
    karel.rechtsDrehen();
    karel.schritt();
  });
}

function ausgangsposition() {
  2..mal(function() {
    while (!karel.istWand()) {
      karel.schritt();
    }
    karel.linksDrehen();
  });
}

function zum_start() {
  karel.rechtsDrehen();
  2..mal(function() {
    while (!karel.istWand()) {
      karel.schritt();
    }
    karel.linksDrehen();
  });
}

function kranz_marke_weg() {
  4..mal(function() {
    while (!karel.istWand()) {
      karel.schritt();
      karel.markeLoeschen();
    }
    karel.linksDrehen();
  });
}

function ring_marke_weg() {
  4..mal(function() {
    while (karel.istMarke()) {
      karel.markeLoeschen();
      karel.schritt();
    }
    umdrehen();
    karel.schritt();
    karel.rechtsDrehen();
    karel.schritt();
  });
  karel.linksDrehen();
  if (karel.istMarke()) {
    karel.rechtsDrehen();
  } else {
    umdrehen();
    karel.schritt();
  }
}

function programm() {
  kranz();
  kranz_fuellen();
  while (!karel.istMarke()) {
    pyramidenring();
    kranz_fuellen();
  }
  ausgangsposition();
  kranz_marke_weg();
  diagonal_1();
  while (karel.istMarke()) {
    ring_marke_weg();
  }
  zum_start();
}

programm();
