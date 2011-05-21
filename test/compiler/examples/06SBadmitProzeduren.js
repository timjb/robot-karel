function bauebecken() {
  for (var i = 0; i < 12; i++) {
    while (nichtIstWand()) {
      hinlegen();
      schritt();
    }
    linksDrehen();
  }
}
function abbauenbecken() {
  for (var j = 0; j < 12; j++) {
    while (nichtIstWand()) {
      aufheben();
      schritt();
    }
    rechtsDrehen();
  }
}
function schwimmen() {
  function umdrehen() {
    linksDrehen();
    linksDrehen();
  }
  for (var k = 0; k < 3; k++) {
    hinlegen();
  }
  schritt();
  while (nichtIstZiegel()) {
    for (var l = 0; l < 3; l++) {
      hinlegen();
    }
    schritt();
    umdrehen();
    for (var m = 0; m < 3; m++) {
      aufheben();
    }
    umdrehen();
  }
  schritt();
  umdrehen();
  for (var n = 0; n < 3; n++) {
    aufheben();
  }
  umdrehen();
}
function hauptteil() {
  bauebecken();
  linksDrehen();
  for (var o = 0; o < 2; o++) {
    schritt();
  }
  rechtsDrehen();
  schwimmen();
  rechtsDrehen();
  for (var p = 0; p < 2; p++) {
    schritt();
  }
  rechtsDrehen();
  abbauenbecken();
  while (nichtIstWand()) {
    schritt();
  }
  linksDrehen();
  linksDrehen();
}
for (var q = 0; q < 4; q++) {
  hauptteil();
}
