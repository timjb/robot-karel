function umdrehen() {
  linksDrehen();
  linksDrehen();
}
function zweischritt() {
  schritt();
  schritt();
}
function eineschichtlegen() {
  while (nichtIstMarke()) {
    hinlegen();
    schritt();
  }
}
function hinabsteigen() {
  while (istZiegel()) {
    schritt();
  }
}
markeSetzen();
for (var i = 0; i < 7; i++) {
  zweischritt();
  umdrehen();
  eineschichtlegen();
  umdrehen();
  hinabsteigen();
}
schritt();
umdrehen();
