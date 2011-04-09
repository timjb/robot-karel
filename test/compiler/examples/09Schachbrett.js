function markierezeile() {
  while (!istWand()) {
    markeSetzen();
    schritt();
    if (!istWand()) {
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
