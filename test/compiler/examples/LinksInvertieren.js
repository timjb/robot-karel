while (!istWand()) {
  if (istZiegel()) {
    schritt();
  } else {
    schritt();
    linksDrehen();
    hinlegen();
    rechtsDrehen();
  }
}
