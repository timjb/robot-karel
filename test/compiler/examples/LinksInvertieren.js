while (nichtIstWand()) {
  if (istZiegel()) {
    schritt();
  } else {
    schritt();
    linksDrehen();
    hinlegen();
    rechtsDrehen();
  }
}
