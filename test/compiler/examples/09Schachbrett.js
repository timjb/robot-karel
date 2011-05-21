function markierezeile() {
  while (nichtIstWand()) {
    markeSetzen();
    schritt();
    if (nichtIstWand()) {
      schritt();
    }
  }
}
for (var i = 0; i < 3; i++) {
  markierezeile();
  linksDrehen();
  schritt();
  linksDrehen();
  markierezeile();
  rechtsDrehen();
  schritt();
  rechtsDrehen();
}
