for (var i = 0; i < 9; i++) {
  schritt();
  linksDrehen();
  hinlegen();
  rechtsDrehen();
  if (istWand()) {
    linksDrehen();
    linksDrehen();
  }
}
