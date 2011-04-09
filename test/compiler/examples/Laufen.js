function umdrehen() {
  linksDrehen();
  linksDrehen();
}
while (!istMarke()) {
  if (istZiegel()) {
    schritt();
  } else {
    linksDrehen();
    if (!istZiegel()) {
      umdrehen();
    }
    schritt();
  }
}
