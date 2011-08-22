function umdrehen() {
  linksDrehen();
  linksDrehen();
}
function schrittRueckwaerts() {
  umdrehen();
  schritt();
  umdrehen();
}
function istgehenerlaubt() {
  var result;
  function istmarkevorne() {
    var result;
    schritt();
    if (istMarke()) {
      result = true;
    } else {
      result = false;
    }
    schrittRueckwaerts();
    return result;
  }
  schnell();
  result = false;
  if (nichtIstWand()) {
    if (nichtIstZiegel()) {
      if (!istmarkevorne()) {
        result = true;
      }
    }
  }
  langsam();
  return result;
}
function istziel() {
  var result;
  schnell();
  result = false;
  for (var i = 0; i < 4; i++) {
    if (istZiegel(1)) {
      result = true;
    }
    linksDrehen();
  }
  langsam();
  return result;
}
function zweiggehen() {
  markeSetzen();
  for (var j = 0; j < 4; j++) {
    if (istgehenerlaubt()) {
      schritt();
      schnell();
      zweiggehen();
      if (istziel()) {
        warten(2500);
        ton();
        while (nichtIstZiegel(1)) {
          linksDrehen();
        }
        schritt();
        langsam();
        beenden();
      } else {
        schnell();
        schrittRueckwaerts();
      }
    }
    linksDrehen();
    schnell();
  }
}
schnell();
zweiggehen();
for (var k = 0; k < 2; k++) {
  ton();
  warten(2000);
}
