function umdrehen() {
  schnell();
  linksDrehen();
  linksDrehen();
  langsam();
}
function pruefeuebertrag() {
  if (istZiegel(10)) {
    for (var i = 0; i < 10; i++) {
      aufheben();
    }
    markeSetzen();
  }
}
function versetzen() {
  while (istZiegel()) {
    aufheben();
    umdrehen();
    hinlegen();
    pruefeuebertrag();
    umdrehen();
  }
}
function istwandrechts() {
  var result;
  schnell();
  rechtsDrehen();
  if (istWand()) {
    result = true;
  } else {
    result = false;
  }
  linksDrehen();
  langsam();
  return result;
}
function rechnen() {
  while (!istwandrechts()) {
    versetzen();
    rechtsDrehen();
    if (istMarke()) {
      markeLoeschen();
      schritt();
      rechtsDrehen();
      hinlegen();
      pruefeuebertrag();
      umdrehen();
    } else {
      schritt();
      linksDrehen();
    }
  }
}
while (!istOsten()) {
  linksDrehen();
}
rechnen();
