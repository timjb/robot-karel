function istziegelrechts() {
  var result;
  schnell();
  result = false;
  rechtsDrehen();
  if (istZiegel()) {
    result = true;
  }
  linksDrehen();
  langsam();
  return result;
}
function biszurwand() {
  while (!istZiegel()) {
    schritt();
    if (istMarke()) {
      beenden();
    }
  }
}
function anderwandentlang() {
  while (istziegelrechts()) {
    if (istZiegel()) {
      linksDrehen();
    }
    schritt();
  }
}
biszurwand();
linksDrehen();
anderwandentlang();
rechtsDrehen();
while (!istMarke()) {
  schritt();
}
