require('bibliothek');
function umsetzen() {
  schnell();
  while (istZiegel()) {
    aufheben();
    hintenhinlegen();
  }
  langsam();
}
function verschieben() {
  schnell();
  while (istZiegel()) {
    aufheben();
    schrittlinks();
    hinlegen();
    schrittrechts();
  }
  langsam();
}
function umsetzendiagonal() {
  umdrehen();
  schnell();
  while (istZiegel()) {
    aufheben();
    linksDrehen();
    schritt();
    linksDrehen();
    hinlegen();
    linksDrehen();
    schritt();
    linksDrehen();
  }
  langsam();
  umdrehen();
}
function vergleichen() {
  function wiederherstellen() {
    umdrehen();
    while (istZiegel()) {
      aufheben();
      umdrehen();
      hinlegen();
      schrittlinks();
      hinlegen();
      rechtsDrehen();
      schritt();
      rechtsDrehen();
    }
    umdrehen();
  }
  schnell();
  while (!istMarke()) {
    if (!istZiegel()) {
      markeSetzen();
    }
    if (!istMarke()) {
      schrittlinks();
      if (!istZiegel()) {
        markeSetzen();
        schrittrechts();
        markeSetzen();
      } else {
        aufheben();
        schrittrechts();
        aufheben();
        hintenhinlegen();
      }
    }
  }
  wiederherstellen();
  langsam();
  markeLoeschen();
}
function tauschen() {
  umsetzen();
  schrittrechts();
  verschieben();
  schrittlinks();
  umsetzendiagonal();
}
for (var i = 0; i < 8; i++) {
  while (!istWand()) {
    rechtsDrehen();
    vergleichen();
    schrittlinks();
    if (!istMarke()) {
      tauschen();
    } else {
      markeLoeschen();
    }
    linksDrehen();
  }
  schnell();
  umdrehen();
  while (!istWand()) {
    schritt();
  }
  umdrehen();
  langsam();
}
