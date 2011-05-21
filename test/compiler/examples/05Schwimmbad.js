function umdrehen() {
  linksDrehen();
  linksDrehen();
}
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 12; j++) {
    while (nichtIstWand()) {
      hinlegen();
      schritt();
    }
    linksDrehen();
  }
  linksDrehen();
  for (var k = 0; k < 2; k++) {
    schritt();
  }
  rechtsDrehen();
  for (var l = 0; l < 3; l++) {
    hinlegen();
  }
  schritt();
  while (nichtIstZiegel()) {
    for (var m = 0; m < 3; m++) {
      hinlegen();
    }
    schritt();
    umdrehen();
    for (var n = 0; n < 3; n++) {
      aufheben();
    }
    umdrehen();
  }
  schritt();
  umdrehen();
  for (var o = 0; o < 3; o++) {
    aufheben();
  }
  umdrehen();
  rechtsDrehen();
  for (var p = 0; p < 2; p++) {
    schritt();
  }
  rechtsDrehen();
  for (var q = 0; q < 12; q++) {
    while (nichtIstWand()) {
      aufheben();
      schritt();
    }
    rechtsDrehen();
  }
  while (nichtIstWand()) {
    schritt();
  }
  umdrehen();
}
