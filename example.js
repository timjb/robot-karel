// Basiert auf dem Karol-Script von Norbert Handick

Number.prototype.mal = function(fn) {
  for (var i = 0; i < this; i++) {
    fn();
  }
};

function umdrehen() {
  karol.linksDrehen();
  karol.linksDrehen();
}

function unterlegen() {
  karol.schritt();
  umdrehen();
  karol.hinlegen();
  umdrehen();
}

function diagonal_1() {
  karol.schritt();
  karol.linksDrehen();
  karol.schritt();
  karol.rechtsDrehen();
}

function kranz() {
  4..mal(function() {
    while (!karol.istWand()) {
      karol.hinlegen();
      karol.schritt();
      karol.markeSetzen();
    }
    karol.linksDrehen();
  });
  diagonal_1();
}

function kranz_fuellen() {
  while (!karol.istMarke()) {
    unterlegen();
    if (karol.istMarke()) {
      karol.linksDrehen();
      karol.schritt();
      karol.linksDrehen();
      karol.schritt();
      while (!karol.istMarke()) {
        karol.schritt();
      }
      umdrehen();
      karol.schritt();
    }
  }
  karol.rechtsDrehen();
  karol.schritt();
  karol.rechtsDrehen();
  karol.schritt();
}

function pyramidenring() {
  4..mal(function() {
    while (!karol.istMarke()) {
      karol.markeSetzen();
      unterlegen();
    }
    umdrehen();
    karol.schritt();
    karol.rechtsDrehen();
    karol.schritt();
  });
}

function ausgangsposition() {
  2..mal(function() {
    while (!karol.istWand()) {
      karol.schritt();
    }
    karol.linksDrehen();
  });
}

function zum_start() {
  karol.rechtsDrehen();
  2..mal(function() {
    while (!karol.istWand()) {
      karol.schritt();
    }
    karol.linksDrehen();
  });
}

function kranz_marke_weg() {
  4..mal(function() {
    while (!karol.istWand()) {
      karol.schritt();
      karol.markeLoeschen();
    }
    karol.linksDrehen();
  });
}

function ring_marke_weg() {
  4..mal(function() {
    while (karol.istMarke()) {
      karol.markeLoeschen();
      karol.schritt();
    }
    umdrehen();
    karol.schritt();
    karol.rechtsDrehen();
    karol.schritt();
  });
  karol.linksDrehen();
  if (karol.istMarke()) {
    karol.rechtsDrehen();
  } else {
    umdrehen();
    karol.schritt();
  }
}

function programm() {
  kranz();
  kranz_fuellen();
  while (!karol.istMarke()) {
    pyramidenring();
    kranz_fuellen();
  }
  ausgangsposition();
  kranz_marke_weg();
  diagonal_1();
  while (karol.istMarke()) {
    ring_marke_weg();
  }
  zum_start();
}

programm();
