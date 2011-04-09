while (!istWand()) {
  if (istZiegel()) {
    aufheben();
  } else {
    hinlegen();
  }
  schritt();
}
