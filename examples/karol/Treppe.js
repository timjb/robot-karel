function umdrehen() {
  linksDrehen();
  linksDrehen();
}
function schrittRueckwaerts() {
  umdrehen();
  schritt();
  umdrehen();
}
while (istZiegel()) {
  schritt();
  umdrehen();
  hinlegen();
  umdrehen();
}
schrittRueckwaerts();
hinlegen();
schritt();
ton();
