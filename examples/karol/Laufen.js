function umdrehen() {
  linksDrehen();
  linksDrehen();
}
while (nichtIstMarke()) {
  if (istZiegel()) {
    schritt();
  } else {
    linksDrehen();
    if (nichtIstZiegel()) {
      umdrehen();
    }
    schritt();
  }
}
