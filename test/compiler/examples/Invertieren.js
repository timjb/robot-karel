while (nichtIstWand()) {
  if (istZiegel()) {
    aufheben();
  } else {
    hinlegen();
  }
  schritt();
}
