function umdrehen() {
  linksDrehen();
  linksDrehen();
}
function zweischritt() {
  schritt();
  schritt();
}
for (var i = 0; i < 7; i++) {
  markeSetzen();
  linksDrehen();
  while (istZiegel()) {
    schritt();
  }
  zweischritt();
  umdrehen();
  while (nichtIstMarke()) {
    hinlegen();
    schritt();
  }
  linksDrehen();
}
